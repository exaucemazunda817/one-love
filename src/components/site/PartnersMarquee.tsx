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

// Bande de logos qui défile en continu (pause au survol, fondu sur les bords et un petit voile au milieu).
// La liste est répétée deux fois : l'animation déplace la piste de la moitié de
// sa largeur, puis recommence sans à-coup. Sans animation (mouvement réduit),
// la bande se fait à la main.
export function PartnersMarquee({ locale }: { locale: Locale }) {
  const t = text[locale];
  const renderItem = (p: (typeof PARTNERS)[number], hidden: boolean) => (
    <li key={`${hidden ? 'b' : 'a'}-${p.slug}`} className="flex-none" aria-hidden={hidden || undefined}>
      <div className="h-[84px] w-[152px] p-3 opacity-80 transition-[transform,opacity] duration-300 ease-out hover:scale-110 hover:opacity-100 sm:h-[128px] sm:w-[224px] sm:p-6">
        <Image
          src={`/partenaires/${p.slug}.webp`}
          alt={hidden ? '' : p.name}
          width={224}
          height={128}
          unoptimized
          loading="lazy"
          className="h-full w-full object-contain"
        />
      </div>
    </li>
  );

  return (
    <section className="overflow-hidden pb-[clamp(28px,4vw,48px)] pt-[clamp(12px,2vw,24px)]" aria-label={t.label}>
      <div className="mx-auto flex max-w-[1200px] flex-col items-center px-[clamp(20px,4vw,32px)] text-center">
        <Reveal variant="scale" className="flex max-w-[640px] flex-col items-center gap-2">
          <h2 className="m-0 font-serif text-[clamp(26px,3vw,36px)] font-medium leading-[1.15]">{t.title}</h2>
          <p className="m-0 text-pretty text-[15px] leading-[1.55] text-ink-body">{t.subtitle}</p>
        </Reveal>
      </div>
      <div className="ol-marquee mt-6">
        <ul className="ol-marquee-track m-0 list-none p-0">
          {PARTNERS.map((p) => renderItem(p, false))}
          {PARTNERS.map((p) => renderItem(p, true))}
        </ul>
      </div>
    </section>
  );
}
