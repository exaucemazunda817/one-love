'use client';

import { useId, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ENGAGEMENT_LABELS } from '@/lib/team';

interface Contract {
  id: string;
  reference: string | null;
  startsOn: string;
  endsOn: string | null;
  status: string;
  grossAmount: string;
  grossCurrency: string;
  periodicity: string;
}

interface PayrollEntry {
  id: string;
  periodYear: number;
  periodMonth: number;
  amount: string;
  currency: string;
  amountEur: string;
  status: string;
  projectName: string | null;
}

interface Member {
  id: string;
  firstName: string;
  lastName: string;
  engagement: string;
  jobTitle: string | null;
  email: string | null;
  phone: string | null;
  city: string | null;
  startedOn: string | null;
  endedOn: string | null;
  isActive: boolean;
  contracts: Contract[];
  payrollEntries: PayrollEntry[];
}

const PERIODICITY_LABELS: Record<string, string> = {
  MONTHLY: 'Mensuel',
  WEEKLY: 'Hebdomadaire',
  DAILY: 'Journalier',
  ONE_OFF: 'Ponctuel'
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

export function MemberDetailManager({
  member,
  projects,
  canManage
}: {
  member: Member;
  projects: { id: string; name: string }[];
  canManage: boolean;
}) {
  const id = useId();
  const router = useRouter();
  const [contracts, setContracts] = useState(member.contracts);
  const [payrollEntries, setPayrollEntries] = useState(member.payrollEntries);
  const [isActive, setIsActive] = useState(member.isActive);
  const [showContractForm, setShowContractForm] = useState(false);
  const [showPayrollForm, setShowPayrollForm] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [payrollError, setPayrollError] = useState<string | null>(null);
  const [actionPendingId, setActionPendingId] = useState<string | null>(null);

  async function toggleActive() {
    setPending(true);
    setError(null);
    try {
      const response = await fetch(`/api/gestion/equipe/${member.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(data.error || 'Une erreur est survenue.');
        return;
      }
      setIsActive((v) => !v);
      router.refresh();
    } catch {
      setError('Une erreur est survenue. Merci de réessayer.');
    } finally {
      setPending(false);
    }
  }

  async function handleContractSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);

    const formEl = event.currentTarget;
    const formData = new FormData(formEl);
    const payload = {
      reference: String(formData.get('reference') || ''),
      startsOn: String(formData.get('startsOn') || ''),
      endsOn: String(formData.get('endsOn') || ''),
      grossAmount: String(formData.get('grossAmount') || ''),
      grossCurrency: String(formData.get('grossCurrency') || 'CDF'),
      periodicity: String(formData.get('periodicity') || 'MONTHLY')
    };

    try {
      const response = await fetch(`/api/gestion/equipe/${member.id}/contrats`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(data.error || 'Une erreur est survenue.');
        return;
      }
      formEl.reset();
      setShowContractForm(false);
      router.refresh();
      setContracts((prev) => [
        {
          id: data.id,
          reference: payload.reference || null,
          startsOn: new Date(payload.startsOn).toISOString(),
          endsOn: payload.endsOn ? new Date(payload.endsOn).toISOString() : null,
          status: 'ACTIVE',
          grossAmount: payload.grossAmount,
          grossCurrency: payload.grossCurrency,
          periodicity: payload.periodicity
        },
        ...prev
      ]);
    } catch {
      setError('Une erreur est survenue. Merci de réessayer.');
    } finally {
      setPending(false);
    }
  }

  async function handlePayrollSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setPayrollError(null);

    const formEl = event.currentTarget;
    const formData = new FormData(formEl);
    const period = String(formData.get('period') || '');
    const [yearStr, monthStr] = period.split('-');
    const payload = {
      periodYear: Number(yearStr),
      periodMonth: Number(monthStr),
      amount: String(formData.get('amount') || ''),
      currency: String(formData.get('currency') || 'CDF'),
      fxRate: String(formData.get('fxRate') || ''),
      projectId: String(formData.get('projectId') || '')
    };

    try {
      const response = await fetch(`/api/gestion/equipe/${member.id}/paie`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setPayrollError(data.error || 'Une erreur est survenue.');
        return;
      }
      formEl.reset();
      setShowPayrollForm(false);
      router.refresh();
      const project = projects.find((p) => p.id === payload.projectId);
      setPayrollEntries((prev) => [
        {
          id: data.id,
          periodYear: payload.periodYear,
          periodMonth: payload.periodMonth,
          amount: payload.amount,
          currency: payload.currency,
          amountEur: payload.amount,
          status: 'DRAFT',
          projectName: project?.name ?? null
        },
        ...prev
      ]);
    } catch {
      setPayrollError('Une erreur est survenue. Merci de réessayer.');
    } finally {
      setPending(false);
    }
  }

  async function runPayrollAction(entryId: string, action: 'approuver' | 'payer') {
    setActionPendingId(entryId);
    setPayrollError(null);
    try {
      const response = await fetch(`/api/gestion/paie/${entryId}/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setPayrollError(data.error || 'Une erreur est survenue.');
        return;
      }
      setPayrollEntries((prev) =>
        prev.map((p) => (p.id === entryId ? { ...p, status: action === 'approuver' ? 'APPROVED' : 'PAID' } : p))
      );
      router.refresh();
    } catch {
      setPayrollError('Une erreur est survenue. Merci de réessayer.');
    } finally {
      setActionPendingId(null);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-ol-charcoal">
            {member.firstName} {member.lastName}
          </h1>
          <p className="mt-1 text-sm text-ol-muted">
            {ENGAGEMENT_LABELS[member.engagement] ?? member.engagement}
            {member.jobTitle ? ` — ${member.jobTitle}` : ''}
          </p>
          <p className="mt-1 text-sm text-ol-muted">
            {member.email ?? '—'} · {member.phone ?? '—'} · {member.city ?? '—'}
          </p>
        </div>
        {canManage && (
          <button
            type="button"
            onClick={toggleActive}
            disabled={pending}
            className="rounded-full border border-ol-line-strong px-5 py-2.5 text-sm font-bold text-ol-charcoal transition-opacity hover:opacity-80 disabled:opacity-60"
          >
            {isActive ? 'Marquer comme parti(e)' : 'Marquer comme actif(ve)'}
          </button>
        )}
      </div>
      {error && (
        <p role="alert" className="text-sm font-bold text-ol-ember-ink">
          {error}
        </p>
      )}

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-ol-charcoal">Contrats</h2>
          {canManage && (
            <button
              type="button"
              onClick={() => setShowContractForm((v) => !v)}
              className="rounded-full bg-ol-ember-ink px-5 py-2.5 text-sm font-bold text-ol-white transition-opacity hover:opacity-90"
            >
              {showContractForm ? 'Annuler' : 'Nouveau contrat'}
            </button>
          )}
        </div>

        {showContractForm && (
          <form
            onSubmit={handleContractSubmit}
            className="grid gap-4 rounded-xl border border-ol-line bg-ol-white p-6 sm:grid-cols-2"
            noValidate
          >
            <div>
              <label htmlFor={`${id}-reference`} className="mb-1.5 block text-sm font-bold text-ol-charcoal">
                Référence <span className="font-normal text-ol-muted">(facultatif)</span>
              </label>
              <input
                id={`${id}-reference`}
                name="reference"
                maxLength={80}
                className="w-full rounded-lg border border-ol-line-strong bg-ol-white px-4 py-2.5 text-[0.95rem] focus:border-ol-ember focus:outline-none focus:ring-2 focus:ring-ol-ember/30"
              />
            </div>
            <div>
              <label htmlFor={`${id}-periodicity`} className="mb-1.5 block text-sm font-bold text-ol-charcoal">
                Périodicité
              </label>
              <select
                id={`${id}-periodicity`}
                name="periodicity"
                defaultValue="MONTHLY"
                className="w-full rounded-lg border border-ol-line-strong bg-ol-white px-4 py-2.5 text-[0.95rem] focus:border-ol-ember focus:outline-none focus:ring-2 focus:ring-ol-ember/30"
              >
                {Object.entries(PERIODICITY_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor={`${id}-startsOn`} className="mb-1.5 block text-sm font-bold text-ol-charcoal">
                Début
              </label>
              <input
                id={`${id}-startsOn`}
                name="startsOn"
                type="date"
                required
                className="w-full rounded-lg border border-ol-line-strong bg-ol-white px-4 py-2.5 text-[0.95rem] focus:border-ol-ember focus:outline-none focus:ring-2 focus:ring-ol-ember/30"
              />
            </div>
            <div>
              <label htmlFor={`${id}-endsOn`} className="mb-1.5 block text-sm font-bold text-ol-charcoal">
                Fin <span className="font-normal text-ol-muted">(si à durée déterminée)</span>
              </label>
              <input
                id={`${id}-endsOn`}
                name="endsOn"
                type="date"
                className="w-full rounded-lg border border-ol-line-strong bg-ol-white px-4 py-2.5 text-[0.95rem] focus:border-ol-ember focus:outline-none focus:ring-2 focus:ring-ol-ember/30"
              />
            </div>
            <div>
              <label htmlFor={`${id}-grossAmount`} className="mb-1.5 block text-sm font-bold text-ol-charcoal">
                Salaire brut de référence
              </label>
              <input
                id={`${id}-grossAmount`}
                name="grossAmount"
                required
                inputMode="decimal"
                placeholder="Ex. : 450000"
                className="w-full rounded-lg border border-ol-line-strong bg-ol-white px-4 py-2.5 text-[0.95rem] focus:border-ol-ember focus:outline-none focus:ring-2 focus:ring-ol-ember/30"
              />
            </div>
            <div>
              <label htmlFor={`${id}-grossCurrency`} className="mb-1.5 block text-sm font-bold text-ol-charcoal">
                Devise
              </label>
              <select
                id={`${id}-grossCurrency`}
                name="grossCurrency"
                defaultValue="CDF"
                className="w-full rounded-lg border border-ol-line-strong bg-ol-white px-4 py-2.5 text-[0.95rem] focus:border-ol-ember focus:outline-none focus:ring-2 focus:ring-ol-ember/30"
              >
                <option value="CDF">CDF</option>
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
              </select>
            </div>
            {error && (
              <p role="alert" className="sm:col-span-2 text-sm font-bold text-ol-ember-ink">
                {error}
              </p>
            )}
            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={pending}
                className="rounded-full bg-ol-ember-ink px-6 py-3 text-sm font-bold text-ol-white transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {pending ? 'Enregistrement…' : 'Enregistrer le contrat'}
              </button>
            </div>
          </form>
        )}

        <div className="overflow-x-auto rounded-xl border border-ol-line bg-ol-white">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b border-ol-line text-xs font-bold uppercase tracking-[0.1em] text-ol-muted">
                <th className="px-4 py-3">Référence</th>
                <th className="px-4 py-3">Début</th>
                <th className="px-4 py-3">Salaire brut</th>
                <th className="px-4 py-3">Périodicité</th>
                <th className="px-4 py-3">Statut</th>
              </tr>
            </thead>
            <tbody>
              {contracts.map((c) => (
                <tr key={c.id} className="border-b border-ol-line last:border-0">
                  <td className="px-4 py-3 text-ol-ink">{c.reference ?? '—'}</td>
                  <td className="px-4 py-3 text-ol-muted">
                    {new Date(c.startsOn).toLocaleDateString('fr-FR', { timeZone: 'UTC' })}
                  </td>
                  <td className="px-4 py-3 font-bold text-ol-charcoal">{formatMoney(c.grossAmount, c.grossCurrency)}</td>
                  <td className="px-4 py-3 text-ol-ink">{PERIODICITY_LABELS[c.periodicity] ?? c.periodicity}</td>
                  <td className="px-4 py-3 text-ol-ink">{c.status}</td>
                </tr>
              ))}
              {contracts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-ol-muted">
                    Aucun contrat enregistré.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-ol-charcoal">Versements de paie</h2>
          {canManage && (
            <button
              type="button"
              onClick={() => setShowPayrollForm((v) => !v)}
              className="rounded-full bg-ol-ember-ink px-5 py-2.5 text-sm font-bold text-ol-white transition-opacity hover:opacity-90"
            >
              {showPayrollForm ? 'Annuler' : 'Nouveau versement'}
            </button>
          )}
        </div>

        {showPayrollForm && (
          <form
            onSubmit={handlePayrollSubmit}
            className="grid gap-4 rounded-xl border border-ol-line bg-ol-white p-6 sm:grid-cols-2"
            noValidate
          >
            <div>
              <label htmlFor={`${id}-period`} className="mb-1.5 block text-sm font-bold text-ol-charcoal">
                Période
              </label>
              <input
                id={`${id}-period`}
                name="period"
                type="month"
                required
                className="w-full rounded-lg border border-ol-line-strong bg-ol-white px-4 py-2.5 text-[0.95rem] focus:border-ol-ember focus:outline-none focus:ring-2 focus:ring-ol-ember/30"
              />
            </div>
            <div>
              <label htmlFor={`${id}-projectId`} className="mb-1.5 block text-sm font-bold text-ol-charcoal">
                Projet <span className="font-normal text-ol-muted">(si financé par un bailleur)</span>
              </label>
              <select
                id={`${id}-projectId`}
                name="projectId"
                defaultValue=""
                className="w-full rounded-lg border border-ol-line-strong bg-ol-white px-4 py-2.5 text-[0.95rem] focus:border-ol-ember focus:outline-none focus:ring-2 focus:ring-ol-ember/30"
              >
                <option value="">Fonds général</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor={`${id}-amount`} className="mb-1.5 block text-sm font-bold text-ol-charcoal">
                Montant versé
              </label>
              <input
                id={`${id}-amount`}
                name="amount"
                required
                inputMode="decimal"
                placeholder="Ex. : 450000"
                className="w-full rounded-lg border border-ol-line-strong bg-ol-white px-4 py-2.5 text-[0.95rem] focus:border-ol-ember focus:outline-none focus:ring-2 focus:ring-ol-ember/30"
              />
            </div>
            <div>
              <label htmlFor={`${id}-currency`} className="mb-1.5 block text-sm font-bold text-ol-charcoal">
                Devise
              </label>
              <select
                id={`${id}-currency`}
                name="currency"
                defaultValue="CDF"
                className="w-full rounded-lg border border-ol-line-strong bg-ol-white px-4 py-2.5 text-[0.95rem] focus:border-ol-ember focus:outline-none focus:ring-2 focus:ring-ol-ember/30"
              >
                <option value="CDF">CDF</option>
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
              </select>
            </div>
            <div>
              <label htmlFor={`${id}-fxRate`} className="mb-1.5 block text-sm font-bold text-ol-charcoal">
                Taux (1 € = … dans cette devise) <span className="font-normal text-ol-muted">(sauf en EUR)</span>
              </label>
              <input
                id={`${id}-fxRate`}
                name="fxRate"
                inputMode="decimal"
                placeholder="Ex. : 2900"
                className="w-full rounded-lg border border-ol-line-strong bg-ol-white px-4 py-2.5 text-[0.95rem] focus:border-ol-ember focus:outline-none focus:ring-2 focus:ring-ol-ember/30"
              />
            </div>
            {payrollError && (
              <p role="alert" className="sm:col-span-2 text-sm font-bold text-ol-ember-ink">
                {payrollError}
              </p>
            )}
            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={pending}
                className="rounded-full bg-ol-ember-ink px-6 py-3 text-sm font-bold text-ol-white transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {pending ? 'Enregistrement…' : 'Enregistrer le versement'}
              </button>
            </div>
          </form>
        )}

        {payrollError && !showPayrollForm && (
          <p role="alert" className="text-sm font-bold text-ol-ember-ink">
            {payrollError}
          </p>
        )}

        <div className="overflow-x-auto rounded-xl border border-ol-line bg-ol-white">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-ol-line text-xs font-bold uppercase tracking-[0.1em] text-ol-muted">
                <th className="px-4 py-3">Période</th>
                <th className="px-4 py-3">Projet</th>
                <th className="px-4 py-3">Montant</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {payrollEntries.map((p) => (
                <tr key={p.id} className="border-b border-ol-line last:border-0">
                  <td className="px-4 py-3 text-ol-ink">
                    {MONTH_LABELS[p.periodMonth - 1] ?? p.periodMonth} {p.periodYear}
                  </td>
                  <td className="px-4 py-3 text-ol-ink">{p.projectName ?? 'Fonds général'}</td>
                  <td className="px-4 py-3 font-bold text-ol-charcoal">{formatMoney(p.amount, p.currency)}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${PAYROLL_STATUS_STYLES[p.status]}`}>
                      {PAYROLL_STATUS_LABELS[p.status] ?? p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {canManage && p.status === 'DRAFT' && (
                      <button
                        type="button"
                        disabled={actionPendingId === p.id}
                        onClick={() => runPayrollAction(p.id, 'approuver')}
                        className="text-sm font-bold text-ol-ember-ink hover:underline disabled:opacity-60"
                      >
                        Approuver
                      </button>
                    )}
                    {canManage && p.status === 'APPROVED' && (
                      <button
                        type="button"
                        disabled={actionPendingId === p.id}
                        onClick={() => runPayrollAction(p.id, 'payer')}
                        className="text-sm font-bold text-ol-ember-ink hover:underline disabled:opacity-60"
                      >
                        Marquer payé
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {payrollEntries.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-ol-muted">
                    Aucun versement enregistré.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
