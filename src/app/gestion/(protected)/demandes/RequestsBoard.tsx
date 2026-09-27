'use client';

import { useState } from 'react';

type RequestType = 'messages' | 'benevoles' | 'partenariats';
type Status = 'NEW' | 'IN_REVIEW' | 'ACCEPTED' | 'DECLINED' | 'ARCHIVED';

export interface RequestItem {
  id: string;
  type: RequestType;
  status: Status;
  receivedAt: string;
  sortKey: number;
  title: string;
  name: string;
  email: string;
  phone: string | null;
  website: string | null;
  fields: { label: string; value: string }[];
  body: string;
}

const STATUS_LABELS: Record<Status, string> = {
  NEW: 'Nouveau',
  IN_REVIEW: 'En cours',
  ACCEPTED: 'Traité — accepté',
  DECLINED: 'Traité — refusé',
  ARCHIVED: 'Archivé'
};
const STATUSES = Object.keys(STATUS_LABELS) as Status[];
const OPEN: Status[] = ['NEW', 'IN_REVIEW'];

const TABS: { key: 'all' | RequestType; label: string }[] = [
  { key: 'all', label: 'Toutes' },
  { key: 'messages', label: 'Messages et parrainages' },
  { key: 'benevoles', label: 'Bénévoles' },
  { key: 'partenariats', label: 'Partenariats' }
];

// Les sujets des demandes de parrainage et d'alerte Mobile Money sont
// générés par le site lui-même (SponsorInteractive.tsx, DonationFlow.tsx) :
// leur préfixe suffit à les repérer sans colonne supplémentaire en base.
function kindOf(item: RequestItem): string {
  if (item.type === 'benevoles') return 'Bénévole';
  if (item.type === 'partenariats') return 'Partenariat';
  if (/^(Parrainer un enfant|Soutenir un programme|Sponsor a child|Support a programme)/.test(item.title)) {
    return 'Parrainage';
  }
  if (item.title.startsWith('Mobile Money')) return 'Mobile Money';
  return 'Message';
}

export function RequestsBoard({ initialItems }: { initialItems: RequestItem[] }) {
  const [items, setItems] = useState(initialItems);
  const [tab, setTab] = useState<'all' | RequestType>('all');
  const [onlyOpen, setOnlyOpen] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState<string | null>(null);

  const visible = items.filter(
    (item) => (tab === 'all' || item.type === tab) && (!onlyOpen || OPEN.includes(item.status))
  );
  const openCount = (key: 'all' | RequestType) =>
    items.filter((item) => (key === 'all' || item.type === key) && OPEN.includes(item.status)).length;

  async function changeStatus(item: RequestItem, status: Status) {
    setSaving(item.id);
    setError('');
    try {
      const response = await fetch(`/api/gestion/demandes/${item.type}/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(data.error || 'La mise à jour a échoué.');
        return;
      }
      setItems((current) => current.map((row) => (row.id === item.id ? { ...row, status } : row)));
    } catch {
      setError('La mise à jour a échoué.');
    } finally {
      setSaving(null);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              aria-pressed={tab === t.key}
              className={`rounded-full border px-4 py-2 text-sm font-bold ${
                tab === t.key
                  ? 'border-ol-charcoal bg-ol-charcoal text-ol-white'
                  : 'border-ol-line bg-ol-white text-ol-muted hover:text-ol-ember-ink'
              }`}
            >
              {t.label}
              <span className="ml-1.5 opacity-70">{openCount(t.key)}</span>
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm text-ol-muted">
          <input type="checkbox" checked={onlyOpen} onChange={(e) => setOnlyOpen(e.target.checked)} />
          Seulement à traiter
        </label>
      </div>

      {error && (
        <p role="alert" className="text-sm font-bold text-ol-ember-ink">
          {error}
        </p>
      )}

      {visible.length === 0 ? (
        <p className="rounded-xl border border-ol-line bg-ol-white p-6 text-sm text-ol-muted">
          {onlyOpen ? 'Aucune demande à traiter.' : 'Aucune demande.'}
        </p>
      ) : (
        <ul className="space-y-4">
          {visible.map((item) => (
            <li key={`${item.type}-${item.id}`} className="rounded-xl border border-ol-line bg-ol-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-ol-cream px-2.5 py-0.5 text-xs font-bold text-ol-ember-ink">
                      {kindOf(item)}
                    </span>
                    <span className="text-xs text-ol-muted">{item.receivedAt}</span>
                  </div>
                  <h2 className="mt-1.5 break-words text-base font-black text-ol-charcoal">{item.title}</h2>
                </div>
                <select
                  value={item.status}
                  disabled={saving === item.id}
                  onChange={(e) => changeStatus(item, e.target.value as Status)}
                  aria-label="Statut de la demande"
                  className="rounded-lg border border-ol-line bg-ol-white px-3 py-2 text-sm font-bold text-ol-charcoal"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_LABELS[s]}
                    </option>
                  ))}
                </select>
              </div>

              <dl className="mt-3 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-[auto_1fr]">
                <dt className="text-ol-muted">Nom</dt>
                <dd className="font-bold text-ol-charcoal">{item.name}</dd>
                <dt className="text-ol-muted">E-mail</dt>
                <dd>
                  <a href={`mailto:${item.email}`} className="font-bold text-ol-ember-ink underline">
                    {item.email}
                  </a>
                </dd>
                {item.phone && (
                  <>
                    <dt className="text-ol-muted">Téléphone</dt>
                    <dd>
                      <a href={`tel:${item.phone}`} className="font-bold text-ol-ember-ink underline">
                        {item.phone}
                      </a>
                    </dd>
                  </>
                )}
                {item.website && /^https?:\/\//i.test(item.website) && (
                  <>
                    <dt className="text-ol-muted">Site</dt>
                    <dd>
                      <a
                        href={item.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="break-all font-bold text-ol-ember-ink underline"
                      >
                        {item.website}
                      </a>
                    </dd>
                  </>
                )}
                {item.fields.map((f) => (
                  <div key={f.label} className="contents">
                    <dt className="text-ol-muted">{f.label}</dt>
                    <dd className="text-ol-charcoal">{f.value}</dd>
                  </div>
                ))}
              </dl>

              <p className="mt-3 whitespace-pre-wrap break-words rounded-lg bg-ol-cream p-4 text-sm leading-relaxed text-ol-ink">
                {item.body}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
