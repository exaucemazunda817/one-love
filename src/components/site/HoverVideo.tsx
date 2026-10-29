'use client';

import { useEffect, useRef, useState } from 'react';

/// Vidéo qui démarre toute seule quand on « passe dessus ».
///
/// ORDINATEUR (souris) : elle démarre AVEC le son quand la souris passe dessus
/// et s'arrête, revenue au début, quand la souris s'en va.
///
/// TÉLÉPHONE ET TABLETTE (pas de souris) : « passer dessus » = la faire entrer
/// à l'écran en défilant. Elle démarre alors SANS le son (les navigateurs
/// mobiles n'autorisent jamais un son qui démarre seul) et s'arrête quand elle
/// sort de l'écran. Le son se met avec les commandes du lecteur (article) ou en
/// ouvrant l'article (carte).
///
/// LIMITE DES NAVIGATEURS (ordinateur) : un son ne peut démarrer sans clic que
/// si le visiteur a déjà cliqué ou tapé quelque chose sur la page. On essaie
/// donc d'abord AVEC le son ; si le navigateur refuse, on démarre sans le son.
///
/// Deux usages :
///  - `variant="card"` : vidéo d'aperçu posée sur l'image d'une carte, invisible
///    tant qu'elle ne joue pas (l'image reste donc affichée) ;
///  - `variant="player"` : lecteur de l'article, avec ses commandes ; si le
///    visiteur s'en sert, la sortie de la souris ne l'arrête plus.
///
/// Le chargement ne commence qu'au premier survol ou à la première entrée à
/// l'écran (`preload="none"`), jamais avec « économiser les données », « réduire
/// les animations » ou une connexion 2G.
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
    const nav = navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } };
    const slow = nav.connection?.effectiveType === 'slow-2g' || nav.connection?.effectiveType === '2g';
    if (reduce || nav.connection?.saveData || slow) return;

    const onPlaying = () => setPlaying(true);
    const onPause = () => {
      if (variant === 'card') setPlaying(false);
    };
    video.addEventListener('playing', onPlaying);
    video.addEventListener('pause', onPause);

    // Zone de survol ou de visibilité : la carte entière (lien parent) si elle
    // existe, sinon l'élément qui contient la vidéo.
    const host: HTMLElement = (variant === 'card' ? video.closest('a') : null) ?? video.parentElement ?? video;
    const cleanups: Array<() => void> = [];

    if (canHover) {
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
      const onUser = () => {
        touched = true;
      };
      const hoverHost = variant === 'card' ? host : video;
      hoverHost.addEventListener('pointerenter', onEnter);
      hoverHost.addEventListener('pointerleave', onLeave);
      if (variant === 'player') video.addEventListener('pointerdown', onUser);
      cleanups.push(() => {
        hoverHost.removeEventListener('pointerenter', onEnter);
        hoverHost.removeEventListener('pointerleave', onLeave);
        video.removeEventListener('pointerdown', onUser);
      });
    } else {
      // Téléphone : lecture sans le son quand la vidéo est bien à l'écran.
      video.muted = true; // une seule fois : si le visiteur met le son, on n'y touche plus
      let ourPause = false;
      let userPaused = false; // le visiteur a mis pause lui-même : on respecte son choix
      const onPauseByUser = () => {
        if (!ourPause) userPaused = true;
      };
      const onPlay = () => {
        userPaused = false;
      };
      video.addEventListener('pause', onPauseByUser);
      video.addEventListener('play', onPlay);
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
              if (!userPaused && document.visibilityState === 'visible') void video.play().catch(() => undefined);
            } else if (entry.intersectionRatio < 0.25) {
              ourPause = true;
              video.pause();
              if (variant === 'card') video.currentTime = 0;
              ourPause = false;
            }
          }
        },
        { threshold: [0, 0.25, 0.6, 1] }
      );
      observer.observe(host);
      cleanups.push(() => {
        observer.disconnect();
        video.removeEventListener('pause', onPauseByUser);
        video.removeEventListener('play', onPlay);
      });
    }

    return () => {
      video.removeEventListener('playing', onPlaying);
      video.removeEventListener('pause', onPause);
      cleanups.forEach((fn) => fn());
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
