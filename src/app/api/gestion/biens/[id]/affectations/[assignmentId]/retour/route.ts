import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireGestionRole } from '@/lib/auth';
import { assetReturnSchema } from '@/lib/schemas';
import { canManageAssets } from '@/lib/assets';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; assignmentId: string }> }
) {
  const actor = await requireGestionRole(['DIRECTION', 'TERRAIN']);
  if (!actor || !canManageAssets(actor.role)) {
    return NextResponse.json({ error: 'Accès refusé.' }, { status: 403 });
  }

  const { id, assignmentId } = await params;
  const assignment = await prisma.assetAssignment.findUnique({ where: { id: assignmentId } });
  if (!assignment || assignment.assetId !== id) {
    return NextResponse.json({ error: 'Introuvable.' }, { status: 404 });
  }
  if (assignment.returnedOn) {
    return NextResponse.json({ error: 'Ce retour a déjà été enregistré.' }, { status: 409 });
  }

  const body = await request.json().catch(() => ({}));
  const parsed = assetReturnSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Formulaire invalide.', issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  await prisma.assetAssignment.update({
    where: { id: assignmentId },
    data: { returnedOn: new Date(), conditionIn: parsed.data.conditionIn || null }
  });

  const asset = await prisma.asset.findUnique({ where: { id } });
  if (asset && asset.status !== 'DISPOSED' && asset.status !== 'LOST') {
    await prisma.asset.update({
      where: { id },
      data: {
        status: 'IN_STOCK',
        condition: parsed.data.conditionIn || asset.condition
      }
    });
  }

  await prisma.auditLog.create({
    data: {
      actorId: actor.id,
      actorEmail: actor.email,
      action: 'UPDATE',
      entity: 'AssetAssignment',
      entityId: assignmentId,
      changes: { returned: true }
    }
  });

  return NextResponse.json({ ok: true });
}
