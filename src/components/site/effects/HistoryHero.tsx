'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { HeroLayer } from '@/components/site/HeroPicture';
import { BrushWord, Eyebrow } from '@/components/site/ui';

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
  // Une fois la photo en plein écran, le bandeau se pose dans le MÊME design
  // que les autres pages (InnerHero) : même dégradé, même bloc de texte.
  // Reprend le minutage de l'ancien intro seul (0,78 → 0,95).
  const settle = seg(p, 0.78, 0.95);

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
          <HeroLayer photo={{ src: image }} alt={imageAlt} priority className="photo-tone object-cover" />
        </div>

        {/* Bandeau final : même dégradé et même bloc de texte que les autres
            pages (InnerHero), qui se pose une fois la photo en plein écran.
            Eyebrow + titre sont un écho purement visuel du vrai <h1> déjà lu
            plus haut dans le défilement — masqués aux lecteurs d’écran ;
            l’intro, elle, n’existe qu’ici et reste accessible. */}
        <div className="pointer-events-none absolute inset-0 flex items-end overflow-hidden dk:items-center" style={{ opacity: settle }}>
          <div className="absolute inset-0 bg-[linear-gradient(180deg,var(--scrim-1)_0%,var(--scrim-2)_30%,var(--scrim-5)_58%,var(--scrim-5)_100%)] dk:bg-[linear-gradient(90deg,var(--scrim-5)_0%,var(--scrim-4)_34%,var(--scrim-1)_64%,var(--scrim-0)_100%)]" />
          <div className="relative mx-auto w-full max-w-[1280px] px-5 py-10 dk:px-12 dk:pb-[88px] dk:pt-[128px]">
            <div className="mx-auto flex max-w-[620px] flex-col items-center gap-4 text-center dk:mx-0 dk:items-start dk:gap-6 dk:text-left">
              <div aria-hidden="true" className="flex flex-col items-center gap-4 dk:items-start dk:gap-6">
                <Eyebrow dark>{eyebrow}</Eyebrow>
                <p className="m-0 text-balance font-serif text-[32px] font-medium leading-[1.08] tracking-[-0.01em] dk:text-[clamp(38px,5vw,64px)]">
                  {wordA} <BrushWord>{wordB}</BrushWord>
                </p>
              </div>
              <p className="-mt-1.5 m-0 max-w-[460px] text-pretty text-[15px] leading-[1.5] text-on-dark-1 dk:mt-0 dk:max-w-[540px] dk:text-[20px] dk:leading-[1.6]">
                {intro}
              </p>
            </div>
          </div>
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
          <span style={{ transform: `translateX(${push}px)` }}>
            <BrushWord>{wordB}</BrushWord>
          </span>
        </h1>
      </div>
    </section>
  );
}
