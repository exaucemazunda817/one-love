'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import Image from 'next/image';

// Ouverture de la page « Notre histoire » (effet repris du « zoom texte » du
// template « Site Immersif ») : une photo naît entre les deux mots du titre,
// les écarte, puis grandit jusqu'au plein écran pendant qu'on fait défiler.
//
// La section est plus haute que l'écran et son contenu reste épinglé
// (position: sticky) : le défilement de la page n'est JAMAIS détourné, on lit
// seulement sa position. Avec « Réduire les animations », on affiche le
// bandeau classique (`fallback`) à la place.
const clamp = (v: number) => Math.min(1, Math.max(0, v));
const seg = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function HistoryHero({
  eyebrow,
  wordA,
  wordB,
  intro,
  image,
  imageAlt,
  fallback
}: {
  eyebrow: string;
  wordA: string;
  wordB: string;
  intro: string;
  image: string;
  imageAlt: string;
  fallback: ReactNode;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const gapRef = useRef<HTMLSpanElement>(null);
  const [gapX, setGapX] = useState(0);
  const [reduced, setReduced] = useState(false);
  const [p, setP] = useState(0);
  const [vp, setVp] = useState({ w: 1280, h: 800 });

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setReduced(true);
      return;
    }
    const el = sectionRef.current;
    if (!el) return;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const travel = r.height - window.innerHeight;
        setP(travel > 0 ? clamp(-r.top / travel) : 1);
        setVp({ w: window.innerWidth, h: window.innerHeight });
        // Centre de l'espace entre les deux mots, par rapport au centre de
        // l'écran : les mots n'ont pas la même longueur, cet espace n'est
        // donc pas au milieu. La photo y naît, puis glisse vers le centre.
        const g = gapRef.current?.getBoundingClientRect();
        if (g) setGapX(g.left + g.width / 2 - window.innerWidth / 2);
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
  }, []);

  if (reduced) return <>{fallback}</>;

  // Taille du titre : la photo « naît » à la hauteur des lettres.
  const fontPx = Math.min(Math.max(vp.w * 0.09, 30), 132);
  const small = { w: fontPx * 1.5, h: fontPx * 0.95 };
  // 0 → 0,18 : la photo s'ouvre entre les mots ; 0,18 → 0,8 : plein écran.
  const born = ease(seg(p, 0, 0.18));
  const grow = ease(seg(p, 0.18, 0.8));
  const gapW = small.w * born;
  const w = gapW + (vp.w - gapW) * grow;
  const h = small.h * born + (vp.h - small.h * born) * grow;
  const push = (w - gapW) / 2;
  const wordsOpacity = 1 - seg(p, 0.35, 0.6);
  const topOpacity = 1 - seg(p, 0.02, 0.2);
  const introOpacity = seg(p, 0.78, 0.95);

  return (
    <section ref={sectionRef} aria-label={`${wordA} ${wordB}`} className="relative h-[230svh] bg-night text-cream">
      <div className="sticky top-0 flex h-svh flex-col items-center justify-center overflow-hidden">
        {/* La photo, centrée, dont la taille suit le défilement */}
        <div
          className="absolute left-1/2 top-1/2 overflow-hidden"
          style={{
            width: `${w}px`,
            height: `${h}px`,
            transform: `translate(calc(-50% + ${gapX * (1 - grow)}px), -50%)`,
            borderRadius: `${16 * (1 - grow)}px`
          }}
        >
          <Image src={image} alt={imageAlt} fill priority sizes="100vw" className="photo-tone object-cover" />
          <div
            className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,.15)_0%,rgba(10,10,10,.25)_45%,rgba(10,10,10,.8)_100%)]"
            style={{ opacity: introOpacity }}
          />
        </div>

        <span
          className="absolute top-[22%] px-5 text-center text-[13px] font-extrabold uppercase tracking-[0.14em] text-gold"
          style={{ opacity: topOpacity }}
        >
          {eyebrow}
        </span>

        <h1
          className="relative m-0 flex items-center font-serif font-medium leading-none tracking-[-0.01em]"
          style={{ fontSize: `${fontPx}px`, opacity: wordsOpacity }}
        >
          <span style={{ transform: `translateX(${-push}px)` }}>{wordA}</span>
          <span ref={gapRef} aria-hidden className="inline-block" style={{ width: `${gapW + fontPx * 0.25}px` }} />
          <span style={{ transform: `translateX(${push}px)` }}>{wordB}</span>
        </h1>

        <p
          className="absolute bottom-[12%] m-0 max-w-[620px] px-5 text-center font-serif text-[clamp(20px,2.6vw,30px)] leading-[1.35] text-cream"
          style={{ opacity: introOpacity, transform: `translateY(${(1 - introOpacity) * 24}px)` }}
        >
          {intro}
        </p>
      </div>
    </section>
  );
}
