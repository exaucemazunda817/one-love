import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getCurrentGestionUser, hashPassword, verifyPassword } from '@/lib/auth';
import { createSessionToken, SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS } from '@/lib/session';

const schema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(12, 'Le nouveau mot de passe doit compter au moins 12 caractères.')
});

// Changement de mot de passe volontaire OU forcé par mustChangePassword.
// Incrémente tokenVersion (révoque toute AUTRE session ouverte sur ce
// compte), mais réémet immédiatement un cookie à jour pour CETTE session :
// l'utilisateur qui vient de changer son mot de passe ne doit pas se
// retrouver déconnecté par son propre geste.
export async function POST(request: NextRequest) {
  const user = await getCurrentGestionUser();
  if (!user) {
    return NextResponse.json({ error: 'Non authentifié.' }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || 'Formulaire invalide.' },
      { status: 400 }
    );
  }
  const { currentPassword, newPassword } = parsed.data;

  const validCurrent = await verifyPassword(currentPassword, user.passwordHash);
  if (!validCurrent) {
    return NextResponse.json({ error: 'Mot de passe actuel incorrect.' }, { status: 401 });
  }

  const passwordHash = await hashPassword(newPassword);
  const updated = await prisma.appUser.update({
    where: { id: user.id },
    data: {
      passwordHash,
      mustChangePassword: false,
      tokenVersion: { increment: 1 }
    }
  });

  await prisma.auditLog.create({
    data: {
      actorId: user.id,
      actorEmail: user.email,
      action: 'UPDATE',
      entity: 'AppUser',
      entityId: user.id,
      changes: { field: 'passwordHash' }
    }
  });

  const token = await createSessionToken(updated.id, updated.tokenVersion);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE_SECONDS,
    path: '/'
  });
  return response;
}
