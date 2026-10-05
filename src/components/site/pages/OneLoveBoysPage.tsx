import type { Metadata } from 'next';
import { HeartIcon, HouseIcon, GraduationCapIcon, SoccerBallIcon, CakeIcon, FirstAidIcon, MusicNotesIcon } from '@phosphor-icons/react/ssr';
import { pageMetadata } from '@/lib/seo';
import { Reveal } from '@/components/Reveal';
import { InnerHero } from '@/components/site/InnerHero';
import { CallBanner, Eyebrow, BrushWord, h2Class } from '@/components/site/ui';
import { PhotoArchive } from '@/components/site/PhotoArchive';
import { BOYS_ALBUMS } from '@/lib/one-love-boys';
import { localeHref, type Locale } from '@/lib/i18n';

// Page des One Love Boys. Textes : publications de l'association (Instagram,
// 2017-2025). Aucun prénom d'enfant (protection de l'enfance). Photos : Drive
// de l'association, dossier « One Love - Boys ».

const text = {
  fr: {
    title: 'Les One Love Boys, accueillis à plein temps',
    desc: 'Des garçons qui vivaient dans la rue à Kinshasa, accueillis à plein temps à la One Love House : un foyer, l’école, les soins et une famille.',
    eyebrow: 'À plein temps',
    titlePre: 'Les One Love ',
    titleWord: 'Boys',
    intro: 'Des garçons qui vivaient dans la rue, et qui ont trouvé à la One Love House un foyer, l’école et une famille.',
    heroAlt: 'Cinq One Love Boys en bonnet de Noël, serrés les uns contre les autres et souriants.',
    storyEyebrow: 'Leur histoire',
    storyTitlePre: 'De la rue à la ',
    storyTitleWord: 'maison',
    story: [
      'Tout commence en 2017 : nous ouvrons la One Love House pour accueillir des garçons rencontrés dans la rue, parfois sous la pluie, sans toit ni famille. Ils étaient quatre au départ, une vingtaine en 2020, seize en 2025.',
      'Pour nous, ce ne sont pas des bénéficiaires : ce sont des fils et des petits frères. Notre amour pour eux ne dépend pas de ce qu’ils font ou ne font pas. Le chemin n’est pas toujours simple : la rue appelle encore certains, et la guérison prend du temps, différemment pour chacun. Mais nous les voyons changer, grandir en sagesse et en confiance.'
    ],
    lifeEyebrow: 'Leur quotidien',
    lifeTitlePre: 'Une vie de ',
    lifeTitleWord: 'famille',
    life: [
      { icon: HouseIcon, t: 'Un foyer', d: 'Un toit, des repas, des vêtements et un cadre, avec des règles et des horaires qui les aident à se reconstruire.' },
      { icon: GraduationCapIcon, t: 'L’école', d: 'Chaque année, nous les inscrivons à l’école, du primaire au secondaire. À la rentrée 2023, ils étaient douze, en uniforme et sac au dos.' },
      { icon: FirstAidIcon, t: 'La santé', d: 'Consultations médicales, soins et écoute : nous veillons sur leur santé comme sur leur cœur.' },
      { icon: SoccerBallIcon, t: 'Le sport', d: 'Entraînements de football, tournois à Matadi et à Muanda, matchs contre l’équipe du lycée René Descartes.' },
      { icon: CakeIcon, t: 'Les fêtes', d: 'Anniversaires fêtés ensemble, Noël, sorties au parc, à la piscine ou au cinéma, et un week-end en famille chaque année.' },
      { icon: MusicNotesIcon, t: 'Les talents', d: 'Cours de guitare, chant, et même un court-métrage écrit et joué par certains d’entre eux en 2019.' }
    ],
    galleryEyebrow: 'En images',
    galleryTitlePre: 'Les Boys, ',
    galleryTitleWord: 'année après année',
    galleryText: 'Les photos des One Love Boys, classées par année. Touchez une photo pour l’agrandir.',
    altPrefix: 'Les One Love Boys',
    bannerTitle: 'Chaque garçon a besoin de parrains.',
    bannerText: 'Le parrainage finance l’école, la maison, la nourriture et les soins d’un enfant, mois après mois.',
    donate: 'Faire un don',
    sponsor: 'Parrainer un enfant'
  },
  en: {
    title: 'The One Love Boys, welcomed full time',
    desc: 'Boys who used to live on the streets of Kinshasa, welcomed full time at the One Love House: a home, school, care and a family.',
    eyebrow: 'Full time',
    titlePre: 'The One Love ',
    titleWord: 'Boys',
    intro: 'Boys who used to live on the street, and who found a home, school and a family at the One Love House.',
    heroAlt: 'Five One Love Boys in Christmas hats, huddled together and smiling.',
    storyEyebrow: 'Their story',
    storyTitlePre: 'From the street to ',
    storyTitleWord: 'home',
    story: [
      'It all began in 2017: we opened the One Love House to welcome boys we met on the street, sometimes in the rain, with no roof and no family. There were four at first, about twenty in 2020, sixteen in 2025.',
      'To us, they are not beneficiaries: they are sons and little brothers. Our love for them does not depend on what they do or do not do. The road is not always easy: the street still calls some of them, and healing takes time, differently for each one. But we see them change, and grow in wisdom and confidence.'
    ],
    lifeEyebrow: 'Their daily life',
    lifeTitlePre: 'A ',
    lifeTitleWord: 'family life',
    life: [
      { icon: HouseIcon, t: 'A home', d: 'A roof, meals, clothes and a framework, with rules and routines that help them rebuild.' },
      { icon: GraduationCapIcon, t: 'School', d: 'Every year, we enrol them at school, from primary to secondary. At the start of the 2023 school year there were twelve of them, in uniform with their backpacks.' },
      { icon: FirstAidIcon, t: 'Health', d: 'Medical check-ups, care and listening: we look after their health as well as their hearts.' },
      { icon: SoccerBallIcon, t: 'Sport', d: 'Football training, tournaments in Matadi and Muanda, matches against the René Descartes school team.' },
      { icon: CakeIcon, t: 'Celebrations', d: 'Birthdays celebrated together, Christmas, outings to the park, the pool or the cinema, and a family weekend every year.' },
      { icon: MusicNotesIcon, t: 'Talents', d: 'Guitar lessons, singing, and even a short film written and acted by some of them in 2019.' }
    ],
    galleryEyebrow: 'In pictures',
    galleryTitlePre: 'The Boys, ',
    galleryTitleWord: 'year after year',
    galleryText: 'Photos of the One Love Boys, sorted by year. Tap a photo to enlarge it.',
    altPrefix: 'The One Love Boys',
    bannerTitle: 'Every boy needs sponsors.',
    bannerText: 'Sponsorship funds a child’s school, home, food and care, month after month.',
    donate: 'Donate',
    sponsor: 'Sponsor a child'
  }
};

