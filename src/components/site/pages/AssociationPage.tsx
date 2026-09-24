import type { Metadata } from 'next';
import { HeartIcon, StarIcon, LeafIcon } from '@phosphor-icons/react/ssr';
import { Reveal } from '@/components/Reveal';
import { InnerHero } from '@/components/site/InnerHero';
import { PlaceholderPhoto, CallBanner, ToConfirm, h2Class } from '@/components/site/ui';
import { localeHref, type Locale } from '@/lib/i18n';

const text = {
  fr: {
    title: 'Qui sommes-nous',
    desc: "L'histoire, la vision, la mission et l'équipe de l'association One Love à Kinshasa.",
    eyebrow: 'Qui nous sommes',
    titlePre: 'Une équipe, une ',
    titleWord: 'conviction',
    intro: 'Chaque être humain a besoin de se sentir aimé et désiré.',
    donate: 'Faire un don',
    sponsor: 'Parrainer un enfant',
    heroAlt: "Des mains d'enfants colorient des lettres.",
    visionEyebrow: 'Notre vision',
    vision: "L'amour est un besoin fondamental de l'être humain. Toute personne victime d'exclusion devrait pouvoir satisfaire ce besoin d'être aimée.",
    missionEyebrow: 'Notre mission',
    mission: 'Réaliser des projets en République Démocratique du Congo qui ont pour objet de valoriser les populations marginalisées, en particulier les enfants.',
    goals: [
      "Permettre l'accès à un mode de vie décent par l'éducation et des actions sociales et sanitaires.",
      'Co-construire des programmes de (ré)insertion professionnelle.',
      'Accompagner les bénéficiaires dans leur accomplissement professionnel et/ou personnel.'
    ],
    foundersPhoto: 'Photo des fondateurs · à fournir',
    foundersSub: 'Kanda Kabangu et son épouse',
    foundersEyebrow: 'Les fondateurs',
    foundersQuote: '« Depuis que nous nous sommes rencontrés en 2010, ma femme et moi avons eu à cœur de vivre un rêve commun : aimer et aider ceux qui en ont besoin. »',
    foundersName: 'Kanda Kabangu',
    foundersText: "Nous sommes une équipe dynamique et pleine d'enthousiasme, passionnée par le défi de rendre le monde meilleur. Et nous ne ménageons pas nos efforts pour y arriver. L'association a été fondée en 2010 par Kanda Kabangu et son épouse.",
    valuesTitle: 'Nos valeurs',
    values: [
      { icon: HeartIcon, t: "Aimer l'autre comme soi-même.", bg: 'bg-night', fg: 'text-cream', ic: 'text-gold-hover' },
      { icon: StarIcon, t: "Croire à l'impossible.", bg: 'bg-white', fg: 'text-ink', ic: 'text-copper-600' },
      { icon: LeafIcon, t: "Conduire nos actions dans le respect de l'environnement.", bg: 'bg-sage-100', fg: 'text-ink', ic: 'text-sage-700' }
    ],
    valuesQuote: "« L'amour que nous souhaitons transmettre est une prolongation de nos valeurs : ce n'est pas pour détruire mais pour construire, non pour imposer mais pour démontrer par nos actes d'amour que l'Homme est aimé au-delà des frontières, des cultures ou des religions. »",
    teamTitle: "L'équipe",
    teamSubtitle: 'Une équipe jeune et dynamique, à Kinshasa et en France.',
    teamPhoto: 'Photo',
    team: [
      ['Kanda Kabangu', 'Cofondateur'],
      ['Prénom Nom', 'Coordination à Kinshasa'],
      ['Prénom Nom', 'Responsable pédagogique'],
      ['Prénom Nom', 'Suivi médical et psychosocial']
    ],
    teamConfirm: 'Noms, rôles et photos à fournir',
    bannerTitle: 'Rejoindre ce qui a commencé en 2010.',
    bannerText: 'Un don, un parrainage ou quelques heures de votre temps.'
  },
  en: {
    title: 'About us',
    desc: "The history, vision, mission and team of the One Love association in Kinshasa.",
    eyebrow: 'Who we are',
    titlePre: 'One team, one ',
    titleWord: 'conviction',
    intro: 'Every human being needs to feel loved and wanted.',
    donate: 'Donate',
    sponsor: 'Sponsor a child',
    heroAlt: "Children's hands colouring in letters.",
    visionEyebrow: 'Our vision',
    vision: 'Love is a fundamental human need. Everyone who suffers exclusion should be able to meet this need to be loved.',
    missionEyebrow: 'Our mission',
    mission: 'To carry out projects in the Democratic Republic of the Congo that empower marginalised people, especially children.',
    goals: [
      'Provide access to a decent way of life through education and social and health actions.',
      'Co-build (re)integration programmes into work.',
      'Support beneficiaries in their professional and/or personal fulfilment.'
    ],
    foundersPhoto: 'Founders photo · to be supplied',
    foundersSub: 'Kanda Kabangu and his wife',
    foundersEyebrow: 'The founders',
    foundersQuote: '“Since we met in 2010, my wife and I have shared one dream: to love and help those in need.”',
    foundersName: 'Kanda Kabangu',
    foundersText: 'We are a dynamic, enthusiastic team, passionate about the challenge of making the world a better place, and we spare no effort to get there. The association was founded in 2010 by Kanda Kabangu and his wife.',
    valuesTitle: 'Our values',
    values: [
      { icon: HeartIcon, t: 'Love others as yourself.', bg: 'bg-night', fg: 'text-cream', ic: 'text-gold-hover' },
      { icon: StarIcon, t: 'Believe in the impossible.', bg: 'bg-white', fg: 'text-ink', ic: 'text-copper-600' },
      { icon: LeafIcon, t: 'Carry out our actions with respect for the environment.', bg: 'bg-sage-100', fg: 'text-ink', ic: 'text-sage-700' }
    ],
    valuesQuote: '“The love we wish to pass on is an extension of our values: not to destroy but to build, not to impose but to show through acts of love that every person is loved, beyond borders, cultures or religions.”',
    teamTitle: 'The team',
    teamSubtitle: 'A young, dynamic team in Kinshasa and France.',
    teamPhoto: 'Photo',
    team: [
      ['Kanda Kabangu', 'Co-founder'],
      ['First Last', 'Kinshasa coordination'],
      ['First Last', 'Education lead'],
      ['First Last', 'Medical and psychosocial care']
    ],
    teamConfirm: 'Names, roles and photos to be supplied',
    bannerTitle: 'Join what began in 2010.',
    bannerText: 'A gift, a sponsorship or a few hours of your time.'
  }
};

