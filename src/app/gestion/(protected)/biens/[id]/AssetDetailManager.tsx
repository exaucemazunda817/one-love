'use client';

import { useId, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ASSET_CATEGORY_LABELS, ASSET_CONDITION_LABELS, ASSET_STATUS_LABELS } from '@/lib/assets';

interface Assignment {
  id: string;
  holder: string;
  assignedOn: string;
  returnedOn: string | null;
  conditionOut: string | null;
  conditionIn: string | null;
}

interface Asset {
  id: string;
  inventoryCode: string;
  label: string;
  category: string;
  serialNumber: string | null;
  condition: string;
  status: string;
  location: string | null;
  acquiredOn: string | null;
  acquisitionAmount: string | null;
  acquisitionCurrency: string | null;
  acquisitionEur: string | null;
  isDonatedInKind: boolean;
  usefulLifeYears: number | null;
  fundedByProjectName: string | null;
  disposalReason: string | null;
  indicativeValueEur: number | null;
  assignments: Assignment[];
}

function formatMoney(amount: string, currency: string): string {
  const num = Number(amount);
  return `${num.toLocaleString('fr-FR', { maximumFractionDigits: 2 })} ${currency}`;
}
function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', { timeZone: 'UTC' });
}

export function AssetDetailManager({
  asset,
  teamMembers,
  canManage
}: {
  asset: Asset;
  teamMembers: { id: string; firstName: string; lastName: string }[];
  canManage: boolean;
}) {
  const id = useId();
  const router = useRouter();
  const [status, setStatus] = useState(asset.status);
  const [condition, setCondition] = useState(asset.condition);
  const [assignments, setAssignments] = useState(asset.assignments);
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [showStatusForm, setShowStatusForm] = useState(false);
  const [assignTarget, setAssignTarget] = useState<'person' | 'site'>('person');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeAssignment = assignments.find((a) => !a.returnedOn) ?? null;

  async function handleAssignSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);

    const formEl = event.currentTarget;
    const formData = new FormData(formEl);
    const payload = {
      teamMemberId: assignTarget === 'person' ? String(formData.get('teamMemberId') || '') : '',
      siteLabel: assignTarget === 'site' ? String(formData.get('siteLabel') || '') : '',
      assignedOn: String(formData.get('assignedOn') || ''),
      conditionOut: String(formData.get('conditionOut') || '')
    };

    try {
      const response = await fetch(`/api/gestion/biens/${asset.id}/affectations`, {
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
      setShowAssignForm(false);
      router.refresh();
      const holderName =
        assignTarget === 'person'
          ? (teamMembers.find((m) => m.id === payload.teamMemberId)?.firstName ?? '') +
            ' ' +
            (teamMembers.find((m) => m.id === payload.teamMemberId)?.lastName ?? '')
          : payload.siteLabel;
      setAssignments((prev) => [
        {
          id: data.id,
          holder: holderName.trim() || '—',
          assignedOn: new Date(payload.assignedOn).toISOString(),
          returnedOn: null,
          conditionOut: payload.conditionOut || null,
          conditionIn: null
        },
        ...prev
      ]);
      setStatus('IN_USE');
    } catch {
      setError('Une erreur est survenue. Merci de réessayer.');
    } finally {
      setPending(false);
    }
  }

  async function handleReturn(assignmentId: string, conditionIn: string) {
    setPending(true);
    setError(null);
    try {
      const response = await fetch(`/api/gestion/biens/${asset.id}/affectations/${assignmentId}/retour`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conditionIn: conditionIn || undefined })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(data.error || 'Une erreur est survenue.');
        return;
      }
      setAssignments((prev) =>
        prev.map((a) =>
          a.id === assignmentId ? { ...a, returnedOn: new Date().toISOString(), conditionIn: conditionIn || null } : a
        )
      );
      if (status !== 'DISPOSED' && status !== 'LOST') {
        setStatus('IN_STOCK');
        if (conditionIn) setCondition(conditionIn);
      }
      router.refresh();
    } catch {
      setError('Une erreur est survenue. Merci de réessayer.');
    } finally {
      setPending(false);
    }
  }

  async function handleStatusSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);

    const formEl = event.currentTarget;
    const formData = new FormData(formEl);
    const payload = {
      status: String(formData.get('status') || ''),
      condition: String(formData.get('condition') || ''),
      location: String(formData.get('location') || ''),
      disposalReason: String(formData.get('disposalReason') || '')
    };

    try {
      const response = await fetch(`/api/gestion/biens/${asset.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(data.error || 'Une erreur est survenue.');
        return;
      }
      setStatus(payload.status);
      if (payload.condition) setCondition(payload.condition);
      setShowStatusForm(false);
      router.refresh();
    } catch {
      setError('Une erreur est survenue. Merci de réessayer.');
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs text-ol-muted">{asset.inventoryCode}</p>
          <h1 className="mt-1 text-2xl font-black text-ol-charcoal">{asset.label}</h1>
          <p className="mt-1 text-sm text-ol-muted">
            {ASSET_CATEGORY_LABELS[asset.category] ?? asset.category}
            {asset.serialNumber ? ` — n° série ${asset.serialNumber}` : ''}
          </p>
        </div>
        {canManage && (status === 'DISPOSED' || status === 'LOST') === false && (
          <button
            type="button"
            onClick={() => setShowStatusForm((v) => !v)}
            className="rounded-full border border-ol-line-strong px-5 py-2.5 text-sm font-bold text-ol-charcoal transition-opacity hover:opacity-80"
          >
            {showStatusForm ? 'Annuler' : 'Modifier l’état'}
          </button>
        )}
      </div>

      {error && (
        <p role="alert" className="text-sm font-bold text-ol-ember-ink">
          {error}
        </p>
      )}

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-ol-line bg-ol-white p-5">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-ol-muted">Statut</p>
          <p className="mt-1 text-lg font-black text-ol-charcoal">{ASSET_STATUS_LABELS[status] ?? status}</p>
        </div>
        <div className="rounded-xl border border-ol-line bg-ol-white p-5">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-ol-muted">État</p>
          <p className="mt-1 text-lg font-black text-ol-charcoal">{ASSET_CONDITION_LABELS[condition] ?? condition}</p>
        </div>
        <div className="rounded-xl border border-ol-line bg-ol-white p-5">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-ol-muted">Localisation</p>
          <p className="mt-1 text-lg font-black text-ol-charcoal">{asset.location ?? '—'}</p>
        </div>
      </section>

      {showStatusForm && (
        <form
          onSubmit={handleStatusSubmit}
          className="grid gap-4 rounded-xl border border-ol-line bg-ol-white p-6 sm:grid-cols-2"
          noValidate
        >
          <div>
            <label htmlFor={`${id}-status`} className="mb-1.5 block text-sm font-bold text-ol-charcoal">
              Statut
            </label>
            <select
              id={`${id}-status`}
              name="status"
              defaultValue={status}
              className="w-full rounded-lg border border-ol-line-strong bg-ol-white px-4 py-2.5 text-[0.95rem] focus:border-ol-ember focus:outline-none focus:ring-2 focus:ring-ol-ember/30"
            >
              {Object.entries(ASSET_STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor={`${id}-condition`} className="mb-1.5 block text-sm font-bold text-ol-charcoal">
              État
            </label>
            <select
              id={`${id}-condition`}
              name="condition"
              defaultValue={condition}
              className="w-full rounded-lg border border-ol-line-strong bg-ol-white px-4 py-2.5 text-[0.95rem] focus:border-ol-ember focus:outline-none focus:ring-2 focus:ring-ol-ember/30"
            >
              {Object.entries(ASSET_CONDITION_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor={`${id}-location`} className="mb-1.5 block text-sm font-bold text-ol-charcoal">
              Localisation <span className="font-normal text-ol-muted">(facultatif)</span>
            </label>
            <input
              id={`${id}-location`}
              name="location"
              defaultValue={asset.location ?? ''}
              maxLength={120}
              className="w-full rounded-lg border border-ol-line-strong bg-ol-white px-4 py-2.5 text-[0.95rem] focus:border-ol-ember focus:outline-none focus:ring-2 focus:ring-ol-ember/30"
            />
          </div>
          <div>
            <label htmlFor={`${id}-disposalReason`} className="mb-1.5 block text-sm font-bold text-ol-charcoal">
              Motif <span className="font-normal text-ol-muted">(requis pour « Retiré » ou « Perdu »)</span>
            </label>
            <input
              id={`${id}-disposalReason`}
              name="disposalReason"
              maxLength={500}
              className="w-full rounded-lg border border-ol-line-strong bg-ol-white px-4 py-2.5 text-[0.95rem] focus:border-ol-ember focus:outline-none focus:ring-2 focus:ring-ol-ember/30"
            />
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={pending}
              className="rounded-full bg-ol-ember-ink px-6 py-3 text-sm font-bold text-ol-white transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {pending ? 'Enregistrement…' : 'Enregistrer'}
            </button>
          </div>
        </form>
      )}

      {asset.disposalReason && (status === 'DISPOSED' || status === 'LOST') && (
        <p className="text-sm text-ol-muted">Motif : {asset.disposalReason}</p>
      )}

      <section className="rounded-xl border border-ol-line bg-ol-white p-6">
        <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-ol-muted">Acquisition</h2>
        <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-ol-muted">Date</dt>
            <dd className="font-bold text-ol-charcoal">{asset.acquiredOn ? formatDate(asset.acquiredOn) : '—'}</dd>
          </div>
          <div>
            <dt className="text-ol-muted">Montant</dt>
            <dd className="font-bold text-ol-charcoal">
              {asset.acquisitionAmount && asset.acquisitionCurrency
                ? formatMoney(asset.acquisitionAmount, asset.acquisitionCurrency)
                : asset.isDonatedInKind
                  ? 'Don en nature'
                  : '—'}
            </dd>
          </div>
          <div>
            <dt className="text-ol-muted">Financé par</dt>
            <dd className="font-bold text-ol-charcoal">{asset.fundedByProjectName ?? 'Fonds général'}</dd>
          </div>
          <div>
            <dt className="text-ol-muted">Valeur indicative aujourd&apos;hui</dt>
            <dd className="font-bold text-ol-charcoal">
              {asset.indicativeValueEur !== null
                ? `${asset.indicativeValueEur.toLocaleString('fr-FR', { maximumFractionDigits: 2 })} €`
                : '—'}
            </dd>
          </div>
        </dl>
        {asset.indicativeValueEur !== null && (
          <p className="mt-3 text-xs text-ol-muted">
            Estimation linéaire simple, à titre indicatif seulement — jamais une écriture comptable
            (l&apos;association ne pratique pas l&apos;amortissement).
          </p>
        )}
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-ol-charcoal">Affectations</h2>
          {canManage && !activeAssignment && status !== 'DISPOSED' && status !== 'LOST' && (
            <button
              type="button"
              onClick={() => setShowAssignForm((v) => !v)}
              className="rounded-full bg-ol-ember-ink px-5 py-2.5 text-sm font-bold text-ol-white transition-opacity hover:opacity-90"
            >
              {showAssignForm ? 'Annuler' : 'Affecter ce bien'}
            </button>
          )}
        </div>

        {showAssignForm && (
          <form
            onSubmit={handleAssignSubmit}
            className="grid gap-4 rounded-xl border border-ol-line bg-ol-white p-6 sm:grid-cols-2"
            noValidate
          >
            <div className="sm:col-span-2 flex gap-4">
              <label className="flex items-center gap-2 text-sm font-bold text-ol-charcoal">
                <input
                  type="radio"
                  checked={assignTarget === 'person'}
                  onChange={() => setAssignTarget('person')}
                />
                À une personne
              </label>
              <label className="flex items-center gap-2 text-sm font-bold text-ol-charcoal">
                <input type="radio" checked={assignTarget === 'site'} onChange={() => setAssignTarget('site')} />
                À un site
              </label>
            </div>
            {assignTarget === 'person' ? (
              <div>
                <label htmlFor={`${id}-teamMemberId`} className="mb-1.5 block text-sm font-bold text-ol-charcoal">
                  Personne
                </label>
                <select
                  id={`${id}-teamMemberId`}
                  name="teamMemberId"
                  required
                  defaultValue=""
                  className="w-full rounded-lg border border-ol-line-strong bg-ol-white px-4 py-2.5 text-[0.95rem] focus:border-ol-ember focus:outline-none focus:ring-2 focus:ring-ol-ember/30"
                >
                  <option value="" disabled>
                    Choisir…
                  </option>
                  {teamMembers.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.firstName} {m.lastName}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label htmlFor={`${id}-siteLabel`} className="mb-1.5 block text-sm font-bold text-ol-charcoal">
                  Site
                </label>
                <input
                  id={`${id}-siteLabel`}
                  name="siteLabel"
                  required
                  maxLength={120}
                  placeholder="Ex. : Centre de Kinshasa"
                  className="w-full rounded-lg border border-ol-line-strong bg-ol-white px-4 py-2.5 text-[0.95rem] focus:border-ol-ember focus:outline-none focus:ring-2 focus:ring-ol-ember/30"
                />
              </div>
            )}
            <div>
              <label htmlFor={`${id}-assignedOn`} className="mb-1.5 block text-sm font-bold text-ol-charcoal">
                Date
              </label>
              <input
                id={`${id}-assignedOn`}
                name="assignedOn"
                type="date"
                required
                defaultValue={new Date().toISOString().slice(0, 10)}
                className="w-full rounded-lg border border-ol-line-strong bg-ol-white px-4 py-2.5 text-[0.95rem] focus:border-ol-ember focus:outline-none focus:ring-2 focus:ring-ol-ember/30"
              />
            </div>
            <div>
              <label htmlFor={`${id}-conditionOut`} className="mb-1.5 block text-sm font-bold text-ol-charcoal">
                État à la remise <span className="font-normal text-ol-muted">(facultatif)</span>
              </label>
              <select
                id={`${id}-conditionOut`}
                name="conditionOut"
                defaultValue=""
                className="w-full rounded-lg border border-ol-line-strong bg-ol-white px-4 py-2.5 text-[0.95rem] focus:border-ol-ember focus:outline-none focus:ring-2 focus:ring-ol-ember/30"
              >
                <option value="">Non précisé</option>
                {Object.entries(ASSET_CONDITION_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={pending}
                className="rounded-full bg-ol-ember-ink px-6 py-3 text-sm font-bold text-ol-white transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {pending ? 'Enregistrement…' : 'Enregistrer'}
              </button>
            </div>
          </form>
        )}

        <div className="overflow-x-auto rounded-xl border border-ol-line bg-ol-white">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-ol-line text-xs font-bold uppercase tracking-[0.1em] text-ol-muted">
                <th className="px-4 py-3">Détenteur</th>
                <th className="px-4 py-3">Remis le</th>
                <th className="px-4 py-3">Rendu le</th>
                <th className="px-4 py-3">État remise → retour</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {assignments.map((a) => (
                <tr key={a.id} className="border-b border-ol-line last:border-0">
                  <td className="px-4 py-3 font-bold text-ol-charcoal">{a.holder}</td>
                  <td className="px-4 py-3 text-ol-muted">{formatDate(a.assignedOn)}</td>
                  <td className="px-4 py-3 text-ol-muted">{a.returnedOn ? formatDate(a.returnedOn) : '—'}</td>
                  <td className="px-4 py-3 text-ol-ink">
                    {a.conditionOut ? ASSET_CONDITION_LABELS[a.conditionOut] : '—'} →{' '}
                    {a.conditionIn ? ASSET_CONDITION_LABELS[a.conditionIn] : '—'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {canManage && !a.returnedOn && (
                      <ReturnButton pending={pending} onReturn={(cond) => handleReturn(a.id, cond)} />
                    )}
                  </td>
                </tr>
              ))}
              {assignments.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-ol-muted">
                    Aucune affectation enregistrée.
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

function ReturnButton({ pending, onReturn }: { pending: boolean; onReturn: (conditionIn: string) => void }) {
  const [conditionIn, setConditionIn] = useState('');
  return (
    <div className="flex items-center justify-end gap-2">
      <select
        value={conditionIn}
        onChange={(e) => setConditionIn(e.target.value)}
        className="rounded-lg border border-ol-line-strong bg-ol-white px-2 py-1.5 text-xs focus:border-ol-ember focus:outline-none"
      >
        <option value="">État au retour</option>
        {Object.entries(ASSET_CONDITION_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <button
        type="button"
        disabled={pending}
        onClick={() => onReturn(conditionIn)}
        className="text-sm font-bold text-ol-ember-ink hover:underline disabled:opacity-60"
      >
        Enregistrer le retour
      </button>
    </div>
  );
}
