import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireGestionRole, hashPassword, generateTemporaryPassword } from '@/lib/auth';

const createSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  firstName: z.string().trim().min(1).max(120),
  lastName: z.string().trim().min(1).max(120),
  role: z.enum(['DIRECTION', 'COMPTABLE', 'TERRAIN', 'RH', 'LECTURE'])
});

// Seule la DIRECTION crée des comptes — jamais d'inscription ouverte. Le mot
// de passe temporaire est généré côté serveur (jamais choisi par un tiers,
// jamais transmis par e-mail non chiffré) et renvoyé UNE SEULE FOIS dans
// cette réponse : à la direction de le communiquer de vive voix ou par un
// canal sûr, puis le compte force son changement à la première connexion.
export async function POST(request: NextRequest) {
  const actor = await requireGestionRole(['DIRECTION']);
  if (!actor) {
    return NextResponse.json({ error: 'Accès réservé à la direction.' }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Formulaire invalide.', issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }
  const data = parsed.data;

  const existing = await prisma.appUser.findUnique({ where: { email: data.email } });
  if (existing) {
    return NextResponse.json({ error: 'Un compte existe déjà avec cet e-mail.' }, { status: 409 });
  }

  const temporaryPassword = generateTemporaryPassword();
  const passwordHash = await hashPassword(temporaryPassword);

  const user = await prisma.appUser.create({
    data: {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role,
      passwordHash,
      mustChangePassword: true,
      createdById: actor.id
    }
  });

  await prisma.auditLog.create({
    data: {
      actorId: actor.id,
      actorEmail: actor.email,
      action: 'CREATE',
      entity: 'AppUser',
      entityId: user.id,
      changes: { email: user.email, role: user.role }
    }
  });

  return NextResponse.json(
    {
      id: user.id,
      email: user.email,
      temporaryPassword
    },
    { status: 201 }
  );
}

export async function GET() {
  const actor = await requireGestionRole(['DIRECTION']);
  if (!actor) {
    return NextResponse.json({ error: 'Accès réservé à la direction.' }, { status: 403 });
  }

  const users = await prisma.appUser.findMany({
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      status: true,
      lastLoginAt: true,
      mustChangePassword: true,
      createdAt: true
    }
  });

  return NextResponse.json({ users });
}
