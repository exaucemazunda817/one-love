import type { Metadata } from 'next';
import Image from 'next/image';
import { HeartIcon } from '@phosphor-icons/react/ssr';
import { pageMetadata } from '@/lib/seo';
import { Reveal } from '@/components/Reveal';
import { InnerHero } from '@/components/site/InnerHero';
import { YouTubeLite } from '@/components/site/YouTubeLite';
import { HistoryHero } from '@/components/site/effects/HistoryHero';
import { CountUp } from '@/components/site/effects/CountUp';
import { YearRoll } from '@/components/site/effects/YearRoll';
import { CallBanner } from '@/components/site/ui';
import { localeHref, type Locale } from '@/lib/i18n';

// Page « Notre histoire » : le parcours de l'association de 2013 à aujourd'hui,
// en chapitres, avec les photos et vidéos publiées par One Love sur Instagram
// et YouTube (repérage du 25/09/2026, droits validés par l'association).
// Médias : public/histoire (photos WebP), public/histoire/videos (MP4
// recompressés, 720 px), public/histoire/posters, public/histoire/youtube.
// Les sources brutes sont dans « HISTOIRE ONE LOVE/ », hors Git.

type L = { fr: string; en: string };

type Media =
  | { kind: 'photo'; src: string; alt: L; shape: 'square' | 'portrait' | 'landscape' }
  | {
      kind: 'video';
      src: string;
      caption: L;
      // `wide` : vidéo 16:9 dont l'image utile est en 2,35:1 (bandes noires
      // incrustées) ; le cadre la recadre pour masquer ces bandes.
      shape: 'portrait' | 'square' | 'landscape' | 'wide';
    }
  | { kind: 'youtube'; id: string; title: L };

type Chapter = { id: string; years: string; title: L; text: L; media: Media[] };

const photo = (src: string, shape: 'square' | 'portrait' | 'landscape', fr: string, en: string): Media => ({
  kind: 'photo',
  src: `/histoire/${src}.webp`,
  alt: { fr, en },
  shape
});
const video = (src: string, shape: 'portrait' | 'square' | 'landscape' | 'wide', fr: string, en: string): Media => ({
  kind: 'video',
  src,
  caption: { fr, en },
  shape
});

