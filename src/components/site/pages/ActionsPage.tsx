import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import Image from 'next/image';
import { HeartIcon } from '@phosphor-icons/react/ssr';
import { Reveal } from '@/components/Reveal';
import { InnerHero } from '@/components/site/InnerHero';
import { Eyebrow, CallBanner } from '@/components/site/ui';
import { MobilePhotoCard } from '@/components/site/MobilePhotoCard';
import { localeHref, type Locale } from '@/lib/i18n';

// Bandeau de « Nos actions » : choix de Mazunda sur planches numérotées
// (07/10/2026), propre à cette page (les autres pages gardent la liste
// commune). `desktop: false` / `mobile: false` : retirée sur ce format seulement.
const HERO_POOL = [
  { src: '/hero-desktop/boys-2023-rentree-ol-photo-007.webp', position: '50% 50%' },
  { src: '/hero-desktop/centre-aere-2024-07-ol-photo-006.webp', position: '50% 50%' },
  { src: '/hero-desktop/centre-aere-2024-07-ol-photo-009.webp', position: '50% 50%' },
  { src: '/hero-desktop/centre-aere-2023-12-25-ol-photo-013.webp', position: '50% 50%', desktop: false },
  { src: '/hero-desktop/centre-aere-2023-02-tim-pt-009.webp', position: '50% 50%', desktop: false },
  { src: '/hero-desktop/centre-aere-2023-02-tim-pt-012.webp', position: '50% 50%' },
  { src: '/hero-desktop/centre-aere-2023-02-tim-pt-015.webp', position: '50% 50%' },
  { src: '/hero-desktop/centre-aere-2024-03-ol-photo-002.webp', position: '50% 50%' },
  { src: '/hero-desktop/centre-aere-2024-02-ol-photo-002.webp', position: '50% 50%', desktop: false },
  { src: '/hero-desktop/centre-aere-2024-02-ol-photo-006.webp', position: '50% 50%', desktop: false },
  { src: '/hero-desktop/centre-aere-2024-02-ol-photo-010.webp', position: '50% 50%', desktop: false },
  { src: '/hero-desktop/centre-aere-2022-06-tim-0160.webp', position: '50% 50%' },
  { src: '/hero-desktop/centre-aere-2022-06-tim-7516.webp', position: '50% 50%' },
  { src: '/hero-desktop/centre-aere-2023-12-02-ol-photo-008.webp', position: '50% 50%', desktop: false },
  { src: '/hero-desktop/centre-aere-2023-12-02-ol-photo-012.webp', position: '50% 50%', desktop: false },
  { src: '/hero-desktop/centre-aere-2023-09-17-ol-photo-012.webp', position: '50% 50%' }
];

