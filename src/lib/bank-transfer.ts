import { randomInt } from 'node:crypto';
import { prisma } from '@/lib/prisma';
import { upsertDonorFillEmpty } from '@/lib/donations';
import { RATE, indicativeEur, type Currency } from '@/lib/money';
import { SPONSORSHIP_FUND_SLUG } from '@/lib/funds';
import { sponsorPlanFor, sendSponsorWelcome, type SponsorSessionInput } from '@/lib/sponsorship';

// Virement bancaire (08/10/2026, demande de Mazunda : carte, prélèvement ET
// virement pour les trois raisons du don).
//
// La banque ne prévient pas le site quand un virement arrive. Le site
// enregistre donc une PROMESSE avec une référence unique (OL-VIL-7K3M2Q…) que
// le donateur recopie dans le libellé de son virement ; l'équipe voit le
// virement sur le relevé, retrouve la référence dans /gestion/virements et
// clique « Virement reçu ». C'est ce clic, et lui seul, qui :
//   - fait passer le don à CONFIRMED et crée l'écriture de recette dans le
//     bon fonds (général, village ou parrainage) ;
//   - pour un parrainage, inscrit la personne parmi les parrains.
// Une promesse jamais honorée n'entre dans aucun total.

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // sans I, O, 0, 1 : illisibles sur un relevé

export type TransferKind = 'DON' | 'VIL' | 'PAR';

function randomCode(): string {
  let out = '';
  for (let i = 0; i < 6; i += 1) out += ALPHABET[randomInt(ALPHABET.length)];
  return out;
}

/** Référence libre (ni dans les dons, ni dans les parrains). */
export async function newTransferReference(kind: TransferKind): Promise<string> {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const reference = `OL-${kind}-${randomCode()}`;
    const [donation, sponsor] = await Promise.all([
      prisma.donation.findFirst({ where: { bankReference: reference }, select: { id: true } }),
      prisma.sponsor.findUnique({ where: { bankReference: reference }, select: { id: true } })
    ]);
    if (!donation && !sponsor) return reference;
  }
  throw new Error('Impossible de générer une référence de virement libre.');
}

/** Promesse de don par virement (association ou village), ponctuel ou mensuel. */
export async function createTransferPledge(input: {
  amount: number;
  currency: Currency;
  isRecurring: boolean;
  projectId: string | null;
  kind: 'DON' | 'VIL';
  donorEmail?: string | null;
  donorFirstName?: string | null;
  donorLastName?: string | null;
  donorCountry?: string | null;
}): Promise<{ reference: string }> {
  const reference = await newTransferReference(input.kind);
  const donor = input.donorEmail
    ? await upsertDonorFillEmpty({
        email: input.donorEmail,
        firstName: input.donorFirstName,
        lastName: input.donorLastName,
        country: input.donorCountry
      })
    : null;

  await prisma.donation.create({
    data: {
      amount: input.amount,
      currency: input.currency,
      fxRate: RATE[input.currency],
      amountEur: indicativeEur(input.amount, input.currency),
      method: 'BANK_TRANSFER',
      status: 'PENDING',
      isRecurring: input.isRecurring,
      receivedOn: new Date(),
      projectId: input.projectId,
      donorId: donor?.id,
      bankReference: reference,
      // Identité saisie sans e-mail : gardée dans le message pour que
      // l'équipe puisse rapprocher le virement.
      message:
        !donor && (input.donorFirstName || input.donorLastName)
          ? `Nom indiqué : ${[input.donorFirstName, input.donorLastName].filter(Boolean).join(' ')}`.slice(0, 300)
          : null
    }
  });
  return { reference };
}

/** Demande de parrainage par virement : un parrain EN ATTENTE, pas encore un parrain. */
export async function createSponsorTransferRequest(input: SponsorSessionInput): Promise<{ reference: string }> {
  const plan = sponsorPlanFor(input.mode, input.plan);
  if (!plan) throw new Error('Formule inconnue.');
  const reference = await newTransferReference('PAR');
  const amount = input.amount ?? plan.prices[input.currency];
  const donor = await upsertDonorFillEmpty({
    email: input.email,
    firstName: input.firstName,
    lastName: input.lastName,
    phone: input.phone || null
  });

  await prisma.sponsor.create({
    data: {
      donorId: donor.id,
      mode: input.mode === 'prog' ? 'PROGRAMME' : 'CHILD',
      planIndex: input.plan,
      planName: plan.name,
      monthlyAmount: amount,
      currency: input.currency,
      monthlyAmountEur: indicativeEur(amount, input.currency),
      paymentMethod: 'BANK_TRANSFER',
      bankReference: reference,
      status: 'PENDING'
    }
  });
  return { reference };
}

