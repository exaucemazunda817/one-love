import type { Metadata } from 'next';
import { redirect, notFound } from 'next/navigation';
import { getCurrentGestionUser } from '@/lib/auth';
import { canManageAssets, canViewAssetRegistry, computeIndicativeValueEur } from '@/lib/assets';
import { prisma } from '@/lib/prisma';
import { AssetDetailManager } from './AssetDetailManager';

export const metadata: Metadata = {
  title: 'Fiche bien — Gestion',
  robots: { index: false, follow: false }
};

export default async function AssetDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentGestionUser();
  if (!user) redirect('/gestion/connexion');
  if (!canViewAssetRegistry(user.role)) redirect('/gestion');

  const { id } = await params;
  const [asset, teamMembers] = await Promise.all([
    prisma.asset.findUnique({
      where: { id },
      include: {
        fundedByProject: { select: { name: true } },
        assignments: {
          orderBy: { assignedOn: 'desc' },
          include: { teamMember: { select: { firstName: true, lastName: true } } }
        }
      }
    }),
    prisma.teamMember.findMany({
      where: { isActive: true },
      orderBy: { lastName: 'asc' },
      select: { id: true, firstName: true, lastName: true }
    })
  ]);
  if (!asset) notFound();

  return (
    <AssetDetailManager
      canManage={canManageAssets(user.role)}
      asset={{
        id: asset.id,
        inventoryCode: asset.inventoryCode,
        label: asset.label,
        category: asset.category,
        serialNumber: asset.serialNumber,
        condition: asset.condition,
        status: asset.status,
        location: asset.location,
        acquiredOn: asset.acquiredOn?.toISOString() ?? null,
        acquisitionAmount: asset.acquisitionAmount?.toString() ?? null,
        acquisitionCurrency: asset.acquisitionCurrency,
        acquisitionEur: asset.acquisitionEur?.toString() ?? null,
        isDonatedInKind: asset.isDonatedInKind,
        usefulLifeYears: asset.usefulLifeYears,
        fundedByProjectName: asset.fundedByProject?.name ?? null,
        disposalReason: asset.disposalReason,
        indicativeValueEur: computeIndicativeValueEur(asset),
        assignments: asset.assignments.map((a) => ({
          id: a.id,
          holder: a.teamMember ? `${a.teamMember.firstName} ${a.teamMember.lastName}` : (a.siteLabel ?? '—'),
          assignedOn: a.assignedOn.toISOString(),
          returnedOn: a.returnedOn?.toISOString() ?? null,
          conditionOut: a.conditionOut,
          conditionIn: a.conditionIn
        }))
      }}
      teamMembers={teamMembers}
    />
  );
}
