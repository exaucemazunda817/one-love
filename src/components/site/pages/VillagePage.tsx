import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRightIcon, HeartIcon } from '@phosphor-icons/react/ssr';
import { pageMetadata } from '@/lib/seo';
import { Reveal } from '@/components/Reveal';
import { InnerHero } from '@/components/site/InnerHero';
import { Brush, BrushWord, CallBanner, Eyebrow, h2Class } from '@/components/site/ui';
import { SwipeDots } from '@/components/site/SwipeDots';
import { MediaItem, photo, video, type Media } from '@/components/site/pages/HistoryPage';
import { FACEBOOK_URL, INSTAGRAM_URL, YOUTUBE_URL, localeHref, type Locale } from '@/lib/i18n';

// Page « One Love Village » : le grand projet de Kasangulu. Sources : la vidéo
// de Kanda et Maïté sur le terrain (2023, transcrite le 05/10/2026), les
// publications Instagram de l'association (dîners 2023 et 2024, guérite) et
// « Notre histoire ». Les montants cités dans la vidéo (2 000 € pour la guérite,
// 2 000 € pour l'avant-projet) datent de 2023 : ils ne sont pas repris.
// Photos : public/histoire (village-*.webp), vidéos : public/histoire/videos.

const STEP_ART = ['/illustrations/village-guerite.svg', '/illustrations/village-avant-projet.svg', '/illustrations/village-maquette.svg'];

// Une photo par date du « chemin parcouru » (06/10/2026).
const PATH_PHOTOS = [
  { src: '/histoire/2015-salle-de-classe.webp', pos: '50% 45%', alt: { fr: 'Une salle de classe, en 2015.', en: 'A classroom, in 2015.' } },
  { src: '/histoire/2018-kasangulu-2.webp', pos: '50% 40%', alt: { fr: 'Débroussaillage du terrain de Kasangulu, en 2018.', en: 'Clearing the Kasangulu land, in 2018.' } },
  { src: '/photos/drive/diner-2023-invites.jpg', pos: '50% 30%', alt: { fr: 'Des invités au premier dîner caritatif, en 2023.', en: 'Guests at the first charity dinner, in 2023.' } },
  { src: '/histoire/2024-diner.webp', pos: '50% 35%', alt: { fr: 'Le dîner caritatif de 2024.', en: 'The 2024 charity dinner.' } }
];

const film: Media = video(
  '2023-kasangulu-village',
  'wide',
  'Sur le terrain de Kasangulu, où doit naître le One Love Village.',
  'On the Kasangulu land, where the One Love Village is to be built.'
);

const youtube: Media = {
  kind: 'youtube',
  id: 'LVjFUCIx9T8',
  title: { fr: 'Premier repérage du terrain de Kasangulu (2015)', en: 'First visit to the Kasangulu land (2015)' }
};

const gallery: Media[] = [
  photo('village-terrain-ciel', 'portrait', 'Le terrain de Kasangulu, sous un ciel d’orage.', 'The Kasangulu land under a stormy sky.'),
  photo('village-terrain-equipe', 'portrait', 'Notre équipe sur le terrain.', 'Our team on the land.'),
  photo('village-terrain-chemin', 'portrait', 'Le chemin qui mène au terrain.', 'The path leading to the land.'),
  photo('village-terrain-palmier', 'portrait', 'Le terrain et les collines de Kasangulu.', 'The land and the hills of Kasangulu.'),
  photo('village-terrain-piste', 'portrait', 'La piste d’accès au terrain.', 'The access track to the land.'),
  photo('village-chantier-coucher-soleil', 'portrait', 'Des engins au travail sur le terrain, au coucher du soleil.', 'Machines at work on the land, at sunset.'),
  photo('2018-kasangulu', 'square', 'Débroussaillage du terrain de Kasangulu, en 2018.', 'Clearing the Kasangulu land, in 2018.'),
  photo('2018-kasangulu-2', 'square', 'L’équipe au travail sur le terrain de Kasangulu.', 'The team at work on the Kasangulu land.'),
  photo('2023-kasangulu', 'portrait', 'Le terrain de Kasangulu.', 'The Kasangulu land.'),
  photo('2023-kasangulu-2', 'portrait', 'Les travaux commencent à Kasangulu.', 'Work begins in Kasangulu.')
];