const chapters: Chapter[] = [
  {
    id: '2013',
    years: '2013 – 2014',
    title: { fr: 'Une idée, un couple', en: 'An idea, a couple' },
    text: {
      fr: "One Love naît en septembre 2013, à l'initiative d'un couple franco-congolais, Kanda Kabangu et son épouse. Dès la première vidéo, la ligne est posée : agir par amour, aider en priorité les enfants, et construire dans la durée plutôt que faire de l'assistanat. En décembre 2014, l'équipe part pour la première fois en RDC.",
      en: 'One Love was founded in September 2013 by a Franco-Congolese couple, Kanda Kabangu and his wife. From the very first video, the approach was clear: act out of love, help children first, and build for the long term rather than hand out aid. In December 2014, the team made its first trip to the DRC.'
    },
    media: [{ kind: 'youtube', id: 'nmIvZoujNlg', title: { fr: 'One Love, la présentation (2014)', en: 'One Love, our introduction (2014)' } }]
  },
  {
    id: '2015',
    years: '2015 – 2016',
    title: { fr: 'Mobiliser à Paris, poser les bases à Kinshasa', en: 'Rallying support in Paris, laying the groundwork in Kinshasa' },
    text: {
      fr: "Le but de départ est concret : construire une école au Congo. À Paris, « One Love plays for Help » réunit près de 300 personnes le 7 juin 2015 autour d'un tournoi de basket et d'un concert. En août, l'équipe s'installe quelques semaines à Kinshasa : enregistrement de l'association au Congo, rencontre au ministère de l'Éducation, puis repérage et bornage du terrain de Kasangulu.",
      en: 'The starting goal was concrete: build a school in Congo. In Paris, "One Love plays for Help" brought nearly 300 people together on 7 June 2015 for a basketball tournament and a concert. In August, the team spent a few weeks in Kinshasa: registering the association in Congo, meeting the Ministry of Education, then surveying and marking out the land in Kasangulu.'
    },
    media: [
      photo('2015-plays-for-help', 'square', "L'affiche de One Love plays for Help, le 7 juin 2015 à Paris.", 'The poster for One Love plays for Help, 7 June 2015 in Paris.'),
      { kind: 'youtube', id: '7bIG5iZT-7w', title: { fr: 'One Love plays for Help, le récap (2015)', en: 'One Love plays for Help, the recap (2015)' } },
      { kind: 'youtube', id: 'LVjFUCIx9T8', title: { fr: 'Premier repérage du terrain de Kasangulu (2015)', en: 'First visit to the Kasangulu land (2015)' } },
      photo('2015-salle-de-classe', 'square', "Des membres de l'équipe dans une salle de classe à Kinshasa.", 'Team members in a classroom in Kinshasa.')
    ]
  },
  {
    id: '2016',
    years: '2016 – 2017',
    title: { fr: 'Trois garçons, puis une maison', en: 'Three boys, then a home' },
    text: {
      fr: "C'est le tournant de l'histoire. À l'été 2016, l'équipe raconte que sa plus belle rencontre a été celle de trois garçons rencontrés dans la rue. En octobre, un programme d'alphabétisation pour mineurs démarre. En 2017 apparaît la One Love House, la maison des enfants : les garçons y vivent, vont à l'école, partent en vacances et préparent leur premier spectacle de Noël.",
      en: "This is the turning point. In summer 2016, the team said its most precious encounter had been with three boys met on the street. In October, a literacy programme for minors began. In 2017 came the One Love House, the children's home: the boys lived there, went to school, went on holiday and prepared their first Christmas show."
    },
    media: [
      photo('2016-premiere-rencontre', 'square', "Les premiers garçons accueillis, avec l'équipe One Love.", 'The first boys welcomed, with the One Love team.'),
      photo('2017-les-garcons', 'square', 'Quatre garçons de la One Love House.', 'Four boys from the One Love House.'),
      photo('2017-les-garcons-2', 'square', 'Des garçons de la One Love House, tout sourire.', 'Boys from the One Love House, all smiles.'),
      photo('2017-noel', 'square', "L'annonce du spectacle de Noël des enfants, le 9 décembre 2017.", "The announcement of the children's Christmas show, 9 December 2017.")
    ]
  },
  {
    id: '2018',
    years: '2018 – 2020',
    title: { fr: 'Une vraie famille', en: 'A real family' },
    text: {
      fr: "L'association se structure : bilans de santé, scolarité payée grâce aux parrainages, une cagnotte qui dépasse 7 000 € en 2018, et un premier débroussaillage du terrain de Kasangulu. Le rythme devient celui d'une famille, avec ses anniversaires et ses sorties. En janvier 2020, One Love accueille 21 garçons de 6 à 17 ans qui vivaient dans les rues de Kinshasa, et traverse le confinement avec eux. Certains réalisent même leur propre court métrage.",
      en: 'The association took shape: health check-ups, school fees paid through sponsorships, a fundraiser that passed €7,000 in 2018, and the first clearing of the Kasangulu land. Life took on the rhythm of a family, with birthdays and outings. In January 2020, One Love was caring for 21 boys aged 6 to 17 who had lived on the streets of Kinshasa, and went through lockdown with them. Some of them even made their own short film.'
    },
    media: [
      photo('2018-anniversaire', 'square', "Un cadeau d'anniversaire rendu possible par les parrainages, en 2018.", 'A birthday present made possible by sponsors, in 2018.'),
      photo('2018-kasangulu', 'square', 'Débroussaillage du terrain de Kasangulu, en 2018.', 'Clearing the Kasangulu land, in 2018.'),
      photo('2018-kasangulu-2', 'square', "L'équipe au travail sur le terrain de Kasangulu.", 'The team at work on the Kasangulu land.'),
      photo('2019-petits-heros', 'square', 'Les « petits héros » de la One Love House, en 2019.', 'The "little heroes" of the One Love House, in 2019.'),
      photo('2019-nonon', 'square', 'Nonon.', 'Nonon.'),
      photo('2019-paulin', 'square', 'Paulin.', 'Paulin.'),
      photo('2019-franck', 'square', 'Franck.', 'Franck.'),
      photo('2019-jd', 'square', 'JD.', 'JD.'),
      photo('2019-exauce', 'square', 'Exaucé.', 'Exaucé.'),
      photo('2019-japhet', 'square', 'Japhet.', 'Japhet.'),
      photo('2019-matthieu', 'square', 'Matthieu.', 'Matthieu.'),
      photo('2020-confinement', 'landscape', 'Masques pour tous pendant le confinement de 2020.', 'Masks for everyone during the 2020 lockdown.'),
      video('2020-quotidienne-frank', 'landscape', '« Quotidienne, l’ancienne vie de Frank », un court métrage tourné avec les garçons.', '"Quotidienne, Frank\'s former life", a short film made with the boys.')
    ]
  },
  {
    id: '2021',
    years: '2021 – 2022',
    title: { fr: 'Ouvrir les portes', en: 'Opening the doors' },
    text: {
      fr: "En juin 2021, One Love lance un nouveau programme : un centre aéré ouvert aux enfants du quartier, le mercredi et le samedi. Bibliothèque, informatique, alphabétisation, football : un samedi de mars 2022, 90 enfants sont accueillis. Il y a aussi les grandes sorties, comme ce jour de janvier 2022 au parc de la N'sele avec 54 enfants, et l'été 2022, le voyage « Congo je t'aime » mené avec l'église Gospel Nation.",
      en: "In June 2021, One Love launched a new programme: a day centre open to the neighbourhood's children on Wednesdays and Saturdays. Library, computers, literacy, football: one Saturday in March 2022, 90 children came. There were big outings too, like that January 2022 day at the N'sele park with 54 children, and in summer 2022, the \"Congo je t'aime\" trip organised with the Gospel Nation church."
    },
    media: [
      photo('2021-bibliotheque', 'square', 'Lecture et jeux à la bibliothèque du centre.', "Reading and games in the centre's library."),
      photo('2021-lecture', 'square', 'Un moment de lecture au centre aéré.', 'Reading time at the day centre.'),
      video('2021-one-love-life', 'wide', '« One Love Life », un aperçu de la vie au centre, filmé par Tim Ntalaja.', '"One Love Life", a glimpse of life at the centre, filmed by Tim Ntalaja.'),
      photo('2022-centre-aere', 'square', 'Les enfants rassemblés au centre aéré.', 'Children gathered at the day centre.'),
      photo('2022-nsele', 'landscape', "Sortie au parc de la vallée de la N'sele, en janvier 2022.", "Outing to the N'sele valley park, January 2022."),
      photo('2022-nsele-lions', 'landscape', "Les lions du parc de la N'sele.", "The lions of the N'sele park."),
      photo('2022-congo-je-taime', 'landscape', 'Avec les enfants, pendant le voyage « Congo je t’aime ».', 'With the children, during the "Congo je t\'aime" trip.'),
      { kind: 'youtube', id: 'v5-lM2ZciIY', title: { fr: 'Congo je t’aime, le documentaire (2022)', en: 'Congo je t’aime, the documentary (2022)' } },
      photo('2022-course-lycee', 'square', 'La course du lycée français de Kinshasa : 1 542 $ pour la scolarité des enfants.', "The French high school's charity run in Kinshasa: $1,542 for the children's schooling.")
    ]
  },
  {
    id: '2023',
    years: '2023 – 2024',
    title: { fr: "Changer d'échelle", en: 'Scaling up' },
    text: {
      fr: "Les premiers garçons accueillis sont maintenant au secondaire. Le centre sert jusqu'à 136 repas en une journée et reçoit une centaine d'enfants chaque semaine. Pour financer le One Love Village de Kasangulu, l'association organise un dîner caritatif à l'hôtel Pullman de Kinshasa : près de 260 invités le 8 décembre 2023, puis une deuxième édition le 13 décembre 2024, avec de grands partenaires comme la Fondation Vodacom.",
      en: "The first boys welcomed are now in secondary school. The centre has served up to 136 meals in a single day and welcomes around a hundred children every week. To fund the One Love Village in Kasangulu, the association holds a charity dinner at the Pullman hotel in Kinshasa: nearly 260 guests on 8 December 2023, then a second edition on 13 December 2024, with major partners such as the Vodacom Foundation."
    },
    media: [
      photo('2023-rentree', 'landscape', 'Le chemin de l’école, rentrée 2023.', 'On the way to school, back to school 2023.'),
      photo('2023-rentree-2', 'landscape', 'Deux des grands, en uniforme.', 'Two of the older boys, in uniform.'),
      video('2023-rentree', 'wide', 'Une journée d’école, du réveil à la classe.', 'A school day, from wake-up to the classroom.'),
      photo('2023-repas', 'portrait', 'Distribution de repas au centre.', 'Meals handed out at the centre.'),
      photo('2023-repas-2', 'portrait', 'Chaque enfant reçoit son repas.', 'Every child gets a meal.'),
      video('2023-kasangulu-village', 'wide', 'Sur le terrain de Kasangulu, où doit naître le One Love Village.', 'On the Kasangulu land, where the One Love Village is to be built.'),
      photo('2023-kasangulu', 'portrait', 'Le terrain de Kasangulu.', 'The Kasangulu land.'),
      photo('2023-kasangulu-2', 'portrait', 'Les travaux commencent à Kasangulu.', 'Work begins in Kasangulu.'),
      video('2023-diner-caritatif', 'square', 'Le premier dîner caritatif, le 8 décembre 2023.', 'The first charity dinner, 8 December 2023.'),
      video('2024-one-love-cest-quoi', 'portrait', '« One Love, c’est quoi ? » Les garçons répondent.', '"What is One Love?" The boys answer.'),
      video('2024-merci-diner', 'portrait', 'Merci après le deuxième dîner, le 13 décembre 2024.', 'Thank you after the second dinner, 13 December 2024.')
    ]
  },
  {
    id: '2025',
    years: '2025 – 2026',
    title: { fr: "Aujourd'hui : le projet RÊVES", en: 'Today: the RÊVES project' },
    text: {
      fr: "La One Love House accueille toujours les enfants chaque semaine, avec des animatrices bénévoles. En octobre 2025 naît RÊVES, pour Réaménager, Éduquer, Valoriser, Écouter, Soigner, avec Angel Foundation : le centre est rénové, la bibliothèque renaît, les ateliers se multiplient (danse, poterie, chant, slam, journalisme) et des soignants passent deux fois par mois. En septembre 2026, RÊVES 2 met l'éducation au centre : formation des animateurs, puis premiers pas en alphabétisation.",
      en: 'The One Love House still welcomes the children every week, with volunteer facilitators. In October 2025 came RÊVES — Reorganise, Educate, Empower, Listen, Care — with Angel Foundation: the centre was renovated, the library reborn, workshops multiplied (dance, pottery, singing, slam, journalism) and health workers now visit twice a month. In September 2026, RÊVES 2 put education first: training the facilitators, then the first steps in literacy.'
    },
    media: [
      video('2025-one-love-house', 'portrait', 'Un après-midi à la One Love House.', 'An afternoon at the One Love House.'),
      photo('2025-bibliotheque', 'portrait', 'La bibliothèque rénovée.', 'The renovated library.'),
      photo('2025-atelier-dessin', 'landscape', 'Atelier de dessin.', 'Drawing workshop.'),
      photo('2025-poterie', 'portrait', 'Atelier de poterie.', 'Pottery workshop.'),
      photo('2025-poterie-2', 'portrait', 'Les poteries prennent forme.', 'The pots take shape.'),
      photo('2025-centre', 'landscape', 'Les enfants rassemblés dans la cour du centre.', "Children gathered in the centre's courtyard."),
      photo('2025-foot', 'portrait', 'Football dans la cour.', 'Football in the courtyard.'),
      photo('2026-kermesse', 'landscape', 'La kermesse éducative de février 2026 : les enfants présentent leurs créations.', 'The February 2026 learning fair: the children show their work.'),
      photo('2026-kermesse-carnets', 'landscape', 'Des carnets en pagne fabriqués par les enfants.', 'Notebooks covered in wax print, made by the children.'),
      video('2026-reves2-formation', 'portrait', 'RÊVES 2 : la formation des animateurs, présentée par Marie-Anne Kemba.', 'RÊVES 2: training the facilitators, introduced by Marie-Anne Kemba.'),
      video('2026-reves2-quotidien', 'portrait', 'Le quotidien des enfants pendant RÊVES 2.', "The children's daily life during RÊVES 2."),
      photo('2026-reves2', 'portrait', 'RÊVES 2, avec Angel Foundation.', 'RÊVES 2, with Angel Foundation.')
    ]
  }
];

