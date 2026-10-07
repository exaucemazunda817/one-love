import { NextRequest, NextResponse } from 'next/server';
import { allowRequest, TOO_MANY_REQUESTS_MESSAGE } from '@/lib/rate-limit';
import { isStripeConfigured, createDonationCheckoutSession } from '@/lib/stripe';
import { sponsorSessionSchema, sponsorPlanFor, sponsorMetadata } from '@/lib/sponsorship';
import { toMinorUnits } from '@/lib/money';

import { getSiteUrl } from '@/lib/site-url';

// Devenir parrain = payer. Cette route ne crée AUCUN parrain : elle ouvre
// seulement une session de paiement Stripe. Le parrain est enregistré par le
// webhook, à la réception de la facture payée (src/app/api/webhooks/stripe).
// Le montant vient du tableau SPONSOR_PLANS côté serveur, jamais du navigateur.
export async function POST(request: NextRequest) {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: 'Le paiement en ligne est momentanément indisponible. Merci de réessayer plus tard.' },
      { status: 503 }
    );
  }

  if (!(await allowRequest('parrainer-session', request, 10, 60 * 60 * 1000))) {
    return NextResponse.json({ error: TOO_MANY_REQUESTS_MESSAGE }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = sponsorSessionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Formulaire invalide.', issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }
  const data = parsed.data;

  const plan = sponsorPlanFor(data.mode, data.plan);
  if (!plan) return NextResponse.json({ error: 'Formule inconnue.' }, { status: 400 });

  const prefix = data.locale === 'en' ? '/en' : '';
  try {
    const siteUrl = getSiteUrl();
    const session = await createDonationCheckoutSession({
      // Dans la devise choisie, sans reconversion : montant libre (borné par
      // le schéma, par devise) sinon prix fixe de la formule dans cette devise.
      amountCents: toMinorUnits(data.amount ?? plan.prices[data.currency]),
      currency: data.currency,
      frequency: 'monthly',
      description: `Parrainage — ${plan.name} — One Love`,
      donorEmail: data.email,
      donorFirstName: data.firstName,
      donorLastName: data.lastName,
      extraMetadata: sponsorMetadata(data),
      successUrl: `${siteUrl}${prefix}/parrainer/merci`,
      cancelUrl: `${siteUrl}${prefix}/parrainer?statut=annule#inscription`
    });

    if (!session.url) throw new Error('Stripe n’a renvoyé aucune URL de paiement.');
    return NextResponse.json({ url: session.url }, { status: 201 });
  } catch (error) {
    console.error('Création de session Stripe (parrainage) échouée', error);
    return NextResponse.json(
      { error: 'Le paiement en ligne est momentanément indisponible. Merci de réessayer.' },
      { status: 502 }
    );
  }
}
