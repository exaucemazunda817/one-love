'use client';

import { useId, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  CheckIcon,
  CaretDownIcon,
  ShieldCheckIcon,
  EnvelopeOpenIcon,
  ImageIcon,
  PaintBrushIcon,
  FileTextIcon,
  ArrowRightIcon
} from '@phosphor-icons/react';
import { Reveal } from '@/components/Reveal';
import { SwipeDots } from '@/components/site/SwipeDots';
import { Brush, BrushLast } from '@/components/site/ui';
import type { Currency } from '@/lib/donation-ui';
import { SYMBOL } from '@/lib/donation-ui';
import { CURRENCIES, SPONSOR_FROM, formatMoney } from '@/lib/money';

const CHARTER_PHOTO = '/hero-desktop/centre-aere-2024-02-ol-photo-006.webp';
import type { PlanPrices } from '@/lib/sponsorship';
import { localeHref, type Locale } from '@/lib/i18n';

type Mode = 'child' | 'prog';

const RECEIVE_ICONS = [EnvelopeOpenIcon, ImageIcon, PaintBrushIcon, FileTextIcon];

export interface SponsorText {
  howTitle: string;
  how: { n: string; t: string; d: string }[];
  formulesTitle: string;
  formulesSubtitle: string;
  modes: Record<Mode, string>;
  plansChild: { name: string; prices: PlanPrices; tag: string; items: string[] }[];
  plansProg: { name: string; prices: PlanPrices; tag: string; items: string[] }[];
  perMonth: string;
  monthUnit: string;
  receiveTitle: string;
  receiveAlt: string;
  receive: { t: string; d: string }[];
  charterTitle: string;
  charterIntro: string;
  charter: string[];
  faqTitle: string;
  faq: { q: string; a: string }[];
  inscriptionTitlePre: string;
  inscriptionTitleWord: string;
  inscriptionTitlePost: string;
  inscriptionIntro: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  optional: string;
  charterAgreePre: string;
  charterAgreeLink: string;
  charterAgreePost: string;
  submitLabelPrefix: string;
  payNote: string;
  customLabel: string;
  customHint: string;
  /** Message « dès 5 $ » ; {montant} est remplacé dans la devise choisie. */
  fromNote: string;
  currencyLabel: string;
  currencyHint: string;
  error: string;
  continueLabel: string;
  continueNote: string;
}


