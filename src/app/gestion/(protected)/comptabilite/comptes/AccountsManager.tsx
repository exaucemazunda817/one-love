'use client';

import { useId, useState } from 'react';
import { useRouter } from 'next/navigation';

type Currency = 'EUR' | 'CDF' | 'USD';
type Kind = 'BANK' | 'CASH' | 'MOBILE_MONEY';

interface AccountRow {
  id: string;
  name: string;
  currency: Currency;
  kind: Kind;
  bankName: string | null;
  ibanLast4: string | null;
  isActive: boolean;
  balance: number;
}

const KIND_LABELS: Record<Kind, string> = { BANK: 'Banque', CASH: 'Caisse', MOBILE_MONEY: 'Mobile Money' };

export function AccountsManager({
  initialAccounts,
  canManage
}: {
  initialAccounts: AccountRow[];
  canManage: boolean;
}) {
  const router = useRouter();
  const id = useId();
  const [accounts, setAccounts] = useState(initialAccounts);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);

    const formEl = event.currentTarget;
    const formData = new FormData(formEl);
    const payload = {
      name: String(formData.get('name') || ''),
      currency: String(formData.get('currency') || 'EUR'),
      kind: String(formData.get('kind') || 'BANK'),
      bankName: String(formData.get('bankName') || ''),
      ibanLast4: String(formData.get('ibanLast4') || '')
    };

    try {
      const response = await fetch('/api/gestion/comptabilite/comptes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(data.error || 'Une erreur est survenue.');
        return;
      }
      formEl.reset();
      router.refresh();
      setAccounts((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          name: payload.name,
          currency: payload.currency as Currency,
          kind: payload.kind as Kind,
          bankName: payload.bankName || null,
          ibanLast4: payload.ibanLast4 || null,
          isActive: true,
          balance: 0
        }
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
        <section className="rounded-xl border border-ol-line bg-ol-white p-6">
          <h2 className="text-lg font-black text-ol-charcoal">Ajouter un compte</h2>
          <form onSubmit={handleCreate} className="mt-4 grid gap-4 sm:grid-cols-2" noValidate>
            <div>
              <label htmlFor={`${id}-name`} className="mb-1.5 block text-sm font-bold text-ol-charcoal">
                Nom
              </label>
              <input
                id={`${id}-name`}
                name="name"
                required
                maxLength={120}
                placeholder="Ex. : Banque France (EUR), Caisse Kinshasa"
                className="w-full rounded-lg border border-ol-line-strong bg-ol-white px-4 py-2.5 text-[0.95rem] focus:border-ol-ember focus:outline-none focus:ring-2 focus:ring-ol-ember/30"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor={`${id}-currency`} className="mb-1.5 block text-sm font-bold text-ol-charcoal">
                  Devise
                </label>
                <select
                  id={`${id}-currency`}
                  name="currency"
                  defaultValue="EUR"
                  className="w-full rounded-lg border border-ol-line-strong bg-ol-white px-4 py-2.5 text-[0.95rem] focus:border-ol-ember focus:outline-none focus:ring-2 focus:ring-ol-ember/30"
                >
                  <option value="EUR">EUR</option>
                  <option value="CDF">CDF</option>
                  <option value="USD">USD</option>
                </select>
              </div>
              <div>
                <label htmlFor={`${id}-kind`} className="mb-1.5 block text-sm font-bold text-ol-charcoal">
                  Type
                </label>
                <select
                  id={`${id}-kind`}
                  name="kind"
                  defaultValue="BANK"
                  className="w-full rounded-lg border border-ol-line-strong bg-ol-white px-4 py-2.5 text-[0.95rem] focus:border-ol-ember focus:outline-none focus:ring-2 focus:ring-ol-ember/30"
                >
                  <option value="BANK">Banque</option>
                  <option value="CASH">Caisse</option>
                  <option value="MOBILE_MONEY">Mobile Money</option>
                </select>
              </div>
            </div>
            <div>
              <label htmlFor={`${id}-bankName`} className="mb-1.5 block text-sm font-bold text-ol-charcoal">
                Banque <span className="font-normal text-ol-muted">(facultatif)</span>
              </label>
              <input
                id={`${id}-bankName`}
                name="bankName"
                maxLength={120}
                className="w-full rounded-lg border border-ol-line-strong bg-ol-white px-4 py-2.5 text-[0.95rem] focus:border-ol-ember focus:outline-none focus:ring-2 focus:ring-ol-ember/30"
              />
            </div>
            <div>
              <label htmlFor={`${id}-iban`} className="mb-1.5 block text-sm font-bold text-ol-charcoal">
                4 derniers chiffres de l&apos;IBAN <span className="font-normal text-ol-muted">(facultatif)</span>
              </label>
              <input
                id={`${id}-iban`}
                name="ibanLast4"
                maxLength={4}
                placeholder="0159"
                className="w-full rounded-lg border border-ol-line-strong bg-ol-white px-4 py-2.5 text-[0.95rem] focus:border-ol-ember focus:outline-none focus:ring-2 focus:ring-ol-ember/30"
              />
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
                {pending ? 'Création…' : 'Ajouter le compte'}
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="overflow-x-auto rounded-xl border border-ol-line bg-ol-white">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr className="border-b border-ol-line text-xs font-bold uppercase tracking-[0.1em] text-ol-muted">
              <th className="px-5 py-3">Nom</th>
              <th className="px-5 py-3">Type</th>
              <th className="px-5 py-3">Devise</th>
              <th className="px-5 py-3 text-right">Solde</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account) => (
              <tr key={account.id} className="border-b border-ol-line last:border-0">
                <td className="px-5 py-3">
                  <div className="font-bold text-ol-charcoal">{account.name}</div>
                  {account.bankName && <div className="text-ol-muted">{account.bankName}</div>}
                </td>
                <td className="px-5 py-3 text-ol-ink">{KIND_LABELS[account.kind]}</td>
                <td className="px-5 py-3 text-ol-ink">{account.currency}</td>
                <td className="px-5 py-3 text-right font-bold text-ol-charcoal">
                  {account.balance.toLocaleString('fr-FR', { maximumFractionDigits: 2 })}
                </td>
              </tr>
            ))}
            {accounts.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-ol-muted">
                  Aucun compte enregistré.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
