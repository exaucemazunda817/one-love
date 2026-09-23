import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireGestionRole } from '@/lib/auth';
import { assetSchema } from '@/lib/schemas';
import { canManageAssets, canViewAssetRegistry, generateInventoryCode } from '@/lib/assets';
import { computeAmountEur } from '@/lib/accounting';

export async function GET() {
  const actor = await requireGestionRole(['DIRECTION', 'TERRAIN', 'COMPTABLE']);
  if (!actor || !canViewAssetRegistry(actor.role)) {
    return NextResponse.json({ error: 'Accès refusé.' }, { status: 403 });
  }

  const assets = await prisma.asset.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      inventoryCode: true,
      label: true,
      category: true,
      condition: true,
      status: true,
      location: true,
      acquisitionAmount: true,
      acquisitionCurrency: true,
      assignments: {
        where: { returnedOn: null },
        take: 1,
        select: { teamMember: { select: { firstName: true, lastName: true } }, siteLabel: true }
      }
    }
  });

  return NextResponse.json({ assets });
}

export async function POST(request: NextRequest) {
  const actor = await requireGestionRole(['DIRECTION', 'TERRAIN']);
  if (!actor || !canManageAssets(actor.role)) {
    return NextResponse.json({ error: 'Accès refusé.' }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const parsed = assetSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Formulaire invalide.', issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }
  const data = parsed.data;

  let acquisitionEur: string | null = null;
  if (data.acquisitionAmount && data.acquisitionCurrency) {
    try {
      acquisitionEur = computeAmountEur(data.acquisitionAmount, data.acquisitionCurrency, data.acquisitionFxRate || '1');
    } catch (error) {
      return NextResponse.json({ error: (error as Error).message }, { status: 400 });
    }
  }

  const inventoryCode = await generateInventoryCode();
  const asset = await prisma.asset.create({
    data: {
      inventoryCode,
      label: data.label,
      category: data.category,
      serialNumber: data.serialNumber || null,
      acquiredOn: data.acquiredOn ? new Date(data.acquiredOn) : null,
      acquisitionAmount: data.acquisitionAmount || null,
      acquisitionCurrency: data.acquisitionAmount ? data.acquisitionCurrency : null,
      acquisitionFxRate: data.acquisitionAmount
        ? data.acquisitionCurrency === 'EUR'
          ? '1'
          : data.acquisitionFxRate || '1'
        : null,
      acquisitionEur,
      fundedByProjectId: data.fundedByProjectId || null,
      isDonatedInKind: data.isDonatedInKind ?? false,
      usefulLifeYears: data.usefulLifeYears ?? null,
      location: data.location || null
    }
  });

  await prisma.auditLog.create({
    data: {
      actorId: actor.id,
      actorEmail: actor.email,
      action: 'CREATE',
      entity: 'Asset',
      entityId: asset.id,
      changes: { inventoryCode: asset.inventoryCode, label: asset.label, category: asset.category }
    }
  });

  return NextResponse.json({ id: asset.id, inventoryCode: asset.inventoryCode }, { status: 201 });
}
