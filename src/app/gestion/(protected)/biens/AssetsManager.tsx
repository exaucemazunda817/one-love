'use client';

import { useId, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ASSET_CATEGORY_LABELS, ASSET_CONDITION_LABELS, ASSET_STATUS_LABELS } from '@/lib/assets';

interface AssetRow {
  id: string;
  inventoryCode: string;
  label: string;
  category: string;
  condition: string;
  status: string;
  location: string | null;
  acquisitionAmount: string | null;
  acquisitionCurrency: string | null;
  holder: string | null;
}

const STATUS_STYLES: Record<string, string> = {
  IN_USE: 'bg-ol-charcoal/10 text-ol-charcoal',
  IN_STOCK: 'bg-ol-sand text-ol-ember-ink',
  UNDER_REPAIR: 'bg-ol-sand text-ol-ember-ink',
  DISPOSED: 'bg-ol-line text-ol-muted line-through',
  LOST: 'bg-ol-night text-ol-cream'
};

function formatMoney(amount: string, currency: string): string {
  const num = Number(amount);
  return `${num.toLocaleString('fr-FR', { maximumFractionDigits: 2 })} ${currency}`;
}

export function AssetsManager({
  initialAssets,
  projects,
  canManage
}: {
  initialAssets: AssetRow[];
  projects: { id: string; name: string }[];
  canManage: boolean;
}) {
  const id = useId();
  const router = useRouter();
  const [assets, setAssets] = useState(initialAssets);
  const [showForm, setShowForm] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasAmount, setHasAmount] = useState(false);
  const [currency, setCurrency] = useState('CDF');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);

    const formEl = event.currentTarget;
    const formData = new FormData(formEl);
    const usefulLifeYears = String(formData.get('usefulLifeYears') || '');
    const payload = {
      label: String(formData.get('label') || ''),
      category: String(formData.get('category') || ''),
      serialNumber: String(formData.get('serialNumber') || ''),
      acquiredOn: String(formData.get('acquiredOn') || ''),
      acquisitionAmount: String(formData.get('acquisitionAmount') || ''),
      acquisitionCurrency: String(formData.get('acquisitionCurrency') || 'CDF'),
      acquisitionFxRate: String(formData.get('acquisitionFxRate') || ''),
      fundedByProjectId: String(formData.get('fundedByProjectId') || ''),
      isDonatedInKind: formData.get('isDonatedInKind') === 'on',
      usefulLifeYears: usefulLifeYears ? Number(usefulLifeYears) : null,
      location: String(formData.get('location') || '')
    };

    try {
      const response = await fetch('/api/gestion/biens', {
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
      setShowForm(false);
      setHasAmount(false);
      router.refresh();
      setAssets((prev) => [
        {
          id: data.id,
          inventoryCode: data.inventoryCode,
          label: payload.label,
          category: payload.category,
          condition: 'GOOD',
          status: 'IN_STOCK',
          location: payload.location || null,
          acquisitionAmount: payload.acquisitionAmount || null,
          acquisitionCurrency: payload.acquisitionAmount ? payload.acquisitionCurrency : null,
          holder: null
        },
        ...prev
      ]);
    } catch {
      setError('Une erreur est survenue. Merci de réessayer.');
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-8">
      {canManage && (
        <div>
          <button
            type="button"
            onClick={() => setShowForm((v) => !v)}
            className="rounded-full bg-ol-ember-ink px-6 py-3 text-sm font-bold text-ol-white transition-opacity hover:opacity-90"
          >
            {showForm ? 'Annuler' : 'Nouveau bien'}
          </button>
        </div>
      )}

      {canManage && showForm && (
        <section className="rounded-xl border border-ol-line bg-ol-white p-6">
          <h2 className="text-lg font-black text-ol-charcoal">Nouveau bien</h2>
          <p className="mt-1 text-sm text-ol-muted">
            L&apos;achat lui-même se saisit séparément, comme une dépense ordinaire, dans la
            comptabilité — ces champs sont indicatifs pour l&apos;inventaire.
          </p>
          <form onSubmit={handleSubmit} className="mt-4 grid gap-4 sm:grid-cols-2" noValidate>
            <div>
              <label htmlFor={`${id}-label`} className="mb-1.5 block text-sm font-bold text-ol-charcoal">
                Désignation
              </label>
              <input
                id={`${id}-label`}
                name="label"
                required
                maxLength={160}
                placeholder="Ex. : Ordinateur portable HP"
                className="w-full rounded-lg border border-ol-line-strong bg-ol-white px-4 py-2.5 text-[0.95rem] focus:border-ol-ember focus:outline-none focus:ring-2 focus:ring-ol-ember/30"
              />
            </div>
            <div>
              <label htmlFor={`${id}-category`} className="mb-1.5 block text-sm font-bold text-ol-charcoal">
                Catégorie
              </label>
              <select
                id={`${id}-category`}
                name="category"
                required
                defaultValue=""
                className="w-full rounded-lg border border-ol-line-strong bg-ol-white px-4 py-2.5 text-[0.95rem] focus:border-ol-ember focus:outline-none focus:ring-2 focus:ring-ol-ember/30"
              >
                <option value="" disabled>
                  Choisir…
                </option>
                {Object.entries(ASSET_CATEGORY_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor={`${id}-serialNumber`} className="mb-1.5 block text-sm font-bold text-ol-charcoal">
                Numéro de série <span className="font-normal text-ol-muted">(facultatif)</span>
              </label>
              <input
                id={`${id}-serialNumber`}
                name="serialNumber"
                maxLength={80}
                className="w-full rounded-lg border border-ol-line-strong bg-ol-white px-4 py-2.5 text-[0.95rem] focus:border-ol-ember focus:outline-none focus:ring-2 focus:ring-ol-ember/30"
              />
            </div>
            <div>
              <label htmlFor={`${id}-location`} className="mb-1.5 block text-sm font-bold text-ol-charcoal">
                Localisation <span className="font-normal text-ol-muted">(facultatif)</span>
              </label>
              <input
                id={`${id}-location`}
                name="location"
                maxLength={120}
                placeholder="Ex. : Centre de Kinshasa"
                className="w-full rounded-lg border border-ol-line-strong bg-ol-white px-4 py-2.5 text-[0.95rem] focus:border-ol-ember focus:outline-none focus:ring-2 focus:ring-ol-ember/30"
              />
            </div>
            <div>
              <label htmlFor={`${id}-acquiredOn`} className="mb-1.5 block text-sm font-bold text-ol-charcoal">
                Date d&apos;acquisition <span className="font-normal text-ol-muted">(facultatif)</span>
              </label>
              <input
                id={`${id}-acquiredOn`}
                name="acquiredOn"
                type="date"
                className="w-full rounded-lg border border-ol-line-strong bg-ol-white px-4 py-2.5 text-[0.95rem] focus:border-ol-ember focus:outline-none focus:ring-2 focus:ring-ol-ember/30"
              />
            </div>
            <div className="flex items-end gap-2 pb-2.5">
              <input id={`${id}-isDonatedInKind`} name="isDonatedInKind" type="checkbox" className="h-4 w-4" />
              <label htmlFor={`${id}-isDonatedInKind`} className="text-sm font-bold text-ol-charcoal">
                Don en nature (pas payé par l&apos;association)
              </label>
            </div>
            <div>
              <label htmlFor={`${id}-acquisitionAmount`} className="mb-1.5 block text-sm font-bold text-ol-charcoal">
                Montant d&apos;acquisition <span className="font-normal text-ol-muted">(facultatif)</span>
              </label>
              <input
                id={`${id}-acquisitionAmount`}
                name="acquisitionAmount"
                inputMode="decimal"
                placeholder="Ex. : 850000"
                onChange={(e) => setHasAmount(e.target.value.trim().length > 0)}
                className="w-full rounded-lg border border-ol-line-strong bg-ol-white px-4 py-2.5 text-[0.95rem] focus:border-ol-ember focus:outline-none focus:ring-2 focus:ring-ol-ember/30"
              />
            </div>
            <div>
              <label htmlFor={`${id}-acquisitionCurrency`} className="mb-1.5 block text-sm font-bold text-ol-charcoal">
                Devise
              </label>
              <select
                id={`${id}-acquisitionCurrency`}
                name="acquisitionCurrency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full rounded-lg border border-ol-line-strong bg-ol-white px-4 py-2.5 text-[0.95rem] focus:border-ol-ember focus:outline-none focus:ring-2 focus:ring-ol-ember/30"
              >
                <option value="CDF">CDF</option>
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
              </select>
            </div>
            {hasAmount && currency !== 'EUR' && (
              <div>
                <label htmlFor={`${id}-acquisitionFxRate`} className="mb-1.5 block text-sm font-bold text-ol-charcoal">
                  Taux (1 € = … dans cette devise)
                </label>
                <input
                  id={`${id}-acquisitionFxRate`}
                  name="acquisitionFxRate"
                  inputMode="decimal"
                  placeholder="Ex. : 2900"
                  className="w-full rounded-lg border border-ol-line-strong bg-ol-white px-4 py-2.5 text-[0.95rem] focus:border-ol-ember focus:outline-none focus:ring-2 focus:ring-ol-ember/30"
                />
              </div>
            )}
            <div>
              <label htmlFor={`${id}-usefulLifeYears`} className="mb-1.5 block text-sm font-bold text-ol-charcoal">
                Durée de vie utile, en années <span className="font-normal text-ol-muted">(facultatif)</span>
              </label>
              <input
                id={`${id}-usefulLifeYears`}
                name="usefulLifeYears"
                type="number"
                min={1}
                max={60}
                className="w-full rounded-lg border border-ol-line-strong bg-ol-white px-4 py-2.5 text-[0.95rem] focus:border-ol-ember focus:outline-none focus:ring-2 focus:ring-ol-ember/30"
              />
            </div>
            <div>
              <label htmlFor={`${id}-fundedByProjectId`} className="mb-1.5 block text-sm font-bold text-ol-charcoal">
                Financé par <span className="font-normal text-ol-muted">(facultatif)</span>
              </label>
              <select
                id={`${id}-fundedByProjectId`}
                name="fundedByProjectId"
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
                {pending ? 'Enregistrement…' : 'Enregistrer'}
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="overflow-x-auto rounded-xl border border-ol-line bg-ol-white">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="border-b border-ol-line text-xs font-bold uppercase tracking-[0.1em] text-ol-muted">
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Désignation</th>
              <th className="px-4 py-3">Catégorie</th>
              <th className="px-4 py-3">État</th>
              <th className="px-4 py-3">Détenteur</th>
              <th className="px-4 py-3">Acquisition</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {assets.map((asset) => (
              <tr key={asset.id} className="border-b border-ol-line last:border-0">
                <td className="px-4 py-3 font-mono text-xs text-ol-muted">{asset.inventoryCode}</td>
                <td className="px-4 py-3 font-bold text-ol-charcoal">{asset.label}</td>
                <td className="px-4 py-3 text-ol-ink">{ASSET_CATEGORY_LABELS[asset.category] ?? asset.category}</td>
                <td className="px-4 py-3 text-ol-ink">{ASSET_CONDITION_LABELS[asset.condition] ?? asset.condition}</td>
                <td className="px-4 py-3 text-ol-muted">{asset.holder ?? '—'}</td>
                <td className="px-4 py-3 text-ol-muted">
                  {asset.acquisitionAmount && asset.acquisitionCurrency
                    ? formatMoney(asset.acquisitionAmount, asset.acquisitionCurrency)
                    : '—'}
                </td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${STATUS_STYLES[asset.status]}`}>
                    {ASSET_STATUS_LABELS[asset.status] ?? asset.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/gestion/biens/${asset.id}`} className="text-sm font-bold text-ol-ember-ink hover:underline">
                    Ouvrir
                  </Link>
                </td>
              </tr>
            ))}
            {assets.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-ol-muted">
                  Aucun bien enregistré.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
