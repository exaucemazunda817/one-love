import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { allowRequest, clientIp, TOO_MANY_REQUESTS_MESSAGE } from '@/lib/rate-limit';
import { sendEmail } from '@/lib/email';
import { newsletterSchema } from '@/lib/schemas';
import { org } from '@/lib/content';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

// Double opt-in : l'inscription crée un abonné non confirmé et envoie un lien
// de confirmation. `confirmedAt` fait foi, et `consentSource`/`consentIp`
// constituent la preuve de consentement que le RGPD impose de pouvoir produire.
export async function POST(request: NextRequest) {
  if (!(await allowRequest('newsletter', request, 5, 60 * 60 * 1000))) {
    return NextResponse.json({ error: TOO_MANY_REQUESTS_MESSAGE }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = newsletterSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Formulaire invalide.', issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }
  const data = parsed.data;

  const existing = await prisma.newsletterSubscriber.findUnique({ where: { email: data.email } });

  // Un abonné déjà confirmé qui se réinscrit ne doit pas recevoir un nouveau
  // lien : on répond succès sans rien renvoyer, pour ne pas révéler à un tiers
  // qu'une adresse est déjà inscrite.
  if (existing?.confirmedAt) {
    return NextResponse.json({ status: 'already-confirmed' }, { status: 200 });
  }

  const subscriber = existing
    ? await prisma.newsletterSubscriber.update({
        where: { id: existing.id },
        data: { firstName: data.firstName || existing.firstName }
      })
    : await prisma.newsletterSubscriber.create({
        data: {
          email: data.email,
          firstName: data.firstName || null,
          consentSource: 'site-formulaire-newsletter',
          consentIp: clientIp(request)
        }
      });

  const confirmUrl = `${siteUrl}/newsletter/confirmer?token=${subscriber.confirmToken}`;

  const result = await sendEmail({
    to: subscriber.email,
    subject: `Confirmez votre inscription à la lettre d'information ${org.name}`,
    text: `Bonjour,\n\nPour confirmer votre inscription à la lettre d'information de ${org.name}, cliquez sur ce lien :\n${confirmUrl}\n\nSi vous n'êtes pas à l'origine de cette demande, ignorez ce message.`,
    html: `<p>Bonjour,</p><p>Pour confirmer votre inscription à la lettre d'information de ${org.name}, cliquez sur le lien ci-dessous.</p><p><a href="${confirmUrl}">Confirmer mon inscription</a></p><p>Si vous n'êtes pas à l'origine de cette demande, ignorez ce message.</p>`
  });

  if (!result.ok && result.reason === 'not-configured') {
    // Resend n'est pas encore branché : l'inscription est enregistrée mais
    // personne ne peut la confirmer. On le dit clairement plutôt que de
    // laisser croire que le mail est parti.
    return NextResponse.json(
      { status: 'saved-but-email-not-configured' },
      { status: 202 }
    );
  }

  return NextResponse.json({ status: 'confirmation-sent' }, { status: 201 });
}
