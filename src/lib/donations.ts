import { prisma } from '@/lib/prisma';
import { Prisma, type DonationMethod } from '@prisma/client';

// Logique partagée de confirmation d'un don, appelée par le webhook Stripe
// aujourd'hui, et demain par le webhook SerdiPay et par la confirmation
// manuelle d'un virement ou d'un Mobile Money non automatisé (jalon 5/6).
//
// Règle absolue du projet : un don confirmé produit UNE et une seule écriture
// de trésorerie (relation 1-1 Transaction.donationId, contrainte unique en
// base). Cette fonction est donc idempotente — l'appeler deux fois pour le
// même don (ex. un webhook rejoué) ne crée jamais de doublon.

const MIN_DONATION_EUR = 1;
const MAX_DONATION_EUR = 100_000;

export function isValidDonationAmount(amountEur: number): boolean {
  return Number.isFinite(amountEur) && amountEur >= MIN_DONATION_EUR && amountEur <= MAX_DONATION_EUR;
}

export async function createPendingDonation({
  amountEur,
  method,
  projectSlug,
  donorEmail
}: {
  amountEur: number;
  method: DonationMethod;
  projectSlug?: string | null;
  donorEmail?: string | null;
}) {
  const project = projectSlug
    ? await prisma.project.findUnique({ where: { slug: projectSlug } })
    : null;

  const donor = donorEmail
    ? await prisma.donor.upsert({
        where: { email: donorEmail },
        update: {},
        create: { email: donorEmail }
      })
    : null;

  return prisma.donation.create({
    data: {
      amount: amountEur,
      currency: 'EUR',
      fxRate: 1,
      amountEur,
      method,
      status: 'PENDING',
      receivedOn: new Date(),
      projectId: project?.id,
      donorId: donor?.id
    }
  });
}

/**
 * Confirme un don et enregistre l'écriture de trésorerie correspondante.
 * `providerReference` est l'identifiant fourni par le prestataire de
 * paiement (`stripePaymentIntentId` pour Stripe) : sa contrainte `@unique` en
 * base est le VRAI verrou anti-doublon, celui qui protège même contre deux
 * appels strictement simultanés — la vérification `status === 'PENDING'`
 * ci-dessous n'est qu'une sortie rapide pour l'appel normal, pas la garantie.
 */
export async function confirmDonation({
  donationId,
  providerField,
  providerReference
}: {
  donationId: string;
  providerField: 'stripePaymentIntentId' | 'serdipayTransactionId';
  providerReference: string;
}): Promise<{ alreadyConfirmed: boolean }> {
  const donation = await prisma.donation.findUnique({ where: { id: donationId } });
  if (!donation) throw new Error(`Don introuvable : ${donationId}`);

  if (donation.status === 'CONFIRMED') {
    return { alreadyConfirmed: true };
  }

  const projectLabel = donation.projectId
    ? await prisma.project.findUnique({ where: { id: donation.projectId }, select: { name: true } })
    : null;

  try {
    await prisma.$transaction(async (tx) => {
      await tx.donation.update({
        where: { id: donationId },
        data: {
          status: 'CONFIRMED',
          confirmedAt: new Date(),
          [providerField]: providerReference
        }
      });

      await tx.transaction.create({
        data: {
          kind: 'INCOME',
          status: 'DRAFT',
          occurredOn: new Date(),
          label: projectLabel
            ? `Don en ligne — ${projectLabel.name}`
            : 'Don en ligne — fonds général',
          amount: donation.amount,
          currency: donation.currency,
          fxRate: donation.fxRate,
          amountEur: donation.amountEur,
          projectId: donation.projectId,
          donationId
        }
      });
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      // Deux violations d'unicité possibles ici, et elles ne veulent PAS dire
      // la même chose — les confondre a été un vrai bug trouvé en testant ce
      // module (voir scripts/tmp-test-donations.ts pendant le jalon 4) :
      // l'ancienne version traitait les deux comme un simple doublon
      // inoffensif, alors que la seconde est une anomalie qui doit être
      // visible.
      const target = (error.meta?.target as string[] | undefined) ?? [];

      // Cas normal et sans danger : `Transaction.donationId` est @unique, et
      // c'est CE don précis qui a déjà sa transaction — deux appels
      // concurrents pour le MÊME don, le second arrive simplement après coup.
      if (target.includes('donationId')) {
        return { alreadyConfirmed: true };
      }

      // Tout le reste (stripePaymentIntentId, serdipayTransactionId) signifie
      // qu'un AUTRE don réclame déjà cette référence de paiement — jamais
      // anodin : soit un vrai bug côté appelant, soit une tentative de rejeu
      // avec un don différent. Ça doit remonter comme une vraie erreur pour
      // être visible dans les journaux, pas disparaître en faux succès.
      throw new Error(
        `Référence de paiement déjà utilisée par un autre don (${providerField} = ${providerReference}).`
      );
    }
    throw error;
  }

  return { alreadyConfirmed: false };
}
