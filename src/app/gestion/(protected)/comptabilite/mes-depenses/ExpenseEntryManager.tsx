'use client';

import { useId, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Paperclip } from 'lucide-react';

type Status = 'DRAFT' | 'VALIDATED' | 'LOCKED' | 'CANCELLED';

interface EntryRow {
  id: string;
  status: Status;
  occurredOn: string;
  label: string;
  amount: string;
  currency: 'EUR' | 'CDF' | 'USD';
  projectName: string | null;
  categoryName: string | null;
  documentCount: number;
}

const STATUS_LABELS: Record<Status, string> = {
  DRAFT: 'En attente de validation',
  VALIDATED: 'Validée',
  LOCKED: 'Verrouillée',
  CANCELLED: 'Annulée'
};
const STATUS_STYLES: Record<Status, string> = {
  DRAFT: 'bg-ol-sand text-ol-ember-ink',
  VALIDATED: 'bg-ol-charcoal/10 text-ol-charcoal',
  LOCKED: 'bg-ol-night text-ol-cream',
  CANCELLED: 'bg-ol-line text-ol-muted line-through'
};

export function ExpenseEntryManager({
  initialEntries,
  categories,
  projects
}: {
  initialEntries: EntryRow[];
  categories: { id: string; label: string }[];
  projects: { id: string; name: string }[];
}) {
  const id = useId();
  const router = useRouter();
  const [entries, setEntries] = useState(initialEntries);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);

    const formEl = event.currentTarget;
    const formData = new FormData(formEl);
    const currency = String(formData.get('currency') || 'CDF');
    const payload = {
      kind: 'EXPENSE',
      occurredOn: String(formData.get('occurredOn') || ''),
      label: String(formData.get('label') || ''),
      amount: String(formData.get('amount') || '').replace(',', '.'),
      currency,
      fxRate: String(formData.get('fxRate') || '').replace(',', '.'),
      categoryId: String(formData.get('categoryId') || ''),
      projectId: String(formData.get('projectId') || '')
    };

    try {
      const response = await fetch('/api/gestion/comptabilite/ecritures', {
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
      router.refresh();
      setEntries((prev) => [
        {
          id: data.id,
          status: 'DRAFT',
          occurredOn: new Date(payload.occurredOn).toISOString(),
          label: payload.label,
          amount: payload.amount,
          currency: currency as EntryRow['currency'],
          projectName: projects.find((p) => p.id === payload.projectId)?.name ?? null,
          categoryName: categories.find((c) => c.id === payload.categoryId)?.label ?? null,
          documentCount: 0
        },
        ...prev
      ]);
    } catch {
      setError('Une erreur est survenue. Merci de réessayer.');
    } finally {
      setPending(false);
    }
  }

  async function handleCancel(entryId: string) {
    setBusyId(entryId);
    try {
      const response = await fetch(`/api/gestion/comptabilite/ecritures/${entryId}/annuler`, {
        method: 'POST'
      });
      const data = await response.json().catch(() => ({}));
      if (response.ok) {
        setEntries((prev) => prev.map((e) => (e.id === entryId ? { ...e, status: data.status } : e)));
      }
    } finally {
      setBusyId(null);
    }
  }

  async function uploadDocument(entryId: string, file: File) {
    setBusyId(entryId);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await fetch(`/api/gestion/comptabilite/ecritures/${entryId}/documents`, {
        method: 'POST',
        body: formData
      });
      if (response.ok) {
        setEntries((prev) =>
          prev.map((e) => (e.id === entryId ? { ...e, documentCount: e.documentCount + 1 } : e))
        );
      }
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-8">
      <section className="rounded-xl border border-ol-line bg-ol-white p-6">
        <h2 className="text-lg font-black text-ol-charcoal">Nouvelle dépense</h2>
        <form onSubmit={handleSubmit} className="mt-4 grid gap-4 sm:grid-cols-2" noValidate>
          <div>
            <label htmlFor={`${id}-date`} className="mb-1.5 block text-sm font-bold text-ol-charcoal">
              Date
            </label>
            <input
              id={`${id}-date`}
              name="occurredOn"
              type="date"
              required
              defaultValue={new Date().toISOString().slice(0, 10)}
              className="w-full rounded-lg border border-ol-line-strong bg-ol-white px-4 py-2.5 text-[0.95rem] focus:border-ol-ember focus:outline-none focus:ring-2 focus:ring-ol-ember/30"
            />
          </div>
          <div>
            <label htmlFor={`${id}-label`} className="mb-1.5 block text-sm font-bold text-ol-charcoal">
              Objet de la dépense
            </label>
            <input
              id={`${id}-label`}
              name="label"
              required
              maxLength={200}
              placeholder="Ex. : Achat de cahiers, transport…"
              className="w-full rounded-lg border border-ol-line-strong bg-ol-white px-4 py-2.5 text-[0.95rem] focus:border-ol-ember focus:outline-none focus:ring-2 focus:ring-ol-ember/30"
            />
          </div>
          <div>
            <label htmlFor={`${id}-amount`} className="mb-1.5 block text-sm font-bold text-ol-charcoal">
              Montant
            </label>
            <input
              id={`${id}-amount`}
              name="amount"
              required
              inputMode="decimal"
              placeholder="0"
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
              <option value="CDF">CDF (francs congolais)</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${id}-fxrate`} className="mb-1.5 block text-sm font-bold text-ol-charcoal">
              Taux (unités pour 1 €) <span className="font-normal text-ol-muted">— laisser vide si EUR</span>
            </label>
            <input
              id={`${id}-fxrate`}
              name="fxRate"
              inputMode="decimal"
              placeholder="Ex. : 2900"
              className="w-full rounded-lg border border-ol-line-strong bg-ol-white px-4 py-2.5 text-[0.95rem] focus:border-ol-ember focus:outline-none focus:ring-2 focus:ring-ol-ember/30"
            />
          </div>
          <div>
            <label htmlFor={`${id}-project`} className="mb-1.5 block text-sm font-bold text-ol-charcoal">
              Projet <span className="font-normal text-ol-muted">(facultatif)</span>
            </label>
            <select
              id={`${id}-project`}
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
          <div className="sm:col-span-2">
            <label htmlFor={`${id}-category`} className="mb-1.5 block text-sm font-bold text-ol-charcoal">
              Catégorie <span className="font-normal text-ol-muted">(facultatif)</span>
            </label>
            <select
              id={`${id}-category`}
              name="categoryId"
              defaultValue=""
              className="w-full max-w-sm rounded-lg border border-ol-line-strong bg-ol-white px-4 py-2.5 text-[0.95rem] focus:border-ol-ember focus:outline-none focus:ring-2 focus:ring-ol-ember/30"
            >
              <option value="">Aucune</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
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
              {pending ? 'Enregistrement…' : 'Enregistrer la dépense'}
            </button>
          </div>
        </form>
      </section>

      <section className="overflow-x-auto rounded-xl border border-ol-line bg-ol-white">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-ol-line text-xs font-bold uppercase tracking-[0.1em] text-ol-muted">
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Objet</th>
              <th className="px-4 py-3 text-right">Montant</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id} className="border-b border-ol-line last:border-0">
                <td className="whitespace-nowrap px-4 py-3 text-ol-muted">
                  {new Date(entry.occurredOn).toLocaleDateString('fr-FR', { timeZone: 'UTC' })}
                </td>
                <td className="px-4 py-3">
                  <div className="font-bold text-ol-charcoal">{entry.label}</div>
                  <div className="text-xs text-ol-muted">
                    {entry.projectName ?? 'Fonds général'}
                    {entry.categoryName ? ` · ${entry.categoryName}` : ''}
                  </div>
                </td>
                <td className="px-4 py-3 text-right font-bold text-ol-charcoal">
                  {Number(entry.amount).toLocaleString('fr-FR')} {entry.currency}
                </td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${STATUS_STYLES[entry.status]}`}>
                    {STATUS_LABELS[entry.status]}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    {entry.status !== 'LOCKED' && entry.status !== 'CANCELLED' && (
                      <label className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-ol-line-strong px-3 py-1.5 text-xs font-bold text-ol-charcoal hover:border-ol-ember-ink">
                        <Paperclip size={13} aria-hidden />
                        {entry.documentCount}
                        <input
                          type="file"
                          accept="application/pdf,image/jpeg,image/png,image/webp"
                          className="hidden"
                          disabled={busyId === entry.id}
                          onChange={(event) => {
                            const file = event.target.files?.[0];
                            if (file) uploadDocument(entry.id, file);
                            event.target.value = '';
                          }}
                        />
                      </label>
                    )}
                    {entry.status === 'DRAFT' && (
                      <button
                        type="button"
                        disabled={busyId === entry.id}
                        onClick={() => handleCancel(entry.id)}
                        className="rounded-full border border-ol-line-strong px-3 py-1.5 text-xs font-bold text-ol-ember-ink hover:border-ol-ember disabled:opacity-60"
                      >
                        Annuler
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {entries.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-ol-muted">
                  Aucune dépense enregistrée.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
