import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireGestionRole } from '@/lib/auth';
import { canManageTeam, canViewTeamDirectory } from '@/lib/team';

// Fiche détaillée (contrats + versements de paie) — réservée à RH et
// DIRECTION. TERRAIN n'a que l'annuaire minimal renvoyé par /api/gestion/equipe,
// jamais cette vue détaillée.
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const actor = await requireGestionRole(['RH', 'DIRECTION']);
  if (!actor || !canViewTeamDirectory(actor.role)) {
    return NextResponse.json({ error: 'Accès refusé.' }, { status: 403 });
  }

  const { id } = await params;
  const member = await prisma.teamMember.findUnique({
    where: { id },
    include: {
      contracts: { orderBy: { startsOn: 'desc' } },
      payrollEntries: {
        orderBy: [{ periodYear: 'desc' }, { periodMonth: 'desc' }],
        include: { project: { select: { name: true } } }
      }
    }
  });
  if (!member) return NextResponse.json({ error: 'Introuvable.' }, { status: 404 });

  return NextResponse.json({ member });
}

/** Départ ou retour d'activité — seul champ modifiable après création,
 * réservé à RH. Toute autre correction (nom, engagement…) passe par la
 * direction directement si besoin, ce n'est pas un écran construit ici. */
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const actor = await requireGestionRole(['RH']);
  if (!actor || !canManageTeam(actor.role)) {
    return NextResponse.json({ error: 'Accès refusé.' }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);
  if (!body || typeof body.isActive !== 'boolean') {
    return NextResponse.json({ error: 'Formulaire invalide.' }, { status: 400 });
  }

  const member = await prisma.teamMember.findUnique({ where: { id } });
  if (!member) return NextResponse.json({ error: 'Introuvable.' }, { status: 404 });

  const updated = await prisma.teamMember.update({
    where: { id },
    data: {
      isActive: body.isActive,
      endedOn: body.isActive ? null : new Date()
    }
  });

  await prisma.auditLog.create({
    data: {
      actorId: actor.id,
      actorEmail: actor.email,
      action: 'UPDATE',
      entity: 'TeamMember',
      entityId: id,
      changes: { isActive: updated.isActive }
    }
  });

  return NextResponse.json({ ok: true });
}
