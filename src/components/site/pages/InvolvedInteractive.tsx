'use client';

import { useId, useState } from 'react';
import Link from 'next/link';
import {
  UsersThreeIcon,
  PackageIcon,
  MegaphoneIcon,
  HandshakeIcon,
  WhatsappLogoIcon,
  CheckIcon
} from '@phosphor-icons/react';
import { Reveal } from '@/components/Reveal';
import { BrushWord } from '@/components/site/ui';
import { localeHref, type Locale } from '@/lib/i18n';

export type Interest = 'benevolat' | 'nature' | 'collecte' | 'partenariat';

const ICONS = { benevolat: UsersThreeIcon, nature: PackageIcon, collecte: MegaphoneIcon, partenariat: HandshakeIcon };

export function InvolvedInteractive({
  locale,
  t,
  between
}: {
  locale: Locale;
  between?: React.ReactNode;
  t: {
    waysTitle: string;
    ways: { k: Interest; t: string; d: string; cta: string }[];
    formTitlePre: string;
    formTitleWord: string;
    formIntro: string;
    whatsapp: string;
    interestLabel: string;
    interests: Record<Interest, string>;
    name: string;
    email: string;
    org: string;
    orgPlaceholder: string;
    message: string;
    send: string;
    sending: string;
    thanksTitle: string;
    thanksText: string;
    sendAnother: string;
    error: string;
  };
}) {
  const id = useId();
  const href = (p: string) => localeHref(p, locale);
  const [interest, setInterest] = useState<Interest>('benevolat');
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');

  function pick(k: Interest) {
    setInterest(k);
    document.getElementById('formulaire')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError('');
    const formEl = event.currentTarget;
    const formData = new FormData(formEl);
    const org = String(formData.get('org') || '');
    const message = String(formData.get('message') || '');
    const payload = {
      fullName: String(formData.get('name') || ''),
      email: String(formData.get('email') || ''),
      phone: '',
      subject: t.interests[interest],
      message: org ? `${message}\n\n${t.org}: ${org}` : message
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

  return (
    <>
      <section className="mx-auto flex max-w-[1200px] flex-col gap-8 px-[clamp(20px,4vw,32px)] py-[clamp(56px,8vw,104px)]">
        <Reveal>
          <h2 className="m-0 text-balance font-serif text-[clamp(30px,3.6vw,46px)] font-medium leading-[1.15]">{t.waysTitle}</h2>
        </Reveal>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-4">
          {t.ways.map((w, i) => {
            const Icon = ICONS[w.k];
            return (
              <Reveal key={w.k} delay={i * 90}>
                <button
                  type="button"
                  onClick={() => pick(w.k)}
                  className={`flex min-h-12 w-full cursor-pointer flex-col items-start gap-3 rounded-[20px] border-2 bg-white px-6 py-7 text-left ${
                    interest === w.k ? 'border-copper-600 bg-copper-tint' : 'border-transparent'
                  }`}
                >
                  <Icon size={32} className="text-copper-600" aria-hidden />
                  <span className="font-serif text-[22px] font-semibold text-ink">{w.t}</span>
                  <span className="text-[15px] leading-[1.55] text-ink-body">{w.d}</span>
                  <span className="mt-auto text-[14px] font-bold text-copper-700">{w.cta}</span>
                </button>
              </Reveal>
            );
          })}
        </div>
      </section>

      {between}

      <section id="formulaire" className="mx-auto grid scroll-mt-20 max-w-[1200px] grid-cols-[repeat(auto-fit,minmax(min(100%,380px),1fr))] items-start gap-[clamp(32px,5vw,64px)] px-[clamp(20px,4vw,32px)] py-[clamp(56px,8vw,104px)]">
        <Reveal className="flex flex-col gap-4">
          <h2 className="m-0 text-balance font-serif text-[clamp(30px,3.6vw,46px)] font-medium leading-[1.15]">
            {t.formTitlePre}
            <BrushWord>{t.formTitleWord}</BrushWord>
          </h2>
          <p className="m-0 text-pretty text-[17px] leading-[1.65] text-ink-body">{t.formIntro}</p>
          <Link href={href('/contact')} className="inline-flex min-h-11 items-center gap-1.5 font-bold no-underline">
            <WhatsappLogoIcon size={22} color="#3F5A47" aria-hidden />
            {t.whatsapp}
          </Link>
        </Reveal>

        <Reveal delay={90}>
          {sent ? (
            <div className="flex flex-col items-start gap-3 rounded-[20px] bg-white p-[clamp(20px,3vw,32px)] shadow-ol-sm">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-sage-100">
                <CheckIcon size={28} color="#3F5A47" aria-hidden />
              </span>
              <h3 className="m-0 font-serif text-[24px] font-semibold leading-[1.25]">{t.thanksTitle}</h3>
              <p className="m-0 text-pretty text-[17px] leading-[1.65] text-ink-body">{t.thanksText}</p>
              <button type="button" onClick={() => setSent(false)} className="min-h-11 cursor-pointer border-0 bg-transparent p-0 text-[15px] font-bold text-copper-600">
                {t.sendAnother}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4 rounded-[20px] bg-white p-[clamp(20px,3vw,32px)] shadow-ol-sm">
              <label className="flex flex-col gap-2">
                <span className="text-[15px] font-bold">{t.interestLabel}</span>
                <select
                  value={interest}
                  onChange={(e) => setInterest(e.target.value as Interest)}
                  className="min-h-[52px] rounded-lg border-[1.5px] border-field-line bg-white px-3.5 text-[17px] text-ink outline-none focus:border-copper-600"
                >
                  {(Object.keys(t.interests) as Interest[]).map((k) => (
                    <option key={k} value={k}>
                      {t.interests[k]}
                    </option>
                  ))}
                </select>
              </label>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,180px),1fr))] gap-3.5">
                <label className="flex flex-col gap-2">
                  <span className="text-[15px] font-bold">{t.name}</span>
                  <input
                    name="name"
                    required
                    maxLength={120}
                    className="min-h-[52px] rounded-lg border-[1.5px] border-field-line bg-white px-3.5 text-[17px] text-ink outline-none focus:border-copper-600"
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-[15px] font-bold">{t.email}</span>
                  <input
                    name="email"
                    type="email"
                    required
                    maxLength={180}
                    className="min-h-[52px] rounded-lg border-[1.5px] border-field-line bg-white px-3.5 text-[17px] text-ink outline-none focus:border-copper-600"
                  />
                </label>
              </div>
              {interest === 'partenariat' && (
                <label className="flex flex-col gap-2">
                  <span className="text-[15px] font-bold">{t.org}</span>
                  <input
                    name="org"
                    placeholder={t.orgPlaceholder}
                    maxLength={160}
                    className="min-h-[52px] rounded-lg border-[1.5px] border-field-line bg-white px-3.5 text-[17px] text-ink outline-none focus:border-copper-600"
                  />
                </label>
              )}
              <label className="flex flex-col gap-2">
                <span className="text-[15px] font-bold">{t.message}</span>
                <textarea
                  name="message"
                  required
                  minLength={10}
                  maxLength={4000}
                  rows={4}
                  className="resize-y rounded-lg border-[1.5px] border-field-line p-3.5 text-[17px] leading-[1.5] outline-none focus:border-copper-600"
                />
              </label>
              {error && (
                <p role="alert" className="m-0 text-[14px] font-bold text-error">
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={pending}
                className="inline-flex min-h-[52px] cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full border-0 bg-copper-600 px-7 text-[17px] font-bold text-white hover:bg-copper-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {pending ? t.sending : t.send}
              </button>
              <input type="hidden" name={`${id}-locale`} value={locale} />
            </form>
          )}
        </Reveal>
      </section>
    </>
  );
}
