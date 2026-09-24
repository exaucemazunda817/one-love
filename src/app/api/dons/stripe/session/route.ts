import { NextRequest, NextResponse } from 'next/server';
import { allowRequest, TOO_MANY_REQUESTS_MESSAGE } from '@/lib/rate-limit';
import { donationSessionSchema } from '@/lib/schemas';
import { createPendingDonation } from '@/lib/donations';
import { isStripeConfigured, createDonationCheckoutSession } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { org } from '@/lib/content';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

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

  const project = data.projectSlug
    ? await prisma.project.findUnique({ where: { slug: data.projectSlug }, select: { name: true } })
    : null;
  const description = project ? `Don — ${project.name} — ${org.name}` : `Don — ${org.name}`;

  try {
    if (data.frequency === 'once') {
      // Don unique : le Donation PENDING existe AVANT Checkout, pour porter
      // son id dans les métadonnées de la session — voir confirmDonation().
      const donation = await createPendingDonation({
        amountEur: data.amountEur,
        method: 'STRIPE',
        projectSlug: data.projectSlug || null,
        donorEmail: data.donorEmail || null,
        donorFirstName: data.donorFirstName || null,
        donorLastName: data.donorLastName || null,
        donorCountry: data.donorCountry || null
      });

      const session = await createDonationCheckoutSession({
        amountEurCents: Math.round(data.amountEur * 100),
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
      amountEurCents: Math.round(data.amountEur * 100),
      frequency: 'monthly',
      projectSlug: data.projectSlug || null,
      description: `${description} (don mensuel)`,
      donorEmail: data.donorEmail || null,
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
