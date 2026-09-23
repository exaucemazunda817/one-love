import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentGestionUser } from '@/lib/auth';
import { getProjectBalanceSheet, getAccountBalance, canViewAccountingSetup } from '@/lib/accounting';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Comptabilité — Gestion',
  robots: { index: false, follow: false }
};

const CURRENCY_FORMAT: Record<string, Intl.NumberFormat> = {
  EUR: new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }),
  CDF: new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }),
  USD: new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD' })
};

function formatEur(value: number): string {
  return CURRENCY_FORMAT.EUR.format(value);
}

export default async function ComptabilitePage() {
  const user = await getCurrentGestionUser();
  if (!user) redirect('/gestion/connexion');
  if (!['DIRECTION', 'COMPTABLE', 'LECTURE'].includes(user.role)) redirect('/gestion');

  const balanceSheet = await getProjectBalanceSheet();
  const totalIncome = balanceSheet.reduce((sum, p) => sum + p.incomeEur, 0);
  const totalExpense = balanceSheet.reduce((sum, p) => sum + p.expenseEur, 0);

  const showSetup = canViewAccountingSetup(user.role);
  const accounts = showSetup ? await prisma.financialAccount.findMany({ where: { isActive: true } }) : [];
  const accountsWithBalance = showSetup
    ? await Promise.all(accounts.map(async (a) => ({ ...a, balance: await getAccountBalance(a.id) })))
    : [];

  const pendingCount = showSetup
    ? await prisma.transaction.count({ where: { status: 'DRAFT' } })
    : 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-ol-charcoal">Comptabilité</h1>
          <p className="mt-1 text-sm text-ol-muted">
            Bilan calculé uniquement à partir des écritures validées ou verrouillées.
          </p>
        </div>
        {showSetup && (
          <div className="flex flex-wrap gap-2">
            <Link
              href="/gestion/comptabilite/journal"
              className="rounded-full bg-ol-ember-ink px-5 py-2.5 text-sm font-bold text-ol-white hover:opacity-90"
            >
              Journal ({pendingCount} en attente)
            </Link>
            <Link
              href="/gestion/comptabilite/comptes"
              className="rounded-full border border-ol-line-strong px-5 py-2.5 text-sm font-bold text-ol-charcoal hover:border-ol-ember-ink"
            >
              Comptes
            </Link>
            <Link
              href="/gestion/comptabilite/categories"
              className="rounded-full border border-ol-line-strong px-5 py-2.5 text-sm font-bold text-ol-charcoal hover:border-ol-ember-ink"
            >
              Catégories
            </Link>
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-ol-line bg-ol-white p-5">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-ol-muted">Recettes</p>
          <p className="mt-1 text-2xl font-black text-ol-charcoal">{formatEur(totalIncome)}</p>
        </div>
        <div className="rounded-xl border border-ol-line bg-ol-white p-5">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-ol-muted">Dépenses</p>
          <p className="mt-1 text-2xl font-black text-ol-charcoal">{formatEur(totalExpense)}</p>
        </div>
        <div className="rounded-xl border border-ol-line bg-ol-white p-5">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-ol-muted">Solde</p>
          <p className="mt-1 text-2xl font-black text-ol-charcoal">{formatEur(totalIncome - totalExpense)}</p>
        </div>
      </div>

      <section className="overflow-x-auto rounded-xl border border-ol-line bg-ol-white">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr className="border-b border-ol-line text-xs font-bold uppercase tracking-[0.1em] text-ol-muted">
              <th className="px-5 py-3">Projet</th>
              <th className="px-5 py-3 text-right">Recettes</th>
              <th className="px-5 py-3 text-right">Dépenses</th>
              <th className="px-5 py-3 text-right">Solde</th>
            </tr>
          </thead>
          <tbody>
            {balanceSheet.map((row) => (
              <tr key={row.projectId ?? 'general'} className="border-b border-ol-line last:border-0">
                <td className="px-5 py-3 font-bold text-ol-charcoal">{row.projectName}</td>
                <td className="px-5 py-3 text-right text-ol-ink">{formatEur(row.incomeEur)}</td>
                <td className="px-5 py-3 text-right text-ol-ink">{formatEur(row.expenseEur)}</td>
                <td className="px-5 py-3 text-right font-bold text-ol-charcoal">{formatEur(row.balanceEur)}</td>
              </tr>
            ))}
            {balanceSheet.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-ol-muted">
                  Aucune écriture validée pour l&apos;instant.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {showSetup && (
        <section>
          <h2 className="text-lg font-black text-ol-charcoal">Comptes de trésorerie</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {accountsWithBalance.map((account) => (
              <div key={account.id} className="rounded-xl border border-ol-line bg-ol-white p-5">
                <p className="text-sm font-bold text-ol-charcoal">{account.name}</p>
                <p className="mt-1 text-xl font-black text-ol-charcoal">
                  {(CURRENCY_FORMAT[account.currency] ?? CURRENCY_FORMAT.EUR).format(account.balance)}
                  {account.currency === 'CDF' ? ' FC' : ''}
                </p>
              </div>
            ))}
            {accountsWithBalance.length === 0 && (
              <p className="text-sm text-ol-muted">Aucun compte de trésorerie enregistré pour l&apos;instant.</p>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