const text = {
  fr: {
    title: 'Nos actions : ce que One Love a réalisé',
    desc: "Les réalisations de One Love à Kinshasa depuis 2017 : accueil des garçons de la rue, scolarité, centre aéré, fêtes de Noël, sport, sorties, repas, soin et écoute.",
    eyebrow: 'Nos actions',
    titlePre: 'Ce que nous avons ',
    titleWord: 'réalisé',
    intro: "Depuis 2017 à Kinshasa, pas à pas, avec nos éducateurs, nos bénévoles et nos soutiens.",
    donate: 'Faire un don',
    sponsor: 'Parrainer un enfant',
    heroAlt: 'Un jeune du centre fait tourner un ballon de basket sur son doigt.',
    items: [
      { when: 'Depuis 2017', k: 'Accueil', t: 'Un foyer pour les garçons de la rue', d: 'En 2017, nous ouvrons la One Love House pour accueillir à plein temps des garçons qui vivaient dans la rue. Ils étaient 4 au départ, 20 en 2020, 16 en 2025. Chacun y trouve un toit, des repas, des soins et une famille.', img: '/histoire/2017-les-garcons.webp', alt: 'Quatre garçons de la One Love House, en 2017.' },
      { when: 'Chaque rentrée', k: 'Scolarité', t: 'Tous les One Love Boys à l’école', d: 'Chaque année, nous inscrivons les garçons à l’école, du primaire au secondaire, avec uniforme, sac et fournitures. À la rentrée 2023, ils étaient douze, de la 2e primaire à la 3e secondaire. La scolarité coûte cher à Kinshasa : environ 720 $ par enfant et par an, hors fournitures.', img: '/histoire/2023-rentree.webp', alt: 'Des garçons sur le chemin de l’école, à la rentrée 2023.' },
      { when: 'Depuis 2021', k: 'Centre aéré', t: 'Un centre ouvert aux enfants des quartiers', d: 'Le mercredi (jeux et film), le samedi (bibliothèque, informatique, chorale, sport) et le dimanche (Parole de Dieu et repas), le One Love Center accueille une centaine d’enfants des quartiers défavorisés, avec un goûter à chaque fois. Un samedi de mars 2022, 90 enfants étaient présents.', img: '/histoire/2022-centre-aere.webp', alt: 'Les enfants rassemblés au centre aéré.' },
      { when: '2022', k: 'Solidarité', t: 'Des courses solidaires pour la scolarité', d: 'Les lycées français et belge de Kinshasa ont couru pour nos enfants. La course du lycée René Descartes a rapporté 1 542 $ en décembre 2022, de quoi payer le minerval de plusieurs enfants.', img: '/histoire/2022-course-lycee.webp', alt: 'La course du lycée français de Kinshasa.' },
      { when: 'Chaque décembre', k: 'Fêtes', t: 'Un vrai Noël pour des centaines d’enfants', d: 'Chaque année, nous offrons une fête de Noël aux enfants des rues et des quartiers difficiles : 60 enfants en 2021, 270 en 2023, avec 180 cadeaux offerts par Toylander. Le 24 décembre 2023, avec l’ONG Aide-moi à m’envoler, plus de 350 enfants ont reçu un cadeau.', img: '/histoire/2017-noel.webp', alt: 'Une fête de Noël à One Love.' },
      { when: 'Depuis 2018', k: 'Sport', t: 'Le football, et des tournois', d: 'Entraînements avec le centre de formation Ujana, matchs contre l’équipe du lycée René Descartes, tournois à Matadi et à Muanda en 2022, où nos garçons ont même battu une équipe de seniors : le sport tient une grande place à One Love.', img: '/histoire/2025-foot.webp', alt: 'Partie de football dans la cour du centre.' },
      { when: 'Janvier 2022', k: 'Sorties', t: 'Découvrir son pays', d: 'Nous emmenons les enfants découvrir ce qu’ils n’ont jamais vu : le parc de la vallée de la Nsele avec 54 enfants du centre aéré et nos One Love Boys, l’océan à Muanda, le cinéma.', img: '/histoire/2022-nsele.webp', alt: 'Les enfants au parc de la vallée de la Nsele.' },
      { when: 'Juillet 2022', k: 'Voyage solidaire', t: '« Congo je t’aime »', d: 'Quinze jours en RDC avec onze bénévoles : repas partagé avec 120 enfants du centre aéré, tournois de foot, évangélisation avec Gospel Nation et découverte du pays avec les garçons.', img: '/histoire/2022-congo-je-taime.webp', alt: 'Avec les enfants, pendant le voyage « Congo je t’aime ».' },
      { when: 'Depuis 2020', k: 'Repas', t: 'Nourrir les enfants', d: 'Nous partageons des repas avec les enfants du centre et, pendant les périodes les plus dures comme le confinement de 2020, avec ceux qui restaient dehors, deux fois par semaine.', img: '/histoire/2023-repas.webp', alt: 'Distribution de repas au centre.' },
      { when: '2025', k: 'Soin et écoute', t: 'Prendre soin du corps et du cœur', d: 'Nos éducateurs ont été formés aux premiers secours en 2022. Depuis 2025, des professionnels de santé passent deux fois par mois au centre, et une psychologue aide les enfants à mettre des mots sur ce qui est difficile.', img: '/histoire/2025-centre.webp', alt: 'Les enfants rassemblés dans la cour du centre.' }
    ],
    bannerTitle: 'Chaque action tient grâce à des soutiens réguliers.',
    bannerText: 'Un don ou un parrainage nous permet de continuer, semaine après semaine.'
  },
  en: {
    title: 'Our work: what One Love has achieved',
    desc: 'What One Love has achieved in Kinshasa since 2017: welcoming street boys, schooling, the day centre, Christmas parties, sport, outings, meals, care and listening.',
    eyebrow: 'Our work',
    titlePre: 'What we have ',
    titleWord: 'achieved',
    intro: 'Since 2017 in Kinshasa, step by step, with our educators, volunteers and supporters.',
    donate: 'Donate',
    sponsor: 'Sponsor a child',
    heroAlt: 'A young man from the centre spinning a basketball on his finger.',
    items: [
      { when: 'Since 2017', k: 'Home', t: 'A home for street boys', d: 'In 2017, we opened the One Love House to welcome full time boys who used to live on the street. There were 4 at first, 20 in 2020, 16 in 2025. Each finds a roof, meals, care and a family there.', img: '/histoire/2017-les-garcons.webp', alt: 'Four boys of the One Love House, in 2017.' },
      { when: 'Every school year', k: 'Schooling', t: 'Every One Love Boy at school', d: 'Every year, we enrol the boys at school, from primary to secondary, with uniform, bag and supplies. At the start of the 2023 school year there were twelve of them, from year 2 of primary to year 3 of secondary. School is expensive in Kinshasa: about $720 per child per year, not counting supplies.', img: '/histoire/2023-rentree.webp', alt: 'Boys on their way to school, at the start of the 2023 school year.' },
      { when: 'Since 2021', k: 'Day centre', t: 'A centre open to children from the neighbourhoods', d: 'On Wednesdays (games and a film), Saturdays (library, computers, choir, sport) and Sundays (the Word of God and a meal), the One Love Center welcomes around a hundred children from disadvantaged neighbourhoods, with a snack each time. On one Saturday in March 2022, 90 children came.', img: '/histoire/2022-centre-aere.webp', alt: 'Children gathered at the day centre.' },
      { when: '2022', k: 'Solidarity', t: 'Charity runs for schooling', d: 'The French and Belgian schools of Kinshasa ran for our children. The René Descartes school run raised $1,542 in December 2022, enough to pay the school fees of several children.', img: '/histoire/2022-course-lycee.webp', alt: 'The French school run in Kinshasa.' },
      { when: 'Every December', k: 'Celebrations', t: 'A real Christmas for hundreds of children', d: 'Every year, we hold a Christmas party for street children and children from difficult neighbourhoods: 60 children in 2021, 270 in 2023, with 180 presents donated by Toylander. On 24 December 2023, with the NGO Aide-moi à m’envoler, more than 350 children received a present.', img: '/histoire/2017-noel.webp', alt: 'A Christmas party at One Love.' },
      { when: 'Since 2018', k: 'Sport', t: 'Football, and tournaments', d: 'Training with the Ujana academy, matches against the René Descartes school team, tournaments in Matadi and Muanda in 2022, where our boys even beat a team of seniors: sport plays a big part at One Love.', img: '/histoire/2025-foot.webp', alt: 'Football in the centre’s courtyard.' },
      { when: 'January 2022', k: 'Outings', t: 'Discovering their country', d: 'We take the children to see what they have never seen: the Nsele valley park with 54 day-centre children and our One Love Boys, the ocean in Muanda, the cinema.', img: '/histoire/2022-nsele.webp', alt: 'The children at the Nsele valley park.' },
      { when: 'July 2022', k: 'Solidarity trip', t: '“Congo je t’aime”', d: 'Two weeks in the DRC with eleven volunteers: a meal shared with 120 day-centre children, football tournaments, evangelism with Gospel Nation and discovering the country with the boys.', img: '/histoire/2022-congo-je-taime.webp', alt: 'With the children, during the “Congo je t’aime” trip.' },
      { when: 'Since 2020', k: 'Meals', t: 'Feeding the children', d: 'We share meals with the children at the centre and, in the hardest times such as the 2020 lockdown, with those who stayed on the street, twice a week.', img: '/histoire/2023-repas.webp', alt: 'Meals being handed out at the centre.' },
      { when: '2025', k: 'Care and listening', t: 'Caring for body and heart', d: 'Our educators were trained in first aid in 2022. Since 2025, health professionals visit the centre twice a month, and a psychologist helps the children put words to what is hard.', img: '/histoire/2025-centre.webp', alt: 'The children gathered in the centre’s courtyard.' }
    ],
    bannerTitle: 'Every action relies on regular support.',
    bannerText: 'A gift or a sponsorship lets us keep going, week after week.'
  }
};

