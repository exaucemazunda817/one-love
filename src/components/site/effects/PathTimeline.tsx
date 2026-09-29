'use client';

import { useRef } from 'react';
import { useSeen } from '@/lib/use-seen';
import { CountUp } from '@/components/site/effects/CountUp';

export interface PathStep {
  value: number;
  prefix?: string;
  label: string;
  when: string;
}

/**
 * Frise de progression pour « Le chemin parcouru » (accueil) : une ligne qui
 * se trace de gauche à droite (verticale sur téléphone), un point par étape,
 * les chiffres qui comptent au fil de la ligne — plutôt que quatre chiffres
 * posés à plat, qui laissaient beaucoup de vide et ne montraient pas que ces
 * quatre dates racontent une progression dans le temps (demande de Mazunda,
 * 27/09/2026).
 *
 * L'espacement entre les points est ÉGAL, pas proportionnel aux années : avec
 * seulement quatre étapes (2016, 2020, 2022, 2024), une échelle réelle aurait
 * tassé les trois dernières à droite. Comme sur la page Notre histoire, ce
 * sont des étapes datées, pas une mesure continue.
 *
 * `useSeen` (déjà utilisé par CountUp) rejoue l'effet à chaque retour dans
 * l'écran, comme le reste du site depuis le 26/09/2026 ; « Réduire les
 * animations » affiche directement l'état final (ligne pleine, chiffres au
 * repos), CountUp gérant déjà ce cas de son côté.
 */
export function PathTimeline({ steps }: { steps: PathStep[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useSeen(ref, 0.7);
  const drawn = seen !== false;

  return (
    <div ref={ref}>
      {/* Desktop : ligne horizontale, points espacés également. */}
      <div className="relative hidden dk:block">
        <div className="absolute inset-x-[6%] top-[11px] h-px bg-card-line" />
        <div
          className="absolute left-[6%] top-[11px] h-px bg-gradient-to-r from-copper-600 to-gold transition-[width] ease-out"
          style={{ width: drawn ? '88%' : '0%', transitionDuration: '1400ms' }}
        />
        <div className="relative grid grid-cols-4">
          {steps.map((step, i) => (
            <div key={step.label} className="flex flex-col items-center gap-5 px-3 text-center">
              <span
                className="h-[9px] w-[9px] flex-none rounded-full bg-gold shadow-[0_0_0_4px_var(--cream)] transition-transform ease-out"
                style={{
                  transform: drawn ? 'scale(1)' : 'scale(0)',
                  transitionDuration: '400ms',
                  transitionDelay: drawn ? `${220 + i * 300}ms` : '0ms'
                }}
              />
              <div
                className="flex flex-col items-center gap-1.5 transition-all ease-out"
                style={{
                  opacity: drawn ? 1 : 0,
                  transform: drawn ? 'translateY(0)' : 'translateY(10px)',
                  transitionDuration: '500ms',
                  transitionDelay: drawn ? `${280 + i * 300}ms` : '0ms'
                }}
              >
                <CountUp
                  value={step.value}
                  prefix={step.prefix}
                  className="font-serif font-medium leading-none text-copper-600"
                  style={{ fontSize: `${28 + i * 6}px` }}
                />
                <span className="max-w-[160px] text-[14px] leading-[1.3] text-ink-body">{step.label}</span>
                <span className="text-[12px] font-extrabold uppercase tracking-[0.1em] text-ink-soft">
                  {step.when}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Téléphone / tablette : ligne verticale à gauche. */}
      <div className="relative flex flex-col gap-7 pl-6 dk:hidden">
        <div className="absolute bottom-[6px] left-[3px] top-[6px] w-px bg-card-line" />
        <div
          className="absolute left-[3px] top-[6px] w-px bg-gradient-to-b from-copper-600 to-gold transition-[height] ease-out"
          style={{ height: drawn ? '100%' : '0%', transitionDuration: '1400ms' }}
        />
        {steps.map((step, i) => (
          <div key={step.label} className="relative flex items-center gap-4">
            <span
              className="absolute left-[-24px] h-[7px] w-[7px] flex-none rounded-full bg-gold shadow-[0_0_0_3px_var(--cream)] transition-transform ease-out"
              style={{
                transform: drawn ? 'scale(1)' : 'scale(0)',
                transitionDuration: '350ms',
                transitionDelay: drawn ? `${180 + i * 220}ms` : '0ms'
              }}
            />
            <div
              className="flex items-baseline gap-3 transition-all ease-out"
              style={{
                opacity: drawn ? 1 : 0,
                transform: drawn ? 'translateX(0)' : 'translateX(-8px)',
                transitionDuration: '450ms',
                transitionDelay: drawn ? `${220 + i * 220}ms` : '0ms'
              }}
            >
              <CountUp
                value={step.value}
                prefix={step.prefix}
                className="flex-none font-serif text-[30px] font-medium leading-none text-copper-600"
              />
              <span className="flex flex-col gap-0.5">
                <span className="text-[14px] leading-[1.3] text-ink-body">{step.label}</span>
                <span className="text-[12px] font-extrabold uppercase tracking-[0.1em] text-ink-soft">
                  {step.when}
                </span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
