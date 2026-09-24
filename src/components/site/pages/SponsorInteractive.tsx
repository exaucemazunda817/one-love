'use client';

import { useId, useMemo, useState } from 'react';
import Image from 'next/image';
import {
  CheckIcon,
  PlusIcon,
  MinusIcon,
  QuotesIcon,
  ShieldCheckIcon,
  EnvelopeOpenIcon,
  ImageIcon,
  PaintBrushIcon,
  FileTextIcon
} from '@phosphor-icons/react';
import { Reveal } from '@/components/Reveal';
import { Brush } from '@/components/site/ui';
import type { Currency } from '@/lib/donation-ui';
import { SYMBOL } from '@/lib/donation-ui';
import type { Locale } from '@/lib/i18n';

type Mode = 'child' | 'prog';

const RECEIVE_ICONS = [EnvelopeOpenIcon, ImageIcon, PaintBrushIcon, FileTextIcon];

export interface SponsorText {
  howTitle: string;
  how: { n: string; t: string; d: string }[];
  formulesTitle: string;
  formulesSubtitle: string;
  modes: Record<Mode, string>;
  plansChild: { name: string; price: number; tag: string; items: string[] }[];
  plansProg: { name: string; price: number; tag: string; items: string[] }[];
  perMonth: string;
  monthUnit: string;
  plansConfirm: string;
  receiveTitle: string;
  receiveAlt: string;
  receive: { t: string; d: string }[];
  charterTitle: string;
  charterIntro: string;
  charter: string[];
  quote: string;
  quoteName: string;
  quoteRole: string;
  quoteFictional: string;
  faqTitle: string;
  faq: { q: string; a: string }[];
  inscriptionTitlePre: string;
  inscriptionTitleWord: string;
  inscriptionTitlePost: string;
  inscriptionIntro: string;
  yourChoice: string;
  change: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  optional: string;
  charterAgreePre: string;
  charterAgreeLink: string;
  charterAgreePost: string;
  submitLabelPrefix: string;
  noCharge: string;
  thanksTitle: string;
  thanksText: string;
  backToForm: string;
  error: string;
}

function fmt(eur: number, currency: Currency, locale: Locale): string {
  const num = currency === 'EUR' ? eur : currency === 'USD' ? Math.round(eur * 1.1) : Math.round((eur * 3100) / 1000) * 1000;
  return `${num.toLocaleString(locale === 'fr' ? 'fr-FR' : 'en-GB')} ${SYMBOL[currency]}`;
}

