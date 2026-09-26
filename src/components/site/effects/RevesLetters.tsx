'use client';

import { useRef } from 'react';
import { useSeen } from '@/lib/use-seen';

// Les cinq lettres de RÊVES tombent et se posent l'une après l'autre, chacune
// avec son mot dessous (effet repris de la « devise » du template « Site
// Immersif »). Rendu serveur et « Réduire les animations » : tout est posé.
const LETTERS = ['R', 'Ê', 'V', 'E', 'S'];

export function RevesLetters({ words }: { words: readonly string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useSeen(ref);
  const waiting = seen === false;

  return (
    <div ref={ref} className="grid grid-cols-1 gap-1 sm:grid-cols-5 sm:gap-4">
      {LETTERS.map((letter, i) => (
        <div key={letter + i} className="flex min-w-0 items-center gap-4 sm:flex-col sm:gap-2 sm:text-center">
          <span
            aria-hidden
            className="w-[1.1em] flex-none text-center font-serif text-[48px] font-medium leading-none text-copper-600 sm:w-auto sm:text-[clamp(56px,8vw,112px)]"
            style={{
              display: 'inline-block',
              opacity: waiting ? 0 : 1,
              transform: waiting ? 'translateY(-0.6em) rotate(-8deg)' : 'none',
              transition: seen ? `opacity 500ms ease ${i * 130}ms, transform 800ms cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 130}ms` : 'none'
            }}
          >
            {letter}
          </span>
          <span
            className="text-[14px] font-extrabold uppercase tracking-[0.1em] text-ink sm:text-[13px] dk:text-[14px]"
            style={{
              opacity: waiting ? 0 : 1,
              transition: seen ? `opacity 500ms ease ${i * 130 + 450}ms` : 'none'
            }}
          >
            {words[i]}
          </span>
        </div>
      ))}
    </div>
  );
}
