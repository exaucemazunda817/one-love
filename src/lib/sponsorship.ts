import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';
import { upsertDonorFillEmpty } from '@/lib/donations';
import { escapeHtml } from '@/lib/validation';
import { CONTACT_EMAIL } from '@/lib/i18n';
import { CURRENCIES, SPONSOR_LIMITS, formatMoney, indicativeEur, type Currency } from '@/lib/money';

// Parrainage : on devient parrain en PAYANT, jamais autrement (décision de
// Mazunda, 29/09/2026). Une ligne `Sponsor` n'est créée que par le webhook
// Stripe, sur une facture d'abonnement payée — voir recordSponsorFromInvoice().

export type SponsorModeKey = 'child' | 'prog';

// Tarifs de référence par mois, fixés DANS CHAQUE DEVISE (07/10/2026) : le
// visiteur paie exactement le prix affiché, sans reconversion. Les prix en $
// et en FC reprennent ceux qui s'affichaient déjà sur le site. C'est CE
// tableau qui fait foi côté serveur : le prix d'une formule n'est jamais lu
// dans la requête du navigateur. ParrainerPage lit les mêmes prix ici.
export type PlanPrices = Record<Currency, number>;
export const SPONSOR_PLANS: Record<SponsorModeKey, { name: string; prices: PlanPrices }[]> = {
  child: [
    { name: 'Éducation', prices: { EUR: 20, USD: 22, CDF: 62_000 } },
    { name: 'Éducation et santé', prices: { EUR: 35, USD: 39, CDF: 109_000 } },
    { name: 'Accompagnement complet', prices: { EUR: 50, USD: 55, CDF: 155_000 } }
  ],
  prog: [
    { name: 'RÊVES 2', prices: { EUR: 25, USD: 28, CDF: 78_000 } },
    { name: 'Santé et écoute', prices: { EUR: 30, USD: 33, CDF: 93_000 } },
    { name: "Là où c'est utile", prices: { EUR: 20, USD: 22, CDF: 62_000 } }
  ]
};

export const sponsorSessionSchema = z.object({
  firstName: z.string().trim().min(1).max(120),
  lastName: z.string().trim().min(1).max(120),
  email: z.string().trim().toLowerCase().email().max(180),
  phone: z.string().trim().max(40).optional().or(z.literal('')),
  mode: z.enum(['child', 'prog']),
  plan: z.number().int().min(0).max(2),
  /** Devise choisie : le paiement se fait dans cette devise. */
  currency: z.enum(CURRENCIES as [Currency, ...Currency[]]).default('EUR'),
  /** Montant mensuel libre (facultatif), dans la devise choisie : remplace le prix de la formule. */
  amount: z.number().finite().positive().optional(),
  locale: z.enum(['fr', 'en']).default('fr')
}).superRefine((value, ctx) => {
  if (value.amount === undefined) return;
  const { min, max } = SPONSOR_LIMITS[value.currency];
  if (value.amount < min || value.amount > max) {
    ctx.addIssue({ code: 'custom', path: ['amount'], message: `Montant entre ${min} et ${max} ${value.currency}.` });
  }
});

export type SponsorSessionInput = z.infer<typeof sponsorSessionSchema>;

const MODE_DB = { child: 'CHILD', prog: 'PROGRAMME' } as const;

export function sponsorPlanFor(mode: SponsorModeKey, plan: number) {
  return SPONSOR_PLANS[mode][plan] ?? null;
}

/** Métadonnées posées sur l'abonnement Stripe, relues à chaque facture payée. */
export function sponsorMetadata(input: SponsorSessionInput): Record<string, string> {
  return {
    sponsorMode: input.mode,
    sponsorPlan: String(input.plan),
    sponsorCurrency: input.currency,
    donorPhone: input.phone || '',
    sponsorLocale: input.locale
  };
}

