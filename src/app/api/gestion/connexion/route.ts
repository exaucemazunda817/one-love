import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { verifyPassword } from '@/lib/auth';
import { createSessionToken, SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS } from '@/lib/session';
import { allowRequest, clientIp, TOO_MANY_REQUESTS_MESSAGE } from '@/lib/rate-limit';

const schema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1)
});

// Message générique dans TOUS les cas d'échec : compte inexistant, suspendu,
// ou mot de passe faux. Préciser lequel reviendrait à confirmer à un
// attaquant qu'une adresse e-mail correspond à un vrai compte — même
// principe qu'un formulaire de connexion classique.
const GENERIC_ERROR = 'Identifiants invalides.';

export async function POST(request: NextRequest) {
  if (!(await allowRequest('gestion-connexion', request, 5, 15 * 60 * 1000))) {
    return NextResponse.json({ error: TOO_MANY_REQUESTS_MESSAGE }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 400 });
  }
  const { email, password } = parsed.data;

  const user = await prisma.appUser.findUnique({ where: { email } });

  if (!user || user.status !== 'ACTIVE') {
    await logLoginAttempt({ action: 'LOGIN_FAILED', actorId: user?.id, email, request });
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 401 });
  }

  const validPassword = await verifyPassword(password, user.passwordHash);
  if (!validPassword) {
    await logLoginAttempt({ action: 'LOGIN_FAILED', actorId: user.id, email, request });
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 401 });
  }

  const token = await createSessionToken(user.id, user.tokenVersion);

  await prisma.$transaction([
    prisma.appUser.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } }),
    prisma.auditLog.create({
      data: {
        actorId: user.id,
        actorEmail: user.email,
        action: 'LOGIN',
        entity: 'AppUser',
        entityId: user.id,
        ipAddress: clientIp(request)
      }
    })
  ]);

  const response = NextResponse.json({
    mustChangePassword: user.mustChangePassword,
    firstName: user.firstName,
    role: user.role
  });
  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE_SECONDS,
    path: '/'
  });
  return response;
}

async function logLoginAttempt({
  action,
  actorId,
  email,
  request
}: {
  action: 'LOGIN_FAILED';
  actorId?: string;
  email: string;
  request: NextRequest;
}) {
  // L'audit ne doit jamais empêcher de répondre l'erreur au visiteur : une
  // panne d'écriture ici ne doit pas cacher un « identifiants invalides ».
  await prisma.auditLog
    .create({
      data: {
        actorId: actorId ?? null,
        actorEmail: email,
        action,
        entity: 'AppUser',
        entityId: actorId ?? email,
        ipAddress: clientIp(request)
      }
    })
    .catch((error) => console.error("Journalisation de la tentative de connexion échouée", error));
}
