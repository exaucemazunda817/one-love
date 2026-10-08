import { NextRequest, NextResponse } from 'next/server';
import { allowRequest, TOO_MANY_REQUESTS_MESSAGE } from '@/lib/rate-limit';
import { donationSessionSchema } from '@/lib/schemas';
import { createPendingDonation } from '@/lib/donations';
import { isStripeConfigured, createDonationCheckoutSession } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { org } from '@/lib/content';
import { toMinorUnits } from '@/lib/money';

import { getSiteUrl } from '@/lib/site-url';

export async function POST(request: NextRequest) {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: "Le paiement en ligne n'est pas encore activé. Merci d'utiliser le virement bancaire." },
      { status: 503 }
    );
  }

  if (!(await allowRequest('dons-stripe', request, 10, 60 * 60 * 1000))) {
    return NextResponse.json({ error: TOO_MANY_REQUESTS_MESSAGE }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = donationSessionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Formulaire invalide.', issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }
  const data = parsed.data;

  // Un don fléché doit arriver dans son projet : si le projet n'existe pas
  // ou ne reçoit pas de dons, on refuse AVANT le paiement plutôt que de
  // ranger l'argent en silence dans le fonds général (08/10/2026).
  const project = data.projectSlug
    ? await prisma.project.findUnique({
        where: { slug: data.projectSlug },
        select: { name: true, isDonationTarget: true }
      })
    : null;
  if (data.projectSlug && (!project || !project.isDonationTarget)) {
    return NextResponse.json(
      { error: 'Ce projet ne reçoit pas de dons en ligne pour le moment. Merci de nous écrire.' },
      { status: 400 }
    );
  }
  const description = project ? `Don — ${project.name} — ${org.name}` : `Don — ${org.name}`;

  try {
    const siteUrl = getSiteUrl();
    if (data.frequency === 'once') {
      // Don unique : le Donation PENDING existe AVANT Checkout, pour porter
      // son id dans les métadonnées de la session — voir confirmDonation().
      const donation = await createPendingDonation({
        amount: data.amount,
        currency: data.currency,
        method: 'STRIPE',
        projectSlug: data.projectSlug || null,
        donorEmail: data.donorEmail || null,
        donorFirstName: data.donorFirstName || null,
        donorLastName: data.donorLastName || null,
        donorCountry: data.donorCountry || null
      });

      const session = await createDonationCheckoutSession({
        amountCents: toMinorUnits(data.amount),
        currency: data.currency,
        frequency: 'once',
        donationId: donation.id,
        description,
        donorEmail: data.donorEmail || null,
        successUrl: `${siteUrl}/dons/merci`,
        cancelUrl: `${siteUrl}/dons?statut=annule`
      });

      if (!session.url) throw new Error('Stripe n’a renvoyé aucune URL de paiement.');
      return NextResponse.json({ url: session.url }, { status: 201 });
    }

    // Don mensuel : aucun Donation créé ici — voir le commentaire de
    // createDonationCheckoutSession dans src/lib/stripe.ts. Le projet et
    // l'e-mail voyagent dans les métadonnées de l'ABONNEMENT.
    const session = await createDonationCheckoutSession({
      amountCents: toMinorUnits(data.amount),
      currency: data.currency,
      frequency: 'monthly',
      projectSlug: data.projectSlug || null,
      description: `${description} (don mensuel)`,
      donorEmail: data.donorEmail || null,
      donorFirstName: data.donorFirstName || null,
      donorLastName: data.donorLastName || null,
      donorCountry: data.donorCountry || null,
      successUrl: `${siteUrl}/dons/merci`,
      cancelUrl: `${siteUrl}/dons?statut=annule`
    });

    if (!session.url) throw new Error('Stripe n’a renvoyé aucune URL de paiement.');
    return NextResponse.json({ url: session.url }, { status: 201 });
  } catch (error) {
    console.error('Création de session Stripe échouée', error);
    return NextResponse.json(
      { error: 'Le paiement en ligne est momentanément indisponible. Merci de réessayer.' },
      { status: 502 }
    );
  }
}