const text = {
  fr: {
    title: 'Notre histoire',
    desc: "De la création de l'association en 2013 au projet RÊVES : le parcours de One Love en photos et en vidéos.",
    eyebrow: 'Depuis 2013',
    titlePre: 'Notre ',
    titleWord: 'histoire',
    intro: 'Un couple, trois garçons rencontrés dans la rue, puis un centre qui accueille une centaine d’enfants chaque semaine.',
    heroAlt: 'Des garçons de One Love sur le chemin de l’école.',
    jumpLabel: 'Aller à une période',
    wordA: 'Notre',
    wordB: 'histoire',
    pathTitle: 'Le chemin parcouru',
    // Chiffres publiés par l'association sur Instagram, chacun daté.
    path: [
      { value: 3, prefix: '', label: 'garçons rencontrés dans la rue', when: 'été 2016' },
      { value: 21, prefix: '', label: 'garçons accueillis à la One Love House', when: 'janvier 2020' },
      { value: 90, prefix: '', label: 'enfants au centre aéré, un samedi', when: 'mars 2022' },
      { value: 100, prefix: '≈ ', label: "enfants accueillis chaque semaine", when: '2024' }
    ],
    play: 'Lire la vidéo',
    bannerTitle: "L'histoire continue.",
    bannerText: 'Chaque don et chaque parrainage écrit le prochain chapitre avec les enfants.',
    donate: 'Faire un don',
    sponsor: 'Parrainer un enfant'
  },
  en: {
    title: 'Our story',
    desc: "From the association's founding in 2013 to the RÊVES project: One Love's journey in photos and videos.",
    eyebrow: 'Since 2013',
    titlePre: 'Our ',
    titleWord: 'story',
    intro: 'A couple, three boys met on the street, then a centre that welcomes around a hundred children every week.',
    heroAlt: 'One Love boys on their way to school.',
    jumpLabel: 'Jump to a period',
    wordA: 'Our',
    wordB: 'story',
    pathTitle: 'How far we have come',
    path: [
      { value: 3, prefix: '', label: 'boys met on the street', when: 'summer 2016' },
      { value: 21, prefix: '', label: 'boys living at the One Love House', when: 'January 2020' },
      { value: 90, prefix: '', label: 'children at the day centre, one Saturday', when: 'March 2022' },
      { value: 100, prefix: '≈ ', label: 'children welcomed every week', when: '2024' }
    ],
    play: 'Play the video',
    bannerTitle: 'The story goes on.',
    bannerText: 'Every donation and every sponsorship writes the next chapter with the children.',
    donate: 'Donate',
    sponsor: 'Sponsor a child'
  }
} as const;

