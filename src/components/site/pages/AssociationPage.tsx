import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { HeartIcon, StarIcon, LeafIcon, UsersThreeIcon, SparkleIcon, CompassIcon, ArrowRightIcon } from '@phosphor-icons/react/ssr';
import Image from 'next/image';
import Link from 'next/link';
import { Reveal } from '@/components/Reveal';
import { InkText } from '@/components/site/effects/InkText';
import { InnerHero } from '@/components/site/InnerHero';
import { Brush, BrushWord, CallBanner, Eyebrow, h2Class } from '@/components/site/ui';
import { PartnersMarquee } from '@/components/site/PartnersMarquee';
import { localeHref, type Locale } from '@/lib/i18n';

const text = {
  fr: {
    title: 'Qui sommes-nous : vision, mission, équipe',
    desc: "L’histoire, la vision, la mission et l’équipe de l’association One Love à Kinshasa.",
    eyebrow: 'Qui nous sommes',
    titlePre: 'Une équipe, une ',
    titleWord: 'conviction',
    intro: 'Chaque être humain a besoin de se sentir aimé et désiré.',
    donate: 'Faire un don',
    sponsor: 'Parrainer un enfant',
    heroAlt: "Les One Love Boys réunis avec l’équipe et les fondateurs.",
    visionEyebrow: 'Notre vision',
    vision: "L’amour est un besoin fondamental de l’être humain. Toute personne victime d’exclusion devrait pouvoir satisfaire ce besoin [[d’être aimée]].",
    missionEyebrow: 'Notre mission',
    mission: 'Réaliser des projets en République Démocratique du Congo qui ont pour objet de valoriser les populations marginalisées, en particulier les enfants.',
    goals: [
      "Permettre l’accès à un mode de vie décent par l’éducation et des actions sociales et sanitaires.",
      'Co-construire des programmes de (ré)insertion professionnelle.',
      'Accompagner les bénéficiaires dans leur accomplissement professionnel et/ou personnel.'
    ],
    foundersEyebrow: 'Les fondateurs',
    foundersQuote: '« Depuis que nous nous sommes rencontrés en 2010, ma femme et moi avons eu à cœur de vivre un rêve commun : aimer et aider ceux qui en ont besoin. »',
    foundersName: 'Kanda Kabangu',
    foundersText: 'Nous sommes une équipe en France et une équipe à Kinshasa, réunies autour d’une même vision. L’association a été fondée en 2013 par Kanda et Maïté Kabangu.',
    storyLink: 'Découvrir notre histoire',
    valuesTitle: 'Nos valeurs',
    values: [
      { icon: HeartIcon, t: "Aimer l’autre comme soi-même.", bg: 'bg-night', fg: 'text-cream', ic: 'text-gold-hover' },
      { icon: StarIcon, t: "Croire à l’impossible.", bg: 'bg-white', fg: 'text-ink', ic: 'text-copper-600' },
      { icon: LeafIcon, t: "Conduire nos actions dans le respect de l’environnement.", bg: 'bg-sage-100', fg: 'text-ink', ic: 'text-sage-700' }
    ],
    pageQuote: "« One Love, une équipe qui pense que l’Amour est divin et qu’il peut agir en nous qui sommes ordinaires par des actes extraordinaires ! »",
    pageQuoteCite: 'Présentation de la page Facebook de One Love',
    valuesQuote: "« L’amour que nous souhaitons transmettre est une prolongation de nos valeurs : ce n’est pas pour détruire mais pour construire, non pour imposer mais pour démontrer par nos actes d’amour que l’Homme est aimé au-delà des frontières, des cultures ou des religions. »",
    whatEyebrow: "Qu’est-ce que One Love ?",
    whatTitlePre: 'Trois convictions, ',
    whatTitleWord: 'une seule direction',
    pillars: [
      { icon: HeartIcon, t: "L’amour avant tout", d: "C’est notre carburant, ce qui nous anime et nous pousse à agir. Nous sommes aimés et nous souhaitons aimer en retour." },
      { icon: UsersThreeIcon, t: 'Des personnes engagées', d: 'Nous sommes une équipe unie par le désir de faire une différence dans ce monde.' },
      { icon: SparkleIcon, t: 'Des rêves en action', d: 'Chacun a un rêve sur son cœur : nous agissons ensemble pour le rendre réel.' }
    ],
    goalsEyebrow: 'Nos objectifs',
    foundersTitlePre: 'Deux fondateurs, ',
    foundersTitleWord: 'une équipe',
    founderCards: [
      { q: '« Seul on va vite, ensemble on va loin ! »', d: "One Love aujourd’hui n’est pas mon œuvre, c’est celle de notre équipe : une équipe qui court pour la même vision, poussée par l’amour.", name: 'Kanda Kabangu', role: 'Cofondateur' },
      { q: '« Voir le sourire d’un visage transformé par l’amour réjouit mon cœur. »', d: "Avec mon mari Kanda, nous avons fondé l’association One Love en 2013. J’apprécie particulièrement discerner les talents des autres et les encourager à les développer.", name: 'Maïté Kabangu', role: 'Cofondatrice' }
    ],
    quoteTitle: 'Ce que nous voulons transmettre',
    structEyebrow: 'Organisation',
    structTitlePre: 'Comment nous ',
    structTitleWord: 'sommes organisés',
    structIntro: "Une équipe en France et une équipe en RDC, réunies autour d’une même direction.",
    structTop: 'Présidence',
    structGroups: [
      { t: 'Gestion et administration', bg: 'bg-white', roles: ['Secrétariat général', 'Trésorerie', 'Trésorerie adjointe', 'Conseil juridique'] },
      { t: 'One Love France', bg: 'bg-copper-tint', roles: ['Responsable France'] },
      { t: 'One Love Congo', bg: 'bg-sage-100', roles: ['Responsable Congo', 'Éducation, équipe Congo'] }
    ],
    voicesEyebrow: 'Témoignages de notre équipe',
    voicesTitlePre: 'Ils ont rejoint ',
    voicesTitleWord: "l’aventure",
    voicesIntro: "Bénévoles, marraines et parrains, membres de la chorale : chacun a un rêve sur le cœur, et l’a mis au service des enfants.",
    voices: [
      { name: 'Céline Barrellon', note: 'Voyage humanitaire en RDC, 2018', q: "Voir tous ces enfants abandonnés, livrés à eux-mêmes, recevoir tous les soins nécessaires, et surtout de l’amour, donne un sens à la vie." },
      { name: 'Manon Besnier', note: 'Voyage humanitaire, juillet 2019', q: "Ses membres ne se contentent pas d’offrir aux enfants un toit et un couvert : ils les entourent d’attention et d’affection." },
      { name: 'Marie-Anne Goury', note: 'Éducation, équipe Congo', q: "J’ai appris que le plus important est l’amour : l’amour entre nous, l’amour donné et démontré aux autres." },
      { name: 'Gaëlle Gravier', note: '', q: "Les aimer et leur démontrer cet amour est la seule solution. Avec One Love, je peux le faire concrètement." },
      { name: 'Patricia Méri-Libota', note: 'Chorale One Love', q: "Ce que les personnes marginalisées apprécient, c’est tout simplement qu’on leur offre du temps, de l’attention et de l’amour." },
      { name: 'Fanny Hovor', note: 'Chorale One Love', q: 'Les enfants sont des dons et des bénédictions. Nous devons prendre soin d’eux avec bienveillance et leur donner les chances de réussir leurs vies.' }
    ],
    bannerTitle: 'Rejoindre ce qui a commencé en 2013.',
    bannerText: 'Un don, un parrainage ou quelques heures de votre temps.'
  },
  en: {
    title: 'About us: vision, mission, team',
    desc: "The history, vision, mission and team of the One Love association in Kinshasa.",
    eyebrow: 'Who we are',
    titlePre: 'One team, one ',
    titleWord: 'conviction',
    intro: 'Every human being needs to feel loved and wanted.',
    donate: 'Donate',
    sponsor: 'Sponsor a child',
    heroAlt: "The One Love Boys together with the team and the founders.",
    visionEyebrow: 'Our vision',
    vision: 'Love is a fundamental human need. Everyone who suffers exclusion should be able to meet this need [[to be loved]].',
    missionEyebrow: 'Our mission',
    mission: 'To carry out projects in the Democratic Republic of the Congo that empower marginalised people, especially children.',
    goals: [
      'Provide access to a decent way of life through education and social and health actions.',
      'Co-build (re)integration programmes into work.',
      'Support beneficiaries in their professional and/or personal fulfilment.'
    ],
    foundersEyebrow: 'The founders',
    foundersQuote: '“Since we met in 2010, my wife and I have shared one dream: to love and help those in need.”',
    foundersName: 'Kanda Kabangu',
    foundersText: 'We are a team in France and a team in Kinshasa, brought together around one vision. The association was founded in 2013 by Kanda and Maïté Kabangu.',
    storyLink: 'Discover our story',
    valuesTitle: 'Our values',
    values: [
      { icon: HeartIcon, t: 'Love others as yourself.', bg: 'bg-night', fg: 'text-cream', ic: 'text-gold-hover' },
      { icon: StarIcon, t: 'Believe in the impossible.', bg: 'bg-white', fg: 'text-ink', ic: 'text-copper-600' },
      { icon: LeafIcon, t: 'Carry out our actions with respect for the environment.', bg: 'bg-sage-100', fg: 'text-ink', ic: 'text-sage-700' }
    ],
    pageQuote: '“One Love, a team that believes Love is divine and can work through ordinary people like us by means of extraordinary acts!”',
    pageQuoteCite: "From One Love’s Facebook page",
    valuesQuote: '“The love we wish to pass on is an extension of our values: not to destroy but to build, not to impose but to show through acts of love that every person is loved, beyond borders, cultures or religions.”',
    whatEyebrow: 'What is One Love?',
    whatTitlePre: 'Three convictions, ',
    whatTitleWord: 'one direction',
    pillars: [
      { icon: HeartIcon, t: 'Love above all', d: 'It is our fuel, what drives us to act. We are loved, and we want to love in return.' },
      { icon: UsersThreeIcon, t: 'Committed people', d: 'We are a team united by the desire to make a difference in this world.' },
      { icon: SparkleIcon, t: 'Dreams in action', d: 'Everyone has a dream on their heart: together we act to make it real.' }
    ],
    goalsEyebrow: 'Our goals',
    foundersTitlePre: 'Two founders, ',
    foundersTitleWord: 'one team',
    founderCards: [
      { q: '“Alone we go fast, together we go far!”', d: 'One Love today is not my work, it is our team’s: a team running towards the same vision, driven by love.', name: 'Kanda Kabangu', role: 'Co-founder' },
      { q: '“Seeing a face lit up by love brings joy to my heart.”', d: 'With my husband Kanda, we founded One Love in 2013. I especially enjoy spotting other people’s talents and encouraging them to develop them.', name: 'Maïté Kabangu', role: 'Co-founder' }
    ],
    quoteTitle: 'What we want to pass on',
    structEyebrow: 'Organisation',
    structTitlePre: 'How we are ',
    structTitleWord: 'organised',
    structIntro: 'A team in France and a team in the DRC, brought together around one direction.',
    structTop: 'Presidency',
    structGroups: [
      { t: 'Management and administration', bg: 'bg-white', roles: ['General secretariat', 'Treasury', 'Deputy treasury', 'Legal adviser'] },
      { t: 'One Love France', bg: 'bg-copper-tint', roles: ['France lead'] },
      { t: 'One Love Congo', bg: 'bg-sage-100', roles: ['Congo lead', 'Education, Congo team'] }
    ],
    voicesEyebrow: 'Voices from our team',
    voicesTitlePre: 'They joined ',
    voicesTitleWord: 'the adventure',
    voicesIntro: 'Volunteers, sponsors, choir members: each has a dream on their heart and has put it at the service of the children.',
    voices: [
      { name: 'Céline Barrellon', note: 'Humanitarian trip to the DRC, 2018', q: 'Seeing all these abandoned children, left to fend for themselves, receive all the care they need, and above all love, gives life meaning.' },
      { name: 'Manon Besnier', note: 'Humanitarian trip, July 2019', q: 'Its members do not just give the children a roof and a meal: they surround them with attention and affection.' },
      { name: 'Marie-Anne Goury', note: 'Education, Congo team', q: 'I learned that the most important thing is love: love among us, love given and shown to others.' },
      { name: 'Gaëlle Gravier', note: '', q: 'Loving them and showing them that love is the only answer. With One Love, I can do it in a concrete way.' },
      { name: 'Patricia Méri-Libota', note: 'One Love choir', q: 'What marginalised people appreciate is simply being offered time, attention and love.' },
      { name: 'Fanny Hovor', note: 'One Love choir', q: 'Children are gifts and blessings. We must look after them with kindness and give them the chance to succeed in life.' }
    ],
    bannerTitle: 'Join what began in 2013.',
    bannerText: 'A gift, a sponsorship or a few hours of your time.'
  }
};