export function oneLoveBoysMetadata(locale: Locale): Metadata {
  const t = text[locale];
  return pageMetadata({ locale, path: '/one-love-boys', title: t.title, description: t.desc });
}

function Head({ eyebrow, pre, word, id }: { eyebrow: string; pre: string; word: string; id: string }) {
  return (
    <Reveal className="flex max-w-[680px] flex-col gap-3">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 id={id} className={h2Class}>
        {pre}
        <BrushWord>{word}</BrushWord>
      </h2>
    </Reveal>
  );
}

export function OneLoveBoysPage({ locale }: { locale: Locale }) {
  const t = text[locale];
  const href = (p: string) => localeHref(p, locale);
  const wrap = 'mx-auto flex max-w-[1200px] flex-col gap-8 px-[clamp(20px,4vw,32px)] py-[clamp(40px,6vw,72px)]';

  return (
    <>
      <InnerHero
        locale={locale}
        eyebrow={t.eyebrow}
        titlePre={t.titlePre}
        titleWord={t.titleWord}
        intro={t.intro}
        image="/photos/drive/boys-noel-2022.jpg"
        imageAlt={t.heroAlt}
        objectPosition="50% 35%"
        still
      />

      <section aria-labelledby="boys-histoire">
        <div className={`${wrap} dk:grid dk:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] dk:items-start dk:gap-14`}>
          <Head eyebrow={t.storyEyebrow} pre={t.storyTitlePre} word={t.storyTitleWord} id="boys-histoire" />
          <Reveal delay={80} className="flex flex-col gap-4 rounded-card bg-copper-tint p-[clamp(24px,3vw,36px)]">
            {t.story.map((p) => (
              <p key={p.slice(0, 24)} className="m-0 max-w-measure text-pretty text-[17px] leading-[1.7] text-ink-body">{p}</p>
            ))}
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="boys-quotidien" className="bg-sand">
        <div className={wrap}>
          <Head eyebrow={t.lifeEyebrow} pre={t.lifeTitlePre} word={t.lifeTitleWord} id="boys-quotidien" />
          <ul className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-5 p-0">
            {t.life.map((d, i) => {
              const Icon = d.icon;
              return (
                <li key={d.t}>
                  <Reveal delay={i * 80} className="flex h-full flex-col gap-3 rounded-card bg-cream p-6">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-copper-tint-2">
                      <Icon size={26} className="text-copper-600" aria-hidden />
                    </span>
                    <h3 className="m-0 font-serif text-[22px] font-medium leading-[1.25] text-ink">{d.t}</h3>
                    <p className="m-0 text-pretty text-[16px] leading-[1.6] text-ink-body">{d.d}</p>
                  </Reveal>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {BOYS_ALBUMS.length > 0 && (
        <section aria-labelledby="boys-photos">
          <div className={wrap}>
            <Head eyebrow={t.galleryEyebrow} pre={t.galleryTitlePre} word={t.galleryTitleWord} id="boys-photos" />
            <p className="-mt-3 m-0 max-w-measure text-pretty text-[16px] leading-[1.6] text-ink-body">{t.galleryText}</p>
            <PhotoArchive months={BOYS_ALBUMS} locale={locale} altPrefix={t.altPrefix} />
          </div>
        </section>
      )}

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
