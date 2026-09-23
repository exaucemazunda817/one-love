import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentGestionUser } from '@/lib/auth';
import { canViewAccountingSetup, canManageAccountingSetup, getAccountBalance } from '@/lib/accounting';
import { prisma } from '@/lib/prisma';
import { AccountsManager } from './AccountsManager';

export const metadata: Metadata = {
  title: 'Comptes de trésorerie — Gestion',
  robots: { index: false, follow: false }
};

export default async function ComptabiliteComptesPage() {
  const user = await getCurrentGestionUser();
  if (!user) redirect('/gestion/connexion');
  if (!canViewAccountingSetup(user.role)) redirect('/gestion');

  const accounts = await prisma.financialAccount.findMany({ orderBy: { createdAt: 'asc' } });
  const withBalance = await Promise.all(
    accounts.map(async (a) => ({ ...a, balance: await getAccountBalance(a.id) }))
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-ol-charcoal">Comptes de trésorerie</h1>
        <p className="mt-1 text-sm text-ol-muted">
          Banque, caisse ou Mobile Money — chaque compte n&apos;a qu&apos;une seule devise.
        </p>
      </div>
      <AccountsManager initialAccounts={withBalance} canManage={canManageAccountingSetup(user.role)} />
    </div>
  );
}