export function historyMetadata(locale: Locale): Metadata {
  const t = text[locale];
  return pageMetadata({ locale, path: '/histoire', title: t.title, description: t.desc });
}

// Grille de 2 colonnes (3 sur grand écran) : photos carrées ou en portrait sur
// une colonne, photos en paysage et vidéos sur deux. Sur téléphone, une vidéo
// verticale prend toute la largeur pour garder des commandes utilisables.
// `grid-flow-dense` comble les trous laissés par les éléments larges.
const photoFrame = { square: 'aspect-square', portrait: 'aspect-[4/5]', landscape: 'aspect-[3/2]' } as const;
const videoFrame = { portrait: 'aspect-[9/16]', square: 'aspect-square', landscape: 'aspect-video', wide: 'aspect-[2.35/1]' } as const;
const videoSpan = { portrait: 'col-span-2 sm:col-span-1', square: 'col-span-2 sm:col-span-1', landscape: 'col-span-2', wide: 'col-span-2' } as const;

function MediaItem({ m, locale, playLabel, index }: { m: Media; locale: Locale; playLabel: string; index: number }) {
  const delay = (index % 3) * 80;

  if (m.kind === 'youtube') {
    return (
      <Reveal delay={delay} className="col-span-2">
        <div className="relative aspect-video overflow-hidden rounded-2xl bg-night shadow-ol-sm">
          <YouTubeLite id={m.id} title={m.title[locale]} playLabel={playLabel} />
        </div>
      </Reveal>
    );
  }

  if (m.kind === 'video') {
    return (
      <Reveal delay={delay} className={videoSpan[m.shape]}>
        <figure className="m-0 flex flex-col gap-2.5">
          <div className={`relative overflow-hidden rounded-2xl bg-night shadow-ol-sm ${videoFrame[m.shape]}`}>
            <video
              controls
              playsInline
              preload="none"
              poster={`/histoire/posters/${m.src}.webp`}
              className="absolute inset-0 h-full w-full object-cover"
              aria-label={m.caption[locale]}
            >
              <source src={`/histoire/videos/${m.src}.mp4`} type="video/mp4" />
            </video>
          </div>
          <figcaption className="text-[14px] leading-[1.45] text-ink-soft">{m.caption[locale]}</figcaption>
        </figure>
      </Reveal>
    );
  }

  const span = m.shape === 'landscape' ? 'col-span-2' : undefined;
  return (
    <Reveal delay={delay} className={span}>
      <div className={`ol-news-frame ol-gallery-frame relative overflow-hidden rounded-2xl ${photoFrame[m.shape]}`}>
        <Reveal variant="zoom" className="absolute inset-0">
          <Image
            src={m.src}
            alt={m.alt[locale]}
            fill
            sizes={m.shape === 'landscape' ? '(max-width: 640px) 100vw, 560px' : '(max-width: 640px) 50vw, 280px'}
            className="photo-tone object-cover"
          />
        </Reveal>
      </div>
    </Reveal>
  );
}

