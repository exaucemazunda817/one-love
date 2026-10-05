import Image from 'next/image';
import { Reveal } from '@/components/Reveal';
import { Brush, Eyebrow } from '@/components/site/ui';
import { PARTNERS } from '@/lib/partners';
import type { Locale } from '@/lib/i18n';

const text = {
  fr: { title: 'Nos partenaires', label: 'Logos de nos partenaires' },
  en: { title: 'Our partners', label: 'Logos of our partners' }
};

// Rangée fixe et centrée : la liste ne compte plus que deux partenaires
// (04/10/2026), une bande défilante n'aurait plus de sens. Le nom du composant
// est gardé pour ne pas toucher aux pages qui l'utilisent.
export function PartnersMarquee({ locale }: { locale: Locale }) {
  const t = text[locale];
  return (
    <section className="bg-sand py-8" aria-label={t.label}>
      <Reveal variant="scale" className="mx-auto mb-5 flex max-w-[640px] flex-col items-center gap-1 px-[clamp(20px,4vw,32px)] text-center">
        <h2 className="m-0">
          <Eyebrow>{t.title}</Eyebrow>
        </h2>
        <Brush fill="var(--clay)" className="h-2 w-16" />
      </Reveal>
      <ul className="m-0 flex list-none flex-wrap items-center justify-center gap-x-14 gap-y-6 p-0 px-5">
        {PARTNERS.map((p) => (
          <li key={p.slug} className="flex h-20 w-36 items-center justify-center sm:h-24 sm:w-44">
            <Image
              src={`/partenaires/${p.slug}.webp`}
              alt={p.name}
              width={176}
              height={96}
              unoptimized
              loading="lazy"
              className="h-full w-full object-contain"
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
