import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { allowRequest, TOO_MANY_REQUESTS_MESSAGE } from '@/lib/rate-limit';
import { notifyAssociation } from '@/lib/email';
import { volunteerSchema } from '@/lib/schemas';
import { org } from '@/lib/content';

export async function POST(request: NextRequest) {
  if (!(await allowRequest('benevole', request, 5, 60 * 60 * 1000))) {
    return NextResponse.json({ error: TOO_MANY_REQUESTS_MESSAGE }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = volunteerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Formulaire invalide.', issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }
  const data = parsed.data;

  // Ne crée volontairement PAS de TeamMember automatiquement : accepter un
  // bénévole est une décision humaine, dans une association qui travaille
  // auprès de mineurs.
  const application = await prisma.volunteerApplication.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone || null,
      country: data.country || null,
      availability: data.availability || null,
      skills: data.skills || null,
      motivation: data.motivation
    }
  });

  await notifyAssociation({
    subject: `[${org.name}] Nouvelle candidature bénévole`,
    lines: [
      { label: 'Nom', value: `${data.firstName} ${data.lastName}` },
      { label: 'E-mail', value: data.email },
      { label: 'Téléphone', value: data.phone || 'Non renseigné' },
      { label: 'Pays', value: data.country || 'Non renseigné' },
      { label: 'Disponibilités', value: data.availability || 'Non renseignées' },
      { label: 'Compétences', value: data.skills || 'Non renseignées' },
      { label: 'Motivation', value: data.motivation }
    ],
    replyTo: data.email
  }).catch((error) => console.error('Notification bénévole échouée', error));

  return NextResponse.json({ id: application.id }, { status: 201 });
}
