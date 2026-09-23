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

  const donation = await createPendingDonation({
    amountEur: data.amountEur,
    method: 'STRIPE',
    projectSlug: data.projectSlug || null,
    donorEmail: data.donorEmail || null
  });

  const project = donation.projectId
    ? await prisma.project.findUnique({ where: { id: donation.projectId }, select: { name: true } })
    : null;

  try {
    const session = await createDonationCheckoutSession({
      amountEurCents: Math.round(data.amountEur * 100),
      donationId: donation.id,
      description: project ? `Don — ${project.name} — ${org.name}` : `Don — ${org.name}`,
      donorEmail: data.donorEmail || null,
      successUrl: `${siteUrl}/dons/merci`,
      cancelUrl: `${siteUrl}/dons?statut=annule`
    });

    if (!session.url) throw new Error('Stripe n’a renvoyé aucune URL de paiement.');

    return NextResponse.json({ url: session.url }, { status: 201 });
  } catch (error) {
    console.error('Création de session Stripe échouée', error);
    // Le don reste en base au statut PENDING : il ne sera jamais confirmé
    // faute de paiement, mais rien n'est perdu si on veut relancer le
    // donateur ou diagnostiquer l'échec depuis /gestion plus tard.
    return NextResponse.json(
      { error: 'Le paiement en ligne est momentanément indisponible. Merci de réessayer.' },
      { status: 502 }
    );
  }
}
