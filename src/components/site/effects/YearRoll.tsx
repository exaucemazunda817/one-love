'use client';

import { useEffect, useRef, useState } from 'react';
import { useSeen } from '@/lib/use-seen';

// Année qui roule comme un compteur kilométrique (effet repris du compteur
// d'étapes du template « Site Immersif ») : chaque chiffre est une colonne
// 0-9 qui glisse de `from` jusqu'à `to`. Rendu serveur et « Réduire les
// animations » : l'année finale, directement.
//
// Chaque colonne fait exactement 1em de haut : le parent doit garder
// `line-height: 1` (sinon les chiffres se décalent).
export function YearRoll({ to, from, className }: { to: string; from: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useSeen(ref);
  const [digits, setDigits] = useState(to);
  const [animate, setAnimate] = useState(false);
  const start = from.padStart(to.length, '0').slice(-to.length);

  useEffect(() => {
    if (seen === false) {
      setAnimate(false);
      setDigits(start);
    }
    if (seen === true) {
      // Une frame à l'état de départ, puis on lance la transition.
      const f = requestAnimationFrame(() => {
        setAnimate(true);
        setDigits(to);
      });
      return () => cancelAnimationFrame(f);
    }
  }, [seen, start, to]);

  return (
    <span ref={ref} className={`inline-flex ${className ?? ''}`} aria-label={to}>
      {to.split('').map((finalDigit, i) => {
        const d = Number(digits[i] ?? finalDigit);
        return (
          <span key={i} aria-hidden className="relative inline-block h-[1em] overflow-hidden leading-none">
            {/* Largeur réservée par le chiffre final : la colonne ne bouge pas. */}
            <span className="invisible">{finalDigit}</span>
            <span
              className="absolute left-0 top-0 flex flex-col"
              style={{
                transform: `translateY(-${d}em)`,
                transition: animate ? `transform 1300ms cubic-bezier(0.22, 1, 0.36, 1) ${i * 110}ms` : 'none'
              }}
            >
              {Array.from({ length: 10 }, (_, n) => (
                <span key={n} className="block h-[1em] text-center">
                  {n}
                </span>
              ))}
            </span>
          </span>
        );
      })}
    </span>
  );
}
