import type { Metadata } from 'next';
import Link from 'next/link';
import { FilePdfIcon, DownloadSimpleIcon, ShieldCheckIcon, LockKeyIcon, ArrowRightIcon } from '@phosphor-icons/react/ssr';
import { Reveal } from '@/components/Reveal';
import { InnerHero } from '@/components/site/InnerHero';
import { ToConfirm } from '@/components/site/ui';
import { localeHref, type Locale } from '@/lib/i18n';
import { org } from '@/lib/content';

const text = {
  fr: {
    title: 'Transparence',
    desc: "Statut juridique, rapports, emploi des fonds et protection des enfants de l'association One Love.",
    eyebrow: 'Transparence',
    titlePre: 'Rendre compte de chaque ',
    titleWord: 'euro',
    intro: 'Statut, rapports, emploi des fonds et protection des enfants : ce que vous êtes en droit de savoir.',
    heroAlt: 'Une jeune fille écrit dans son cahier.',
    statusTitle: 'Statut juridique',
    statusText: 'One Love est une association loi 1901 à but non lucratif, qui mène ses projets en République démocratique du Congo.',
    fields: [
      ['Forme', 'Association loi 1901'],
      ['N° RNA', org.rna],
      ['Création', String(org.foundedYear)],
      ['Fondateurs', org.founders],
      ['Siège social', 'Adresse à compléter'],
      ['Terrain', 'Kinshasa, RDC']
    ] as const,
    reportsTitle: 'Rapports à télécharger',
    reports: [
      ["Rapport d'activité 2025", 'PDF · à venir'],
      ['Comptes annuels 2025', 'PDF · à venir'],
      ['Bilan RÊVES (phase 1)', 'PDF · à venir'],
      ["Statuts de l'association", 'PDF · à venir']
    ],
    reportsConfirm: "Documents à fournir par l'association",
    fundsTitle: "L'emploi des fonds",
    fundsIntro: "Sauf mention spéciale, l'affectation de vos dons se fait en fonction des besoins des programmes de terrain.",
    funds: [
      ['Programmes de terrain', 82, '#A9531A'],
      ['Formation des animateurs', 10, '#C2651A'],
      ['Fonctionnement', 8, '#8C8177']
    ] as const,
    fundsConfirm: 'Répartition à confirmer',
    childTitle: 'Protection des enfants',
    childText: "Aucun nom complet, lieu précis ou récit personnel identifiable n'est associé à un visage sur nos supports. Les liens avec les parrains passent toujours par l'équipe.",
    dataTitle: 'Protection des données',
    dataText: 'One Love ne commercialise pas ses fichiers de donateurs, de clients ni d’abonnés.',
    dataLink: 'Politique de confidentialité'
  },
  en: {
    title: 'Transparency',
    desc: 'Legal status, reports, use of funds and child protection at the One Love association.',
    eyebrow: 'Transparency',
    titlePre: 'Accounting for every ',
    titleWord: 'euro',
    intro: 'Legal status, reports, use of funds and child protection: what you have a right to know.',
    heroAlt: 'A girl writes in her notebook.',
    statusTitle: 'Legal status',
    statusText: 'One Love is a French non-profit association (loi 1901) carrying out projects in the Democratic Republic of the Congo.',
    fields: [
      ['Type', 'Non-profit association (loi 1901)'],
      ['RNA no.', org.rna],
      ['Founded', String(org.foundedYear)],
      ['Founders', 'Kanda Kabangu and his wife'],
      ['Registered office', 'Address to be added'],
      ['Field', 'Kinshasa, DRC']
    ] as const,
    reportsTitle: 'Reports to download',
    reports: [
      ['2025 activity report', 'PDF · coming soon'],
      ['2025 annual accounts', 'PDF · coming soon'],
      ['RÊVES report (phase 1)', 'PDF · coming soon'],
      ['Association bylaws', 'PDF · coming soon']
    ],
    reportsConfirm: 'Documents to be supplied by the association',
    fundsTitle: 'Use of funds',
    fundsIntro: 'Unless you specify otherwise, gifts are allocated according to the needs of our field programmes.',
    funds: [
      ['Field programmes', 82, '#A9531A'],
      ['Facilitator training', 10, '#C2651A'],
      ['Operations', 8, '#8C8177']
    ] as const,
    fundsConfirm: 'Breakdown to be confirmed',
    childTitle: 'Child protection',
    childText: 'No full name, precise location or identifiable personal story is ever linked to a face in our materials. Contact with sponsors always goes through the team.',
    dataTitle: 'Data protection',
    dataText: 'One Love never sells its donor, customer or subscriber lists.',
    dataLink: 'Privacy policy'
  }
};

