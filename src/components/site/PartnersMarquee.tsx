import Image from 'next/image';
import { Reveal } from '@/components/Reveal';
import { PARTNERS } from '@/lib/partners';
import type { Locale } from '@/lib/i18n';

const text = {
  fr: {
    title: 'Nos partenaires',
    subtitle: 'Entreprises et fondations qui soutiennent One Love, notamment lors de notre Dîner caritatif.',
    label: 'Logos de nos partenaires'
  },
  en: {
    title: 'Our partners',
    subtitle: 'Companies and foundations that support One Love, notably at our Charity Dinner.',
    label: 'Logos of our partners'
  }
};

// Bande de logos qui défile en continu (pause au survol, fondu sur les bords).
// La liste est répétée deux fois : l'animation déplace la piste de la moitié de
// sa largeur, puis recommence sans à-coup. Sans animation (mouvement réduit),
// la bande se fait à la main.
export function PartnersMarquee({ locale }: { locale: Locale }) {
  const t = text[locale];
  const renderItem = (p: (typeof PARTNERS)[number], hidden: boolean) => (
    <li key={`${hidden ? 'b' : 'a'}-${p.slug}`} className="flex-none" aria-hidden={hidden || undefined}>
      <Image
        src={`/partenaires/${p.slug}.webp`}
        alt={hidden ? '' : p.name}
        width={120}
        height={120}
        unoptimized
        loading="lazy"
        className="h-[104px] w-[104px] rounded-full opacity-90 transition-all duration-300 hover:scale-110 hover:opacity-100 sm:h-[120px] sm:w-[120px]"
      />
    </li>
  );

  return (
    <section className="overflow-hidden py-[clamp(48px,7vw,88px)]" aria-label={t.label}>
      <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-3 px-[clamp(20px,4vw,32px)] text-center">
        <Reveal variant="scale" className="flex max-w-[640px] flex-col items-center gap-3">
          <h2 className="m-0 font-serif text-[clamp(28px,3.2vw,40px)] font-medium leading-[1.15]">{t.title}</h2>
          <p className="m-0 text-pretty text-[16px] leading-[1.6] text-ink-body">{t.subtitle}</p>
        </Reveal>
      </div>
      <div className="ol-marquee relative mt-10 overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-cream to-transparent sm:w-32" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-cream to-transparent sm:w-32" />
        <ul className="ol-marquee-track m-0 list-none p-0">
          {PARTNERS.map((p) => renderItem(p, false))}
          {PARTNERS.map((p) => renderItem(p, true))}
        </ul>
      </div>
    </section>
  );
}
