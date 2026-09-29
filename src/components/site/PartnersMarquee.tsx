import Image from 'next/image';
import { Reveal } from '@/components/Reveal';
import { Brush, Eyebrow } from '@/components/site/ui';
import { PARTNERS } from '@/lib/partners';
import type { Locale } from '@/lib/i18n';

const text = {
  fr: {
    title: 'Nos partenaires',
    label: 'Logos de nos partenaires'
  },
  en: {
    title: 'Our partners',
    label: 'Logos of our partners'
  }
};

// Bande filante à UNE seule rangée, qui défile dans un seul sens — sur le
// modèle d'une bannière de logos clients simple (titre centré, logos à même
// le bandeau, sans tuile ni carte individuelle autour de chaque logo, sans
// espace vide en haut ou en bas de la bande). La liste est doublée :
// l'animation déplace la piste de la moitié de sa largeur, puis recommence
// sans à-coup. Sans animation (mouvement réduit), la rangée se fait défiler
// à la main.
const SPEED = '120s';

export function PartnersMarquee({ locale }: { locale: Locale }) {
  const t = text[locale];
  const list = [...PARTNERS, ...PARTNERS];

  return (
    <section className="overflow-hidden bg-sand py-4" aria-label={t.label}>
      {/* Même langage que les autres surtitres du site : capitales espacées, un
          trait de pinceau dessous. Avant, un titre serif en gras jurait avec
          le reste (retour de Mazunda, 29/09/2026). */}
      <Reveal variant="scale" className="mx-auto mb-3 flex max-w-[640px] flex-col items-center gap-1 px-[clamp(20px,4vw,32px)] text-center">
        <h2 className="m-0">
          <Eyebrow>{t.title}</Eyebrow>
        </h2>
        <Brush fill="var(--clay)" className="h-2 w-16" />
      </Reveal>
      <div className="ol-marquee" aria-hidden="false">
        <ul
          className="ol-marquee-track m-0 flex list-none items-center gap-8 p-0 sm:gap-12"
          style={{ '--ol-marquee-speed': SPEED, '--ol-marquee-direction': 'normal' } as React.CSSProperties}
        >
          {list.map((p, i) => (
            <li key={`${i}-${p.slug}`} className="flex h-9 w-20 flex-none items-center justify-center sm:h-11 sm:w-24" aria-hidden={i >= PARTNERS.length || undefined}>
              <Image
                src={`/partenaires/${p.slug}.webp`}
                alt={i < PARTNERS.length ? p.name : ''}
                width={96}
                height={44}
                unoptimized
                loading="lazy"
                className="h-full w-full object-contain"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