export function SponsorInteractive({ locale, t }: { locale: Locale; t: SponsorText }) {
  const id = useId();
  const [cur, setCur] = useState<Currency>('EUR');
  const [mode, setMode] = useState<Mode>('child');
  const [plan, setPlan] = useState(1);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');

  const plans = mode === 'child' ? t.plansChild : t.plansProg;
  const chosen = plans[plan];
  const chosenPrice = fmt(chosen.price, cur, locale);

  function pickMode(m: Mode) {
    setMode(m);
    setPlan(m === 'child' ? 1 : 0);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError('');
    const formEl = event.currentTarget;
    const formData = new FormData(formEl);
    const payload = {
      fullName: `${formData.get('firstName') || ''} ${formData.get('lastName') || ''}`.trim(),
      email: String(formData.get('email') || ''),
      phone: String(formData.get('phone') || ''),
      subject: `${t.modes[mode]} — ${chosen.name} — ${chosenPrice}/${t.perMonth}`,
      message: `${t.yourChoice}: ${chosen.name} · ${chosenPrice} / ${t.perMonth}`
    };
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.status === 201) {
        setSent(true);
        formEl.reset();
      } else {
        const data = await response.json().catch(() => ({}));
        setError(data.error || t.error);
      }
    } catch {
      setError(t.error);
    } finally {
      setPending(false);
    }
  }

  const currencies = useMemo(() => ['EUR', 'USD', 'CDF'] as Currency[], []);

  return (
    <>
      {/* Comment ça marche */}
      <section id="comment" className="mx-auto flex max-w-[1200px] scroll-mt-20 flex-col gap-10 px-[clamp(20px,4vw,32px)] py-[clamp(56px,8vw,104px)]">
        <Reveal>
          <h2 className="m-0 font-serif text-[clamp(30px,3.6vw,46px)] font-medium leading-[1.15]">{t.howTitle}</h2>
        </Reveal>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-x-10 gap-y-8">
          {t.how.map((h, i) => (
            <Reveal key={h.n} delay={i * 90} className="flex flex-col gap-3">
              <div className="flex items-center gap-3.5">
                <span className="font-serif text-[48px] leading-none text-copper-600">{h.n}</span>
                <Brush fill="#D9C7AE" className="h-2 flex-1" />
              </div>
              <h3 className="m-0 font-serif text-[24px] font-semibold">{h.t}</h3>
              <p className="m-0 text-[17px] leading-[1.6] text-ink-body">{h.d}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Formules */}
      <section id="formules" className="scroll-mt-20 bg-sand">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-7 px-[clamp(16px,4vw,32px)] py-[clamp(56px,8vw,104px)]">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <Reveal className="flex max-w-[620px] flex-col gap-2.5">
              <h2 className="m-0 font-serif text-[clamp(30px,3.6vw,46px)] font-medium leading-[1.15]">{t.formulesTitle}</h2>
              <p className="m-0 text-[17px] leading-[1.6] text-ink-body">{t.formulesSubtitle}</p>
            </Reveal>
            <div className="flex gap-1">
              {currencies.map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-pressed={cur === c}
                  onClick={() => setCur(c)}
                  className={`min-h-11 min-w-[52px] cursor-pointer rounded-md border-[1.5px] px-3 text-[14px] font-bold ${
                    cur === c ? 'border-ink bg-ink text-cream' : 'border-field-line bg-white text-ink'
                  }`}
                >
                  {SYMBOL[c]}
                </button>
              ))}
            </div>
          </div>

          <div role="radiogroup" aria-label={t.formulesTitle} className="grid max-w-[560px] grid-cols-2 rounded-full bg-cream p-1">
            {(['child', 'prog'] as Mode[]).map((m) => (
              <button
                key={m}
                type="button"
                role="radio"
                aria-checked={mode === m}
                onClick={() => pickMode(m)}
                className={`min-h-12 cursor-pointer rounded-full border-0 text-[15px] font-bold ${
                  mode === m ? 'bg-ink text-cream' : 'bg-transparent text-ink'
                }`}
              >
                {t.modes[m]}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-4">
            {plans.map((p, i) => (
              <button
                key={p.name}
                type="button"
                role="radio"
                aria-checked={plan === i}
                onClick={() => setPlan(i)}
                className={`relative flex cursor-pointer flex-col gap-3.5 rounded-[20px] border-2 px-6 py-7 text-left ${
                  plan === i ? 'border-copper-600 bg-white shadow-[0_12px_32px_rgba(60,35,15,.14)]' : 'border-card-line bg-sand'
                }`}
              >
                <span className="flex w-full items-center justify-between gap-2">
                  <b className="text-[15px] tracking-[0.02em]">{p.name}</b>
                  {p.tag && <span className="rounded-full bg-sage-700 px-2.5 py-1 text-[12px] font-extrabold text-white">{p.tag}</span>}
                </span>
                <span className="flex items-baseline gap-1.5">
                  <span className="font-serif text-[44px] font-medium leading-none">{fmt(p.price, cur, locale)}</span>
                  <span className="text-[15px] text-ink-soft">{t.perMonth}</span>
                </span>
                <span className="flex flex-col gap-2">
                  {p.items.map((it) => (
                    <span key={it} className="flex items-start gap-2.5 text-[15px] leading-[1.45]">
                      <CheckIcon size={18} color="#3F5A47" className="mt-0.5 flex-none" aria-hidden />
                      {it}
                    </span>
                  ))}
                </span>
              </button>
            ))}
          </div>
          <span className="text-[13px] text-ink-soft">{t.plansConfirm}</span>
        </div>
      </section>

      {/* Ce que vous recevez */}
      <section className="mx-auto grid max-w-[1200px] grid-cols-[repeat(auto-fit,minmax(min(100%,380px),1fr))] items-center gap-[clamp(32px,5vw,72px)] px-[clamp(20px,4vw,32px)] py-[clamp(56px,8vw,104px)]">
        <Reveal className="relative aspect-[4/5] max-h-[560px] overflow-hidden rounded-[20px]">
          <Image src="/photos/photo-mains.jpg" alt={t.receiveAlt} fill sizes="(max-width: 1200px) 100vw, 560px" className="photo-tone object-cover" />
        </Reveal>
        <Reveal delay={90} className="flex flex-col gap-6">
          <h2 className="m-0 font-serif text-[clamp(30px,3.6vw,46px)] font-medium leading-[1.15]">{t.receiveTitle}</h2>
          {t.receive.map((r, i) => {
            const Icon = RECEIVE_ICONS[i];
            return (
              <div key={r.t} className="flex items-start gap-4">
                <span className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-copper-tint-2">
                  <Icon size={24} className="text-copper-600" aria-hidden />
                </span>
                <div className="flex flex-col gap-1">
                  <b className="text-[17px]">{r.t}</b>
                  <span className="text-[16px] leading-[1.55] text-ink-body">{r.d}</span>
                </div>
              </div>
            );
          })}
        </Reveal>
      </section>

      {/* Charte de protection */}
      <section id="charte" className="mx-auto scroll-mt-20 px-[clamp(12px,3vw,32px)] pb-[clamp(56px,8vw,104px)]">
        <Reveal className="grid max-w-[1200px] grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] gap-x-14 gap-y-8 rounded-[20px] bg-night p-[clamp(28px,5vw,56px)] text-cream">
          <div className="flex flex-col gap-3.5">
            <ShieldCheckIcon size={40} color="#9DB5A2" aria-hidden />
            <h2 className="m-0 font-serif text-[clamp(28px,3.2vw,40px)] font-medium leading-[1.2]">{t.charterTitle}</h2>
            <p className="m-0 text-[17px] leading-[1.6] text-on-dark-1">{t.charterIntro}</p>
          </div>
          <div className="flex flex-col gap-3.5">
            {t.charter.map((c) => (
              <div key={c} className="flex items-start gap-3 text-[16px] leading-[1.55]">
                <Brush fill="#E89A2C" className="mt-2.5 h-2 w-[22px] flex-none" />
                <span>{c}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Témoignage + FAQ */}
      <section className="mx-auto grid max-w-[1200px] grid-cols-[repeat(auto-fit,minmax(min(100%,360px),1fr))] items-start gap-x-16 gap-y-10 px-[clamp(20px,4vw,32px)] pb-[clamp(56px,8vw,104px)]">
        <Reveal>
          <figure className="m-0 flex flex-col gap-4 rounded-[20px] bg-white p-8 shadow-ol-sm">
            <QuotesIcon size={36} className="text-copper-600" aria-hidden />
            <blockquote className="m-0 font-serif text-[22px] italic leading-[1.45]">{t.quote}</blockquote>
            <figcaption className="text-[15px]">
              <b>{t.quoteName}</b> · {t.quoteRole} · <span className="text-ink-soft">{t.quoteFictional}</span>
            </figcaption>
          </figure>
        </Reveal>
        <Reveal delay={90} className="flex flex-col gap-2">
          <h2 className="m-0 mb-3 font-serif text-[clamp(28px,3.2vw,40px)] font-medium leading-[1.15]">{t.faqTitle}</h2>
          {t.faq.map((f, i) => {
            const open = faqOpen === i;
            return (
              <div key={f.q} className="border-b-[1.5px] border-card-line">
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() => setFaqOpen(open ? null : i)}
                  className="flex min-h-[60px] w-full cursor-pointer items-center justify-between gap-4 border-0 bg-transparent py-2 text-left text-[17px] font-bold text-ink"
                >
                  {f.q}
                  {open ? <MinusIcon size={20} color="#A9531A" className="flex-none" aria-hidden /> : <PlusIcon size={20} color="#A9531A" className="flex-none" aria-hidden />}
                </button>
                {open && <p className="m-0 mb-[18px] text-[16px] leading-[1.6] text-ink-body">{f.a}</p>}
              </div>
            );
          })}
        </Reveal>
      </section>

      {/* Inscription */}
      <section id="inscription" className="scroll-mt-20 bg-sand">
        <div className="mx-auto grid max-w-[1200px] grid-cols-[repeat(auto-fit,minmax(min(100%,380px),1fr))] items-start gap-[clamp(32px,5vw,64px)] px-[clamp(16px,4vw,32px)] py-[clamp(56px,8vw,104px)]">
          <Reveal className="flex flex-col gap-4">
            <h2 className="m-0 font-serif text-[clamp(30px,3.6vw,46px)] font-medium leading-[1.15]">
              {t.inscriptionTitlePre}
              <span className="relative inline-block">
                {t.inscriptionTitleWord}
                <Brush className="absolute bottom-[-0.12em] left-[-3%] h-[0.22em] w-[106%]" />
              </span>
              {t.inscriptionTitlePost}
            </h2>
            <p className="m-0 text-[17px] leading-[1.6] text-ink-body">{t.inscriptionIntro}</p>
            <div className="flex flex-col gap-2 rounded-xl bg-cream px-5 py-5">
              <span className="text-[13px] font-extrabold tracking-[0.08em] text-ink-soft">{t.yourChoice}</span>
              <b className="font-serif text-[26px] font-medium">
                {chosen.name} · {chosenPrice} / {t.monthUnit}
              </b>
              <a href="#formules" className="text-[15px] font-bold">
                {t.change}
              </a>
            </div>
          </Reveal>

          <Reveal delay={90}>
            {sent ? (
              <div className="flex flex-col items-start gap-3.5 rounded-[20px] bg-white p-[clamp(20px,3vw,32px)] py-3 shadow-ol-lg">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-sage-100">
                  <CheckIcon size={28} color="#3F5A47" aria-hidden />
                </span>
                <h3 className="m-0 font-serif text-[26px] font-semibold">{t.thanksTitle}</h3>
                <p className="m-0 text-[16px] leading-[1.6] text-ink-body">{t.thanksText}</p>
                <button type="button" onClick={() => setSent(false)} className="min-h-11 cursor-pointer border-0 bg-transparent p-0 text-[15px] font-bold text-copper-600">
                  {t.backToForm}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4 rounded-[20px] bg-white p-[clamp(20px,3vw,32px)] shadow-ol-lg">
                <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,180px),1fr))] gap-3.5">
                  <label className="flex flex-col gap-2">
                    <span className="text-[15px] font-bold">{t.firstName}</span>
                    <input
                      name="firstName"
                      required
                      autoComplete="given-name"
                      maxLength={120}
                      className="min-h-[52px] rounded-lg border-[1.5px] border-field-line px-3.5 text-[17px] outline-none focus:border-copper-600"
                    />
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className="text-[15px] font-bold">{t.lastName}</span>
                    <input
                      name="lastName"
                      required
                      autoComplete="family-name"
                      maxLength={120}
                      className="min-h-[52px] rounded-lg border-[1.5px] border-field-line px-3.5 text-[17px] outline-none focus:border-copper-600"
                    />
                  </label>
                </div>
                <label className="flex flex-col gap-2">
                  <span className="text-[15px] font-bold">{t.email}</span>
                  <input
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    maxLength={180}
                    className="min-h-[52px] rounded-lg border-[1.5px] border-field-line px-3.5 text-[17px] outline-none focus:border-copper-600"
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-[15px] font-bold">
                    {t.phone} <span className="font-normal text-ink-soft">{t.optional}</span>
                  </span>
                  <input
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    maxLength={40}
                    className="min-h-[52px] rounded-lg border-[1.5px] border-field-line px-3.5 text-[17px] outline-none focus:border-copper-600"
                  />
                </label>
                <label className="flex min-h-12 cursor-pointer items-start gap-3">
                  <input required type="checkbox" className="mt-0.5 h-[22px] w-[22px] flex-none accent-copper-600" />
                  <span className="text-[15px] leading-[1.5]">
                    {t.charterAgreePre}
                    <a href="#" className="font-bold">
                      {t.charterAgreeLink}
                    </a>
                    {t.charterAgreePost}
                  </span>
                </label>
                {error && (
                  <p role="alert" className="m-0 text-[14px] font-bold text-error">
                    {error}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={pending}
                  className="inline-flex min-h-[54px] cursor-pointer items-center justify-center gap-2 rounded-full border-0 bg-copper-600 text-[17px] font-bold text-white hover:bg-copper-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {pending ? '…' : `${t.submitLabelPrefix} · ${chosenPrice} / ${t.monthUnit}`}
                </button>
                <span className="text-[13px] text-ink-soft">{t.noCharge}</span>
                <input type="hidden" name={`${id}-locale`} value={locale} />
              </form>
            )}
          </Reveal>
        </div>
      </section>
    </>
  );
}
