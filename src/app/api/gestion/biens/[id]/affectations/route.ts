import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireGestionRole } from '@/lib/auth';
import { assetAssignmentSchema } from '@/lib/schemas';
import { canManageAssets } from '@/lib/assets';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const actor = await requireGestionRole(['DIRECTION', 'TERRAIN']);
  if (!actor || !canManageAssets(actor.role)) {
    return NextResponse.json({ error: 'Accès refusé.' }, { status: 403 });
  }

  const { id } = await params;
  const asset = await prisma.asset.findUnique({ where: { id } });
  if (!asset) return NextResponse.json({ error: 'Introuvable.' }, { status: 404 });

  const body = await request.json().catch(() => null);
  const parsed = assetAssignmentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Formulaire invalide.', issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }
  const data = parsed.data;

  // Un bien ne peut avoir qu'une seule affectation active à la fois — sans
  // ce contrôle, l'historique ne dirait plus rien de fiable sur qui l'a
  // réellement en main.
  const active = await prisma.assetAssignment.findFirst({ where: { assetId: id, returnedOn: null } });
  if (active) {
    return NextResponse.json({ error: 'Ce bien est déjà affecté — enregistrez d’abord son retour.' }, { status: 409 });
  }

  const assignment = await prisma.assetAssignment.create({
    data: {
      assetId: id,
      teamMemberId: data.teamMemberId || null,
      siteLabel: data.siteLabel || null,
      assignedOn: new Date(data.assignedOn),
      conditionOut: data.conditionOut || null
    }
  });

  await prisma.asset.update({
    where: { id },
    data: { status: 'IN_USE', location: data.siteLabel || asset.location }
  });

  await prisma.auditLog.create({
    data: {
      actorId: actor.id,
      actorEmail: actor.email,
      action: 'CREATE',
      entity: 'AssetAssignment',
      entityId: assignment.id,
      changes: { assetId: id, teamMemberId: data.teamMemberId || null, siteLabel: data.siteLabel || null }
    }
  });

  return NextResponse.json({ id: assignment.id }, { status: 201 });
}
