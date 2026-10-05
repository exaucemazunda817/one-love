'use client';

import { useEffect } from 'react';

// Halo cuivre qui suit la souris sur les cartes (.ol-spot), repris de l'effet
// « Spotlight Card » de SUN Market (05/10/2026). Un seul écouteur pour tout le
// site, qui place la position du halo sur la carte survolée.
export function SpotlightTracker() {
  useEffect(() => {
    if (!window.matchMedia('(hover: hover)').matches) return;
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      const card = (e.target as Element | null)?.closest?.('.ol-spot') as HTMLElement | null;
      if (!card) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--ol-mx', `${e.clientX - r.left}px`);
        card.style.setProperty('--ol-my', `${e.clientY - r.top}px`);
      });
    };
    document.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      document.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(frame);
    };
  }, []);
  return null;
}
