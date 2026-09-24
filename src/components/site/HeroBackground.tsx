'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { HERO_PHOTOS } from '@/lib/hero-photos';

type Photo = { src: string; position: string };
type Layer = 0 | 1;

const FIRST_DELAY_MS = 5000;
const EVERY_MS = 6000;
const FADE_MS = 1400;

// Image de fond d'un bandeau : la photo de la page s'affiche d'abord (rendu
// serveur, sans attente), puis une photo d'enfant tirée au hasard passe par-
// dessus en fondu toutes les quelques secondes. Aucune photo ne revient avant
// que les autres soient passées (tirage sans remise).
//
// Le conteneur est isolé (`isolate`) : l'empilement des deux calques reste
// enfermé dedans et ne passe jamais par-dessus le dégradé ni le texte du bandeau.
// Deux calques permanents échangent leurs rôles : aucun élément n'est recréé
// pendant la transition, donc aucun clignotement.
//
// Rien ne tourne si le visiteur a demandé moins d'animations, si le mode
// économie de données est actif, si la connexion est très lente, si l'onglet
// est masqué, ou si ce bandeau n'est pas affiché (l'accueil en contient deux,
// dont un est toujours masqué).
export function HeroBackground({
  src,
  alt,
  position = '50% 35%'
}: {
  src: string;
  alt: string;
  position?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [photos, setPhotos] = useState<[Photo, Photo | null]>([{ src, position }, null]);
  const [front, setFront] = useState<Layer>(0);
  const [fading, setFading] = useState(false);
  const frontRef = useRef<Layer>(0);
  const photosRef = useRef<[Photo, Photo | null]>([{ src, position }, null]);
  const bag = useRef<Photo[]>([]);
  const swapTimer = useRef(0);

  useEffect(() => {
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      conn?.saveData ||
      conn?.effectiveType === 'slow-2g' ||
      conn?.effectiveType === '2g'
    ) {
      return;
    }

    let timer = 0;
    let stopped = false;

    const nextPhoto = (): Photo => {
      const shownSrc = photosRef.current[frontRef.current]?.src;
      if (bag.current.length === 0) {
        const pool = HERO_PHOTOS.filter((p) => p.src !== shownSrc).map((p) => ({ ...p }));
        for (let i = pool.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [pool[i], pool[j]] = [pool[j], pool[i]];
        }
        bag.current = pool;
      }
      return bag.current.shift() as Photo;
    };

    const tick = () => {
      if (stopped) return;
      const el = rootRef.current;
      const visibleNow = el && el.getClientRects().length > 0 && !document.hidden;
      if (visibleNow) {
        let photo = nextPhoto();
        if (photo.src === photosRef.current[frontRef.current]?.src) photo = nextPhoto();
        const back: Layer = frontRef.current === 0 ? 1 : 0;
        const next: [Photo, Photo | null] = [...photosRef.current] as [Photo, Photo | null];
        next[back] = photo;
        photosRef.current = next;
        setFading(false);
        setPhotos(next);
      }
      timer = window.setTimeout(tick, EVERY_MS);
    };

    timer = window.setTimeout(tick, FIRST_DELAY_MS);
    return () => {
      stopped = true;
      window.clearTimeout(timer);
      window.clearTimeout(swapTimer.current);
    };
  }, []);

  // Photo entrante chargée : fondu, puis son calque devient le calque de devant.
  const handleLoaded = (index: Layer) => {
    if (index === frontRef.current) return;
    window.requestAnimationFrame(() => setFading(true));
    window.clearTimeout(swapTimer.current);
    swapTimer.current = window.setTimeout(() => {
      frontRef.current = index;
      setFront(index);
      setFading(false);
    }, FADE_MS + 100);
  };

  return (
    <div ref={rootRef} className="absolute inset-0 isolate">
      {([0, 1] as Layer[]).map((i) => {
        const photo = photos[i];
        if (!photo) return null;
        const isFront = i === front;
        const animating = !isFront && fading;
        return (
          <Image
            key={i}
            src={photo.src}
            alt={isFront && photo.src === src ? alt : ''}
            fill
            priority={i === 0}
            sizes="100vw"
            onLoad={() => handleLoaded(i)}
            className="photo-tone object-cover"
            style={{
              objectPosition: photo.position,
              zIndex: isFront ? 0 : 10,
              opacity: isFront || animating ? 1 : 0,
              transition: animating ? `opacity ${FADE_MS}ms ease-in-out` : 'none'
            }}
          />
        );
      })}
    </div>
  );
}
