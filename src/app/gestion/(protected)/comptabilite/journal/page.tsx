import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentGestionUser } from '@/lib/auth';
import { canViewJournal, canCreateFullEntry } from '@/lib/accounting';
import { prisma } from '@/lib/prisma';
import { JournalManager } from './JournalManager';

export const metadata: Metadata = {
  title: 'Journal comptable — Gestion',
  robots: { index: false, follow: false }
};

export default async function JournalPage() {
  const user = await getCurrentGestionUser();
  if (!user) redirect('/gestion/connexion');
  if (!canViewJournal(user.role)) redirect('/gestion');

  const [entries, accounts, categories, projects] = await Promise.all([
    prisma.transaction.findMany({
      orderBy: { occurredOn: 'desc' },
      take: 200,
      include: {
        project: { select: { name: true } },
        category: { select: { label: true } },
        account: { select: { name: true } },
        createdBy: { select: { firstName: true, lastName: true } },
        validatedBy: { select: { firstName: true, lastName: true } },
        _count: { select: { documents: true } }
      }
    }),
    prisma.financialAccount.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } }),
    prisma.transactionCategory.findMany({ where: { isActive: true }, orderBy: { label: 'asc' } }),
    prisma.project.findMany({ orderBy: { name: 'asc' }, select: { id: true, name: true } })
  ]);

  const serialized = entries.map((e) => ({
    id: e.id,
    kind: e.kind,
    status: e.status,
    occurredOn: e.occurredOn.toISOString(),
    label: e.label,
    amount: e.amount.toString(),
    currency: e.currency,
    fxRate: e.fxRate.toString(),
    amountEur: e.amountEur.toString(),
    projectName: e.project?.name ?? null,
    categoryName: e.category?.label ?? null,
    accountName: e.account?.name ?? null,
    createdByName: e.createdBy ? `${e.createdBy.firstName} ${e.createdBy.lastName}` : null,
    validatedByName: e.validatedBy ? `${e.validatedBy.firstName} ${e.validatedBy.lastName}` : null,
    createdById: e.createdById,
    documentCount: e._count.documents
  }));

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-ol-charcoal">Journal comptable</h1>
          <p className="mt-1 text-sm text-ol-muted">
            200 dernières écritures. Une écriture est validée par une autre personne que celle
            qui l&apos;a saisie.
          </p>
        </div>
        <a
          href="/api/gestion/comptabilite/export"
          className="rounded-full border border-ol-line-strong px-5 py-2.5 text-sm font-bold text-ol-charcoal hover:border-ol-ember-ink"
        >
          Exporter en Excel
        </a>
      </div>

      <JournalManager
        initialEntries={serialized}
        accounts={accounts}
        categories={categories.map((c) => ({ id: c.id, label: c.label, kind: c.kind }))}
        projects={projects}
        currentUserId={user.id}
        currentUserRole={user.role}
        canCreate={canCreateFullEntry(user.role)}
      />
    </div>
  );
}
