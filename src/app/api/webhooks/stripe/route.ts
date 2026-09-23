import { NextRequest, NextResponse } from 'next/server';
import {
  verifyStripeWebhookSignature,
  getStripeSubscription,
  type StripeWebhookEvent,
  type StripeCheckoutSessionObject,
  type StripeInvoiceObject
} from '@/lib/stripe';
import { confirmDonation, createConfirmedDonation } from '@/lib/donations';

// Le corps DOIT être lu en texte brut, AVANT tout JSON.parse : la vérification
// de signature Stripe porte sur les octets exacts envoyés, pas sur une
// reconstruction JSON.stringify(JSON.parse(...)) qui peut différer (ordre des
// clés, espaces) et casser la signature.
export async function POST(request: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    console.error('STRIPE_WEBHOOK_SECRET manquant : webhook Stripe reçu mais ignoré.');
    // 500 et non 200 : un webhook mal configuré doit être visible dans le
    // tableau de bord Stripe (tentatives échouées), jamais avalé en silence.
    // Leçon du 10/09 sur gospel-nation : un webhook qui répond 200 alors que
    // la synchronisation a échoué fait perdre l'événement pour de bon, Stripe
    // ne le rejouant que si la réponse indique explicitement un échec.
    return NextResponse.json({ error: 'Non configuré' }, { status: 500 });
  }

  const rawBody = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!verifyStripeWebhookSignature(rawBody, signature, secret)) {
    console.error('Signature de webhook Stripe invalide.');
    return NextResponse.json({ error: 'Signature invalide' }, { status: 400 });
  }

  let event: StripeWebhookEvent;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'Corps JSON invalide' }, { status: 400 });
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as unknown as StripeCheckoutSessionObject;

      // Don mensuel : ignoré ici volontairement. `invoice.paid` est la seule
      // source de vérité pour un abonnement, premier prélèvement compris —
      // traiter aussi ce premier paiement depuis checkout.session.completed
      // créerait un don en double pour le premier mois.
      if (session.mode === 'subscription') {
        return NextResponse.json({ status: 'ignored', reason: 'subscription-mode' });
      }

      const donationId = session.metadata?.donationId;
      if (!donationId) {
        console.error('Session Stripe sans donationId en métadonnée', session.id);
        return NextResponse.json({ error: 'Métadonnée manquante' }, { status: 400 });
      }
      if (session.payment_status !== 'paid') {
        return NextResponse.json({ status: 'ignored', reason: 'not-paid' });
      }
      if (!session.payment_intent) {
        console.error('Session Stripe payée sans payment_intent', session.id);
        return NextResponse.json({ error: 'payment_intent manquant' }, { status: 400 });
      }

      await confirmDonation({
        donationId,
        providerField: 'stripePaymentIntentId',
        providerReference: session.payment_intent
      });
    }

    if (event.type === 'invoice.paid') {
      const invoice = event.data.object as unknown as StripeInvoiceObject;

      if (!invoice.subscription) {
        // Facture hors abonnement (ex. facture ponctuelle créée à la main
        // dans le tableau de bord Stripe) : hors du périmètre des dons
        // mensuels, on ignore sans erreur.
        return NextResponse.json({ status: 'ignored', reason: 'no-subscription' });
      }

      // Le projet et l'e-mail du donateur ne sont PAS sur la facture : ils
      // vivent sur l'ABONNEMENT (subscription_data.metadata à la création de
      // la session, voir src/lib/stripe.ts). Une facture par mois porte le
      // même identifiant d'abonnement, donc la même métadonnée à chaque fois.
      const subscription = await getStripeSubscription(invoice.subscription);

      await createConfirmedDonation({
        amountEur: invoice.amount_paid / 100,
        method: 'STRIPE',
        isRecurring: true,
        projectSlug: subscription.metadata?.projectSlug || null,
        donorEmail: subscription.metadata?.donorEmail || null,
        providerField: 'stripePaymentIntentId',
        // Pas littéralement un PaymentIntent : identifiant Stripe de la
        // FACTURE, réutilisé comme clé d'idempotence (garanti présent et
        // stable, contrairement à payment_intent qui peut être absent selon
        // le moyen de paiement).
        providerReference: invoice.id,
        receivedOn: new Date()
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Traitement du webhook Stripe échoué', error);
    // 500 volontaire : Stripe réessaiera selon son propre calendrier plutôt
    // que de considérer l'événement traité alors qu'il ne l'est pas.
    return NextResponse.json({ error: 'Traitement échoué' }, { status: 500 });
  }
}