/**
 * Enregistre le parrain d'un abonnement DONT LA FACTURE VIENT D'ÊTRE PAYÉE.
 * Idempotente : un webhook rejoué ne crée jamais de doublon (clé unique sur
 * `stripeSubscriptionId`, plus une recherche préalable pour la sortie rapide).
 * Renvoie `created: true` seulement à la toute première facture payée.
 */
export async function recordSponsorFromInvoice({
  subscriptionId,
  metadata,
  amountPaid,
  currency
}: {
  subscriptionId: string;
  metadata: Record<string, string>;
  /** Montant réellement payé, dans la devise de la facture. */
  amountPaid: number;
  currency: Currency;
}): Promise<{ created: boolean }> {
  const mode = metadata.sponsorMode === 'child' || metadata.sponsorMode === 'prog' ? metadata.sponsorMode : null;
  const planIndex = Number(metadata.sponsorPlan);
  const plan = mode && Number.isInteger(planIndex) ? sponsorPlanFor(mode, planIndex) : null;
  // Même valeur que celle utilisée par createConfirmedDonation : un seul Donor
  // par personne. La minuscule est déjà appliquée par le schéma du formulaire.
  const email = metadata.donorEmail || '';

  if (!mode || !plan || !email) {
    // Abonnement de parrainage aux métadonnées inutilisables : erreur visible
    // (le webhook répond 500 et Stripe réessaie), jamais un parrain « à moitié ».
    throw new Error(`Métadonnées de parrainage invalides pour l'abonnement ${subscriptionId}.`);
  }
  if (!(amountPaid > 0)) {
    // Une facture à 0 n'est pas un paiement : pas de parrain.
    return { created: false };
  }

  const existing = await prisma.sponsor.findUnique({ where: { stripeSubscriptionId: subscriptionId } });
  if (existing) return { created: false };

  const donor = await upsertDonorFillEmpty({
    email,
    firstName: metadata.donorFirstName,
    lastName: metadata.donorLastName,
    phone: metadata.donorPhone,
    country: metadata.donorCountry
  });

  try {
    await prisma.sponsor.create({
      data: {
        donorId: donor.id,
        mode: MODE_DB[mode],
        planIndex,
        planName: plan.name,
        monthlyAmount: amountPaid,
        currency,
        // Contre-valeur indicative, pour les totaux de l'espace de gestion.
        monthlyAmountEur: indicativeEur(amountPaid, currency),
        stripeSubscriptionId: subscriptionId
      }
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return { created: false };
    }
    throw error;
  }

  return { created: true };
}

/**
 * Paiement refusé : le parrain reste dans la liste mais passe en « paiement en
 * échec », pour que l'équipe écrive un mot humain pendant que Stripe réessaie.
 * Ne casse jamais le webhook : si la base ne connaît pas encore cette valeur
 * de statut, on journalise et on continue (le paiement lui-même est déjà
 * traité par Stripe).
 */
export async function markSponsorPaymentFailed(subscriptionId: string): Promise<void> {
  try {
    await prisma.sponsor.updateMany({
      where: { stripeSubscriptionId: subscriptionId, status: 'ACTIVE' },
      data: { status: 'PAYMENT_FAILED' }
    });
  } catch (error) {
    console.error('Statut « paiement en échec » non enregistré', error);
  }
}

/** Une facture est payée : un parrain en échec de paiement redevient actif. */
export async function markSponsorPaymentRecovered(subscriptionId: string): Promise<void> {
  try {
    await prisma.sponsor.updateMany({
      where: { stripeSubscriptionId: subscriptionId, status: 'PAYMENT_FAILED' },
      data: { status: 'ACTIVE' }
    });
  } catch (error) {
    console.error('Statut « actif » non rétabli', error);
  }
}

/** Résiliation de l'abonnement côté Stripe : le parrain passe à « terminé ». */
export async function endSponsorBySubscription(subscriptionId: string): Promise<void> {
  await prisma.sponsor.updateMany({
    where: { stripeSubscriptionId: subscriptionId, status: 'ACTIVE' },
    data: { status: 'ENDED', endedAt: new Date() }
  });
  // Séparé et protégé : tant que la base ne connaît pas la valeur
  // PAYMENT_FAILED, cette requête échoue et ne doit pas faire échouer la
  // résiliation ci-dessus.
  try {
    await prisma.sponsor.updateMany({
      where: { stripeSubscriptionId: subscriptionId, status: 'PAYMENT_FAILED' },
      data: { status: 'ENDED', endedAt: new Date() }
    });
  } catch (error) {
    console.error('Résiliation d\'un parrain en échec de paiement non enregistrée', error);
  }
}

/**
 * Prénom affiché dans l'e-mail : lettres, espaces, tirets et apostrophes,
 * 40 caractères au plus. Le prénom vient d'un formulaire public ; sans ce
 * nettoyage, il pouvait glisser une phrase dans un e-mail qui part du nom de
 * l'association (audit de sécurité du 29/09/2026).
 */
export function cleanFirstName(value: string | null | undefined): string {
  return (value ?? '')
    .replace(/[^\p{L}\s'’-]/gu, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 40);
}

/** Courriel de bienvenue : les informations pour le parrainage. Silencieux si Resend n'est pas configuré. */
export async function sendSponsorWelcome({
  email,
  firstName,
  planName,
  amount: paid,
  currency,
  locale
}: {
  email: string;
  firstName: string | null;
  planName: string;
  amount: number;
  currency: Currency;
  locale: 'fr' | 'en';
}): Promise<void> {
  const name = cleanFirstName(firstName);
  const amount = formatMoney(paid, currency, locale);
  const contact = CONTACT_EMAIL;

  const content =
    locale === 'en'
      ? {
          subject: 'You are now a One Love sponsor. Thank you!',
          lines: [
            `Hello ${name},`.trim(),
            `Thank you: your payment is confirmed and you are now a sponsor of One Love (${planName}, ${amount} per month).`,
            'Here is what you can expect:',
            '- a message from our team every quarter, with a respectful photo or a drawing;',
            '- a yearly review of the year and how the funds were used;',
            '- the possibility of writing to your sponsored child through our team, and of visiting by appointment.',
            'To protect the children, contact always goes through our team, and the photos you receive must not be published online.',
            `You can change or stop your sponsorship at any time by writing to us at ${contact}.`,
            'With gratitude,',
            'The One Love team'
          ]
        }
      : {
          subject: 'Vous êtes désormais parrain de One Love. Merci !',
          lines: [
            `Bonjour ${name},`.replace(/ ,$/, ','),
            `Merci : votre paiement est confirmé et vous êtes désormais parrain ou marraine de One Love (${planName}, ${amount} par mois).`,
            'Voici ce que vous allez recevoir :',
            '- un message de notre équipe chaque trimestre, avec une photo respectueuse ou un dessin ;',
            "- un bilan annuel de l'année et de l'emploi des fonds ;",
            "- la possibilité d'écrire à votre filleul par l'intermédiaire de notre équipe, et de lui rendre visite sur rendez-vous.",
            "Pour protéger les enfants, le lien passe toujours par notre équipe, et les photos que vous recevez ne doivent pas être publiées en ligne.",
            `Vous pouvez modifier ou arrêter votre parrainage à tout moment en nous écrivant à ${contact}.`,
            'Avec toute notre gratitude,',
            "L'équipe One Love"
          ]
        };

  const text = content.lines.join('\n\n').replace(/\n\n- /g, '\n- ');
  const html = content.lines
    .map((l) => (l.startsWith('- ') ? `<li>${escapeHtml(l.slice(2))}</li>` : `<p>${escapeHtml(l)}</p>`))
    .join('')
    .replace(/(<li>.*?<\/li>)+/g, (m) => `<ul>${m}</ul>`);

  const result = await sendEmail({ to: email, subject: content.subject, text, html, replyTo: contact });
  if (!result.ok && result.reason !== 'not-configured') {
    console.error('Courriel de bienvenue parrain non envoyé', result.reason);
  }
}
