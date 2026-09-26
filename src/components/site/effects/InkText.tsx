'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useScrollProgress } from '@/lib/use-seen';

// Phrase qui « s'encre » lettre par lettre au fil du défilement, puis un ovale
// tracé à la main entoure 2 ou 3 mots (effet repris du manifeste du template
// « Site Immersif »). Les mots à entourer sont notés entre [[ ]].
//
// Le défilement n'est jamais détourné : on lit seulement la position de la
// phrase à l'écran. Rendu serveur et « Réduire les animations » : phrase
// entièrement encrée et ovale déjà tracé.
const OVAL = 'M50,6 C88,4 98,22 97,50 C96,82 76,96 49,95 C16,94 3,76 4,48 C5,18 20,7 50,6 Z';

export function InkText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { before, marked, after } = useMemo(() => {
    const m = text.match(/^([\s\S]*?)\[\[([\s\S]+?)\]\]([\s\S]*)$/);
    return m ? { before: m[1], marked: m[2], after: m[3] } : { before: text, marked: '', after: '' };
  }, [text]);
  const total = before.length + marked.length + after.length;

  // La phrase commence à s'encrer quand son haut passe aux 85 % de l'écran et
  // finit quand son bas atteint les 70 % : l'ovale se trace pendant que la
  // phrase est encore bien en vue.
  const p = useScrollProgress(ref, (r, vh) => (vh * 0.88 - r.top) / (r.height + vh * 0.18));
  const inked = p === null ? total : Math.round(p * total);
  const markEnd = before.length + marked.length;
  const [ovalDrawn, setOvalDrawn] = useState(true);
  useEffect(() => {
    if (p === null) setOvalDrawn(true);
    else setOvalDrawn(inked >= markEnd);
  }, [p, inked, markEnd]);

  let index = 0;
  const chars = (s: string) =>
    s.split('').map((c) => {
      const i = index++;
      return (
        <span key={i} className={i < inked ? 'text-ink' : 'text-ink/20'} style={{ transition: 'color 180ms linear' }}>
          {c}
        </span>
      );
    });

  return (
    <p ref={ref} className={className}>
      <span className="sr-only">{before + marked + after}</span>
      <span aria-hidden>
        {chars(before)}
        {marked && (
          <span className="relative inline-block whitespace-nowrap px-[0.12em]">
            {chars(marked)}
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="pointer-events-none absolute -left-[0.18em] -top-[0.1em] h-[calc(100%+0.2em)] w-[calc(100%+0.36em)] overflow-visible"
            >
              <path
                d={OVAL}
                pathLength={1}
                fill="none"
                stroke="url(#ol-brush)"
                strokeWidth={2.4}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                style={{
                  strokeDasharray: 1,
                  strokeDashoffset: ovalDrawn ? 0 : 1,
                  transition: p === null ? 'none' : 'stroke-dashoffset 900ms cubic-bezier(0.65, 0, 0.35, 1)'
                }}
              />
            </svg>
          </span>
        )}
        {chars(after)}
      </span>
    </p>
  );
}
