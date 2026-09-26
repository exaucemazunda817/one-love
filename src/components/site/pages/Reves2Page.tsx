import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import Image from 'next/image';
import { HeartIcon } from '@phosphor-icons/react/ssr';
import { Reveal } from '@/components/Reveal';
import { InnerHero } from '@/components/site/InnerHero';
import { RevesLetters } from '@/components/site/effects/RevesLetters';
import { Brush, CallBanner } from '@/components/site/ui';
import { currentProject, publishableGallery } from '@/lib/content';
import { localeHref, type Locale } from '@/lib/i18n';

const text = {
  fr: {
    title: `${currentProject.name} — ${currentProject.acronymMeaning}`,
    desc: currentProject.intro,
    eyebrow: 'Projet en cours',
    titleWord: currentProject.name,
    intro: currentProject.intro,
    heroAlt: currentProject.firstMilestone.label,
    steps: currentProject.acronymMeaning.split('–').map((w) => w.trim()),
    objectifLabel: 'Objectif',
    objectif: currentProject.objectif,
    periodLabel: 'Période',
    period: currentProject.period,
    partnerLabel: 'Partenaire',
    partner: currentProject.partnerName,
    milestoneLabel: 'Première étape',
    milestone: currentProject.firstMilestone.label,
    milestoneDate: currentProject.firstMilestone.date,
    galleryTitle: 'En images',
    bannerTitle: 'Le projet se poursuit jusqu’en décembre.',
    bannerText: 'Chaque contribution finance directement les ateliers, le matériel pédagogique et le suivi des enfants.',
    donate: 'Faire un don',
    sponsor: 'Parrainer un enfant'
  },
  en: {
    title: `${currentProject.name} — Reorganise · Educate · Empower · Listen · Care`,
    desc: "Launched a first time last year, the RÊVES project returns for a second phase, more focused on education, in partnership with Angel Foundation.",
    eyebrow: 'Ongoing project',
    titleWord: currentProject.name,
    intro: "Launched a first time last year, the RÊVES project returns for a second phase, more focused on education, in partnership with Angel Foundation.",
    heroAlt: currentProject.firstMilestone.label,
    steps: ['Reorganise', 'Educate', 'Empower', 'Listen', 'Care'],
    objectifLabel: 'Objective',
    objectif: "Build the children's skills, confidence and independence.",
    periodLabel: 'Period',
    period: 'September to December 2026 (4 months)',
    partnerLabel: 'Partner',
    partner: currentProject.partnerName,
    milestoneLabel: 'First milestone',
    milestone: 'First steps in literacy',
    milestoneDate: 'Saturday 5 September 2026',
    galleryTitle: 'In pictures',
    bannerTitle: 'The project runs through to December.',
    bannerText: 'Every contribution directly funds the workshops, teaching materials and follow-up for the children.',
    donate: 'Donate',
    sponsor: 'Sponsor a child'
  }
} as const;

export function reves2Metadata(locale: Locale): Metadata {
  const t = text[locale];
  return pageMetadata({ locale, path: '/projets/reves-2', title: t.title, description: t.desc });
}

export function Reves2Page({ locale }: { locale: Locale }) {
  const t = text[locale];
  const href = (p: string) => localeHref(p, locale);

  return (
    <>
      <InnerHero
        locale={locale}
        eyebrow={t.eyebrow}
        titleWord={t.titleWord}
        intro={t.intro}
        image="/projets/reves-2/reves2-atelier-1.jpg"
        imageAlt={t.heroAlt}
        objectPosition="50% 40%"
      />

      <section className="mx-auto max-w-[1200px] px-[clamp(20px,4vw,32px)] py-[clamp(56px,8vw,104px)]">
        <RevesLetters words={t.steps} />

        <div className="mt-10 grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] items-start gap-8">
          <Reveal delay={60} className="flex flex-col gap-5">
            <p className="m-0 max-w-measure text-[17px] leading-[1.65] text-ink-body">{currentProject.description}</p>
            <div className="flex flex-col gap-2 rounded-card bg-copper-tint p-6">
              <span className="text-[13px] font-extrabold uppercase tracking-[0.1em] text-copper-700">{t.objectifLabel}</span>
              <p className="m-0 text-[16px] leading-[1.55] text-ink">{t.objectif}</p>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <dl className="m-0 flex flex-col gap-5 rounded-card border-[1.5px] border-card-line p-6">
              <div className="flex flex-col gap-1">
                <dt className="text-[13px] font-extrabold uppercase tracking-[0.1em] text-ink-soft">{t.periodLabel}</dt>
                <dd className="m-0 text-[16px] font-bold text-ink">{t.period}</dd>
              </div>
              <div className="flex flex-col gap-1">
                <dt className="text-[13px] font-extrabold uppercase tracking-[0.1em] text-ink-soft">{t.partnerLabel}</dt>
                <dd className="m-0 text-[16px] font-bold text-ink">{t.partner}</dd>
              </div>
              <div className="flex flex-col gap-1">
                <dt className="text-[13px] font-extrabold uppercase tracking-[0.1em] text-ink-soft">{t.milestoneLabel}</dt>
                <dd className="m-0 text-[16px] font-bold text-ink">{t.milestone}</dd>
                <dd className="m-0 text-[14px] text-ink-soft">{t.milestoneDate}</dd>
              </div>
            </dl>
          </Reveal>
        </div>

      </section>

      <section className="bg-sand">
        <div className="mx-auto max-w-[1200px] px-[clamp(20px,4vw,32px)] py-[clamp(56px,8vw,104px)]">
          <Reveal className="mb-8 flex items-center gap-3.5">
            <h2 className="m-0 font-serif text-[clamp(30px,3.6vw,46px)] font-medium leading-[1.15]">{t.galleryTitle}</h2>
            <Brush className="h-2 w-20" />
          </Reveal>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-6">
            {publishableGallery.map((photo, index) => (
              <Reveal key={photo.src} delay={(index % 3) * 90}>
                <figure className="m-0 flex flex-col gap-3">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
                    <Reveal variant="zoom" className="absolute inset-0">
                      <Image
                        src={photo.src}
                        alt={photo.caption}
                        fill
                        sizes="(max-width: 1200px) 100vw, 33vw"
                        className="photo-tone object-cover"
                      />
                    </Reveal>
                  </div>
                  <figcaption className="text-[14px] leading-[1.5] text-ink-soft">{photo.caption}</figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CallBanner
        title={t.bannerTitle}
        text={t.bannerText}
        donateLabel={t.donate}
        sponsorLabel={t.sponsor}
        donateHref={href('/dons')}
        sponsorHref={href('/parrainer')}
        Icon={HeartIcon}
      />
    </>
  );
}