export function actionsMetadata(locale: Locale): Metadata {
  const t = text[locale];
  return pageMetadata({ locale, path: '/actions', title: t.title, description: t.desc });
}

export function ActionsPage({ locale }: { locale: Locale }) {
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
        image="/hero-desktop/centre-aere-2022-06-tim-0160.webp"
        imageAlt={t.heroAlt}
        objectPosition="50% 50%"
        photoPool={HERO_POOL}
        cta={{ donate: t.donate, sponsor: t.sponsor }}
      />

      {/* Réalisations concrètes, tirées des publications de l'association
          (Instagram, 2017-2026). RÊVES 2 n'est plus mis en avant ici : il reste
          dans Actualités (demande du 04/10/2026). */}
      <section className="mx-auto flex max-w-[1200px] flex-col gap-[clamp(48px,7vw,88px)] px-[clamp(20px,4vw,32px)] py-[clamp(56px,8vw,104px)]">
        {t.items.map((a, i) => {
          const imgFirst = i % 2 === 0;
          return (
            <div key={a.t}>
              <div className="md:hidden">
                <MobilePhotoCard
                  src={a.img}
                  alt={a.alt}
                  heightClass="h-[480px]"
                  badge={
                    <span className="inline-flex items-center gap-2 rounded-full bg-cream px-3 py-1.5 text-[13px] font-extrabold uppercase tracking-[0.08em] text-copper-700">
                      {a.k} · {a.when}
                    </span>
                  }
                  title={a.t}
                  text={a.d}
                />
              </div>
              <Reveal className="hidden grid-cols-[repeat(auto-fit,minmax(min(100%,360px),1fr))] items-center gap-[clamp(28px,5vw,64px)] md:grid">
                <div className={`relative aspect-[4/3] overflow-hidden rounded-card ${imgFirst ? 'dk:order-1' : 'dk:order-2'}`}>
                  <Reveal variant="zoom" className="absolute inset-0">
                    <Image src={a.img} alt={a.alt} fill sizes="(max-width: 1200px) 100vw, 560px" loading="lazy" className="photo-tone object-cover object-[50%_40%]" />
                  </Reveal>
                </div>
                <div className={`flex flex-col gap-3.5 ${imgFirst ? 'dk:order-2' : 'dk:order-1'}`}>
                  <Reveal variant="soft" delay={200} className="flex flex-wrap items-center gap-3">
                    <Eyebrow>{a.k}</Eyebrow>
                    <span className="rounded-full bg-copper-tint-2 px-3 py-1 text-[13px] font-bold text-copper-700">{a.when}</span>
                  </Reveal>
                  <Reveal variant="soft" delay={320}>
                    <h2 className="m-0 font-serif text-[clamp(28px,3vw,38px)] font-medium leading-[1.2]">{a.t}</h2>
                  </Reveal>
                  <Reveal variant="soft" delay={440}>
                    <p className="max-w-measure m-0 text-pretty text-[17px] leading-[1.65] text-ink-body">{a.d}</p>
                  </Reveal>
                </div>
              </Reveal>
            </div>
          );
        })}
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