export function associationMetadata(locale: Locale): Metadata {
  const t = text[locale];
  return { title: t.title, description: t.desc };
}

export function AssociationPage({ locale }: { locale: Locale }) {
  const t = text[locale];
  const href = (p: string) => localeHref(p, locale);

  return (
    <>
      <InnerHero
        locale={locale}
        eyebrow={t.eyebrow}
        titlePre={t.titlePre}
        titleWord={t.titleWord}
        intro={t.intro}
        image="/photos/photo-mains.jpg"
        imageAlt={t.heroAlt}
        cta={{ donate: t.donate, sponsor: t.sponsor }}
      />

      <section className="mx-auto grid max-w-[1200px] grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] gap-x-[72px] gap-y-10 px-[clamp(20px,4vw,32px)] py-[clamp(56px,8vw,104px)]">
        <Reveal className="flex flex-col gap-3.5">
          <span className="text-[13px] font-extrabold uppercase tracking-[0.12em] text-copper-700">{t.visionEyebrow}</span>
          <p className="m-0 font-serif text-[clamp(24px,2.6vw,32px)] leading-[1.35]">{t.vision}</p>
        </Reveal>
        <Reveal delay={90} className="flex flex-col gap-3.5">
          <span className="text-[13px] font-extrabold uppercase tracking-[0.12em] text-copper-700">{t.missionEyebrow}</span>
          <p className="m-0 text-pretty text-[17px] leading-[1.65] text-ink-body">{t.mission}</p>
          <div className="flex flex-col gap-3.5 pt-2">
            {t.goals.map((g, i) => (
              <div key={g} className="grid grid-cols-[40px_minmax(0,1fr)] items-baseline gap-3">
                <span className="font-serif text-[30px] leading-none text-copper-600">{i + 1}</span>
                <span className="text-[17px] leading-[1.55]">{g}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="bg-sand">
        <div className="mx-auto grid max-w-[1200px] grid-cols-[repeat(auto-fit,minmax(min(100%,380px),1fr))] items-center gap-[clamp(32px,5vw,72px)] px-[clamp(20px,4vw,32px)] py-[clamp(56px,8vw,104px)]">
          <Reveal>
            <PlaceholderPhoto
              label={
                <>
                  {t.foundersPhoto}
                  <br />
                  {t.foundersSub}
                </>
              }
            />
          </Reveal>
          <Reveal delay={90} className="flex flex-col gap-5">
            <span className="text-[13px] font-extrabold uppercase tracking-[0.12em] text-copper-700">{t.foundersEyebrow}</span>
            <blockquote className="m-0 font-serif text-[clamp(24px,2.6vw,32px)] italic leading-[1.4]">{t.foundersQuote}</blockquote>
            <b className="text-[17px]">{t.foundersName}</b>
            <p className="m-0 text-pretty text-[17px] leading-[1.65] text-ink-body">{t.foundersText}</p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto flex max-w-[1200px] flex-col gap-10 px-[clamp(20px,4vw,32px)] py-[clamp(56px,8vw,104px)]">
        <Reveal>
          <h2 className={h2Class}>{t.valuesTitle}</h2>
        </Reveal>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-5">
          {t.values.map((v, i) => {
            const Icon = v.icon;
            return (
              <Reveal key={v.t} delay={i * 90} className={`flex flex-col gap-3.5 rounded-[20px] ${v.bg} ${v.fg} px-7 py-8`}>
                <Icon size={34} className={v.ic} aria-hidden />
                <p className="m-0 font-serif text-[26px] leading-[1.3]">{v.t}</p>
              </Reveal>
            );
          })}
        </div>
        <p className="m-0 max-w-[900px] font-serif text-[clamp(20px,2.2vw,26px)] italic leading-[1.5] text-ink-body">{t.valuesQuote}</p>
      </section>

      <section className="mx-auto flex max-w-[1200px] flex-col gap-8 px-[clamp(20px,4vw,32px)] pb-[clamp(56px,8vw,104px)]">
        <Reveal className="flex flex-col gap-2.5">
          <h2 className={h2Class}>{t.teamTitle}</h2>
          <p className="m-0 text-pretty text-[17px] leading-[1.65] text-ink-body">{t.teamSubtitle}</p>
        </Reveal>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-5">
          {t.team.map(([n, r], i) => (
            <Reveal key={n + r} delay={i * 90} className="flex flex-col gap-2.5">
              <PlaceholderPhoto label={t.teamPhoto} ratio="1/1" />
              <b className="text-[17px]">{n}</b>
              <span className="text-[15px] text-ink-soft">{r}</span>
            </Reveal>
          ))}
        </div>
        <ToConfirm>{t.teamConfirm}</ToConfirm>
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
