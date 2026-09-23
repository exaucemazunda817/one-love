import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { allowRequest, TOO_MANY_REQUESTS_MESSAGE } from '@/lib/rate-limit';
import { notifyAssociation } from '@/lib/email';
import { partnershipSchema } from '@/lib/schemas';
import { safeHttpUrl } from '@/lib/validation';
import { org } from '@/lib/content';

export async function POST(request: NextRequest) {
  if (!(await allowRequest('partenariat', request, 5, 60 * 60 * 1000))) {
    return NextResponse.json({ error: TOO_MANY_REQUESTS_MESSAGE }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = partnershipSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Formulaire invalide.', issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }
  const data = parsed.data;
  // Deuxième filtre indépendant du schéma zod : safeHttpUrl bloque
  // explicitement javascript: et data:, qu'une simple regex peut laisser passer.
  const website = safeHttpUrl(data.website || null);

  const request_ = await prisma.partnershipRequest.create({
    data: {
      organisationName: data.organisationName,
      contactName: data.contactName,
      email: data.email,
      phone: data.phone || null,
      website,
      partnershipType: data.partnershipType || null,
      message: data.message
    }
  });

  await notifyAssociation({
    subject: `[${org.name}] Nouvelle proposition de partenariat`,
    lines: [
      { label: 'Organisation', value: data.organisationName },
      { label: 'Contact', value: data.contactName },
      { label: 'E-mail', value: data.email },
      { label: 'Téléphone', value: data.phone || 'Non renseigné' },
      { label: 'Site web', value: website || 'Non renseigné' },
      { label: 'Type de partenariat', value: data.partnershipType || 'Non précisé' },
      { label: 'Message', value: data.message }
    ],
    replyTo: data.email
  }).catch((error) => console.error('Notification partenariat échouée', error));

  return NextResponse.json({ id: request_.id }, { status: 201 });
}
