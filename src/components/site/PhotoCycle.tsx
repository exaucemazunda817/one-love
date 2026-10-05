'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { PauseIcon, PlayIcon } from '@phosphor-icons/react';

type Photo = { src: string; pos?: string };

const EVERY_MS = 4200;
const FADE_MS = 1200;

// Diaporama en fondu pour les cartes « One Love Boys » et « Centre aéré » de
// l'accueil (05/10/2026) : les photos se succèdent avec un lent zoom continu
// (Ken Burns). Il ne tourne que lorsque la carte est à l'écran et que l'onglet
// est visible ; il reste figé si « Réduire les animations » est activé. Un
// bouton pause est fourni (WCAG 2.2.2, défilement automatique de plus de 5 s).
export function PhotoCycle({ photos, alt, sizes, label }: { photos: Photo[]; alt: string; sizes: string; label: { pause: string; play: string } }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [active, setActive] = useState(false);
  const pausedRef = useRef(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || photos.length < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let visible = false;
    const io = new IntersectionObserver((e) => {
      visible = !!e[0]?.isIntersecting;
      // Activé depuis le rappel (et non directement dans l'effet).
      if (visible) setActive(true);
    }, { threshold: 0.2 });
    io.observe(el);
    const timer = window.setInterval(() => {
      if (visible && !document.hidden && !pausedRef.current) setIndex((i) => (i + 1) % photos.length);
    }, EVERY_MS);
    return () => {
      io.disconnect();
      window.clearInterval(timer);
    };
  }, [photos.length]);

  return (
    <div ref={rootRef} className="absolute inset-0 overflow-hidden">
      {photos.map((p, i) => (
        <div
          key={p.src}
          className="absolute inset-0"
          style={{ opacity: i === index ? 1 : 0, transition: `opacity ${FADE_MS}ms ease-in-out`, zIndex: i === index ? 1 : 0 }}
          aria-hidden={i !== index}
        >
          <Image
            src={p.src}
            alt={i === index ? alt : ''}
            fill
            sizes={sizes}
            loading="lazy"
            className={`object-cover ${active ? 'ol-kenburns' : ''}`}
            style={{ objectPosition: p.pos ?? '50% 35%', animationDelay: `${-i * 3}s` }}
          />
        </div>
      ))}
      {active && (
        <button
          type="button"
          aria-pressed={paused}
          aria-label={paused ? label.play : label.pause}
          onClick={() => {
            pausedRef.current = !paused;
            setPaused(!paused);
          }}
          className="absolute bottom-3 right-3 z-30 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-cream/40 bg-night/60 text-cream backdrop-blur-sm"
        >
          {paused ? <PlayIcon size={18} aria-hidden /> : <PauseIcon size={18} aria-hidden />}
        </button>
      )}
      <div className="absolute inset-x-0 bottom-0 z-[5] flex justify-center gap-1.5 pb-4" aria-hidden>
        {photos.map((p, i) => (
          <span key={p.src} className={`h-1.5 rounded-full bg-cream transition-all duration-500 ${i === index ? 'w-5 opacity-100' : 'w-1.5 opacity-50'}`} />
        ))}
      </div>
    </div>
  );
}
