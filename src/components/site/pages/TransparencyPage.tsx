import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import Link from 'next/link';
import { ShieldCheckIcon, LockKeyIcon, ArrowRightIcon } from '@phosphor-icons/react/ssr';
import { Reveal } from '@/components/Reveal';
import { InnerHero } from '@/components/site/InnerHero';
import { localeHref, type Locale } from '@/lib/i18n';
import { org } from '@/lib/content';

const text = {
  fr: {
    title: 'Transparence',
    desc: "Statut juridique, emploi des fonds et protection des enfants de l'association One Love.",
    eyebrow: 'Transparence',
    titlePre: 'Rendre compte de chaque ',
    titleWord: 'euro',
    intro: 'Statut, emploi des fonds et protection des enfants : ce que vous êtes en droit de savoir.',
    heroAlt: 'Une jeune fille écrit dans son cahier.',
    statusTitle: 'Statut juridique',
    statusText: 'One Love est une association loi 1901 à but non lucratif, qui mène ses projets en République démocratique du Congo.',
    fields: [
      ['Forme', 'Association loi 1901'],
      ['N° RNA', org.rna],
      ['Création', String(org.foundedYear)],
      ['Fondateurs', org.founders],
      ['Terrain', 'Kinshasa, RDC']
    ] as const,
    fundsTitle: "L'emploi des fonds",
    fundsIntro: "Sauf mention spéciale, l'affectation de vos dons se fait en fonction des besoins des programmes de terrain.",
    childTitle: 'Protection des enfants',
    childText: "Aucun nom complet, lieu précis ou récit personnel identifiable n'est associé à un visage sur nos supports. Les liens avec les parrains passent toujours par l'équipe.",
    dataTitle: 'Protection des données',
    dataText: 'One Love ne commercialise pas ses fichiers de donateurs, de clients ni d’abonnés.',
    dataLink: 'Politique de confidentialité'
  },
  en: {
    title: 'Transparency',
    desc: 'Legal status, use of funds and child protection at the One Love association.',
    eyebrow: 'Transparency',
    titlePre: 'Accounting for every ',
    titleWord: 'euro',
    intro: 'Legal status, use of funds and child protection: what you have a right to know.',
    heroAlt: 'A girl writes in her notebook.',
    statusTitle: 'Legal status',
    statusText: 'One Love is a French non-profit association (loi 1901) carrying out projects in the Democratic Republic of the Congo.',
    fields: [
      ['Type', 'Non-profit association (loi 1901)'],
      ['RNA no.', org.rna],
      ['Founded', String(org.foundedYear)],
      ['Founders', 'Kanda Kabangu and his wife'],
      ['Field', 'Kinshasa, DRC']
    ] as const,
    fundsTitle: 'Use of funds',
    fundsIntro: 'Unless you specify otherwise, gifts are allocated according to the needs of our field programmes.',
    childTitle: 'Child protection',
    childText: 'No full name, precise location or identifiable personal story is ever linked to a face in our materials. Contact with sponsors always goes through the team.',
    dataTitle: 'Data protection',
    dataText: 'One Love never sells its donor, customer or subscriber lists.',
    dataLink: 'Privacy policy'
  }
};

export function transparencyMetadata(locale: Locale): Metadata {
  const t = text[locale];
  return pageMetadata({ locale, path: '/transparence', title: t.title, description: t.desc });
}

export function TransparencyPage({ locale }: { locale: Locale }) {
  const t = text[locale];

  return (
    <>
      <InnerHero
        locale={locale}
        eyebrow={t.eyebrow}
        titlePre={t.titlePre}
        titleWord={t.titleWord}
        intro={t.intro}
        image="/photos/photo-ecriture.jpg"
        imageAlt={t.heroAlt}
      />

      <section className="mx-auto grid max-w-[1200px] grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] gap-x-16 gap-y-8 px-[clamp(20px,4vw,32px)] py-[clamp(56px,8vw,104px)]">
        <Reveal className="flex flex-col gap-3">
          <h2 className="m-0 text-balance font-serif text-[clamp(30px,3.6vw,46px)] font-medium leading-[1.15]">{t.statusTitle}</h2>
          <p className="m-0 text-pretty text-[17px] leading-[1.65] text-ink-body">{t.statusText}</p>
        </Reveal>
        <Reveal delay={90}>
          {/* Sur téléphone, libellé au-dessus de la valeur : en deux colonnes,
              la colonne des libellés gardait 180 px et celle des valeurs
              tombait à 24 px (un mot par ligne, n° RNA hors de la carte). */}
          <dl className="m-0 grid grid-cols-1 gap-x-5 rounded-card bg-white p-5 text-[16px] shadow-ol-sm sm:grid-cols-[minmax(0,160px)_minmax(0,1fr)] sm:gap-y-3.5 sm:p-7 [&>div:last-child>dd]:mb-0">
            {t.fields.map(([label, value]) => (
              <div key={label} className="contents">
                <dt className="text-[15px] text-ink-soft sm:text-[16px]">{label}</dt>
                <dd className="m-0 mb-3.5 break-words font-bold text-ink sm:mb-0">{value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </section>

      <section className="bg-sand">
        <Reveal className="mx-auto flex max-w-[1200px] flex-col gap-3.5 px-[clamp(20px,4vw,32px)] py-[clamp(56px,8vw,104px)]">
          <h2 className="m-0 text-balance font-serif text-[clamp(30px,3.6vw,46px)] font-medium leading-[1.15]">{t.fundsTitle}</h2>
          <p className="m-0 max-w-measure text-pretty text-[17px] leading-[1.65] text-ink-body">{t.fundsIntro}</p>
        </Reveal>
      </section>

      <section className="mx-auto grid max-w-[1200px] grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-5 px-[clamp(20px,4vw,32px)] py-[clamp(56px,8vw,104px)]">
        <Reveal className="flex flex-col gap-3 rounded-card bg-night p-8 text-cream">
          <ShieldCheckIcon size={36} className="text-sage-300" aria-hidden />
          <h3 className="m-0 font-serif text-[26px] font-medium">{t.childTitle}</h3>
          <p className="m-0 text-[16px] leading-[1.6] text-on-dark-1">{t.childText}</p>
        </Reveal>
        <Reveal delay={90} className="flex flex-col gap-3 rounded-card bg-white p-8 shadow-ol-sm">
          <LockKeyIcon size={36} className="text-copper-600" aria-hidden />
          <h3 className="m-0 font-serif text-[26px] font-medium">{t.dataTitle}</h3>
          <p className="m-0 text-pretty text-[17px] leading-[1.65] text-ink-body">{t.dataText}</p>
          <Link href={localeHref('/confidentialite', locale)} className="inline-flex min-h-11 items-center gap-1.5 font-bold no-underline">
            {t.dataLink}
            <ArrowRightIcon aria-hidden />
          </Link>
        </Reveal>
      </section>
    </>
  );
}
