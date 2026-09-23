import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentGestionUser } from '@/lib/auth';
import { canManageAccountingSetup } from '@/lib/accounting';
import { prisma } from '@/lib/prisma';
import { CategoriesManager } from './CategoriesManager';

export const metadata: Metadata = {
  title: 'Catégories comptables — Gestion',
  robots: { index: false, follow: false }
};

export default async function CategoriesPage() {
  const user = await getCurrentGestionUser();
  if (!user) redirect('/gestion/connexion');
  if (!canManageAccountingSetup(user.role)) redirect('/gestion');

  // Le type en base couvre aussi TRANSFER (transferts internes), mais une
  // catégorie ne peut être créée qu'en INCOME/EXPENSE (voir
  // transactionCategorySchema) — le filtre ci-dessous n'est donc qu'une
  // garantie de typage, pas un vrai filtre fonctionnel.
  const categories = (
    await prisma.transactionCategory.findMany({ orderBy: [{ kind: 'asc' }, { label: 'asc' }] })
  ).filter((c): c is typeof c & { kind: 'INCOME' | 'EXPENSE' } => c.kind !== 'TRANSFER');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-ol-charcoal">Catégories comptables</h1>
        <p className="mt-1 text-sm text-ol-muted">
          Nomenclature libre de l&apos;association — un seul niveau de sous-catégories.
        </p>
      </div>
      <CategoriesManager
        initialCategories={categories.map((c) => ({ ...c, parentId: c.parentId }))}
      />
    </div>
  );
}
