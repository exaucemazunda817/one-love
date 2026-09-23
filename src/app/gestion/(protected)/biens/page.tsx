import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentGestionUser } from '@/lib/auth';
import { canManageAssets, canViewAssetRegistry } from '@/lib/assets';
import { prisma } from '@/lib/prisma';
import { AssetsManager } from './AssetsManager';

export const metadata: Metadata = {
  title: 'Inventaire — Gestion',
  robots: { index: false, follow: false }
};

export default async function BiensPage() {
  const user = await getCurrentGestionUser();
  if (!user) redirect('/gestion/connexion');
  if (!canViewAssetRegistry(user.role)) redirect('/gestion');

  const [assets, projects] = await Promise.all([
    prisma.asset.findMany({
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
    }),
    prisma.project.findMany({ orderBy: { name: 'asc' }, select: { id: true, name: true } })
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-ol-charcoal">Inventaire</h1>
        <p className="mt-1 text-sm text-ol-muted">
          {assets.length} bien{assets.length > 1 ? 's' : ''} enregistré{assets.length > 1 ? 's' : ''}.
        </p>
      </div>
      <AssetsManager
        initialAssets={assets.map((a) => ({
          id: a.id,
          inventoryCode: a.inventoryCode,
          label: a.label,
          category: a.category,
          condition: a.condition,
          status: a.status,
          location: a.location,
          acquisitionAmount: a.acquisitionAmount?.toString() ?? null,
          acquisitionCurrency: a.acquisitionCurrency,
          holder: a.assignments[0]
            ? a.assignments[0].teamMember
              ? `${a.assignments[0].teamMember.firstName} ${a.assignments[0].teamMember.lastName}`
              : a.assignments[0].siteLabel
            : null
        }))}
        projects={projects}
        canManage={canManageAssets(user.role)}
      />
    </div>
  );
}
