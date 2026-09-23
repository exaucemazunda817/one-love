'use client';

import { useId, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Paperclip } from 'lucide-react';

type Kind = 'INCOME' | 'EXPENSE' | 'TRANSFER';
type Status = 'DRAFT' | 'VALIDATED' | 'LOCKED' | 'CANCELLED';

interface EntryRow {
  id: string;
  kind: Kind;
  status: Status;
  occurredOn: string;
  label: string;
  amount: string;
  currency: 'EUR' | 'CDF' | 'USD';
  fxRate: string;
  amountEur: string;
  projectName: string | null;
  categoryName: string | null;
  accountName: string | null;
  createdByName: string | null;
  validatedByName: string | null;
  createdById: string | null;
  documentCount: number;
}

interface Option {
  id: string;
  name?: string;
  label?: string;
  currency?: string;
  kind?: string;
}

const STATUS_LABELS: Record<Status, string> = {
  DRAFT: 'Brouillon',
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
const KIND_LABELS: Record<Kind, string> = { INCOME: 'Recette', EXPENSE: 'Dépense', TRANSFER: 'Transfert' };

function formatMoney(amount: string, currency: string): string {
  const num = Number(amount);
  return `${num.toLocaleString('fr-FR', { maximumFractionDigits: 2 })} ${currency}`;
}

export function JournalManager({
  initialEntries,
  accounts,
  categories,
  projects,
  currentUserId,
  currentUserRole,
  canCreate
}: {
  initialEntries: EntryRow[];
  accounts: Option[];
  categories: Option[];
  projects: Option[];
  currentUserId: string;
  currentUserRole: string;
  canCreate: boolean;
}) {
  const router = useRouter();
  const id = useId();
  const [entries, setEntries] = useState(initialEntries);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterKind, setFilterKind] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      entries.filter(
        (e) => (!filterStatus || e.status === filterStatus) && (!filterKind || e.kind === filterKind)
      ),
    [entries, filterStatus, filterKind]
  );

  async function runAction(entryId: string, action: 'valider' | 'verrouiller' | 'annuler') {
    setBusyId(entryId);
    setActionError(null);
    try {
      const response = await fetch(`/api/gestion/comptabilite/ecritures/${entryId}/${action}`, {
        method: 'POST'
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setActionError(data.error || 'Action refusée.');
        return;
      }
      setEntries((prev) => prev.map((e) => (e.id === entryId ? { ...e, status: data.status } : e)));
    } catch {
      setActionError('Une erreur est survenue.');
    } finally {
      setBusyId(null);
    }
  }

  async function uploadDocument(entryId: string, file: File) {
    setBusyId(entryId);
    setActionError(null);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await fetch(`/api/gestion/comptabilite/ecritures/${entryId}/documents`, {
        method: 'POST',
        body: formData
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setActionError(data.error || "Envoi du justificatif échoué.");
        return;
      }
      setEntries((prev) =>
        prev.map((e) => (e.id === entryId ? { ...e, documentCount: e.documentCount + 1 } : e))
      );
    } catch {
      setActionError('Une erreur est survenue.');
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-8">
      {canCreate && (
        <CreateEntryForm
          accounts={accounts}
          categories={categories}
          projects={projects}
          onCreated={(entry) => setEntries((prev) => [entry, ...prev])}
        />
      )}

      <div className="flex flex-wrap gap-3">
        <select
          value={filterKind}
          onChange={(e) => setFilterKind(e.target.value)}
          aria-label="Filtrer par type"
          className="rounded-lg border border-ol-line-strong bg-ol-white px-3 py-2 text-sm"
        >
          <option value="">Tous types</option>
          <option value="INCOME">Recettes</option>
          <option value="EXPENSE">Dépenses</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          aria-label="Filtrer par statut"
          className="rounded-lg border border-ol-line-strong bg-ol-white px-3 py-2 text-sm"
        >
          <option value="">Tous statuts</option>
          <option value="DRAFT">Brouillon</option>
          <option value="VALIDATED">Validée</option>
          <option value="LOCKED">Verrouillée</option>
          <option value="CANCELLED">Annulée</option>
        </select>
      </div>

      {actionError && (
        <p role="alert" className="text-sm font-bold text-ol-ember-ink">
          {actionError}
        </p>
      )}

      <div className="overflow-x-auto rounded-xl border border-ol-line bg-ol-white">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead>
            <tr className="border-b border-ol-line text-xs font-bold uppercase tracking-[0.1em] text-ol-muted">
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Libellé</th>
              <th className="px-4 py-3">Projet</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3 text-right">Montant</th>
              <th className="px-4 py-3 text-right">Contre-valeur €</th>
              <th className="px-4 py-3">Saisie / validée par</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((entry) => {
              const canValidate =
                entry.status === 'DRAFT' &&
                (currentUserRole === 'COMPTABLE' || currentUserRole === 'DIRECTION') &&
                entry.createdById !== currentUserId;
              const canLock = entry.status === 'VALIDATED' && currentUserRole === 'COMPTABLE';
              const canCancel =
                entry.status === 'DRAFT' &&
                (currentUserRole === 'COMPTABLE' || entry.createdById === currentUserId);
              const canAttach = entry.status !== 'LOCKED' && entry.status !== 'CANCELLED';

              return (
                <tr key={entry.id} className="border-b border-ol-line last:border-0 align-top">
                  <td className="whitespace-nowrap px-4 py-3 text-ol-muted">
                    {new Date(entry.occurredOn).toLocaleDateString('fr-FR', { timeZone: 'UTC' })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-bold text-ol-charcoal">{entry.label}</div>
                    <div className="text-xs text-ol-muted">
                      {KIND_LABELS[entry.kind]}
                      {entry.categoryName ? ` · ${entry.categoryName}` : ''}
                      {entry.accountName ? ` · ${entry.accountName}` : ''}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-ol-ink">{entry.projectName ?? 'Fonds général'}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${STATUS_STYLES[entry.status]}`}>
                      {STATUS_LABELS[entry.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-ol-charcoal">
                    {formatMoney(entry.amount, entry.currency)}
                  </td>
                  <td className="px-4 py-3 text-right text-ol-ink">
                    {formatMoney(entry.amountEur, 'EUR')}
                  </td>
                  <td className="px-4 py-3 text-xs text-ol-muted">
                    {entry.createdByName ?? '—'}
                    {entry.validatedByName ? <div>Validée par {entry.validatedByName}</div> : null}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center justify-end gap-2">
                      {canAttach && (
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
                      {canValidate && (
                        <button
                          type="button"
                          disabled={busyId === entry.id}
                          onClick={() => runAction(entry.id, 'valider')}
                          className="rounded-full border border-ol-line-strong px-3 py-1.5 text-xs font-bold text-ol-charcoal hover:border-ol-ember-ink disabled:opacity-60"
                        >
                          Valider
                        </button>
                      )}
                      {canLock && (
                        <button
                          type="button"
                          disabled={busyId === entry.id}
                          onClick={() => runAction(entry.id, 'verrouiller')}
                          className="rounded-full border border-ol-line-strong px-3 py-1.5 text-xs font-bold text-ol-charcoal hover:border-ol-ember-ink disabled:opacity-60"
                        >
                          Verrouiller
                        </button>
                      )}
                      {canCancel && (
                        <button
                          type="button"
                          disabled={busyId === entry.id}
                          onClick={() => runAction(entry.id, 'annuler')}
                          className="rounded-full border border-ol-line-strong px-3 py-1.5 text-xs font-bold text-ol-ember-ink hover:border-ol-ember disabled:opacity-60"
                        >
                          Annuler
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-ol-muted">
                  Aucune écriture.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CreateEntryForm({
  accounts,
  categories,
  projects,
  onCreated
}: {
  accounts: Option[];
  categories: Option[];
  projects: Option[];
  onCreated: (entry: EntryRow) => void;
}) {
  const id = useId();
  const router = useRouter();
  const [kind, setKind] = useState<'INCOME' | 'EXPENSE'>('EXPENSE');
  const [currency, setCurrency] = useState<'EUR' | 'CDF' | 'USD'>('EUR');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const relevantCategories = categories.filter((c) => c.kind === kind);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);

    const formEl = event.currentTarget;
    const formData = new FormData(formEl);
    const payload = {
      kind,
      occurredOn: String(formData.get('occurredOn') || ''),
      label: String(formData.get('label') || ''),
      description: String(formData.get('description') || ''),
      amount: String(formData.get('amount') || '').replace(',', '.'),
      currency,
      fxRate: String(formData.get('fxRate') || '').replace(',', '.'),
      accountId: String(formData.get('accountId') || ''),
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
      onCreated({
        id: data.id,
        kind,
        status: 'DRAFT',
        occurredOn: new Date(payload.occurredOn).toISOString(),
        label: payload.label,
        amount: payload.amount,
        currency,
        fxRate: currency === 'EUR' ? '1' : payload.fxRate,
        amountEur:
          currency === 'EUR'
            ? Number(payload.amount).toFixed(2)
            : (Number(payload.amount) / Number(payload.fxRate)).toFixed(2),
        projectName: projects.find((p) => p.id === payload.projectId)?.name ?? null,
        categoryName: categories.find((c) => c.id === payload.categoryId)?.label ?? null,
        accountName: accounts.find((a) => a.id === payload.accountId)?.name ?? null,
        createdByName: 'Vous',
        validatedByName: null,
        createdById: null,
        documentCount: 0
      });
    } catch {
      setError('Une erreur est survenue. Merci de réessayer.');
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="rounded-xl border border-ol-line bg-ol-white p-6">
      <h2 className="text-lg font-black text-ol-charcoal">Nouvelle écriture</h2>
      <div role="radiogroup" aria-label="Type" className="mt-4 inline-flex rounded-full border border-ol-line-strong p-1">
        {(['EXPENSE', 'INCOME'] as const).map((option) => (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={kind === option}
            onClick={() => setKind(option)}
            className={`rounded-full px-5 py-2 text-sm font-bold transition-colors ${
              kind === option ? 'bg-ol-ember-ink text-ol-white' : 'text-ol-charcoal hover:text-ol-ember-ink'
            }`}
          >
            {option === 'EXPENSE' ? 'Dépense' : 'Recette'}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" noValidate>
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
        <div className="sm:col-span-2">
          <label htmlFor={`${id}-label`} className="mb-1.5 block text-sm font-bold text-ol-charcoal">
            Libellé
          </label>
          <input
            id={`${id}-label`}
            name="label"
            required
            maxLength={200}
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
            placeholder="0.00"
            className="w-full rounded-lg border border-ol-line-strong bg-ol-white px-4 py-2.5 text-[0.95rem] focus:border-ol-ember focus:outline-none focus:ring-2 focus:ring-ol-ember/30"
          />
        </div>
        <div>
          <label htmlFor={`${id}-currency`} className="mb-1.5 block text-sm font-bold text-ol-charcoal">
            Devise
          </label>
          <select
            id={`${id}-currency`}
            value={currency}
            onChange={(e) => setCurrency(e.target.value as typeof currency)}
            className="w-full rounded-lg border border-ol-line-strong bg-ol-white px-4 py-2.5 text-[0.95rem] focus:border-ol-ember focus:outline-none focus:ring-2 focus:ring-ol-ember/30"
          >
            <option value="EUR">EUR</option>
            <option value="CDF">CDF</option>
            <option value="USD">USD</option>
          </select>
        </div>
        {currency !== 'EUR' && (
          <div>
            <label htmlFor={`${id}-fxrate`} className="mb-1.5 block text-sm font-bold text-ol-charcoal">
              Taux (unités {currency} pour 1 €)
            </label>
            <input
              id={`${id}-fxrate`}
              name="fxRate"
              required
              inputMode="decimal"
              placeholder="Ex. : 2900"
              className="w-full rounded-lg border border-ol-line-strong bg-ol-white px-4 py-2.5 text-[0.95rem] focus:border-ol-ember focus:outline-none focus:ring-2 focus:ring-ol-ember/30"
            />
          </div>
        )}

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
        <div>
          <label htmlFor={`${id}-category`} className="mb-1.5 block text-sm font-bold text-ol-charcoal">
            Catégorie <span className="font-normal text-ol-muted">(facultatif)</span>
          </label>
          <select
            id={`${id}-category`}
            name="categoryId"
            defaultValue=""
            className="w-full rounded-lg border border-ol-line-strong bg-ol-white px-4 py-2.5 text-[0.95rem] focus:border-ol-ember focus:outline-none focus:ring-2 focus:ring-ol-ember/30"
          >
            <option value="">Aucune</option>
            {relevantCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={`${id}-account`} className="mb-1.5 block text-sm font-bold text-ol-charcoal">
            Compte de trésorerie <span className="font-normal text-ol-muted">(facultatif)</span>
          </label>
          <select
            id={`${id}-account`}
            name="accountId"
            defaultValue=""
            className="w-full rounded-lg border border-ol-line-strong bg-ol-white px-4 py-2.5 text-[0.95rem] focus:border-ol-ember focus:outline-none focus:ring-2 focus:ring-ol-ember/30"
          >
            <option value="">Non précisé</option>
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name} ({a.currency})
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2 lg:col-span-3">
          <label htmlFor={`${id}-description`} className="mb-1.5 block text-sm font-bold text-ol-charcoal">
            Description <span className="font-normal text-ol-muted">(facultatif)</span>
          </label>
          <textarea
            id={`${id}-description`}
            name="description"
            maxLength={2000}
            className="min-h-20 w-full rounded-lg border border-ol-line-strong bg-ol-white px-4 py-2.5 text-[0.95rem] focus:border-ol-ember focus:outline-none focus:ring-2 focus:ring-ol-ember/30"
          />
        </div>

        {error && (
          <p role="alert" className="sm:col-span-2 lg:col-span-3 text-sm font-bold text-ol-ember-ink">
            {error}
          </p>
        )}

        <div className="sm:col-span-2 lg:col-span-3">
          <button
            type="submit"
            disabled={pending}
            className="rounded-full bg-ol-ember-ink px-6 py-3 text-sm font-bold text-ol-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {pending ? 'Enregistrement…' : 'Enregistrer en brouillon'}
          </button>
        </div>
      </form>
    </section>
  );
}
