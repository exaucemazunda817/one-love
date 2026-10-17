import { NextRequest, NextResponse } from 'next/server';
import { allowRequest, TOO_MANY_REQUESTS_MESSAGE } from '@/lib/rate-limit';
import { isStripeConfigured } from '@/lib/stripe';
import { checkoutState } from '@/lib/payment-guard';

// Le formulaire de don demande ici si le dernier paiement commencé dans ce
// navigateur est passé (protection contre le double paiement, 17/10/2026).
// Ne renvoie que l'état de la session, jamais le montant, le nom ou l'e-mail :
// l'identifiant de session est long et aléatoire, seul celui qui a commencé
// le paiement le connaît.
const SESSION_ID = /^cs_(test|live)_[A-Za-z0-9]{10,200}$/;

export async function GET(request: NextRequest) {
  if (!isStripeConfigured()) return NextResponse.json({ state: 'unknown' }, { status: 503 });

  if (!(await allowRequest('paiement-statut', request, 30, 60 * 60 * 1000))) {
    return NextResponse.json({ error: TOO_MANY_REQUESTS_MESSAGE }, { status: 429 });
  }

  const sessionId = request.nextUrl.searchParams.get('session_id') ?? '';
  if (!SESSION_ID.test(sessionId)) return NextResponse.json({ error: 'Demande invalide.' }, { status: 400 });

  return NextResponse.json(
    { state: await checkoutState(sessionId) },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}
