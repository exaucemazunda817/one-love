'use client';

import { useEffect, useRef, useState } from 'react';

// Apparition au défilement : le bloc est masqué tant qu'il n'a pas atteint
// l'écran, puis glisse vers le haut en apparaissant. Les blocs déjà visibles au
// chargement s'animent aussi, comme sur le site Gospel Nation.
//
// Le masquage est fait en CSS (globals.css, attribut data-reveal) et n'est actif
// que si la classe `js` est posée sur <html> : sans JavaScript, tout est visible.
// Si le JavaScript démarre mais que ce composant n'est jamais hydraté, le CSS
// révèle le bloc tout seul après 4 s.
//
// Deux pièges déjà rencontrés sur les projets précédents :
// 1. Un IntersectionObserver seul laisse du contenu invisible pour de bon quand
//    l'élément est déjà à l'écran au montage (ancre, rechargement en cours de
//    page) ou qu'on le dépasse trop vite. On vérifie donc au montage ET à chaque
//    défilement, et un bloc déjà dépassé est révélé.
// 2. Un filet de sécurité qui révèle tout après un délai supprime l'effet : le
//    nôtre ne concerne que les blocs réellement à l'écran.
type State = 'pending' | 'waiting' | 'shown';

export function Reveal({
  children,
  delay = 0,
  className = ''
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<State>('pending');

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setState('shown');
      return;
    }

    let done = false;
    let frame = 0;
    let safetyNet = 0;
    let observer: IntersectionObserver | undefined;

    // Le haut du bloc est entré dans la partie basse de l'écran, ou il est déjà
    // au-dessus (défilement rapide, ancre, position restaurée).
    // Un bloc sans mise en page (page montée mais pas encore affichée pendant une
    // navigation) a un rectangle nul : il ne compte pas comme « atteint ».
    const reached = () => {
      if (el.getClientRects().length === 0) return false;
      return el.getBoundingClientRect().top < window.innerHeight * 0.92;
    };

    const onScroll = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        if (reached()) reveal();
      });
    };

    const stop = () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      observer?.disconnect();
      window.clearTimeout(safetyNet);
      window.cancelAnimationFrame(frame);
    };

    function reveal() {
      if (done) return;
      done = true;
      stop();
      setState('shown');
    }

    if (reached()) {
      // Laisse le navigateur peindre l'état masqué avant de lancer la transition.
      frame = window.requestAnimationFrame(() => {
        frame = window.requestAnimationFrame(reveal);
      });
      return stop;
    }

    setState('waiting');
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) reveal();
      },
      { threshold: 0.1, rootMargin: '0px 0px -8% 0px' }
    );
    observer.observe(el);

    safetyNet = window.setTimeout(() => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) reveal();
    }, 2500);

    return stop;
  }, []);

  return (
    <div
      ref={ref}
      data-reveal={state}
      className={className}
      style={delay ? ({ '--reveal-delay': `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </div>
  );
}