const dinners: Media[] = [
  video('2023-diner-caritatif', 'square', 'Le premier dîner caritatif, le 8 décembre 2023.', 'The first charity dinner, 8 December 2023.'),
  video('2024-merci-diner', 'portrait', 'Merci après le deuxième dîner, le 13 décembre 2024.', 'Thank you after the second dinner, 13 December 2024.')
];

// Seules les photos du chantier et du terrain défilent dans le bandeau.
// Choix de Mazunda sur planches numérotées (07/10/2026) : sur ordinateur, cinq
// photos du terrain et du chantier ; sur téléphone, les deux vues du drone (les
// autres photos, en basse résolution, y seraient floues).
const heroPool = [
  { src: '/hero-desktop/village-drone-terrain.webp', position: '50% 50%', desktop: false },
  { src: '/hero-desktop/village-drone-brume.webp', position: '50% 50%', desktop: false },
  { src: '/histoire/village-hero.webp', position: '50% 55%' },
  { src: '/histoire/village-terrain-palmier.webp', position: '50% 70%' },
  { src: '/histoire/village-chantier-coucher-soleil.webp', position: '50% 60%' },
  { src: '/histoire/2023-kasangulu.webp', position: '50% 50%' },
  { src: '/histoire/2023-kasangulu-2.webp', position: '50% 50%' }
];