export function transparencyMetadata(locale: Locale): Metadata {
  const t = text[locale];
  return { title: t.title, description: t.desc };
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
          <dl className="m-0 grid grid-cols-[minmax(0,180px)_minmax(0,1fr)] gap-x-5 gap-y-3.5 rounded-[20px] bg-white p-7 text-[16px] shadow-ol-sm">
            {t.fields.map(([label, value], i) => (
              <div key={label} className="contents">
                <dt className="text-ink-soft">{label}</dt>
                <dd className={`m-0 font-bold ${i === 4 ? 'text-copper-700' : 'text-ink'}`}>{value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </section>

      <section className="bg-sand">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-7 px-[clamp(20px,4vw,32px)] py-[clamp(56px,8vw,104px)]">
          <Reveal>
            <h2 className="m-0 text-balance font-serif text-[clamp(30px,3.6vw,46px)] font-medium leading-[1.15]">{t.reportsTitle}</h2>
          </Reveal>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-3.5">
            {t.reports.map(([title, meta], i) => (
              <Reveal key={title} delay={i * 60} className="flex min-h-[88px] items-center gap-4 rounded-xl bg-cream px-5 py-4">
                <FilePdfIcon size={32} className="flex-none text-copper-600" aria-hidden />
                <span className="flex flex-1 flex-col gap-0.5">
                  <b className="text-[16px]">{title}</b>
                  <span className="text-[14px] text-ink-soft">{meta}</span>
                </span>
                <DownloadSimpleIcon size={22} className="text-copper-600" aria-hidden />
              </Reveal>
            ))}
          </div>
          <ToConfirm>{t.reportsConfirm}</ToConfirm>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1200px] grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] items-start gap-x-[72px] gap-y-10 px-[clamp(20px,4vw,32px)] py-[clamp(56px,8vw,104px)]">
        <Reveal className="flex flex-col gap-3.5">
          <h2 className="m-0 text-balance font-serif text-[clamp(30px,3.6vw,46px)] font-medium leading-[1.15]">{t.fundsTitle}</h2>
          <p className="m-0 text-pretty text-[17px] leading-[1.65] text-ink-body">{t.fundsIntro}</p>
        </Reveal>
        <Reveal delay={90} className="flex flex-col gap-[18px]">
          <div className="flex flex-col gap-[18px]">
            {t.funds.map(([label, pct, color]) => (
              <div key={label} className="flex flex-col gap-2">
                <div className="flex justify-between gap-3 text-[16px]">
                  <b>{label}</b>
                  <b className="font-serif text-[20px]">{pct} %</b>
                </div>
                <div className="h-3.5 overflow-hidden rounded-full bg-[#EDE3D5]">
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
                </div>
              </div>
            ))}
          </div>
          <ToConfirm className="self-start">{t.fundsConfirm}</ToConfirm>
        </Reveal>
      </section>

      <section className="mx-auto grid max-w-[1200px] grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-5 px-[clamp(20px,4vw,32px)] pb-[clamp(56px,8vw,104px)]">
        <Reveal className="flex flex-col gap-3 rounded-[20px] bg-night p-8 text-cream">
          <ShieldCheckIcon size={36} color="#9DB5A2" aria-hidden />
          <h3 className="m-0 font-serif text-[26px] font-medium">{t.childTitle}</h3>
          <p className="m-0 text-[16px] leading-[1.6] text-on-dark-1">{t.childText}</p>
        </Reveal>
        <Reveal delay={90} className="flex flex-col gap-3 rounded-[20px] bg-white p-8 shadow-ol-sm">
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
