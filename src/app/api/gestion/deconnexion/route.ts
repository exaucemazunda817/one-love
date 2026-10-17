import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { SESSION_COOKIE_NAME, verifySessionToken } from '@/lib/session';

// Déconnexion : en plus d'effacer le cookie, on invalide la session côté
// serveur (tokenVersion + 1). Sans ça, un cookie copié avant la déconnexion
// (ordinateur partagé) restait valable jusqu'à 8 heures (audit du
// 17/10/2026). Effet voulu : la déconnexion ferme aussi les autres appareils.
export async function POST(request: NextRequest) {
  const payload = await verifySessionToken(request.cookies.get(SESSION_COOKIE_NAME)?.value);
  if (payload) {
    await prisma.appUser
      .updateMany({
        where: { id: payload.userId, tokenVersion: payload.tokenVersion },
        data: { tokenVersion: { increment: 1 } }
      })
      .catch((error) => console.error('Invalidation de session échouée', error));
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE_NAME, '', { httpOnly: true, path: '/', maxAge: 0 });
  return response;
}
