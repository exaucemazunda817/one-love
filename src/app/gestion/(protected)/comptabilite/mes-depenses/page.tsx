import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentGestionUser } from '@/lib/auth';
import { canCreateTerrainExpense } from '@/lib/accounting';
import { prisma } from '@/lib/prisma';
import { ExpenseEntryManager } from './ExpenseEntryManager';

export const metadata: Metadata = {
  title: 'Mes dépenses — Gestion',
  robots: { index: false, follow: false }
};

export default async function MesDepensesPage() {
  const user = await getCurrentGestionUser();
  if (!user) redirect('/gestion/connexion');
  if (!canCreateTerrainExpense(user.role)) redirect('/gestion');

  const [entries, categories, projects] = await Promise.all([
    prisma.transaction.findMany({
      where: { createdById: user.id, kind: 'EXPENSE' },
      orderBy: { occurredOn: 'desc' },
      take: 100,
      include: {
        project: { select: { name: true } },
        category: { select: { label: true } },
        _count: { select: { documents: true } }
      }
    }),
    prisma.transactionCategory.findMany({
      where: { isActive: true, kind: 'EXPENSE' },
      orderBy: { label: 'asc' }
    }),
    prisma.project.findMany({ orderBy: { name: 'asc' }, select: { id: true, name: true } })
  ]);

  const serialized = entries.map((e) => ({
    id: e.id,
    status: e.status,
    occurredOn: e.occurredOn.toISOString(),
    label: e.label,
    amount: e.amount.toString(),
    currency: e.currency,
    projectName: e.project?.name ?? null,
    categoryName: e.category?.label ?? null,
    documentCount: e._count.documents
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-ol-charcoal">Mes dépenses de terrain</h1>
        <p className="mt-1 text-sm text-ol-muted">
          Vos dépenses restent en brouillon jusqu&apos;à leur validation par la comptabilité.
        </p>
      </div>
      <ExpenseEntryManager
        initialEntries={serialized}
        categories={categories.map((c) => ({ id: c.id, label: c.label }))}
        projects={projects}
      />
    </div>
  );
}