export function SponsorInteractive({ locale, t }: { locale: Locale; t: SponsorText }) {
  const id = useId();
  const [cur, setCur] = useState<Currency>('EUR');
  // Parrainage d'un enfant uniquement : l'option programme a été retirée (05/10/2026).
  const [plan, setPlan] = useState(1);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const plans = t.plansChild;
  const chosen = plans[plan];
  const fromNote = t.fromNote.replace('{montant}', formatMoney(SPONSOR_FROM[cur], cur, locale));
  // Le paiement se fait dans le formulaire unique de la page « Faire un don »
  // (08/10/2026) : le parrain y arrive avec sa formule et sa devise déjà choisies.
  const formHref = `${localeHref('/dons', locale)}?affectation=parrainage&formule=${plan}&devise=${cur}`;

  return (
    <>
      {/* Comment ça marche */}
      <section id="comment" className="mx-auto flex max-w-[1200px] scroll-mt-[var(--header-clear)] flex-col gap-10 px-[clamp(20px,4vw,32px)] pt-[clamp(56px,8vw,104px)] pb-[clamp(32px,5vw,56px)]">
        <Reveal>
          <h2 className="m-0 font-serif text-[clamp(30px,3.6vw,46px)] font-medium leading-[1.15]"><BrushLast text={t.howTitle} /></h2>
        </Reveal>
        {/* Sur téléphone, les trois étapes deviennent des cartes qu'on fait
            glisser à l'horizontale (demande de Mazunda du 07/10/2026), comme
            les autres listes de cartes du site ; grille inchangée au-dessus. */}
        <ol className="ol-swipe m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-x-10 gap-y-8 p-0">
          {t.how.map((h, i) => (
            <li key={h.n} className="flex">
              <Reveal delay={i * 90} className="flex w-full flex-col gap-3 max-md:rounded-card max-md:border max-md:border-card-line max-md:bg-white max-md:p-6">
                <div className="flex items-center gap-3.5">
                  <span className="font-serif text-[48px] leading-none text-copper-600">{h.n}</span>
                  <Brush fill="var(--clay)" className="h-2 flex-1" />
                </div>
                <h3 className="m-0 font-serif text-[24px] font-semibold">{h.t}</h3>
                <p className="m-0 text-[17px] leading-[1.6] text-ink-body">{h.d}</p>
              </Reveal>
            </li>
          ))}
        </ol>
        <SwipeDots count={t.how.length} label={t.howTitle} />
      </section>

      {/* Formules */}
      <section id="formules" className="scroll-mt-[var(--header-clear)] bg-sand">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-7 px-[clamp(16px,4vw,32px)] pt-[clamp(56px,8vw,104px)] pb-[clamp(32px,5vw,56px)]">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <Reveal className="flex max-w-[620px] flex-col gap-2.5">
              <h2 className="m-0 font-serif text-[clamp(30px,3.6vw,46px)] font-medium leading-[1.15]"><BrushLast text={t.formulesTitle} /></h2>
              <p className="m-0 text-[17px] leading-[1.6] text-ink-body">{t.formulesSubtitle}</p>
            </Reveal>
          </div>

          {/* Parrainage = un enfant uniquement (décision du 05/10/2026) : le choix
              « Soutenir un programme » a été retiré. */}
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-4">
            {plans.map((p, i) => (
              <button
                key={p.name}
                type="button"
                role="radio"
                aria-checked={plan === i}
                onClick={() => setPlan(i)}
                className={`ol-spot relative flex cursor-pointer flex-col gap-3.5 rounded-card border-2 px-6 py-7 text-left ${
                  plan === i ? 'border-copper-600 bg-white shadow-ol-hover' : 'border-card-line bg-sand'
                }`}
              >
                <span className="flex w-full items-center justify-between gap-2">
                  <b className="text-[15px] tracking-[0.02em]">{p.name}</b>
                  {p.tag && <span className="rounded-full bg-sage-700 px-2.5 py-1 text-[12px] font-extrabold text-white">{p.tag}</span>}
                </span>
                <span className="flex items-baseline gap-1.5">
                  <span className="font-serif text-[44px] font-medium leading-none">{formatMoney(p.prices[cur], cur, locale)}</span>
                  <span className="text-[15px] text-ink-soft">{t.perMonth}</span>
                </span>
                <span className="flex flex-col gap-2">
                  {p.items.map((it) => (
                    <span key={it} className="flex items-start gap-2.5 text-[15px] leading-[1.45]">
                      <CheckIcon size={18} className="text-sage-700 mt-0.5 flex-none" aria-hidden />
                      {it}
                    </span>
                  ))}
                </span>
              </button>
            ))}
          </div>
          {/* Sous les formules, juste avant le formulaire : les prix ne limitent
              pas la contribution (demande de Mazunda du 07/10/2026). */}
          <p className="m-0 rounded-lg bg-white/70 px-4 py-3 text-[16px] font-semibold leading-[1.55] text-copper-700">{fromNote}</p>
        </div>
      </section>

      {/* Inscription : juste après le choix de la formule, pour qu'on voie
          tout de suite ce qu'on a choisi (demande de Mazunda du 07/10/2026). */}
      <section id="inscription" className="scroll-mt-[var(--header-clear)] bg-sand">
        <div className="mx-auto grid max-w-[1200px] grid-cols-[repeat(auto-fit,minmax(min(100%,380px),1fr))] items-start gap-[clamp(32px,5vw,64px)] px-[clamp(16px,4vw,32px)] pt-[clamp(8px,2vw,16px)] pb-[clamp(56px,8vw,104px)]">
          <Reveal className="flex flex-col gap-4">
            <h2 className="m-0 font-serif text-[clamp(30px,3.6vw,46px)] font-medium leading-[1.15]">
              {t.inscriptionTitlePre}
              <span className="relative inline-block">
                {t.inscriptionTitleWord}
                <Brush className="absolute bottom-[-0.12em] left-[-3%] h-[0.22em] w-[106%]" />
              </span>
              {t.inscriptionTitlePost}
            </h2>
            <p className="max-w-measure m-0 text-[17px] leading-[1.6] text-ink-body">{t.inscriptionIntro}</p>
          </Reveal>

          <Reveal delay={90}>
            {/* Un seul formulaire de don pour tout le site (08/10/2026, demande
                de Mazunda) : ce bouton ouvre la page « Faire un don » avec
                « Parrainer un enfant », la formule et la devise déjà cochées. */}
            <div className="relative flex flex-col gap-4 rounded-card bg-white p-[clamp(20px,3vw,32px)] shadow-ol-lg">
              <span className="ol-beam" aria-hidden />
              <div className="flex flex-col gap-1">
                <span className="text-[14px] font-bold text-ink-soft">{chosen.name}</span>
                <span className="font-serif text-[36px] font-medium leading-none">
                  {formatMoney(chosen.prices[cur], cur, locale)}
                  <span className="text-[16px] text-ink-soft"> / {t.monthUnit}</span>
                </span>
              </div>
              <fieldset className="m-0 flex flex-col gap-2 border-0 p-0">
                <legend className="mb-2 p-0 text-[15px] font-bold">{t.currencyLabel}</legend>
                <div className="flex gap-2">
                  {CURRENCIES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      aria-pressed={cur === c}
                      onClick={() => setCur(c)}
                      className={`min-h-11 min-w-[64px] cursor-pointer rounded-md border-[1.5px] px-3 text-[15px] font-bold ${
                        cur === c ? 'border-ink bg-ink text-cream' : 'border-field-line bg-white text-ink'
                      }`}
                    >
                      {SYMBOL[c]}
                    </button>
                  ))}
                </div>
                <span className="text-[13px] text-ink-soft">{t.currencyHint}</span>
              </fieldset>
              <Link
                href={formHref}
                className="inline-flex min-h-[54px] items-center justify-center gap-2 rounded-full bg-copper-600 px-6 text-center text-[17px] font-bold text-white no-underline hover:bg-copper-700 hover:text-white"
              >
                {t.continueLabel}
                <ArrowRightIcon aria-hidden />
              </Link>
              <span className="text-[13px] leading-[1.5] text-ink-soft">{t.continueNote}</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Ce que vous recevez */}
      <section className="mx-auto grid max-w-[1200px] grid-cols-[repeat(auto-fit,minmax(min(100%,380px),1fr))] items-center gap-[clamp(32px,5vw,72px)] px-[clamp(20px,4vw,32px)] pt-[clamp(32px,5vw,56px)] pb-[clamp(56px,8vw,104px)]">
        <Reveal className="relative aspect-[4/5] max-h-[560px] overflow-hidden rounded-card">
          <Image src="/photos/photo-mains.jpg" alt={t.receiveAlt} fill sizes="(max-width: 1200px) 100vw, 560px" className="photo-tone object-cover" />
        </Reveal>
        <Reveal delay={90} className="flex flex-col gap-6">
          <h2 className="m-0 font-serif text-[clamp(30px,3.6vw,46px)] font-medium leading-[1.15]"><BrushLast text={t.receiveTitle} /></h2>
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
      <section id="charte" className="mx-auto scroll-mt-[var(--header-clear)] px-[clamp(12px,3vw,32px)] pb-[clamp(56px,8vw,104px)]">
        <Reveal className="relative mx-auto grid max-w-[1200px] grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] gap-x-14 gap-y-8 overflow-hidden rounded-card bg-night p-[clamp(28px,5vw,56px)] text-cream max-md:pt-[230px]">
          {/* Photo de fond (07/10/2026, demande de Mazunda) : en haut sur
              téléphone, très atténuée derrière tout le cadre sur ordinateur
              pour que la liste de la charte reste lisible. */}
          <Image src={CHARTER_PHOTO} alt="" fill sizes="(max-width: 767px) 100vw, 1200px" className="ol-cb-photo ol-cb-photo-soft photo-tone object-cover object-[50%_30%]" />
          <div className="relative flex flex-col gap-3.5">
            <ShieldCheckIcon size={40} className="text-sage-300" aria-hidden />
            <h2 className="m-0 font-serif text-[clamp(28px,3.2vw,40px)] font-medium leading-[1.2]">{t.charterTitle}</h2>
            <p className="m-0 text-[17px] leading-[1.6] text-on-dark-1">{t.charterIntro}</p>
          </div>
          <div className="relative flex flex-col gap-3.5">
            {t.charter.map((c) => (
              <div key={c} className="flex items-start gap-3 text-[16px] leading-[1.55]">
                <Brush fill="var(--gold)" className="mt-2.5 h-2 w-[22px] flex-none" />
                <span>{c}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Questions fréquentes */}
      <div className="overflow-x-clip">
      <section id="faq" className="mx-auto max-w-[1000px] scroll-mt-[var(--header-clear)] px-[clamp(20px,4vw,32px)] pb-[clamp(56px,8vw,104px)]">
        <Reveal variant="scale" repeat className="mb-8 text-center">
          <h2 className="m-0 font-serif text-[clamp(28px,3.2vw,40px)] font-medium leading-[1.15]"><BrushLast text={t.faqTitle} /></h2>
        </Reveal>
        <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
          {t.faq.map((f, i) => {
            const open = faqOpen === i;
            const panelId = `${id}-faq-${i}`;
            return (
              <Reveal key={f.q} variant={i % 2 === 0 ? 'left' : 'right'} repeat>
                <div
                  className={`overflow-hidden rounded-card border border-card-line shadow-ol-sm transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] hover:shadow-ol-md ${
                    i % 2 === 0 ? 'bg-white' : 'bg-sand'
                  } ${open ? 'ring-2 ring-copper-600/30' : ''}`}
                >
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => setFaqOpen(open ? null : i)}
                    className="group flex min-h-[64px] w-full cursor-pointer items-start justify-between gap-4 border-0 bg-transparent px-5 py-4 text-left sm:px-6"
                  >
                    <span className="text-[16px] font-bold leading-[1.3] text-ink transition-colors group-hover:text-copper-700">{f.q}</span>
                    <CaretDownIcon
                      size={20}
                      aria-hidden
                      className={`mt-0.5 flex-none text-ink-soft transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:text-copper-600 ${open ? 'rotate-180' : ''}`}
                    />
                  </button>
                  <div
                    id={panelId}
                    role="region"
                    aria-hidden={!open}
                    className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                      open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="mx-5 border-t border-card-line pb-5 pt-4 sm:mx-6 sm:pb-6">
                        <p className="m-0 text-[15px] leading-[1.6] text-ink-body">{f.a}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>
      </div>

    </>
  );
}
