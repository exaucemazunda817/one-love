'use client';

import { useId, useState } from 'react';
import { CreditCard } from 'lucide-react';

const presets = [10, 25, 50, 100];

export function StripeDonationForm({ projectSlug }: { projectSlug?: string }) {
  const id = useId();
  const [amount, setAmount] = useState<number | 'custom'>(25);
  const [customAmount, setCustomAmount] = useState('');
  const [email, setEmail] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const finalAmount = amount === 'custom' ? Number(customAmount.replace(',', '.')) : amount;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);

    try {
      const response = await fetch('/api/dons/stripe/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amountEur: finalAmount,
          projectSlug: projectSlug || undefined,
          donorEmail: email || undefined
        })
      });

      if (response.status === 201) {
        const data = await response.json();
        // Redirection pleine page vers Stripe Checkout : c'est Stripe qui
        // héberge le formulaire de carte, jamais nous. La confirmation en
        // base ne vient JAMAIS de cette redirection — seul le webhook
        // vérifié (voir src/app/api/webhooks/stripe) fait foi.
        window.location.href = data.url;
        return;
      }

      const data = await response.json().catch(() => ({}));
      setError(data.error || 'Une erreur est survenue. Merci de réessayer.');
    } catch {
      setError('Une erreur est survenue. Merci de réessayer.');
    } finally {
      setPending(false);
    }
  }

  const disabled = pending || !finalAmount || finalAmount < 1 || finalAmount > 100000;

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div>
        <span className="mb-2 block text-sm font-bold text-ol-charcoal">Montant du don</span>
        <div className="flex flex-wrap gap-2.5">
          {presets.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setAmount(value)}
              aria-pressed={amount === value}
              className={`rounded-full px-5 py-2.5 text-sm font-bold transition-colors ${
                amount === value
                  ? 'bg-ol-ember-ink text-ol-white'
                  : 'border border-ol-line-strong text-ol-charcoal hover:border-ol-ember'
              }`}
            >
              {value} €
            </button>
          ))}
          <button
            type="button"
            onClick={() => setAmount('custom')}
            aria-pressed={amount === 'custom'}
            className={`rounded-full px-5 py-2.5 text-sm font-bold transition-colors ${
              amount === 'custom'
                ? 'bg-ol-ember-ink text-ol-white'
                : 'border border-ol-line-strong text-ol-charcoal hover:border-ol-ember'
            }`}
          >
            Autre montant
          </button>
        </div>
        {amount === 'custom' && (
          <div className="mt-3 max-w-40">
            <label htmlFor={`${id}-custom`} className="sr-only">
              Montant personnalisé, en euros
            </label>
            <div className="flex items-center rounded-lg border border-ol-line-strong focus-within:border-ol-ember focus-within:ring-2 focus-within:ring-ol-ember/30">
              <input
                id={`${id}-custom`}
                type="number"
                inputMode="decimal"
                min={1}
                max={100000}
                step="1"
                value={customAmount}
                onChange={(event) => setCustomAmount(event.target.value)}
                placeholder="0"
                className="w-full rounded-lg bg-ol-white px-4 py-3 text-[0.95rem] text-ol-ink focus:outline-none"
              />
              <span className="pr-4 text-ol-muted">€</span>
            </div>
          </div>
        )}
      </div>

      <div>
        <label htmlFor={`${id}-email`} className="mb-1.5 block text-sm font-bold text-ol-charcoal">
          E-mail <span className="font-normal text-ol-muted">(facultatif, pour un reçu de confirmation)</span>
        </label>
        <input
          id={`${id}-email`}
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          maxLength={180}
          autoComplete="email"
          className="w-full max-w-sm rounded-lg border border-ol-line-strong bg-ol-white px-4 py-3 text-[0.95rem] text-ol-ink focus:border-ol-ember focus:outline-none focus:ring-2 focus:ring-ol-ember/30"
        />
      </div>

      {error && (
        <p role="alert" className="text-sm font-bold text-ol-ember-ink">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={disabled}
        className="inline-flex items-center gap-2 rounded-full bg-ol-ember-ink px-6 py-3.5 text-sm font-bold text-ol-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <CreditCard size={16} aria-hidden />
        {pending ? 'Redirection…' : `Payer ${finalAmount ? `${finalAmount} €` : ''} par carte ou prélèvement`}
      </button>
      <p className="text-xs text-ol-muted">
        Paiement sécurisé par Stripe. Vous serez redirigé vers une page de paiement chiffrée.
      </p>
    </form>
  );
}
