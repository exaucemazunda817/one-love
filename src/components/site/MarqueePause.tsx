'use client';

import { useState } from 'react';
import { PauseIcon, PlayIcon } from '@phosphor-icons/react';
import type { Locale } from '@/lib/i18n';

// Bouton pause de la bande des partenaires (WCAG 2.2.2 : un mouvement
// automatique de plus de 5 secondes doit pouvoir être arrêté sans souris ;
// jusqu'ici seule la pause au survol existait). La bande se met aussi en
// pause quand un de ses éléments reçoit le focus (voir globals.css).
// Masqué quand « Réduire les animations » est actif : il n'y a rien à arrêter.
export function MarqueePause({ locale }: { locale: Locale }) {
  const [paused, setPaused] = useState(false);
  const label =
    locale === 'fr'
      ? paused
        ? 'Reprendre le défilement des partenaires'
        : 'Mettre en pause le défilement des partenaires'
      : paused
        ? 'Resume the partners scroll'
        : 'Pause the partners scroll';

  return (
    <button
      type="button"
      aria-pressed={paused}
      aria-label={label}
      onClick={(event) => {
        const next = !paused;
        setPaused(next);
        event.currentTarget
          .closest('section')
          ?.querySelector('.ol-marquee')
          ?.setAttribute('data-paused', String(next));
      }}
      className="ol-marquee-pause absolute right-[clamp(12px,3vw,32px)] top-2 z-10 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-card-line bg-white/70 text-ink"
    >
      {paused ? <PlayIcon size={20} aria-hidden /> : <PauseIcon size={20} aria-hidden />}
    </button>
  );
}
