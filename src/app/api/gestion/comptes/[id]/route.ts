import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireGestionRole } from '@/lib/auth';

const patchSchema = z.object({
  status: z.enum(['ACTIVE', 'SUSPENDED']).optional(),
  role: z.enum(['DIRECTION', 'COMPTABLE', 'TERRAIN', 'RH', 'LECTURE']).optional()
});

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const actor = await requireGestionRole(['DIRECTION']);
  if (!actor) {
    return NextResponse.json({ error: 'Accès réservé à la direction.' }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success || (!parsed.data.status && !parsed.data.role)) {
    return NextResponse.json({ error: 'Rien à modifier.' }, { status: 400 });
  }
  const data = parsed.data;

  const target = await prisma.appUser.findUnique({ where: { id } });
  if (!target) {
    return NextResponse.json({ error: 'Compte introuvable.' }, { status: 404 });
  }

  // Deux garde-fous pour ne jamais pouvoir bloquer l'accès de tout le monde :
  // on ne peut pas se suspendre soi-même, ni suspendre le dernier compte
  // DIRECTION actif restant.
  if (data.status === 'SUSPENDED') {
    if (target.id === actor.id) {
      return NextResponse.json({ error: 'Vous ne pouvez pas suspendre votre propre compte.' }, { status: 400 });
    }
    if (target.role === 'DIRECTION') {
      const otherActiveDirection = await prisma.appUser.count({
        where: { role: 'DIRECTION', status: 'ACTIVE', id: { not: target.id } }
      });
      if (otherActiveDirection === 0) {
        return NextResponse.json(
          { error: 'Impossible de suspendre le dernier compte direction actif.' },
          { status: 400 }
        );
      }
    }
  }

  const updated = await prisma.appUser.update({
    where: { id },
    data: {
      ...(data.status ? { status: data.status } : {}),
      ...(data.role ? { role: data.role } : {}),
      // La suspension n'a pas besoin de tokenVersion pour être immédiate
      // (getCurrentGestionUser relit `status` à chaque requête), mais on
      // l'incrémente quand même par défense en profondeur : si un cookie
      // avait fuité, la révocation devient certaine même en cas d'écart
      // futur dans la logique de contrôle.
      ...(data.status === 'SUSPENDED' ? { tokenVersion: { increment: 1 } } : {})
    }
  });

  await prisma.auditLog.create({
    data: {
      actorId: actor.id,
      actorEmail: actor.email,
      action: 'UPDATE',
      entity: 'AppUser',
      entityId: target.id,
      changes: {
        ...(data.status ? { status: { from: target.status, to: data.status } } : {}),
        ...(data.role ? { role: { from: target.role, to: data.role } } : {})
      }
    }
  });

  return NextResponse.json({
    id: updated.id,
    status: updated.status,
    role: updated.role
  });
}
