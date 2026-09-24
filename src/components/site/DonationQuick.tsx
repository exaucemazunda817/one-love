'use client';

import { useState } from 'react';
import {
  LockSimpleIcon,
  CreditCardIcon,
  BankIcon,
  DeviceMobileIcon
} from '@phosphor-icons/react';
import type { Locale } from '@/lib/i18n';
import {
  type Currency,
  SYMBOL,
  formatFromEur,
  formatCustom,
  toEur,
  startStripeCheckout
} from '@/lib/donation-ui';

const text = {
  fr: {
    title: 'Donner en 30 secondes',
    subtitle: 'Pour soutenir RÊVES 2 et les programmes de terrain.',
    frequency: 'Fréquence',
    freqs: { once: 'Une seule fois', monthly: 'Tous les mois' },
    amount: 'Montant',
    amounts: [
      [10, 'Un cahier et des crayons pour un trimestre'],
      [25, "Un mois de matériel pour un groupe d'atelier"],
      [50, 'Une consultation médicale et son suivi'],
      [100, 'Un mois de formation pour un animateur']
    ] as const,
    customLabel: 'Ou choisissez votre montant',
    customPlaceholder: 'Autre montant',
    give: (label: string, monthly: boolean) => `Donner ${label}${monthly ? ' par mois' : ''}`,
    empty: 'Indiquez un montant',
    pending: 'Redirection…',
    card: 'Carte · SEPA',
    transfer: 'Virement',
    mobile: 'Mobile Money bientôt',
    note: 'Équivalences et conversions indicatives.'
  },
  en: {
    title: 'Give in 30 seconds',
    subtitle: 'To support RÊVES 2 and our field programmes.',
    frequency: 'Frequency',
    freqs: { once: 'One-off', monthly: 'Monthly' },
    amount: 'Amount',
    amounts: [
      [10, 'A notebook and pencils for a term'],
      [25, 'A month of materials for a workshop group'],
      [50, 'A medical check-up and follow-up'],
      [100, 'A month of training for a facilitator']
    ] as const,
    customLabel: 'Or choose your amount',
    customPlaceholder: 'Other amount',
    give: (label: string, monthly: boolean) => `Give ${label}${monthly ? ' per month' : ''}`,
    empty: 'Enter an amount',
    pending: 'Redirecting…',
    card: 'Card · SEPA',
    transfer: 'Bank transfer',
    mobile: 'Mobile Money soon',
    note: 'Equivalents and conversions are indicative.'
  }
};

export function DonationQuick({ locale }: { locale: Locale }) {
  const t = text[locale];
  // Par défaut : mensuel, 25 € (maquette).
  const [freq, setFreq] = useState<'once' | 'monthly'>('monthly');
  const [cur, setCur] = useState<Currency>('EUR');
  const [amt, setAmt] = useState<number>(1);
  const [custom, setCustom] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isCustom = amt === -1;
  const cVal = parseFloat(custom.replace(',', '.'));
  const label = isCustom
    ? cVal > 0
      ? formatCustom(cVal, cur, locale)
      : null
    : formatFromEur(t.amounts[amt][0], cur, locale);
  const amountEur = isCustom ? (cVal > 0 ? toEur(cVal, cur) : 0) : t.amounts[amt][0];

  async function give() {
    if (!label || amountEur < 1) return;
    setPending(true);
    setError(null);
    const message = await startStripeCheckout({ amountEur, frequency: freq, locale });
    if (message) {
      setError(message);
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col gap-[18px] rounded-card bg-white p-[clamp(22px,3vw,32px)] shadow-ol-lg">
      <div className="flex flex-col gap-1">
        <h3 className="m-0 font-serif text-[26px] font-semibold">{t.title}</h3>
        <span className="text-[15px] text-ink-soft">{t.subtitle}</span>
      </div>

      <div role="radiogroup" aria-label={t.frequency} className="grid grid-cols-2 rounded-full bg-sand p-1">
        {(['once', 'monthly'] as const).map((k) => (
          <button
            key={k}
            type="button"
            role="radio"
            aria-checked={freq === k}
            onClick={() => setFreq(k)}
            className={`min-h-11 cursor-pointer rounded-full border-0 text-[15px] font-bold text-ink ${
              freq === k ? 'bg-white shadow-ol-xs' : 'bg-transparent'
            }`}
          >
            {t.freqs[k]}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between gap-2">
        <span className="text-[15px] font-bold">{t.amount}</span>
        <div className="flex gap-1">
          {(['EUR', 'USD', 'CDF'] as const).map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={cur === c}
              onClick={() => setCur(c)}
              className={`min-h-11 min-w-12 cursor-pointer rounded-md border-[1.5px] px-2.5 text-[13px] font-bold ${
                cur === c ? 'border-ink bg-ink text-cream' : 'border-field-line bg-white text-ink'
              }`}
            >
              {SYMBOL[c]}
            </button>
          ))}
        </div>
      </div>

      <div role="radiogroup" aria-label={t.amount} className="grid grid-cols-2 gap-2.5">
        {t.amounts.map(([v, eq], i) => (
          <button
            key={v}
            type="button"
            role="radio"
            aria-checked={amt === i}
            onClick={() => setAmt(i)}
            className={`flex min-h-[84px] cursor-pointer flex-col items-start gap-1 rounded-xl border-2 px-3.5 py-3 text-left ${
              amt === i ? 'border-copper-600 bg-copper-tint' : 'border-card-line bg-white'
            }`}
          >
            <span className="text-[22px] font-extrabold text-ink">{formatFromEur(v, cur, locale)}</span>
            <span className="text-[13px] leading-[1.35] text-ink-soft">{eq}</span>
          </button>
        ))}
      </div>

      <label className="flex flex-col gap-2">
        <span className="text-[15px] font-bold">{t.customLabel}</span>
        <div
          className={`flex min-h-14 items-center gap-2 rounded-xl border-2 px-4 ${
            isCustom ? 'border-copper-600 bg-copper-tint' : 'border-card-line bg-white'
          }`}
        >
          <input
            type="number"
            inputMode="decimal"
            min={1}
            placeholder={t.customPlaceholder}
            value={custom}
            onChange={(e) => {
              setCustom(e.target.value);
              setAmt(-1);
            }}
            onFocus={() => setAmt(-1)}
            className="min-w-0 flex-1 border-0 bg-transparent text-[20px] font-extrabold text-ink outline-none"
          />
          <span className="text-[17px] font-extrabold text-ink-soft">{SYMBOL[cur]}</span>
        </div>
      </label>

      <button
        type="button"
        onClick={give}
        disabled={!label || pending}
        className="inline-flex min-h-[54px] cursor-pointer items-center justify-center gap-2 rounded-full border-0 bg-copper-600 text-[17px] font-bold text-white hover:bg-copper-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <LockSimpleIcon size="1em" aria-hidden />
        {pending ? t.pending : label ? t.give(label, freq === 'monthly') : t.empty}
      </button>
      {error && (
        <p role="alert" className="m-0 text-[14px] font-bold text-error">
          {error}
        </p>
      )}

      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[13px] text-ink-soft">
        <span className="inline-flex items-center gap-1.5">
          <CreditCardIcon size={18} aria-hidden />
          {t.card}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <BankIcon size={18} aria-hidden />
          {t.transfer}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <DeviceMobileIcon size={18} aria-hidden />
          {t.mobile}
        </span>
      </div>
      <span className="text-[12px] text-ink-soft">{t.note}</span>
    </div>
  );
}
