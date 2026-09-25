'use client';

import { useState } from 'react';
import Image from 'next/image';
import { PlayIcon } from '@phosphor-icons/react';

// Vidéo YouTube chargée seulement au clic : tant que le visiteur ne lance pas
// la lecture, la page n'affiche qu'une miniature locale (public/histoire/
// youtube) et ne contacte pas YouTube, donc aucun cookie ni script tiers.
// Au clic, le lecteur youtube-nocookie remplace la miniature.
export function YouTubeLite({ id, title, playLabel }: { id: string; title: string; playLabel: string }) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
        title={title}
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
        className="absolute inset-0 h-full w-full border-0"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`${playLabel} : ${title}`}
      className="group absolute inset-0 block h-full w-full cursor-pointer border-0 bg-night p-0"
    >
      <Image
        src={`/histoire/youtube/${id}.webp`}
        alt=""
        fill
        sizes="(max-width: 768px) 100vw, 600px"
        className="object-cover opacity-90 transition-opacity duration-300 group-hover:opacity-100"
      />
      <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0)_40%,rgba(10,10,10,.75)_100%)]" />
      <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gold text-night shadow-ol-md transition-transform duration-300 group-hover:scale-110">
        <PlayIcon size={26} weight="fill" aria-hidden />
      </span>
      <span className="absolute bottom-3 left-4 right-4 text-left text-[14px] font-bold leading-[1.35] text-cream">{title}</span>
    </button>
  );
}
