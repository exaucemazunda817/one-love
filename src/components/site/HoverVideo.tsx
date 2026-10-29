'use client';

import { useEffect, useRef, useState } from 'react';

/// Vidéo qui démarre toute seule, AVEC le son, quand la souris passe dessus
/// (ordinateur uniquement : un téléphone n'a pas de survol, on y touche pour
/// lancer). Elle s'arrête et revient au début quand la souris s'en va.
///
/// LIMITE DES NAVIGATEURS : un son ne peut démarrer sans clic que si le
/// visiteur a déjà cliqué, touché ou tapé quelque chose sur la page (Chrome,
/// Firefox, Safari). On essaie donc d'abord AVEC le son ; si le navigateur
/// refuse (premier survol d'une page ouverte directement), la vidéo démarre
/// SANS le son, et le visiteur le met avec les commandes (lecteur) ou en
/// entrant dans l'article (carte). Un clic dans le menu ou sur un lien du site
/// suffit ensuite pour que le son marche partout.
///
/// Deux usages :
///  - `variant="card"` : vidéo d'aperçu posée sur l'image d'une carte
///    (le survol de TOUTE la carte, le lien parent, la lance) ; invisible tant
///    qu'elle ne joue pas, l'image reste donc affichée.
///  - `variant="player"` : lecteur de l'article, avec ses commandes ; si le
///    visiteur s'en sert, le survol ne l'arrête plus.
///
/// Le chargement ne commence qu'au premier survol (`preload="none"`), jamais
/// avec « économiser les données », ni avec « réduire les animations ».
export function HoverVideo({
  src,
  poster,
  label,
  variant,
  className = ''
}: {
  src: string;
  poster?: string;
  label: string;
  variant: 'card' | 'player';
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
    if (!canHover || reduce || nav.connection?.saveData) return;

    // Zone de survol : la carte entière (lien parent) ou la vidéo elle-même.
    const host: HTMLElement = variant === 'card' ? (video.closest('a') ?? video) : video;
    let touched = false; // le visiteur a utilisé les commandes : on ne l'arrête plus
    let inside = false;

    const start = async () => {
      video.muted = false;
      try {
        await video.play();
      } catch {
        // Son refusé par le navigateur : on démarre sans le son.
        video.muted = true;
        try {
          await video.play();
        } catch {
          /* rien à faire */
        }
      }
      // La souris est repartie pendant le chargement : on arrête.
      if (!inside && !touched) video.pause();
    };
    const onEnter = () => {
      inside = true;
      void start();
    };
    const onLeave = () => {
      inside = false;
      if (touched) return;
      video.pause();
      video.currentTime = 0;
      setPlaying(false);
    };
    const onPlaying = () => setPlaying(true);
    const onPause = () => {
      if (variant === 'card') setPlaying(false);
    };
    const onUser = () => {
      touched = true;
    };

    host.addEventListener('pointerenter', onEnter);
    host.addEventListener('pointerleave', onLeave);
    video.addEventListener('playing', onPlaying);
    video.addEventListener('pause', onPause);
    if (variant === 'player') video.addEventListener('pointerdown', onUser);
    return () => {
      host.removeEventListener('pointerenter', onEnter);
      host.removeEventListener('pointerleave', onLeave);
      video.removeEventListener('playing', onPlaying);
      video.removeEventListener('pause', onPause);
      video.removeEventListener('pointerdown', onUser);
    };
  }, [variant]);

  if (variant === 'card') {
    return (
      <video
        ref={ref}
        loop
        playsInline
        preload="none"
        aria-hidden
        tabIndex={-1}
        className={`pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${playing ? 'opacity-100' : 'opacity-0'} ${className}`}
      >
        <source src={src} type="video/mp4" />
      </video>
    );
  }

  return (
    <video
      ref={ref}
      loop
      controls
      playsInline
      preload="none"
      poster={poster}
      aria-label={label}
      className={`absolute inset-0 h-full w-full object-cover ${className}`}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
