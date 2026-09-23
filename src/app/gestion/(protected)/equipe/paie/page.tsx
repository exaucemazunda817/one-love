import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentGestionUser } from '@/lib/auth';
import { canViewPayrollLedger } from '@/lib/team';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Registre de paie — Gestion',
  robots: { index: false, follow: false }
};

const PAYROLL_STATUS_LABELS: Record<string, string> = { DRAFT: 'Brouillon', APPROVED: 'Approuvé', PAID: 'Payé' };
const PAYROLL_STATUS_STYLES: Record<string, string> = {
  DRAFT: 'bg-ol-sand text-ol-ember-ink',
  APPROVED: 'bg-ol-charcoal/10 text-ol-charcoal',
  PAID: 'bg-ol-night text-ol-cream'
};
const MONTH_LABELS = [
  'Janvier',
  'Février',
  'Mars',
  'Avril',
  'Mai',
  'Juin',
  'Juillet',
  'Août',
  'Septembre',
  'Octobre',
  'Novembre',
  'Décembre'
];

function formatMoney(amount: string, currency: string): string {
  const num = Number(amount);
  return `${num.toLocaleString('fr-FR', { maximumFractionDigits: 2 })} ${currency}`;
}

// Registre transversal — seule vue de ce module ouverte à COMPTABLE, pour son
// rapprochement (les montants uniquement, jamais l'annuaire ni les
// contrats). Purement en lecture ici : approuver et payer un versement se
// fait depuis la fiche de la personne, réservé à RH (voir team.ts).
export default async function PaieLedgerPage() {
  const user = await getCurrentGestionUser();
  if (!user) redirect('/gestion/connexion');
  if (!canViewPayrollLedger(user.role)) redirect('/gestion');

  const entries = await prisma.payrollEntry.findMany({
    orderBy: [{ periodYear: 'desc' }, { periodMonth: 'desc' }, { createdAt: 'desc' }],
    take: 300,
    include: {
      teamMember: { select: { id: true, firstName: true, lastName: true } },
      project: { select: { name: true } },
      transaction: { select: { status: true } }
    }
  });

  const totalEur = entries.reduce((sum, e) => sum + Number(e.amountEur), 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-ol-charcoal">Registre de paie</h1>
        <p className="mt-1 text-sm text-ol-muted">
          {entries.length} versement{entries.length > 1 ? 's' : ''} — {totalEur.toLocaleString('fr-FR', { maximumFractionDigits: 2 })} € au total.
        </p>
      </div>

      <section className="overflow-x-auto rounded-xl border border-ol-line bg-ol-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-ol-line text-xs font-bold uppercase tracking-[0.1em] text-ol-muted">
              <th className="px-4 py-3">Personne</th>
              <th className="px-4 py-3">Période</th>
              <th className="px-4 py-3">Projet</th>
              <th className="px-4 py-3">Montant</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3">Écriture</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id} className="border-b border-ol-line last:border-0">
                <td className="px-4 py-3 font-bold text-ol-charcoal">
                  {user.role === 'RH' || user.role === 'DIRECTION' ? (
                    <Link href={`/gestion/equipe/${entry.teamMember.id}`} className="hover:underline">
                      {entry.teamMember.firstName} {entry.teamMember.lastName}
                    </Link>
                  ) : (
                    `${entry.teamMember.firstName} ${entry.teamMember.lastName}`
                  )}
                </td>
                <td className="px-4 py-3 text-ol-ink">
                  {MONTH_LABELS[entry.periodMonth - 1] ?? entry.periodMonth} {entry.periodYear}
                </td>
                <td className="px-4 py-3 text-ol-ink">{entry.project?.name ?? 'Fonds général'}</td>
                <td className="px-4 py-3 font-bold text-ol-charcoal">{formatMoney(entry.amount.toString(), entry.currency)}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${PAYROLL_STATUS_STYLES[entry.status]}`}>
                    {PAYROLL_STATUS_LABELS[entry.status] ?? entry.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-ol-muted">{entry.transaction ? entry.transaction.status : '—'}</td>
              </tr>
            ))}
            {entries.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-ol-muted">
                  Aucun versement enregistré.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