/** Écrit un don CONFIRMÉ par virement et sa recette, dans une transaction. */
async function writeConfirmedTransfer(data: {
  amount: number;
  currency: Currency;
  isRecurring: boolean;
  projectId: string | null;
  donorId: string | null;
  bankReference: string | null;
  receivedOn: Date;
  confirmedById: string;
  label: string;
  /** Nom indiqué par un donateur sans e-mail, recopié d'un versement à l'autre. */
  message?: string | null;
}) {
  await prisma.$transaction(async (tx) => {
    const donation = await tx.donation.create({
      data: {
        amount: data.amount,
        currency: data.currency,
        fxRate: RATE[data.currency],
        amountEur: indicativeEur(data.amount, data.currency),
        method: 'BANK_TRANSFER',
        status: 'CONFIRMED',
        isRecurring: data.isRecurring,
        receivedOn: data.receivedOn,
        projectId: data.projectId,
        donorId: data.donorId,
        bankReference: data.bankReference,
        confirmedById: data.confirmedById,
        confirmedAt: new Date(),
        message: data.message ?? null
      }
    });
    await tx.transaction.create({
      data: {
        kind: 'INCOME',
        status: 'DRAFT',
        occurredOn: data.receivedOn,
        label: data.label,
        amount: data.amount,
        currency: data.currency,
        fxRate: RATE[data.currency],
        amountEur: indicativeEur(data.amount, data.currency),
        projectId: data.projectId,
        donationId: donation.id
      }
    });
  });
}

async function fundLabel(projectId: string | null): Promise<string> {
  if (!projectId) return 'fonds général';
  const project = await prisma.project.findUnique({ where: { id: projectId }, select: { name: true } });
  return project?.name ?? 'fonds général';
}

/**
 * Premier virement d'une promesse reçu : la promesse elle-même passe à
 * CONFIRMED (montant réellement reçu si différent) et sa recette est créée.
 * Renvoie `false` si la promesse n'était plus en attente (double clic).
 */
export async function confirmTransferPledge(
  donationId: string,
  actorId: string,
  received: { amount?: number; receivedOn: Date }
): Promise<boolean> {
  const label = async (projectId: string | null) => `Virement — ${await fundLabel(projectId)}`;
  return prisma.$transaction(async (tx) => {
    // Bascule atomique : un seul des deux clics simultanés gagne.
    const switched = await tx.donation.updateMany({
      where: { id: donationId, status: 'PENDING', method: 'BANK_TRANSFER' },
      data: { status: 'CONFIRMED', confirmedById: actorId, confirmedAt: new Date(), receivedOn: received.receivedOn }
    });
    if (switched.count === 0) return false;
    const donation = await tx.donation.findUniqueOrThrow({ where: { id: donationId } });
    const amount = received.amount ?? Number(donation.amount);
    const currency = donation.currency as Currency;
    if (received.amount !== undefined) {
      await tx.donation.update({
        where: { id: donationId },
        data: { amount, amountEur: indicativeEur(amount, currency) }
      });
    }
    await tx.transaction.create({
      data: {
        kind: 'INCOME',
        status: 'DRAFT',
        occurredOn: received.receivedOn,
        label: await label(donation.projectId),
        amount,
        currency,
        fxRate: RATE[currency],
        amountEur: indicativeEur(amount, currency),
        projectId: donation.projectId,
        donationId
      }
    });
    return true;
  });
}