const text = {
  fr: {
    title: 'One Love Village, notre projet à Kasangulu',
    desc: 'Le One Love Village : un centre socio-éducatif et sportif en construction à Kasangulu, près de Kinshasa. Le projet, la vidéo qui l’explique, les dîners caritatifs et le terrain en images.',
    eyebrow: 'Grand projet en construction',
    titlePre: 'One Love ',
    titleWord: 'Village',
    intro: 'Sur notre terrain de Kasangulu, nous construisons un lieu pour accueillir, instruire et faire grandir les enfants.',
    heroAlt: 'Le terrain de Kasangulu, où sera bâti le village.',
    bannerTitle: 'Le village se construit avec vous.',
    bannerText: 'Votre don pour ce projet va entièrement à la construction du One Love Village.',
    accompany: 'Nous accompagner sur ce projet',
    leadEyebrow: 'Le projet, concrètement',
    leadTitlePre: 'Un centre pour ',
    leadTitleWord: 'grandir',
    lead: [
      'Le One Love Village sera un grand centre socio-éducatif et sportif, construit sur le terrain que nous possédons à Kasangulu, une petite ville à 25 km au sud de Kinshasa. Il accueillera des enfants défavorisés et leur offrira une éducation de qualité : c’est le sens de notre appel « Une école pour tous ».',
      'Autour de l’école, le village fera aussi place au sport, avec des centres de formation en basket, et à l’agriculture, avec une mini-ferme pédagogique, un potager et des plantations d’arbres.'
    ],
    stepsTitle: 'Les étapes en cours',
    stepLabel: 'ÉTAPE',
    steps: [
      { t: 'La guérite', d: 'Le premier bâtiment, à l’entrée du terrain. Il sert à stocker le matériel et à récupérer l’eau de pluie de son toit, pour lancer le potager et les plantations.' },
      { t: 'L’avant-projet', d: 'Architecte, géomètre, plans de préparation du terrain et d’implantation des bâtiments.' },
      { t: 'La maquette', d: 'Une maquette en trois dimensions, pour vous montrer le village tel que nous le rêvons.' }
    ],
    droneAlt: 'Vue aérienne du terrain de Kasangulu, entre collines boisées et brume.',
    filmEyebrow: 'La vidéo explicative',
    filmTitlePre: 'Tout le projet, ',
    filmTitleWord: 'en trois minutes',
    filmText: 'Kanda et Maïté vous présentent le One Love Village depuis le terrain de Kasangulu.',
    pathEyebrow: 'Le chemin parcouru',
    pathTitlePre: 'Du premier repérage aux ',
    pathTitleWord: 'premiers travaux',
    path: [
      { year: '2015', title: 'Un projet d’école', text: 'Notre but de départ est concret : construire une école au Congo. En août, nous repérons et bornons le terrain de Kasangulu.' },
      { year: '2018', title: 'Le premier débroussaillage', text: 'Notre équipe se met au travail sur le terrain pour le dégager.' },
      { year: '2023', title: 'La guérite et le premier dîner', text: 'La construction de la guérite commence. Le 8 décembre, le premier dîner caritatif lance la levée de fonds du village.' },
      { year: '2024', title: 'Une deuxième édition', text: 'Le 13 décembre, un nouveau dîner rassemble nos soutiens et de grands partenaires, dont la Fondation Vodacom.' }
    ],
    galleryEyebrow: 'En images',
    galleryTitlePre: 'Le terrain de ',
    galleryTitleWord: 'Kasangulu',
    dinnersEyebrow: 'Ceux qui le rendent possible',
    dinnersTitlePre: 'Deux dîners ',
    dinnersTitleWord: 'caritatifs',
    dinners: [
      {
        t: '8 décembre 2023 : « Une école pour tous »',
        d: [
          'Le premier dîner caritatif One Love a réuni 236 invités sous le chapiteau de l’hôtel Pullman, à Kinshasa. Son but était clair : construire une école pour les enfants vulnérables, et lancer officiellement la levée de fonds du One Love Village.',
          'Au programme : un spectacle de danse et de chant, une tombola aux nombreux lots offerts par nos partenaires, et la présentation du projet avec des images inédites du terrain. Dans la foulée, nous avons ouvert une promesse de don pour que chacun puisse participer à la construction, depuis la France comme depuis le Congo.'
        ]
      },
      {
        t: '13 décembre 2024 : la deuxième édition',
        d: [
          'Un an plus tard, près de 200 personnes se sont retrouvées au même endroit pour la deuxième édition, avec un sponsor premium, la Fondation Vodacom, et de nombreux partenaires, de Toylander à PPC.',
          'Grâce à ces deux soirées, de nouveaux projets ont pu prendre vie pour les enfants que nous accompagnons chaque jour, et le village continue d’avancer.'
        ]
      }
    ],
    followTitle: 'Suivre le chantier',
    followText: 'Nous partageons l’avancée du projet sur nos réseaux.',
    facebook: 'Facebook',
    instagram: 'Instagram',
    youtube: 'YouTube',
    historyLink: 'Lire toute notre histoire',
    play: 'Lire la vidéo'
  },
  en: {
    title: 'One Love Village, our project in Kasangulu',
    desc: 'The One Love Village: a socio-educational and sports centre under construction in Kasangulu, near Kinshasa. The project, the video that explains it, the charity dinners and the land in pictures.',
    eyebrow: 'Large project under construction',
    titlePre: 'One Love ',
    titleWord: 'Village',
    intro: 'On our land in Kasangulu, we are building a place to welcome, educate and help children grow.',
    heroAlt: 'The Kasangulu land, where the village will be built.',
    bannerTitle: 'The village is built with you.',
    bannerText: 'Your gift to this project goes entirely to building the One Love Village.',
    accompany: 'Support this project',
    leadEyebrow: 'The project, in practice',
    leadTitlePre: 'A centre to ',
    leadTitleWord: 'grow up in',
    lead: [
      'The One Love Village will be a large socio-educational and sports centre, built on the land we own in Kasangulu, a small town 25 km south of Kinshasa. It will welcome disadvantaged children and give them a quality education: that is the meaning of our call, “A school for all”.',
      'Around the school, the village will also make room for sport, with basketball training centres, and for farming, with a small teaching farm, a vegetable garden and tree planting.'
    ],
    stepsTitle: 'Current steps',
    stepLabel: 'STEP',
    steps: [
      { t: 'The gatehouse', d: 'The first building, at the entrance to the land. It stores equipment and collects rainwater from its roof, to start the garden and the planting.' },
      { t: 'The preliminary design', d: 'Architect, surveyor, plans for preparing the land and siting the buildings.' },
      { t: 'The model', d: 'A three-dimensional model, to show you the village as we dream it.' }
    ],
    droneAlt: 'Aerial view of the Kasangulu land, between wooded hills and mist.',
    filmEyebrow: 'The explainer video',
    filmTitlePre: 'The whole project, ',
    filmTitleWord: 'in three minutes',
    filmText: 'Kanda and Maïté present the One Love Village from the Kasangulu land.',
    pathEyebrow: 'The road so far',
    pathTitlePre: 'From the first visit to the ',
    pathTitleWord: 'first works',
    path: [
      { year: '2015', title: 'A school project', text: 'Our starting goal is concrete: build a school in Congo. In August, we survey and mark out the Kasangulu land.' },
      { year: '2018', title: 'The first clearing', text: 'Our team gets to work on the land to clear it.' },
      { year: '2023', title: 'The gatehouse and the first dinner', text: 'Building the gatehouse begins. On 8 December, the first charity dinner launches the village fundraising.' },
      { year: '2024', title: 'A second edition', text: 'On 13 December, a new dinner brings together our supporters and major partners, including the Vodacom Foundation.' }
    ],
    galleryEyebrow: 'In pictures',
    galleryTitlePre: 'The land in ',
    galleryTitleWord: 'Kasangulu',
    dinnersEyebrow: 'Those who make it possible',
    dinnersTitlePre: 'Two ',
    dinnersTitleWord: 'charity dinners',
    dinners: [
      {
        t: '8 December 2023: “A school for all”',
        d: [
          'The first One Love charity dinner brought 236 guests together under the marquee of the Pullman hotel in Kinshasa. Its goal was clear: build a school for vulnerable children, and officially launch the One Love Village fundraising.',
          'On the programme: a dance and singing show, a raffle with many prizes donated by our partners, and a presentation of the project with never-before-seen images of the land. Straight afterwards, we opened a pledge so that everyone could take part in the building, from France as well as from Congo.'
        ]
      },
      {
        t: '13 December 2024: the second edition',
        d: [
          'A year later, nearly 200 people met at the same place for the second edition, with a premium sponsor, the Vodacom Foundation, and many partners, from Toylander to PPC.',
          'Thanks to these two evenings, new projects have come to life for the children we support every day, and the village keeps moving forward.'
        ]
      }
    ],
    followTitle: 'Follow the building work',
    followText: 'We share the progress of the project on our social networks.',
    facebook: 'Facebook',
    instagram: 'Instagram',
    youtube: 'YouTube',
    historyLink: 'Read our whole story',
    play: 'Play video'
  }
} as const satisfies Record<Locale, unknown>;

