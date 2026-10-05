'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { CaretLeftIcon, CaretRightIcon, XIcon } from '@phosphor-icons/react';
import { Reveal } from '@/components/Reveal';
import type { CentreMonth } from '@/lib/centre-aere';

type Locale = 'fr' | 'en';

const T = {
  fr: { all: 'Toutes les années', filter: 'Filtrer par année', open: 'Agrandir la photo', close: 'Fermer', prev: 'Photo précédente', next: 'Photo suivante', count: (n: number) => `${n} photo${n > 1 ? 's' : ''}` },
  en: { all: 'All years', filter: 'Filter by year', open: 'Enlarge photo', close: 'Close', prev: 'Previous photo', next: 'Next photo', count: (n: number) => `${n} photo${n > 1 ? 's' : ''}` }
};

// Galerie d'archives classée par année puis par mois, comme dans le Drive de
// l'association. Agrandissement au clic, flèches et Échap au clavier.
export function PhotoArchive({ months, locale, altPrefix }: { months: CentreMonth[]; locale: Locale; altPrefix: string }) {
  const t = T[locale];
  const years = [...new Set(months.map((m) => m.year))];
  const [year, setYear] = useState<string | null>(null);
  const shown = year ? months.filter((m) => m.year === year) : months;
  const flat = shown.flatMap((m) => m.photos.map((p, i) => ({ ...p, alt: `${altPrefix}, ${m.label[locale]} (${i + 1}/${m.photos.length})` })));
  const [open, setOpen] = useState<number | null>(null);

  const go = useCallback((d: number) => setOpen((o) => (o === null ? o : (o + d + flat.length) % flat.length)), [flat.length]);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null);
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, go]);

  // Position de la première photo de chaque mois dans la liste à plat (agrandissement).
  const starts = shown.map((_, i) => shown.slice(0, i).reduce((n, m) => n + m.photos.length, 0));
  const pill = (active: boolean) =>
    `min-h-11 cursor-pointer rounded-full border-[1.5px] px-4 text-[14px] font-bold transition-colors ${
      active ? 'border-ink bg-ink text-cream' : 'border-field-line bg-transparent text-ink hover:border-ink'
    }`;

  return (
    <>
      <div role="group" aria-label={t.filter} className="flex flex-wrap gap-2">
        <button type="button" aria-pressed={year === null} onClick={() => setYear(null)} className={pill(year === null)}>
          {t.all}
        </button>
        {years.map((y) => (
          <button key={y} type="button" aria-pressed={year === y} onClick={() => setYear(y)} className={pill(year === y)}>
            {y}
          </button>
        ))}
      </div>

      <div key={year ?? 'all'} className="flex flex-col gap-12">
        {shown.map((m, mi) => {
          const start = starts[mi];
          return (
            <section key={m.key} aria-labelledby={`mois-${m.key}`} className="flex flex-col gap-4">
              <Reveal className="flex flex-col gap-1">
                <h3 id={`mois-${m.key}`} className="m-0 flex flex-wrap items-baseline gap-x-3 font-serif text-[clamp(22px,2.4vw,28px)] font-medium text-ink">
                  {m.label[locale]}
                  <span className="font-sans text-[13px] font-bold uppercase tracking-[0.08em] text-ink-soft">{t.count(m.photos.length)}</span>
                </h3>
                <p className="m-0 text-pretty text-[16px] leading-[1.6] text-ink-body">{m.caption[locale]}</p>
              </Reveal>
              <ul className="m-0 grid list-none grid-cols-2 gap-2 p-0 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4">
                {m.photos.map((p, i) => (
                  <li key={p.src}>
                    <Reveal variant="photo" delay={(i % 4) * 110} className="h-full">
                      <button
                        type="button"
                        onClick={() => setOpen(start + i)}
                        aria-label={`${t.open} : ${m.label[locale]}`}
                        className="ol-photo-hover group relative block aspect-[4/5] w-full cursor-zoom-in overflow-hidden rounded-xl border-0 bg-night p-0 shadow-ol-sm"
                      >
                        <Image
                          src={p.src}
                          alt={`${altPrefix}, ${m.label[locale]}`}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 290px"
                          loading="lazy"
                          className="object-cover"
                          style={{ objectPosition: p.pos ?? '50% 35%' }}
                        />
                      </button>
                    </Reveal>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      {open !== null && flat[open] && (
        <div role="dialog" aria-modal="true" aria-label={flat[open].alt} className="fixed inset-0 z-[100] flex items-center justify-center bg-night/95 p-4" onClick={() => setOpen(null)}>
          <div className="relative h-full max-h-[88vh] w-full max-w-[1200px]" onClick={(e) => e.stopPropagation()}>
            <Image src={flat[open].src} alt={flat[open].alt} fill sizes="100vw" quality={85} className="object-contain" priority />
          </div>
          <button type="button" onClick={() => setOpen(null)} aria-label={t.close} className="absolute right-4 top-4 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border-0 bg-cream/15 text-cream hover:bg-cream/25">
            <XIcon size={24} aria-hidden />
          </button>
          <button type="button" onClick={(e) => { e.stopPropagation(); go(-1); }} aria-label={t.prev} className="absolute left-2 top-1/2 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-0 bg-cream/15 text-cream hover:bg-cream/25 sm:left-4">
            <CaretLeftIcon size={24} aria-hidden />
          </button>
          <button type="button" onClick={(e) => { e.stopPropagation(); go(1); }} aria-label={t.next} className="absolute right-2 top-1/2 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-0 bg-cream/15 text-cream hover:bg-cream/25 sm:right-4">
            <CaretRightIcon size={24} aria-hidden />
          </button>
          <p className="absolute bottom-4 left-1/2 m-0 -translate-x-1/2 text-[14px] text-on-dark-1">{open + 1} / {flat.length}</p>
        </div>
      )}
    </>
  );
}