/** Virement mensuel suivant d'un donateur déjà confirmé : un nouveau don, même fonds, même référence. */
export async function recordNextMonthlyTransfer(
  donationId: string,
  actorId: string,
  received: { amount?: number; receivedOn: Date }
): Promise<boolean> {
  const source = await prisma.donation.findUnique({ where: { id: donationId } });
  if (!source || source.method !== 'BANK_TRANSFER' || !source.isRecurring || source.status !== 'CONFIRMED') return false;
  await writeConfirmedTransfer({
    amount: received.amount ?? Number(source.amount),
    currency: source.currency as Currency,
    isRecurring: true,
    projectId: source.projectId,
    donorId: source.donorId,
    bankReference: source.bankReference,
    receivedOn: received.receivedOn,
    confirmedById: actorId,
    label: `Virement mensuel — ${await fundLabel(source.projectId)}`,
    message: source.message
  });
  return true;
}

/** Promesse abandonnée (le virement n'est jamais arrivé). */
export async function cancelTransferPledge(donationId: string): Promise<boolean> {
  const result = await prisma.donation.updateMany({
    where: { id: donationId, status: 'PENDING', method: 'BANK_TRANSFER' },
    data: { status: 'FAILED' }
  });
  return result.count > 0;
}

async function sponsorFundId(): Promise<string | null> {
  const fund = await prisma.project.findUnique({ where: { slug: SPONSORSHIP_FUND_SLUG }, select: { id: true } });
  if (!fund) console.error(`Fonds « ${SPONSORSHIP_FUND_SLUG} » introuvable : virement de parrainage rangé au fonds général.`);
  return fund?.id ?? null;
}

/**
 * Premier virement d'un parrain reçu : la personne DEVIENT parrain (ACTIVE),
 * la mensualité est enregistrée dans le fonds Parrainage et le courriel de
 * bienvenue part. Renvoie `false` si la demande n'était plus en attente.
 */
export async function activateTransferSponsor(
  sponsorId: string,
  actorId: string,
  received: { amount?: number; receivedOn: Date }
): Promise<boolean> {
  const switched = await prisma.sponsor.updateMany({
    where: { id: sponsorId, status: 'PENDING', paymentMethod: 'BANK_TRANSFER' },
    data: { status: 'ACTIVE', sponsorSince: received.receivedOn }
  });
  if (switched.count === 0) return false;

  const sponsor = await prisma.sponsor.findUniqueOrThrow({ where: { id: sponsorId }, include: { donor: true } });
  const currency = sponsor.currency as Currency;
  const amount = received.amount ?? Number(sponsor.monthlyAmount ?? sponsor.monthlyAmountEur);
  await writeConfirmedTransfer({
    amount,
    currency,
    isRecurring: true,
    projectId: await sponsorFundId(),
    donorId: sponsor.donorId,
    bankReference: sponsor.bankReference,
    receivedOn: received.receivedOn,
    confirmedById: actorId,
    label: `Parrainage par virement — ${sponsor.planName}`
  });

  if (sponsor.donor.email) {
    await sendSponsorWelcome({
      email: sponsor.donor.email,
      firstName: sponsor.donor.firstName,
      planName: sponsor.planName,
      amount,
      currency,
      locale: 'fr'
    });
  }
  return true;
}

/** Mensualité suivante d'un parrain par virement. */
export async function recordSponsorTransfer(
  sponsorId: string,
  actorId: string,
  received: { amount?: number; receivedOn: Date }
): Promise<boolean> {
  const sponsor = await prisma.sponsor.findUnique({ where: { id: sponsorId } });
  if (!sponsor || sponsor.paymentMethod !== 'BANK_TRANSFER' || sponsor.status !== 'ACTIVE') return false;
  const currency = sponsor.currency as Currency;
  await writeConfirmedTransfer({
    amount: received.amount ?? Number(sponsor.monthlyAmount ?? sponsor.monthlyAmountEur),
    currency,
    isRecurring: true,
    projectId: await sponsorFundId(),
    donorId: sponsor.donorId,
    bankReference: sponsor.bankReference,
    receivedOn: received.receivedOn,
    confirmedById: actorId,
    label: `Parrainage par virement — ${sponsor.planName}`
  });
  return true;
}

/** Fin d'un parrainage par virement (ou demande jamais suivie d'un virement). */
export async function endTransferSponsor(sponsorId: string): Promise<boolean> {
  const result = await prisma.sponsor.updateMany({
    where: { id: sponsorId, paymentMethod: 'BANK_TRANSFER', status: { in: ['PENDING', 'ACTIVE'] } },
    data: { status: 'ENDED', endedAt: new Date() }
  });
  return result.count > 0;
}