export function HistoryPage({ locale }: { locale: Locale }) {
  const t = text[locale];
  const href = (p: string) => localeHref(p, locale);

  return (
    <>
      <HistoryHero
        eyebrow={t.eyebrow}
        wordA={t.wordA}
        wordB={t.wordB}
        intro={t.intro}
        image="/histoire/2023-rentree.webp"
        imageAlt={t.heroAlt}
        fallback={
        <InnerHero
          locale={locale}
          eyebrow={t.eyebrow}
          titlePre={t.titlePre}
          titleWord={t.titleWord}
          intro={t.intro}
          image="/histoire/2023-rentree.webp"
          imageAlt={t.heroAlt}
          objectPosition="50% 45%"
        />
        }
      />

      <section aria-labelledby="chemin-titre" className="bg-sand">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-8 px-[clamp(20px,4vw,32px)] py-[clamp(48px,7vw,88px)]">
          <Reveal>
            <h2 id="chemin-titre" className="m-0 font-serif text-[clamp(26px,3vw,36px)] font-medium leading-[1.15]">
              {t.pathTitle}
            </h2>
          </Reveal>
          <div className="grid grid-cols-2 gap-x-5 gap-y-8 md:grid-cols-4">
            {t.path.map((item) => (
              <Reveal key={item.label} className="flex flex-col gap-1.5">
                <CountUp
                  value={item.value}
                  prefix={item.prefix}
                  className="font-serif text-[clamp(44px,5vw,64px)] font-medium leading-none text-copper-600"
                />
                <span className="text-[16px] leading-[1.4] text-ink">{item.label}</span>
                <span className="text-[13px] font-extrabold uppercase tracking-[0.1em] text-ink-soft">{item.when}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <nav
        aria-label={t.jumpLabel}
        className="mx-auto flex max-w-[1200px] flex-wrap gap-2 px-[clamp(20px,4vw,32px)] pt-[clamp(32px,5vw,56px)]"
      >
        {chapters.map((c) => (
          <a
            key={c.id}
            href={`#${c.id}`}
            className="inline-flex min-h-11 items-center rounded-full border-[1.5px] border-field-line px-4 text-[14px] font-bold tabular-nums text-ink no-underline transition-colors hover:border-copper-600 hover:text-copper-700"
          >
            {c.years}
          </a>
        ))}
      </nav>

      <div className="mx-auto flex max-w-[1200px] flex-col gap-[clamp(56px,8vw,96px)] px-[clamp(20px,4vw,32px)] py-[clamp(40px,6vw,72px)]">
        {chapters.map((c, ci) => (
          <section
            key={c.id}
            id={c.id}
            aria-labelledby={`${c.id}-titre`}
            className="grid scroll-mt-28 gap-8 dk:grid-cols-[300px_minmax(0,1fr)] dk:gap-14"
          >
            <Reveal className="flex flex-col gap-3 dk:sticky dk:top-28 dk:self-start">
              <span className="whitespace-nowrap font-serif text-[clamp(32px,3.4vw,42px)] font-medium leading-none tabular-nums text-copper-600">
                <YearRoll from={chapters[ci - 1]?.id ?? '2000'} to={c.id} />
                {c.years.slice(4)}
              </span>
              <h2 id={`${c.id}-titre`} className="m-0 text-balance font-serif text-[clamp(24px,2.6vw,30px)] font-medium leading-[1.2]">
                {c.title[locale]}
              </h2>
              <p className="m-0 max-w-measure text-pretty text-[16px] leading-[1.65] text-ink-body">{c.text[locale]}</p>
            </Reveal>

            <div className="grid grid-flow-dense grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
              {c.media.map((m, i) => (
                <MediaItem key={m.kind === 'youtube' ? m.id : m.src} m={m} locale={locale} playLabel={t.play} index={i} />
              ))}
            </div>
          </section>
        ))}
      </div>

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
