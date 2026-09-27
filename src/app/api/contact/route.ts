import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { allowRequest, TOO_MANY_REQUESTS_MESSAGE } from '@/lib/rate-limit';
import { notifyAssociation, sendEmail } from '@/lib/email';
import { contactSchema } from '@/lib/schemas';
import { org } from '@/lib/content';

// Accusé de réception envoyé à l'adresse saisie. Texte FIXE : rien de ce que
// le visiteur a tapé n'y est recopié (ni nom, ni message). Sinon, n'importe
// qui pourrait se servir du formulaire pour faire envoyer par l'association
// un texte de son choix à l'adresse d'un tiers. Le rate limiting (8 par heure
// et par IP) borne le reste.
const ACK: Record<'contact' | 'parrainage' | 'mobile-money', { subject: string; body: string }> = {
  contact: {
    subject: `${org.name} — nous avons bien reçu votre message`,
    body: "Bonjour,\n\nNous avons bien reçu votre message et nous vous répondrons dès que possible.\n\nL'équipe One Love"
  },
  parrainage: {
    subject: `${org.name} — votre demande de parrainage`,
    body: "Bonjour,\n\nMerci pour votre demande de parrainage. Nous revenons vers vous sous 7 jours pour vous présenter l'enfant ou le programme que vous accompagnerez. Aucun prélèvement n'a lieu avant cet échange.\n\nL'équipe One Love"
  },
  'mobile-money': {
    subject: `${org.name} — don par Mobile Money`,
    body: "Bonjour,\n\nC'est noté : nous vous préviendrons dès que le don par Mobile Money (Orange Money, Airtel Money, M-Pesa) sera disponible.\n\nL'équipe One Love"
  }
};

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

  const ack = ACK[data.origin ?? 'contact'];
  await sendEmail({
    to: data.email,
    subject: ack.subject,
    text: ack.body,
    html: ack.body
      .split('\n\n')
      .map((paragraph) => `<p>${paragraph.replace(/\n/g, '<br>')}</p>`)
      .join('')
  }).catch((error) => console.error('Accusé de réception échoué', error));

  return NextResponse.json({ id: message.id }, { status: 201 });
}
