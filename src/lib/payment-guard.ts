import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { Currency } from '@/lib/money';
import { expireCheckoutSession, getCheckoutSession } from '@/lib/stripe';

// Protection contre le double paiement (audit du 17/10/2026).
//
// Le cas réel : le visiteur paie chez Stripe, la connexion coupe avant la page
// de remerciement, il revient sur le formulaire et recommence. Sans garde, il
// est débité deux fois. Stripe protège une MÊME session (impossible de la payer
// deux fois), pas deux sessions différentes : c'est donc au site de vérifier.
//
// Deux verrous, qui se complètent :
//   1. le navigateur garde l'identifiant de la dernière session ouverte et le
//      renvoie (`previousSessionId`) : si elle a été payée, on refuse d'en
//      ouvrir une nouvelle sans confirmation ; si elle est encore ouverte, on
//      la ferme pour qu'elle ne puisse plus être payée en plus de la nouvelle ;
//   2. si un e-mail est connu, on cherche un paiement récent identique en base
//      (utile quand le navigateur a perdu sa mémoire : autre appareil, onglet
//      privé).
// Dans les deux cas, le visiteur peut quand même payer à nouveau en le
// confirmant (`confirmAgain`) : on ne bloque jamais un vrai second don.

export type CheckoutState = 'paid' | 'processing' | 'open' | 'expired' | 'unknown';

/** État d'une session Checkout, sans rien révéler d'autre. */
export async function checkoutState(sessionId: string): Promise<CheckoutState> {
  try {
    const session = await getCheckoutSession(sessionId);
    if (session.status === 'complete') {
      // Prélèvement SEPA : la session est terminée mais l'argent n'arrive
      // qu'après quelques jours. Payer une seconde fois serait un doublon.
      return session.payment_status === 'unpaid' ? 'processing' : 'paid';
    }
    if (session.status === 'open') return 'open';
    if (session.status === 'expired') return 'expired';
    return 'unknown';
  } catch {
    return 'unknown';
  }
}

const RECENT_DONATION_MS = 30 * 60 * 1000; // 30 min
const RECENT_SPONSOR_MS = 24 * 60 * 60 * 1000; // 24 h

function alreadyPaid(message: string) {
  return NextResponse.json({ code: 'ALREADY_PAID', error: message }, { status: 409 });
}

/**
 * Renvoie une réponse 409 si un paiement identique semble déjà passé, sinon
 * `null` (on peut ouvrir la nouvelle session). Ferme au passage l'ancienne
 * session si elle est encore ouverte.
 */
export async function guardAgainstDoublePayment(input: {
  previousSessionId?: string;
  confirmAgain?: boolean;
  kind: 'don' | 'parrainage';
  email?: string | null;
  amount: number;
  currency: Currency;
}): Promise<NextResponse | null> {
  if (input.previousSessionId) {
    const state = await checkoutState(input.previousSessionId);
    if ((state === 'paid' || state === 'processing') && !input.confirmAgain) {
      return alreadyPaid('Votre paiement précédent a bien été reçu. Inutile de recommencer.');
    }
    if (state === 'open') {
      // Échec sans gravité (session déjà fermée entre-temps) : on continue.
      await expireCheckoutSession(input.previousSessionId).catch(() => undefined);
    }
  }

  if (input.confirmAgain || !input.email) return null;
  const email = input.email.trim().toLowerCase();

  if (input.kind === 'parrainage') {
    const recent = await prisma.sponsor.findFirst({
      where: {
        donor: { email },
        status: { in: ['ACTIVE', 'PENDING', 'PAYMENT_FAILED'] },
        createdAt: { gte: new Date(Date.now() - RECENT_SPONSOR_MS) }
      },
      select: { id: true }
    });
    return recent ? alreadyPaid('Un parrainage à cette adresse e-mail a déjà été enregistré aujourd’hui.') : null;
  }

  const recent = await prisma.donation.findFirst({
    where: {
      donor: { email },
      status: 'CONFIRMED',
      method: 'STRIPE',
      amount: input.amount,
      currency: input.currency,
      confirmedAt: { gte: new Date(Date.now() - RECENT_DONATION_MS) }
    },
    select: { id: true }
  });
  return recent ? alreadyPaid('Un don du même montant vient d’être reçu à cette adresse e-mail.') : null;
}
