import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';
import { escapeHtml } from '@/lib/validation';
import { CONTACT_EMAIL } from '@/lib/i18n';

// Parrainage : on devient parrain en PAYANT, jamais autrement (décision de
// Mazunda, 29/09/2026). Une ligne `Sponsor` n'est créée que par le webhook
// Stripe, sur une facture d'abonnement payée — voir recordSponsorFromInvoice().

export type SponsorModeKey = 'child' | 'prog';

// Tarifs de référence, en euros par mois. C'est CE tableau qui fait foi côté
// serveur : le montant prélevé n'est jamais lu dans la requête du navigateur.
// ParrainerPage lit les mêmes prix ici, pour qu'affichage et prélèvement ne
// puissent pas diverger.
export const SPONSOR_PLANS: Record<SponsorModeKey, { name: string; eur: number }[]> = {
  child: [
    { name: 'Éducation', eur: 20 },
    { name: 'Éducation et santé', eur: 35 },
    { name: 'Accompagnement complet', eur: 50 }
  ],
  prog: [
    { name: 'RÊVES 2', eur: 25 },
    { name: 'Santé et écoute', eur: 30 },
    { name: "Là où c'est utile", eur: 20 }
  ]
};

const MIN_SPONSOR_EUR = 1;
const MAX_SPONSOR_EUR = 5000;

export const sponsorSessionSchema = z.object({
  firstName: z.string().trim().min(1).max(120),
  lastName: z.string().trim().min(1).max(120),
  email: z.string().trim().toLowerCase().email().max(180),
  phone: z.string().trim().max(40).optional().or(z.literal('')),
  mode: z.enum(['child', 'prog']),
  plan: z.number().int().min(0).max(2),
  /** Montant mensuel libre en euros (facultatif) : remplace le prix de la formule. */
  amountEur: z.number().min(MIN_SPONSOR_EUR).max(MAX_SPONSOR_EUR).optional(),
  locale: z.enum(['fr', 'en']).default('fr')
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
  amountPaidEur
}: {
  subscriptionId: string;
  metadata: Record<string, string>;
  amountPaidEur: number;
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
  if (!(amountPaidEur > 0)) {
    // Une facture à 0 € n'est pas un paiement : pas de parrain.
    return { created: false };
  }

  const existing = await prisma.sponsor.findUnique({ where: { stripeSubscriptionId: subscriptionId } });
  if (existing) return { created: false };

  const donor = await prisma.donor.upsert({
    where: { email },
    update: {
      ...(metadata.donorFirstName ? { firstName: metadata.donorFirstName } : {}),
      ...(metadata.donorLastName ? { lastName: metadata.donorLastName } : {}),
      ...(metadata.donorPhone ? { phone: metadata.donorPhone } : {})
    },
    create: {
      email,
      firstName: metadata.donorFirstName || null,
      lastName: metadata.donorLastName || null,
      phone: metadata.donorPhone || null,
      country: metadata.donorCountry || 'FR'
    }
  });

  try {
    await prisma.sponsor.create({
      data: {
        donorId: donor.id,
        mode: MODE_DB[mode],
        planIndex,
        planName: plan.name,
        monthlyAmountEur: amountPaidEur,
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

/** Résiliation de l'abonnement côté Stripe : le parrain passe à « terminé ». */
export async function endSponsorBySubscription(subscriptionId: string): Promise<void> {
  await prisma.sponsor.updateMany({
    where: { stripeSubscriptionId: subscriptionId, status: 'ACTIVE' },
    data: { status: 'ENDED', endedAt: new Date() }
  });
}

/** Courriel de bienvenue : les informations pour le parrainage. Silencieux si Resend n'est pas configuré. */
export async function sendSponsorWelcome({
  email,
  firstName,
  planName,
  amountEur,
  locale
}: {
  email: string;
  firstName: string | null;
  planName: string;
  amountEur: number;
  locale: 'fr' | 'en';
}): Promise<void> {
  const name = firstName || '';
  const amount = `${amountEur} €`;
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