export function villageMetadata(locale: Locale): Metadata {
  const t = text[locale];
  return pageMetadata({ locale, path: '/projets/village', title: t.title, description: t.desc });
}

function SectionHead({ eyebrow, pre, word, id }: { eyebrow: string; pre: string; word: string; id: string }) {
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

export function VillagePage({ locale }: { locale: Locale }) {
  const t = text[locale];
  const href = (p: string) => localeHref(p, locale);
  const wrap = 'mx-auto flex max-w-[1200px] flex-col gap-10 px-[clamp(20px,4vw,32px)] py-[clamp(36px,5vw,64px)]';
  const link =
    'inline-flex min-h-11 items-center rounded-full border-[1.5px] border-field-line px-5 text-[14px] font-bold text-ink no-underline transition-colors hover:border-copper-600 hover:text-copper-700';
  const villageDonate = `${href('/dons')}?affectation=village`;

  return (
    <>
      <InnerHero
        locale={locale}
        eyebrow={t.eyebrow}
        titlePre={t.titlePre}
        titleWord={t.titleWord}
        intro={t.intro}
        image="/histoire/village-hero.webp"
        imageMobile="/hero-mobile/village-drone-terrain.webp"
        imageAlt={t.heroAlt}
        objectPosition="50% 55%"
        photoPool={heroPool}
      />

      {/* Appel en haut de page, un seul bouton : don réservé au village
          (demande de Mazunda du 04/10/2026). */}
      <CallBanner
        title={t.bannerTitle}
        text={t.bannerText}
        donateLabel={t.accompany}
        donateHref={villageDonate}
        Icon={HeartIcon}
      />

      <section aria-labelledby="village-projet">
        <div className={`${wrap} pt-0`}>
          <div className="dk:grid dk:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] dk:items-start dk:gap-14">
            <SectionHead eyebrow={t.leadEyebrow} pre={t.leadTitlePre} word={t.leadTitleWord} id="village-projet" />
            <Reveal delay={80} className="mt-6 flex flex-col gap-4 rounded-card bg-copper-tint p-[clamp(24px,3vw,36px)] dk:mt-0">
              {t.lead.map((para) => (
                <p key={para.slice(0, 24)} className="m-0 max-w-measure text-[17px] leading-[1.7] text-ink-body">{para}</p>
              ))}
            </Reveal>
          </div>
          <Reveal className="relative aspect-[16/9] overflow-hidden rounded-card bg-night shadow-ol-photo">
            <Image src="/photos/drive/drone-kasangulu-brume.jpg" alt={t.droneAlt} fill sizes="(max-width: 1200px) 100vw, 1136px" className="object-cover" />
          </Reveal>
          <div className="flex flex-col gap-5">
            <h3 className="m-0 font-serif text-[clamp(22px,2.4vw,28px)] font-medium">{t.stepsTitle}</h3>
            <ol className="ol-swipe m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-5 p-0">
              {t.steps.map((st, i) => (
                <li key={st.t}>
                  <Reveal delay={i * 90} className="ol-spot flex h-full flex-col overflow-hidden rounded-card bg-white shadow-ol-sm">
                    {/* Illustration dessinée pour l'étape (06/10/2026) : pas de
                        photo réelle de la maquette ni des plans à ce jour. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={STEP_ART[i]} alt="" width={640} height={400} loading="lazy" className="block aspect-[16/10] w-full object-cover" />
                    <div className="flex flex-col gap-2 p-6">
                      <span className="text-[13px] font-extrabold tracking-[0.12em] text-copper-700">{t.stepLabel} {i + 1}</span>
                      <h4 className="m-0 font-serif text-[21px] font-medium text-ink">{st.t}</h4>
                      <p className="m-0 text-[16px] leading-[1.6] text-ink-body">{st.d}</p>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ol>
            <SwipeDots count={t.steps.length} label={t.stepsTitle} />
          </div>
        </div>
      </section>

      {/* La vidéo explicative, seule et en grand : c'est elle qui détaille tout le projet. */}
      <section aria-labelledby="village-film" className="bg-night text-cream">
        <div className={wrap}>
          <Reveal className="flex max-w-[720px] flex-col gap-3">
            <Eyebrow dark>{t.filmEyebrow}</Eyebrow>
            <h2 id="village-film" className="m-0 font-serif text-[clamp(32px,4vw,52px)] font-semibold leading-[1.1]">
              {t.filmTitlePre}
              <BrushWord>{t.filmTitleWord}</BrushWord>
            </h2>
            <p className="m-0 text-[17px] leading-[1.6] text-on-dark-1">{t.filmText}</p>
          </Reveal>
          <div className="grid grid-cols-2 [&_figcaption]:hidden">
            <MediaItem m={film} locale={locale} playLabel={t.play} index={0} />
          </div>
        </div>
      </section>

      <section aria-labelledby="village-chemin" className="bg-sand">
        <div className={wrap}>
          <SectionHead eyebrow={t.pathEyebrow} pre={t.pathTitlePre} word={t.pathTitleWord} id="village-chemin" />
          <ol className="ol-swipe m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,250px),1fr))] gap-6 p-0">
            {t.path.map((step, i) => (
              <li key={step.year}>
                <Reveal delay={i * 90} className="ol-spot flex h-full flex-col overflow-hidden rounded-card bg-white shadow-ol-sm">
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-night">
                    <Image src={PATH_PHOTOS[i].src} alt={PATH_PHOTOS[i].alt[locale]} fill sizes="(max-width: 767px) 82vw, 300px" className="photo-tone object-cover" style={{ objectPosition: PATH_PHOTOS[i].pos }} />
                  </div>
                  <div className="flex flex-col gap-2 p-6">
                    <span className="font-serif text-[clamp(26px,2.8vw,32px)] font-medium leading-none tabular-nums text-copper-700">{step.year}</span>
                    <h3 className="m-0 text-balance font-serif text-[21px] font-medium leading-[1.25] text-ink">{step.title}</h3>
                    <p className="m-0 text-pretty text-[16px] leading-[1.6] text-ink-body">{step.text}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
          <SwipeDots count={t.path.length} label={t.pathEyebrow} />
        </div>
      </section>

      <section aria-labelledby="village-images">
        <div className={wrap}>
          <SectionHead eyebrow={t.galleryEyebrow} pre={t.galleryTitlePre} word={t.galleryTitleWord} id="village-images" />
          <Reveal className="relative aspect-[16/9] overflow-hidden rounded-card bg-night shadow-ol-photo">
            <Image src="/photos/drive/drone-kasangulu-terrain.jpg" alt={t.droneAlt} fill sizes="(max-width: 1200px) 100vw, 1136px" loading="lazy" className="object-cover" />
          </Reveal>
          <div className="ol-swipe ol-swipe-photos grid grid-flow-dense grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            {gallery.map((m, i) => (
              <MediaItem key={m.kind === 'photo' ? m.src : i} m={m} locale={locale} playLabel={t.play} index={i} />
            ))}
          </div>
          <div className="ol-swipe ol-swipe-photos grid grid-cols-2 gap-3 sm:gap-4">
            <MediaItem m={youtube} locale={locale} playLabel={t.play} index={0} />
          </div>
        </div>
      </section>

      <section aria-labelledby="village-diners" className="bg-sand">
        <div className={wrap}>
          <SectionHead eyebrow={t.dinnersEyebrow} pre={t.dinnersTitlePre} word={t.dinnersTitleWord} id="village-diners" />
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] gap-6">
            {t.dinners.map((dn, i) => (
              <Reveal key={dn.t} delay={i * 90} className="flex flex-col gap-3.5 ol-spot rounded-card bg-cream p-[clamp(24px,3vw,36px)]">
                <h3 className="m-0 text-balance font-serif text-[clamp(22px,2.4vw,28px)] font-medium leading-[1.25] text-ink">{dn.t}</h3>
                {dn.d.map((para) => (
                  <p key={para.slice(0, 24)} className="m-0 text-pretty text-[16px] leading-[1.65] text-ink-body">{para}</p>
                ))}
              </Reveal>
            ))}
          </div>
          <div className="ol-swipe ol-swipe-photos grid grid-cols-2 gap-3 sm:gap-4">
            <Reveal className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-night shadow-ol-sm">
              <Image src="/photos/drive/diner-2023-table.jpg" alt={locale === 'fr' ? 'Des invités à table lors du premier dîner caritatif, en 2023.' : 'Guests at their table at the first charity dinner, in 2023.'} fill sizes="(max-width: 1200px) 50vw, 560px" loading="lazy" className="object-cover" />
            </Reveal>
            <Reveal delay={80} className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-night shadow-ol-sm">
              <Image src="/photos/drive/diner-2023-invites.jpg" alt={locale === 'fr' ? 'Des invités échangent pendant le premier dîner caritatif.' : 'Guests talking during the first charity dinner.'} fill sizes="(max-width: 1200px) 50vw, 560px" loading="lazy" className="object-cover" />
            </Reveal>
            {dinners.map((m, i) => (
              <MediaItem key={m.kind === 'video' ? m.src : i} m={m} locale={locale} playLabel={t.play} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="village-suivre">
        <div className={`${wrap} items-start gap-5 pb-[clamp(56px,8vw,104px)]`}>
          <Reveal className="flex flex-col gap-3">
            <h2 id="village-suivre" className="m-0 font-serif text-[clamp(24px,2.6vw,30px)] font-medium leading-[1.2]">{t.followTitle}</h2>
            <Brush fill="var(--clay)" className="h-2 w-full max-w-[160px]" stretch />
            <p className="m-0 max-w-measure text-[16px] leading-[1.65] text-ink-body">{t.followText}</p>
          </Reveal>
          <Reveal delay={80} className="flex flex-wrap gap-3">
            <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className={link}>{t.facebook}</a>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className={link}>{t.instagram}</a>
            <a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer" className={link}>{t.youtube}</a>
          </Reveal>
          <Reveal delay={120}>
            <Link href={href('/histoire')} className="inline-flex min-h-11 items-center gap-1.5 font-bold no-underline">
              {t.historyLink}
              <ArrowRightIcon aria-hidden />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
