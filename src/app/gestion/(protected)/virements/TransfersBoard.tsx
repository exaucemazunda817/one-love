'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Currency } from '@/lib/money';

export interface TransferRow {
  kind: 'don' | 'parrain';
  id: string;
  reference: string;
  who: string;
  contact: string;
  purpose: string;
  amount: number;
  amountLabel: string;
  currency: Currency;
  monthly: boolean;
  dateLabel: string;
}

type Action = 'confirm' | 'next' | 'cancel' | 'end';

function today(): string {
  // Date locale (et non toISOString, qui décale d'un jour selon le fuseau).
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function Row({ row, mode, onDone }: { row: TransferRow; mode: 'awaiting' | 'recurring'; onDone: () => void }) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(String(row.amount));
  const [date, setDate] = useState(today());
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function send(action: Action) {
    if ((action === 'cancel' || action === 'end') && !window.confirm(
      action === 'cancel' ? 'Annuler cette promesse de virement ?' : 'Arrêter ce parrainage par virement ?'
    )) return;
    setBusy(true);
    setError('');
    const value = Number(amount.replace(',', '.'));
    try {
      const response = await fetch('/api/gestion/virements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind: row.kind,
          id: row.id,
          action,
          ...(action === 'confirm' || action === 'next'
            ? { receivedOn: date, ...(value > 0 && value !== row.amount ? { amount: value } : {}) }
            : {})
        })
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(data.error || 'L’action a échoué.');
        setBusy(false);
        return;
      }
      onDone();
    } catch {
      setError('L’action a échoué.');
      setBusy(false);
    }
  }

  const receiveAction: Action = mode === 'awaiting' ? 'confirm' : 'next';
  const stopAction: Action | null = mode === 'awaiting' ? (row.kind === 'don' ? 'cancel' : 'end') : row.kind === 'parrain' ? 'end' : null;

  return (
    <li className="flex flex-col gap-3 border-b border-ol-line px-5 py-4 last:border-b-0">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <span className="font-mono text-sm font-bold text-ol-charcoal">{row.reference}</span>
          <span className="text-sm font-bold text-ol-charcoal">{row.purpose}</span>
          <span className="text-sm text-ol-muted">
            {row.who}
            {row.contact && ` · ${row.contact}`}
          </span>
          <span className="text-xs text-ol-muted">{row.dateLabel}</span>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="text-lg font-black text-ol-charcoal">
            {row.amountLabel}
            {row.monthly && <span className="text-sm font-bold text-ol-muted"> / mois</span>}
          </span>
          <div className="flex flex-wrap justify-end gap-2">
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="rounded-full bg-ol-ember-ink px-4 py-2 text-sm font-bold text-ol-white hover:opacity-90"
            >
              {mode === 'awaiting' ? 'Virement reçu' : 'Versement du mois reçu'}
            </button>
            {stopAction && (
              <button
                type="button"
                disabled={busy}
                onClick={() => send(stopAction)}
                className="rounded-full border border-ol-line px-4 py-2 text-sm font-bold text-ol-muted hover:text-ol-ember-ink disabled:opacity-60"
              >
                {stopAction === 'cancel' ? 'Annuler' : 'Arrêter'}
              </button>
            )}
          </div>
        </div>
      </div>
      {open && (
        <div className="flex flex-wrap items-end gap-3 rounded-lg bg-ol-cream p-3">
          <label className="flex flex-col gap-1 text-xs font-bold text-ol-muted">
            Montant reçu ({row.currency})
            <input
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-36 rounded-md border border-ol-line bg-ol-white px-3 py-2 text-sm text-ol-charcoal"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-bold text-ol-muted">
            Date sur le relevé
            <input
              type="date"
              value={date}
              max={today()}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-md border border-ol-line bg-ol-white px-3 py-2 text-sm text-ol-charcoal"
            />
          </label>
          <button
            type="button"
            disabled={busy || !(Number(amount.replace(',', '.')) > 0) || !date}
            onClick={() => send(receiveAction)}
            className="rounded-full bg-ol-ember-ink px-5 py-2 text-sm font-bold text-ol-white hover:opacity-90 disabled:opacity-60"
          >
            {busy ? '…' : 'Valider'}
          </button>
        </div>
      )}
      {error && <p role="alert" className="m-0 text-sm font-bold text-error">{error}</p>}
    </li>
  );
}

export function TransfersBoard({ awaiting, recurring }: { awaiting: TransferRow[]; recurring: TransferRow[] }) {
  const router = useRouter();
  const refresh = () => router.refresh();

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h2 className="text-lg font-black text-ol-charcoal">
          Virements attendus <span className="text-ol-muted">({awaiting.length})</span>
        </h2>
        <p className="text-sm text-ol-muted">
          Annoncés sur le site, pas encore reçus. Ils n’entrent dans aucun total, et un parrain par virement n’est pas
          encore parrain tant que son premier virement n’est pas validé ici.
        </p>
        <ul className="m-0 list-none rounded-xl border border-ol-line bg-ol-white p-0">
          {awaiting.length === 0 && <li className="px-5 py-8 text-center text-sm text-ol-muted">Aucun virement attendu.</li>}
          {awaiting.map((row) => (
            <Row key={`${row.kind}-${row.id}`} row={row} mode="awaiting" onDone={refresh} />
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-black text-ol-charcoal">
          Virements mensuels en cours <span className="text-ol-muted">({recurring.length})</span>
        </h2>
        <p className="text-sm text-ol-muted">
          Chaque mois, quand le virement permanent arrive avec cette référence, cliquez « Versement du mois reçu ».
        </p>
        <ul className="m-0 list-none rounded-xl border border-ol-line bg-ol-white p-0">
          {recurring.length === 0 && <li className="px-5 py-8 text-center text-sm text-ol-muted">Aucun virement mensuel en cours.</li>}
          {recurring.map((row) => (
            <Row key={`${row.kind}-${row.id}`} row={row} mode="recurring" onDone={refresh} />
          ))}
        </ul>
      </section>
    </div>
  );
}
