import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireGestionRole } from '@/lib/auth';
import { canAccessChildIdentity, isBeneficiariesModuleEnabled } from '@/lib/beneficiaries';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const actor = await requireGestionRole(['TERRAIN']);
  if (!actor || !canAccessChildIdentity(actor.role)) {
    return NextResponse.json({ error: 'Accès refusé.' }, { status: 403 });
  }
  if (!(await isBeneficiariesModuleEnabled())) {
    return NextResponse.json({ error: 'Module non activé.' }, { status: 403 });
  }

  const { id } = await params;
  const child = await prisma.child.findUnique({
    where: { id },
    include: {
      enrollments: { include: { project: { select: { name: true } } }, orderBy: { enrolledOn: 'desc' } },
      careEvents: { orderBy: { occurredOn: 'desc' }, take: 50 },
      consents: true
    }
  });
  if (!child) return NextResponse.json({ error: 'Introuvable.' }, { status: 404 });

  // Consultation d'une fiche = donnée sensible relue : journalisé, comme
  // prévu par AuditAction.VIEW_SENSITIVE dès le jalon 0.
  await prisma.auditLog.create({
    data: {
      actorId: actor.id,
      actorEmail: actor.email,
      action: 'VIEW_SENSITIVE',
      entity: 'Child',
      entityId: child.id
    }
  });

  return NextResponse.json({ child });
}
