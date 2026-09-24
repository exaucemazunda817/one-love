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

// Bandes de logos façon n8n : trois rangées qui défilent en continu, à des
// vitesses différentes et une sur deux dans l'autre sens. Chaque logo est posé
// dans une tuile arrondie à bordure fine, qui grossit au survol ; les bords de
// la bande s'estompent. Chaque rangée montre les 33 logos, dans un ordre
// décalé pour qu'au départ deux rangées n'affichent pas les mêmes logos. La liste est doublée : l'animation déplace la piste de la moitié de
// sa largeur, puis recommence sans à-coup. Sans animation (mouvement réduit),
// chaque rangée se fait défiler à la main.
const ROWS = [
  { offset: 0, speed: '110s', reverse: false },
  // Une rangée inversée démarre en montrant la fin de sa liste : son décalage
  // est choisi pour qu'elle n'affiche pas les mêmes logos que ses voisines.
  { offset: 30, speed: '130s', reverse: true },
  { offset: 11, speed: '120s', reverse: false }
];

export function PartnersMarquee({ locale }: { locale: Locale }) {
  const t = text[locale];
  const renderItem = (p: (typeof PARTNERS)[number], key: string, hidden: boolean) => (
    <li key={key} className="flex-none" aria-hidden={hidden || undefined}>
      <div className="ol-logo-tile flex h-[76px] w-[104px] items-center justify-center p-3 sm:h-[96px] sm:w-[132px] sm:p-4">
        <Image
          src={`/partenaires/${p.slug}.webp`}
          alt={hidden ? '' : p.name}
          width={132}
          height={96}
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
      <div className="mt-6 flex flex-col gap-1 sm:gap-2">
        {ROWS.map((row, r) => {
          // La première rangée porte les noms (lecteurs d'écran) ; les deux
          // autres sont décoratives.
          const list = [...PARTNERS.slice(row.offset), ...PARTNERS.slice(0, row.offset)];
          return (
            <div key={r} className="ol-marquee" aria-hidden={r > 0 || undefined}>
              <ul
                className="ol-marquee-track m-0 list-none p-0"
                style={
                  {
                    '--ol-marquee-speed': row.speed,
                    '--ol-marquee-direction': row.reverse ? 'reverse' : 'normal'
                  } as React.CSSProperties
                }
              >
                {list.map((p) => renderItem(p, `${r}-a-${p.slug}`, r > 0))}
                {list.map((p) => renderItem(p, `${r}-b-${p.slug}`, true))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
