import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireGestionRole } from '@/lib/auth';
import { assetStatusUpdateSchema } from '@/lib/schemas';
import { canManageAssets, canViewAssetRegistry } from '@/lib/assets';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const actor = await requireGestionRole(['DIRECTION', 'TERRAIN', 'COMPTABLE']);
  if (!actor || !canViewAssetRegistry(actor.role)) {
    return NextResponse.json({ error: 'Accès refusé.' }, { status: 403 });
  }

  const { id } = await params;
  const asset = await prisma.asset.findUnique({
    where: { id },
    include: {
      fundedByProject: { select: { name: true } },
      assignments: {
        orderBy: { assignedOn: 'desc' },
        include: { teamMember: { select: { firstName: true, lastName: true } } }
      }
    }
  });
  if (!asset) return NextResponse.json({ error: 'Introuvable.' }, { status: 404 });

  return NextResponse.json({ asset });
}

/** État, condition, localisation et retrait — réservé à DIRECTION et
 * TERRAIN, comme la création. Le retrait (DISPOSED/LOST) exige un motif,
 * imposé par le schéma. */
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const actor = await requireGestionRole(['DIRECTION', 'TERRAIN']);
  if (!actor || !canManageAssets(actor.role)) {
    return NextResponse.json({ error: 'Accès refusé.' }, { status: 403 });
  }

  const { id } = await params;
  const asset = await prisma.asset.findUnique({ where: { id } });
  if (!asset) return NextResponse.json({ error: 'Introuvable.' }, { status: 404 });

  const body = await request.json().catch(() => null);
  const parsed = assetStatusUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Formulaire invalide.', issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }
  const data = parsed.data;
  const isDisposal = data.status === 'DISPOSED' || data.status === 'LOST';

  const updated = await prisma.asset.update({
    where: { id },
    data: {
      status: data.status,
      condition: data.condition || asset.condition,
      location: data.location || null,
      disposalReason: isDisposal ? data.disposalReason || null : null,
      disposedOn: isDisposal ? (asset.disposedOn ?? new Date()) : null
    }
  });

  await prisma.auditLog.create({
    data: {
      actorId: actor.id,
      actorEmail: actor.email,
      action: 'UPDATE',
      entity: 'Asset',
      entityId: id,
      changes: { status: updated.status, condition: updated.condition }
    }
  });

  return NextResponse.json({ ok: true });
}