export function associationMetadata(locale: Locale): Metadata {
  const t = text[locale];
  return pageMetadata({ locale, path: '/association', title: t.title, description: t.desc });
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
        image="/one-love-boys/2023-famille/02.webp"
        imageAlt={t.heroAlt}
        cta={{ donate: t.donate, sponsor: t.sponsor }}
      />

      {/* Qu'est-ce que One Love : trois convictions, issues de l'ancien
          site de l’association (texte repris tel quel). */}
      <section className="mx-auto flex max-w-[1200px] flex-col gap-10 px-[clamp(20px,4vw,32px)] py-[clamp(56px,8vw,104px)]">
        <Reveal className="flex max-w-[720px] flex-col gap-3">
          <Eyebrow>{t.whatEyebrow}</Eyebrow>
          <h2 className={h2Class}>
            {t.whatTitlePre}
            <BrushWord>{t.whatTitleWord}</BrushWord>
          </h2>
        </Reveal>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-x-10 gap-y-9">
          {t.pillars.map((pl, i) => {
            const Icon = pl.icon;
            return (
              <div key={pl.t} className="flex flex-col gap-3.5">
                <Reveal delay={i * 90}>
                  <Icon size={34} className="text-copper-700" aria-hidden />
                </Reveal>
                <Reveal variant="soft" delay={120 + i * 90}>
                  <Brush fill="var(--clay)" className="h-2 w-full" stretch />
                </Reveal>
                <Reveal variant="soft" delay={200 + i * 90}>
                  <h3 className="m-0 font-serif text-[26px] font-semibold leading-[1.2]">{pl.t}</h3>
                </Reveal>
                <Reveal variant="soft" delay={280 + i * 90}>
                  <p className="m-0 text-pretty text-[17px] leading-[1.65] text-ink-body">{pl.d}</p>
                </Reveal>
              </div>
            );
          })}
        </div>
      </section>

      {/* Vision et mission */}
      <section className="bg-sand">
        <div className="mx-auto grid max-w-[1200px] grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] gap-x-[72px] gap-y-10 px-[clamp(20px,4vw,32px)] py-[clamp(56px,8vw,104px)]">
          <Reveal className="flex flex-col gap-3.5">
            <Eyebrow>{t.visionEyebrow}</Eyebrow>
            <InkText text={t.vision} className="m-0 font-serif text-[clamp(26px,3vw,38px)] leading-[1.3]" />
          </Reveal>
          <Reveal delay={90} className="flex flex-col gap-3.5">
            <Eyebrow>{t.missionEyebrow}</Eyebrow>
            <p className="max-w-measure m-0 text-pretty text-[17px] leading-[1.65] text-ink-body">{t.mission}</p>
            <div className="flex flex-col gap-4 pt-3">
              <Eyebrow>{t.goalsEyebrow}</Eyebrow>
              {t.goals.map((g, i) => (
                <Reveal key={g} variant="soft" delay={120 + i * 90} className="flex flex-col gap-2">
                  <div className="grid grid-cols-[40px_minmax(0,1fr)] items-baseline gap-3">
                    <span className="font-serif text-[30px] leading-none text-copper-600">{i + 1}</span>
                    <span className="text-[17px] leading-[1.55]">{g}</span>
                  </div>
                  <Brush fill="var(--clay)" className="h-2 w-full" stretch />
                </Reveal>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Fondateurs */}
      <section className="mx-auto grid max-w-[1200px] grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] gap-x-14 gap-y-10 px-[clamp(20px,4vw,32px)] py-[clamp(56px,8vw,104px)]">
        <Reveal className="flex flex-col gap-5">
          <Eyebrow>{t.foundersEyebrow}</Eyebrow>
          <h2 className={h2Class}>
            {t.foundersTitlePre}
            <BrushWord>{t.foundersTitleWord}</BrushWord>
          </h2>
          <blockquote className="m-0 font-serif text-[clamp(20px,2.2vw,26px)] italic leading-[1.45]">{t.foundersQuote}</blockquote>
          <b className="text-[17px]">{t.foundersName}</b>
          <p className="m-0 text-pretty text-[17px] leading-[1.65] text-ink-body">{t.foundersText}</p>
          <Link
            href={href('/histoire')}
            className="inline-flex min-h-11 items-center gap-2 self-start text-[16px] font-bold text-copper-700 no-underline hover:underline hover:underline-offset-4"
          >
            {t.storyLink} <ArrowRightIcon aria-hidden />
          </Link>
        </Reveal>
        <div className="flex flex-col gap-5">
          {t.founderCards.map((f, i) => (
            <Reveal key={f.name} delay={i * 120}>
              <figure className="m-0 flex flex-col gap-3.5 rounded-card bg-white p-[clamp(24px,3vw,32px)] shadow-ol-sm">
                <Brush fill="var(--clay)" className="h-2 w-16" />
                <blockquote className="m-0 font-serif text-[22px] italic leading-[1.4]">{f.q}</blockquote>
                <p className="m-0 text-pretty text-[16px] leading-[1.6] text-ink-body">{f.d}</p>
                <figcaption className="text-[15px]">
                  <b>{f.name}</b> · {f.role}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Valeurs */}
      <section className="bg-sand">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-8 px-[clamp(20px,4vw,32px)] py-[clamp(56px,8vw,104px)]">
          <Reveal className="flex flex-col gap-3">
            <h2 className={h2Class}>
              <BrushWord>{t.valuesTitle}</BrushWord>
            </h2>
          </Reveal>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-4">
            {t.values.map((v, i) => {
              const Icon = v.icon;
              return (
                <Reveal key={v.t} delay={i * 90} className={`flex min-h-[220px] flex-col gap-3.5 rounded-card ${v.bg} ${v.fg} px-7 py-8`}>
                  <Icon size={36} className={v.ic} aria-hidden />
                  <p className="m-0 font-serif text-[26px] leading-[1.3]">{v.t}</p>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Citation, sur photo comme « Projet en cours » de l'accueil */}
      <section className="relative overflow-hidden bg-night text-cream">
        <Image src="/centre-aere/2023-12-02/09.webp" alt="" fill sizes="100vw" className="photo-tone object-cover object-[60%_30%]" />
        <div className="relative mx-auto max-w-[1280px] px-[clamp(12px,4vw,48px)] py-[clamp(40px,8vw,120px)]">
          <Reveal className="flex max-w-[640px] flex-col gap-[18px] rounded-card bg-[color:var(--scrim-5)] p-[clamp(28px,4vw,48px)]">
            <Eyebrow dark>{t.quoteTitle}</Eyebrow>
            <p className="m-0 font-serif text-[clamp(22px,2.4vw,30px)] italic leading-[1.45]">{t.valuesQuote}</p>
            <figure className="m-0 flex flex-col gap-1.5 border-l-[3px] border-gold pl-4">
              <blockquote className="m-0 text-[16px] leading-[1.55] text-on-dark-1">{t.pageQuote}</blockquote>
              <figcaption className="text-[14px] text-on-dark-2">{t.pageQuoteCite}</figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* Structure organisationnelle : fonctions seulement, jamais de noms
          (décision de Mazunda, 29/09/2026). Rôles relevés sur l’ancien site
          de l’association (2023) : à faire confirmer avant publication. */}
      <section className="bg-sand">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-10 px-[clamp(20px,4vw,32px)] py-[clamp(56px,8vw,104px)]">
          <Reveal className="flex max-w-[680px] flex-col gap-3">
            <Eyebrow>{t.structEyebrow}</Eyebrow>
            <h2 className={h2Class}>
              {t.structTitlePre}
              <BrushWord>{t.structTitleWord}</BrushWord>
            </h2>
            <p className="m-0 max-w-measure text-pretty text-[17px] leading-[1.6] text-ink-body">{t.structIntro}</p>
          </Reveal>
          {/* Mobile : colonne verticale reliée par un trait à gauche.
              Ordinateur : arbre avec barre horizontale et trois branches. */}
          <div className="relative flex flex-col gap-5 pl-9 before:absolute before:bottom-8 before:left-[11px] before:top-8 before:w-0.5 before:bg-clay dk:items-center dk:gap-0 dk:pl-0 dk:before:hidden">
            <Reveal className="relative">
              <span className="absolute -left-9 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full border-[3px] border-clay bg-night dk:hidden" aria-hidden />
              <div className="flex items-center gap-3.5 rounded-card bg-night px-7 py-5 text-cream dk:px-12">
                <CompassIcon size={30} className="flex-none text-gold-hover" aria-hidden />
                <span className="font-serif text-[26px] font-medium leading-none">{t.structTop}</span>
              </div>
            </Reveal>
            <span className="hidden h-9 w-0.5 bg-clay dk:block" aria-hidden />
            <div className="flex w-full flex-col gap-5 dk:flex-row dk:gap-0">
              {t.structGroups.map((g, i) => {
                const last = t.structGroups.length - 1;
                return (
                  <Reveal key={g.t} delay={i * 90} className="relative dk:flex-1 dk:px-2.5 dk:pt-9">
                    <span className="absolute -left-9 top-8 h-3.5 w-3.5 translate-x-[5px] rounded-full bg-copper-600 dk:hidden" aria-hidden />
                    <span
                      className={`absolute top-0 hidden h-0.5 bg-clay dk:block ${i === 0 ? 'left-1/2 right-0' : i === last ? 'left-0 right-1/2' : 'left-0 right-0'}`}
                      aria-hidden
                    />
                    <span className="absolute left-1/2 top-0 hidden h-9 w-0.5 -translate-x-1/2 bg-clay dk:block" aria-hidden />
                    <div className={`flex h-full flex-col gap-4 rounded-card p-6 shadow-ol-sm dk:p-7 ${g.bg}`}>
                      <Eyebrow>{g.t}</Eyebrow>
                      <Brush fill="var(--clay)" className="h-2 w-full" stretch />
                      <ul className="m-0 flex list-none flex-col gap-3 p-0">
                        {g.roles.map((r) => (
                          <li key={r} className="flex items-baseline gap-3 font-serif text-[20px] leading-[1.3] dk:text-[22px]">
                            <span className="mt-2 h-2 w-2 flex-none rounded-full bg-copper-600" aria-hidden />
                            {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Témoignages de l'équipe */}
      <section className="mx-auto flex max-w-[1200px] flex-col gap-10 px-[clamp(20px,4vw,32px)] py-[clamp(56px,8vw,104px)]">
        <Reveal className="flex max-w-[680px] flex-col gap-3">
          <Eyebrow>{t.voicesEyebrow}</Eyebrow>
          <h2 className={h2Class}>
            {t.voicesTitlePre}
            <BrushWord>{t.voicesTitleWord}</BrushWord>
          </h2>
          <p className="m-0 max-w-measure text-pretty text-[17px] leading-[1.6] text-ink-body">{t.voicesIntro}</p>
        </Reveal>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-5">
          {t.voices.map((m, i) => (
            <Reveal key={m.q} delay={(i % 3) * 90}>
              <figure className="m-0 flex h-full flex-col gap-3.5 rounded-card bg-white p-7 shadow-ol-sm">
                <Brush fill="var(--clay)" className="h-2 w-16" />
                <blockquote className="m-0 flex-1 font-serif text-[19px] italic leading-[1.5]">« {m.q} »</blockquote>
                <figcaption className="flex flex-col text-[15px]">
                  <b>{m.name}</b>
                  {m.note && <span className="text-ink-soft">{m.note}</span>}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      <PartnersMarquee locale={locale} />

      {/* Espace entre la bande des partenaires et le bandeau d'appel (elle est
          sur fond sable, le bandeau sur fond crème : collés, ils se
          confondaient). */}
      <div>
        <CallBanner
          title={t.bannerTitle}
          text={t.bannerText}
          donateLabel={t.donate}
          sponsorLabel={t.sponsor}
          donateHref={href('/dons')}
          sponsorHref={href('/parrainer')}
          Icon={HeartIcon}
        />
      </div>
    </>
  );
}
