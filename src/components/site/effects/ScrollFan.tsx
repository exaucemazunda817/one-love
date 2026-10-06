'use client';

import { Children, useEffect, useRef, type ReactNode } from 'react';

// Cartes qui se déploient en éventail au fil du défilement : chacune part
// décalée vers l'extérieur (selon sa place par rapport au centre de la
// rangée), plus bas, légèrement pivotée et réduite, puis se pose à sa place
// quand son haut atteint 55 % de la hauteur de l'écran. Lié à la position de
// défilement (lue seulement, jamais pilotée — règle du site).
//
// Rendu serveur et « Réduire les animations » = cartes à leur place finale.
// On mesure l'enveloppe (jamais transformée) et on transforme l'intérieur :
// sinon la transformation fausserait la mesure suivante.
export function ScrollFan({ children, className }: { children: ReactNode; className?: string }) {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const list = listRef.current;
    // Sur téléphone la rangée défile à l'horizontale (.ol-swipe) : pas d'éventail.
    if (!list || window.matchMedia('(prefers-reduced-motion: reduce), (max-width: 767px)').matches) return;

    const slots = Array.from(list.children) as HTMLElement[];
    const inners = slots.map((slot) => slot.firstElementChild as HTMLElement);
    let frame = 0;

    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      const listRect = list.getBoundingClientRect();
      const listCenter = listRect.left + listRect.width / 2;
      slots.forEach((slot, i) => {
        const r = slot.getBoundingClientRect();
        const p = Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.45)));
        const k = 1 - p * p * (3 - 2 * p);
        const dx = r.left + r.width / 2 - listCenter;
        const side = Math.abs(dx) < 8 ? 0 : Math.sign(dx);
        const inner = inners[i];
        if (!inner) return;
        inner.style.transform = k
          ? `translate3d(${dx * 0.35 * k}px, ${70 * k}px, 0) rotate(${side * 6 * k}deg) scale(${1 - 0.08 * k})`
          : '';
        inner.style.opacity = k ? String(1 - 0.65 * k) : '';
      });
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    for (const inner of inners) if (inner) inner.style.willChange = 'transform, opacity';
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      for (const inner of inners) {
        if (!inner) continue;
        inner.style.transform = '';
        inner.style.opacity = '';
        inner.style.willChange = '';
      }
    };
  }, []);

  return (
    <div ref={listRef} className={className}>
      {Children.map(children, (child) => (
        <div>
          <div className="h-full">{child}</div>
        </div>
      ))}
    </div>
  );
}
