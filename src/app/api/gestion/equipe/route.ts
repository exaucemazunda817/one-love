import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireGestionRole } from '@/lib/auth';
import { teamMemberSchema } from '@/lib/schemas';
import { canManageTeam, canViewTeamDirectory, canViewTeamDirectoryBasic } from '@/lib/team';

// TERRAIN reçoit un annuaire volontairement réduit (nom, fonction,
// engagement, actif) — jamais les coordonnées ni aucune donnée salariale.
// C'est filtré ICI, côté serveur, pas seulement caché dans l'interface.
export async function GET() {
  const actor = await requireGestionRole(['RH', 'DIRECTION', 'TERRAIN']);
  if (!actor) return NextResponse.json({ error: 'Accès refusé.' }, { status: 403 });

  if (canViewTeamDirectory(actor.role)) {
    const members = await prisma.teamMember.findMany({
      orderBy: [{ isActive: 'desc' }, { lastName: 'asc' }],
      select: {
        id: true,
        firstName: true,
        lastName: true,
        engagement: true,
        jobTitle: true,
        email: true,
        phone: true,
        city: true,
        startedOn: true,
        endedOn: true,
        isActive: true,
        _count: { select: { contracts: true, payrollEntries: true } }
      }
    });
    return NextResponse.json({ members, basic: false });
  }

  if (canViewTeamDirectoryBasic(actor.role)) {
    const members = await prisma.teamMember.findMany({
      where: { isActive: true },
      orderBy: { lastName: 'asc' },
      select: { id: true, firstName: true, lastName: true, engagement: true, jobTitle: true, isActive: true }
    });
    return NextResponse.json({ members, basic: true });
  }

  return NextResponse.json({ error: 'Accès refusé.' }, { status: 403 });
}

export async function POST(request: NextRequest) {
  const actor = await requireGestionRole(['RH']);
  if (!actor || !canManageTeam(actor.role)) {
    return NextResponse.json({ error: 'Accès refusé.' }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const parsed = teamMemberSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Formulaire invalide.', issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }
  const data = parsed.data;

  const member = await prisma.teamMember.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      engagement: data.engagement,
      jobTitle: data.jobTitle || null,
      email: data.email || null,
      phone: data.phone || null,
      city: data.city || null,
      startedOn: data.startedOn ? new Date(data.startedOn) : null
    }
  });

  await prisma.auditLog.create({
    data: {
      actorId: actor.id,
      actorEmail: actor.email,
      action: 'CREATE',
      entity: 'TeamMember',
      entityId: member.id,
      changes: { firstName: member.firstName, lastName: member.lastName, engagement: member.engagement }
    }
  });

  return NextResponse.json({ id: member.id }, { status: 201 });
}
