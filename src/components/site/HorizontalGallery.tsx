'use client';

import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';

/**
 * Enveloppe une galerie à défilement horizontal (scroll-snap x) pour qu'un
 * geste de souris/trackpad principalement VERTICAL ne reste jamais bloqué
 * par le moteur de snap horizontal du navigateur — bug reproduit sur ce
 * site : au premier survol des photos, la molette « avalait » un cran sans
 * rien faire défiler, il fallait recommencer. On redirige nous-mêmes tout
 * geste à dominante verticale vers le défilement de la page ; un geste à
 * dominante horizontale (glissé tactile, molette inclinée) continue de
 * faire défiler la galerie normalement, snap compris.
 */
export function HorizontalGallery({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    function onWheel(e: WheelEvent) {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        window.scrollBy(0, e.deltaY);
      }
    }
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
