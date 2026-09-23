import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { allowRequest, TOO_MANY_REQUESTS_MESSAGE } from '@/lib/rate-limit';
import { notifyAssociation } from '@/lib/email';
import { contactSchema } from '@/lib/schemas';
import { org } from '@/lib/content';

export async function POST(request: NextRequest) {
  if (!(await allowRequest('contact', request, 8, 60 * 60 * 1000))) {
    return NextResponse.json({ error: TOO_MANY_REQUESTS_MESSAGE }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Formulaire invalide.', issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }
  const data = parsed.data;

  const message = await prisma.contactMessage.create({
    data: {
      fullName: data.fullName,
      email: data.email,
      phone: data.phone || null,
      subject: data.subject,
      message: data.message
    }
  });

  // L'écriture en base a réussi : c'est le seul point qui compte pour le
  // visiteur. Un échec d'e-mail ne doit jamais faire échouer la soumission,
  // le message reste visible dans /gestion.
  await notifyAssociation({
    subject: `[${org.name}] Nouveau message — ${data.subject}`,
    lines: [
      { label: 'Nom', value: data.fullName },
      { label: 'E-mail', value: data.email },
      { label: 'Téléphone', value: data.phone || 'Non renseigné' },
      { label: 'Sujet', value: data.subject },
      { label: 'Message', value: data.message }
    ],
    replyTo: data.email
  }).catch((error) => console.error('Notification contact échouée', error));

  return NextResponse.json({ id: message.id }, { status: 201 });
}
