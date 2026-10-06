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
  const max = Math.max(...steps.map((s) => s.value));

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

      {/* Téléphone / tablette : barres de croissance (06/10/2026, choix de
          Mazunda). La longueur de chaque barre est proportionnelle au chiffre :
          on voit d'un coup d'œil le passage de 3 garçons à une centaine
          d'enfants. Chaque barre se remplit pendant que son chiffre compte. */}
      <ol className="m-0 flex list-none flex-col gap-6 p-0 dk:hidden">
        {steps.map((step, i) => {
          const pct = Math.max(4, Math.round((step.value / max) * 100));
          const last = i === steps.length - 1;
          return (
            <li key={step.label} className="flex flex-col gap-2">
              <div className="flex items-baseline justify-between gap-4">
                <CountUp
                  value={step.value}
                  prefix={step.prefix}
                  className="font-serif text-[clamp(34px,10vw,44px)] font-medium leading-none tabular-nums text-copper-600"
                />
                <span className="text-[12px] font-extrabold uppercase tracking-[0.1em] text-ink-soft">{step.when}</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-copper-600/15" aria-hidden>
                <div
                  className={`h-full rounded-full transition-[width] ease-out ${last ? 'bg-gradient-to-r from-copper-600 to-gold' : 'bg-copper-600'}`}
                  style={{
                    width: drawn ? `${pct}%` : '0%',
                    transitionDuration: '1100ms',
                    transitionDelay: drawn ? `${150 + i * 250}ms` : '0ms'
                  }}
                />
              </div>
              <span className="text-[15px] leading-[1.4] text-ink-body">{step.label}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
