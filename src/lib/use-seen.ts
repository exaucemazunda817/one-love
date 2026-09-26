'use client';

import { useEffect, useState, type RefObject } from 'react';

// Détecte le moment où un élément arrive à l'écran, pour lancer un effet.
// L'effet se REJOUE à chaque retour : dès que l'élément est entièrement sorti
// de l'écran, on repasse à `false` (l'effet revient à son point de départ,
// sans être vu), puis à `true` quand il revient. Demande de Mazunda
// (26/09/2026) : un effet joué une seule fois semblait cassé au retour.
//
// Vérification au montage ET à chaque défilement (pas seulement un
// IntersectionObserver, qui rate les éléments déjà à l'écran ou franchis
// trop vite — piège déjà rencontré sur ce projet).
//
// Renvoie `null` tant que le composant n'est pas monté (rendu serveur : les
// effets affichent alors leur état FINAL, lisible sans JavaScript), `false`
// quand l'effet attend, `true` quand il faut le jouer. Avec « Réduire les
// animations », renvoie `null` en permanence : l'effet reste à son état final.
export function useSeen(ref: RefObject<Element | null>, threshold = 0.88): boolean | null {
  const [seen, setSeen] = useState<boolean | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let current: boolean | null = false;
    let frame = 0;
    const check = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (el.getClientRects().length === 0) return;
        const r = el.getBoundingClientRect();
        const vh = window.innerHeight;
        const inView = r.bottom > 0 && r.top < vh;
        if (current === true && !inView) {
          current = false;
          setSeen(false);
        } else if (current !== true && r.top < vh * threshold && r.bottom > 0) {
          current = true;
          setSeen(true);
        }
      });
    };

    setSeen(false);
    // Deux frames : laisse le navigateur peindre l'état de départ avant de
    // lancer l'effet, même pour un élément déjà à l'écran.
    frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(check);
    });
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check, { passive: true });
    return () => {
      window.removeEventListener('scroll', check);
      window.removeEventListener('resize', check);
      cancelAnimationFrame(frame);
    };
  }, [ref, threshold]);

  return seen;
}

/** Progression (0 → 1) d'un élément à travers l'écran, suivie au défilement. */
export function useScrollProgress(
  ref: RefObject<Element | null>,
  compute: (rect: DOMRect, vh: number) => number
): number | null {
  const [p, setP] = useState<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const v = compute(el.getBoundingClientRect(), window.innerHeight);
        setP(Math.min(1, Math.max(0, v)));
      });
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      cancelAnimationFrame(frame);
    };
    // `compute` est une fonction pure définie une fois par le composant appelant.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);

  return p;
}
