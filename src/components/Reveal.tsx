'use client';

import { useEffect, useRef, useState } from 'react';

// Apparition au défilement.
//
// Ce composant a été écrit pour qu'il soit IMPOSSIBLE qu'il laisse du contenu
// définitivement invisible. Deux régressions de ce type ont déjà coûté cher
// sur les projets précédents : un `whileInView` seul ne se déclenche jamais
// sur une section franchie trop vite, atteinte par une ancre ou déjà à l'écran
// au chargement, et le contenu restait à opacité 0 pour de bon.
//
// La protection est structurelle, pas un filet de rattrapage : l'état initial
// du rendu est VISIBLE. L'élément n'est masqué qu'une fois que le JavaScript
// s'est exécuté et a constaté qu'il était hors de l'écran. Si le JavaScript
// échoue, ne s'exécute pas ou arrive tard, le contenu est simplement là.
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
  // `null` = le JavaScript n'a pas encore tranché, on rend visible sans animer.
  const [shown, setShown] = useState<boolean | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setShown(true);
      return;
    }

    // Déjà à l'écran au montage : on affiche tout de suite, sans attendre un
    // défilement qui ne viendra peut-être jamais.
    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      setShown(true);
      return;
    }

    setShown(false);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            observer.disconnect();
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px' }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const animating = shown !== null;

  return (
    <div
      ref={ref}
      className={className}
      style={
        animating
          ? {
              opacity: shown ? 1 : 0,
              transform: shown ? 'none' : 'translateY(24px)',
              transition: `opacity 700ms ease ${delay}ms, transform 700ms ease ${delay}ms`
            }
          : undefined
      }
    >
      {children}
    </div>
  );
}
