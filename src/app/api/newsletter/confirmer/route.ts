import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const token = typeof body?.token === 'string' ? body.token : null;
  if (!token) return NextResponse.json({ error: 'Jeton manquant.' }, { status: 400 });

  const subscriber = await prisma.newsletterSubscriber.findUnique({ where: { confirmToken: token } });
  if (!subscriber) {
    return NextResponse.json({ error: 'Lien de confirmation invalide.' }, { status: 404 });
  }
  if (subscriber.unsubscribedAt) {
    return NextResponse.json({ error: 'Cette inscription a été résiliée.' }, { status: 410 });
  }

  if (!subscriber.confirmedAt) {
    await prisma.newsletterSubscriber.update({
      where: { id: subscriber.id },
      data: { confirmedAt: new Date() }
    });
  }

  return NextResponse.json({ status: 'confirmed' });
}
