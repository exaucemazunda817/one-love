import Image from 'next/image';
import Link from 'next/link';
import {
  HeartIcon,
  HandHeartIcon,
  UsersThreeIcon,
  ArrowRightIcon,
  SealCheckIcon
} from '@phosphor-icons/react/ssr';
import { Reveal } from '@/components/Reveal';
import { HeroBackground } from '@/components/site/HeroBackground';
import { FacebookBand } from '@/components/site/FacebookBand';
import { PartnersMarquee } from '@/components/site/PartnersMarquee';
import { BrushWord, Eyebrow, h2Class } from '@/components/site/ui';
import { localeHref, type Locale } from '@/lib/i18n';
import { PhotoCycle } from '@/components/site/PhotoCycle';
import { PathTimeline } from '@/components/site/effects/PathTimeline';
import { ScrollFan } from '@/components/site/effects/ScrollFan';

// Bandeau de l'accueil (05/10/2026) : on commence par la photo du pasteur, de
// sa femme et des enfants, puis les autres défilent au hasard. Photos fournies
// par Mazunda, recadrées en paysage.
const HOME_POOL = [
  { src: '/hero-accueil/pasteur-famille.webp', position: '50% 50%' },
  { src: '/hero-accueil/trois-garcons.webp', position: '50% 35%' },
  { src: '/hero-accueil/bonnets-1.webp', position: '50% 40%' },
  { src: '/hero-accueil/bonnets-2.webp', position: '50% 40%' },
  { src: '/hero-accueil/peace.webp', position: '50% 40%' },
  { src: '/hero-accueil/sourire.webp', position: '50% 40%' },
  { src: '/hero-accueil/rires.webp', position: '50% 35%' }
];

const text = {
  fr: {
    eyebrow: 'Kinshasa, RDC · depuis 2013',
    titlePre: "L'",
    titleWord: 'amour',
    titlePost: ' et la foi, notre carburant.',
    intro:
      "Notre désir est de communiquer l’amour que nous avons reçu. À Kinshasa, nous accompagnons des enfants par l’éducation, le soin et l’écoute.",
    donate: 'Faire un don',
    sponsor: 'Parrainer un enfant',
    badge: 'Association loi 1901 · RNA W951001528',
    heroImgAlt: 'Le pasteur, sa femme et les enfants de One Love, hilares devant la caméra.',
    pathTitle: 'Le chemin parcouru',
    pathIntro:
      'Un couple, trois garçons rencontrés dans la rue, puis un centre qui accueille une centaine d’enfants chaque semaine.',
    pathLink: 'Découvrir notre histoire',
    // Mêmes chiffres, mêmes sources datées que la page Notre histoire —
    // ne pas laisser diverger si l'un des deux est corrigé un jour.
    path: [
      { value: 3, prefix: '', label: 'garçons rencontrés dans la rue', when: 'été 2016' },
      { value: 21, prefix: '', label: 'garçons accueillis à la One Love House', when: 'janvier 2020' },
      { value: 90, prefix: '', label: 'enfants au centre aéré, un samedi', when: 'mars 2022' },
      { value: 100, prefix: '≈ ', label: 'enfants accueillis chaque semaine', when: '2024' }
    ] as const,
    orgEyebrow: 'Notre organisation',
    orgTitlePre: 'Comment One Love ',
    orgTitleWord: 's’organise',
    orgIntro: 'À Kinshasa, nous accompagnons deux groupes d’enfants, de deux façons différentes.',
    cycleLabel: { pause: 'Mettre en pause le diaporama', play: 'Reprendre le diaporama' },
    groups: [
      {
        k: 'À plein temps',
        t: 'Les One Love Boys',
        d: 'Des garçons qui vivaient dans la rue et que nous accueillons à temps plein à la One Love House. Ils y trouvent un foyer, des repas, des soins, et vont à l’école chaque jour : nous les scolarisons et suivons leur année, de la rentrée aux résultats. Ils étaient 16 en 2025.',
        img: '/photos/drive/boys-noel-2022.jpg',
        alt: 'Cinq One Love Boys en bonnet de Noël, souriants.',
        pos: '50% 35%',
        href: '/one-love-boys',
        cycle: [{ src: '/photos/drive/boys-noel-2022.jpg', pos: '50% 35%' }, { src: '/one-love-boys/2022-noel/11.webp', pos: '50% 30%' }, { src: '/one-love-boys/2023-rentree/03.webp', pos: '50% 35%' }, { src: '/one-love-boys/2022-noel/13.webp', pos: '50% 45%' }, { src: '/one-love-boys/2023-famille/03.webp', pos: '50% 45%' }, { src: '/one-love-boys/2022-noel/01.webp', pos: '50% 25%' }],
        more: 'Découvrir les One Love Boys'
      },
      {
        k: 'Chaque semaine',
        t: 'Les enfants du centre aéré',
        d: 'Des enfants des quartiers défavorisés, filles et garçons de 5 à 12 ans et de 13 à 17 ans, qui viennent au One Love Center le mercredi, le samedi et le dimanche. Le mercredi est réservé aux jeux et à un film ; le samedi, ce sont les ateliers ; le dimanche, la Parole de Dieu (One Love Ministry) et un repas. Ils y trouvent un lieu sûr pour apprendre, jouer, partager un repas et, le dimanche, écouter la Parole de Dieu. Ils sont une centaine chaque semaine.',
        img: '/centre-aere/2023-12-02/05.webp',
        alt: 'Un groupe d’enfants du centre aéré, souriants et serrés les uns contre les autres.',
        pos: '50% 35%',
        href: '/centre-aere',
        cycle: [{ src: '/centre-aere/2023-12-02/05.webp', pos: '50% 30%' }, { src: '/centre-aere/2023-12-02/09.webp', pos: '50% 40%' }, { src: '/centre-aere/2024-02/04.webp', pos: '50% 30%' }, { src: '/centre-aere/2022-06/06.webp', pos: '50% 35%' }, { src: '/centre-aere/2024-04-24/01.webp', pos: '50% 30%' }, { src: '/centre-aere/2023-12-02/02.webp', pos: '50% 30%' }],
        more: 'Découvrir le centre aéré'
      }
    ],
    dayEyebrow: 'Le programme',
    dayTitlePre: 'Un après-midi au ',
    dayTitleWord: 'centre aéré',
    daySubtitle: 'Le mercredi et le samedi, de 14h à 16h, au One Love Center.',
    day: [
      ['L’accueil', 'Nos animateurs arrivent à 12h30 et préparent, dès 13h, les jeux du jour autour d’un thème. À 13h30, une ou deux personnes inscrivent les enfants, qui entrent dans le centre à 14h pile.', 'Des filles éclatent de rire au centre aéré.'],
      ['Prière et consignes', 'À 14h, un temps de prière, de motivation et de consignes : le thème de la journée, ce qu’on va faire et ce qu’il ne faut pas faire.', 'Des filles jouent à un jeu de société.'],
      ['Jeux et activités', 'On commence par des jeux de groupe pour apprendre à se connaître, en équipes de 5 ou de 10 selon les animateurs. Le thème est éducatif et amusant, pour que personne ne s’ennuie. Le mercredi, c’est jeux, puis un film ; le samedi, des ateliers s’y ajoutent.', 'Des garçons jouent au basket dans la cour.'],
      ['Clôture et goûter', 'Vers 15h30, un bilan (ce qui s’est passé, ce que chacun a aimé), une prière, puis jus et pain pour tous. Sortie à 16h pile. Le dimanche, de 14h à 16h, la Parole de Dieu puis du riz et des haricots.', 'Un enfant savoure sa glace au centre aéré.']
    ] as const,
    projectEyebrow: 'Projet en cours · sept. à déc. 2026',
    projectSupport: 'Soutenir RÊVES 2',
    projectLink: 'Le projet',
    projectImgAlt: 'Une jeune fille écrit dans son cahier pendant un atelier.',
    villageEyebrow: 'Grand projet en construction',
    villageTitle: 'One Love Village',
    villageText: 'Sur notre terrain de Kasangulu, les travaux ont commencé. Découvrez l’histoire du projet, en photos et en vidéos.',
    villageLink: 'Découvrir le village',
    villageImgAlt: 'Des engins au travail sur le terrain de Kasangulu, au coucher du soleil.',
    waysTitlePre: 'Trois façons d’',
    waysTitleWord: 'aider',
    ways: [
      { icon: HandHeartIcon, t: 'Parrainer', d: 'Parrainer, c’est accompagner un enfant, un seul, chaque mois. Votre engagement assure la continuité de son accompagnement : l’école, le suivi médical, l’écoute. Après votre paiement, vous recevez son prénom, son âge et ses envies, puis un message chaque trimestre et un bilan annuel. Le lien passe toujours par notre équipe, et vous pouvez arrêter à tout moment.', cta: 'Parrainer un enfant', bg: 'bg-sand', fg: 'text-ink', fg2: 'text-ink-body', ic: 'text-copper-700', href: '/parrainer' },
      { icon: HeartIcon, t: 'Donner', d: 'Un don, ponctuel ou mensuel, finance directement nos actions sur le terrain : les ateliers, le matériel pédagogique, le suivi médical et psychosocial des enfants. Sauf mention de votre part, il va là où les besoins sont les plus forts. Vous pouvez aussi le réserver à un projet précis, comme le One Love Village, en l’indiquant dans le libellé de votre virement.', cta: 'Faire un don', bg: 'bg-night', fg: 'text-cream', fg2: 'text-on-dark-1', ic: 'text-gold-hover', href: '/dons' },
      { icon: UsersThreeIcon, t: 'S’engager', d: 'Donnez de votre temps comme bénévole, à Kinshasa pendant les ateliers ou à distance : communication, traduction, recherche de fonds. Offrez du matériel en bon état (fournitures scolaires, livres, matériel sportif ou informatique), organisez une collecte pour un anniversaire, une course solidaire ou un événement d’église, ou construisez un partenariat avec votre entreprise, votre église ou votre fondation.', cta: 'S’impliquer', bg: 'bg-sage-100', fg: 'text-ink', fg2: 'text-ink-body', ic: 'text-sage-700', href: '/s-impliquer' }
    ],
    testimonials: [
      { q: '« Depuis que nous nous sommes rencontrés en 2010, ma femme et moi avons eu à cœur de vivre un rêve commun : aimer et aider ceux qui en ont besoin. »', name: 'Kanda Kabangu', role: 'cofondateur' },
    ]
  },
  en: {
    eyebrow: 'Kinshasa, DRC · since 2013',
    titlePre: '',
    titleWord: 'Love',
    titlePost: ' and faith are what drive us.',
    intro:
      'Our desire is to share the love we have received. In Kinshasa, we support children through education, care and listening.',
    donate: 'Donate',
    sponsor: 'Sponsor a child',
    badge: 'Registered non-profit (France) · RNA W951001528',
    heroImgAlt: 'The pastor, his wife and the One Love children, laughing together for the camera.',
    pathTitle: 'How far we have come',
    pathIntro:
      'A couple, three boys met on the street, then a centre that welcomes around a hundred children every week.',
    pathLink: 'Discover our story',
    path: [
      { value: 3, prefix: '', label: 'boys met on the street', when: 'summer 2016' },
      { value: 21, prefix: '', label: 'boys living at the One Love House', when: 'January 2020' },
      { value: 90, prefix: '', label: 'children at the day centre, one Saturday', when: 'March 2022' },
      { value: 100, prefix: '≈ ', label: 'children welcomed every week', when: '2024' }
    ] as const,
    orgEyebrow: 'How we work',
    orgTitlePre: 'How One Love is ',
    orgTitleWord: 'organised',
    orgIntro: 'In Kinshasa, we support two groups of children, in two different ways.',
    cycleLabel: { pause: 'Pause the slideshow', play: 'Resume the slideshow' },
    groups: [
      {
        k: 'Full time',
        t: 'The One Love Boys',
        d: 'Boys who used to live on the street and whom we welcome full time at the One Love House. They find a home, meals and care there, and go to school every day: we enrol them and follow their year, from the first day to their results. There were 16 of them in 2025.',
        img: '/photos/drive/boys-noel-2022.jpg',
        alt: 'Five One Love Boys in Christmas hats, smiling.',
        pos: '50% 35%',
        href: '/one-love-boys',
        cycle: [{ src: '/photos/drive/boys-noel-2022.jpg', pos: '50% 35%' }, { src: '/one-love-boys/2022-noel/11.webp', pos: '50% 30%' }, { src: '/one-love-boys/2023-rentree/03.webp', pos: '50% 35%' }, { src: '/one-love-boys/2022-noel/13.webp', pos: '50% 45%' }, { src: '/one-love-boys/2023-famille/03.webp', pos: '50% 45%' }, { src: '/one-love-boys/2022-noel/01.webp', pos: '50% 25%' }],
        more: 'Discover the One Love Boys'
      },
      {
        k: 'Every week',
        t: 'The day-centre children',
        d: 'Children from disadvantaged neighbourhoods, girls and boys aged 5 to 12 and 13 to 17, who come to the One Love Center on Wednesdays, Saturdays and Sundays. Wednesday is reserved for games and a film; Saturday is for workshops; Sunday is for the Word of God (One Love Ministry) and a meal. They find a safe place there to learn, play, share a meal and, on Sundays, hear the Word of God. Around a hundred come every week.',
        img: '/centre-aere/2023-12-02/05.webp',
        alt: 'A group of day-centre children, smiling and huddled together.',
        pos: '50% 35%',
        href: '/centre-aere',
        cycle: [{ src: '/centre-aere/2023-12-02/05.webp', pos: '50% 30%' }, { src: '/centre-aere/2023-12-02/09.webp', pos: '50% 40%' }, { src: '/centre-aere/2024-02/04.webp', pos: '50% 30%' }, { src: '/centre-aere/2022-06/06.webp', pos: '50% 35%' }, { src: '/centre-aere/2024-04-24/01.webp', pos: '50% 30%' }, { src: '/centre-aere/2023-12-02/02.webp', pos: '50% 30%' }],
        more: 'Discover the day centre'
      }
    ],
    dayEyebrow: 'The programme',
    dayTitlePre: 'An afternoon at the ',
    dayTitleWord: 'day centre',
    daySubtitle: 'Wednesdays and Saturdays, from 2 pm to 4 pm, at the One Love Center.',
    day: [
      ['Welcome', 'Our facilitators arrive at 12:30 and, from 1 pm, prepare the day’s games around a theme. At 1:30 pm, one or two people sign the children in, and they enter the centre at 2 pm sharp.', 'Girls burst out laughing at the day centre.'],
      ['Prayer and guidelines', 'At 2 pm, a time of prayer, encouragement and guidelines: the theme of the day, what we will do and what we must not do.', 'Girls playing a board game.'],
      ['Games and activities', 'We start with group games so the children get to know each other, in teams of 5 or 10 depending on the facilitators. The theme is educational and fun, so nobody gets bored. On Wednesdays it is games, then a film; on Saturdays, workshops are added.', 'Boys playing basketball in the courtyard.'],
      ['Closing and snack', 'Around 3:30 pm, a review (what happened, what each child enjoyed), a prayer, then juice and bread for everyone. Out at 4 pm sharp. On Sundays, from 2 pm to 4 pm, the Word of God, then rice and beans.', 'A child enjoying an ice cream at the day centre.']
    ] as const,
    projectEyebrow: 'Current project · Sept. to Dec. 2026',
    projectSupport: 'Support RÊVES 2',
    projectLink: 'The project',
    projectImgAlt: 'A girl writes in her notebook during a workshop.',
    villageEyebrow: 'Large project under construction',
    villageTitle: 'One Love Village',
    villageText: 'On our land in Kasangulu, work has begun. Discover the story of the project, in photos and videos.',
    villageLink: 'Discover the village',
    villageImgAlt: 'Machines at work on the Kasangulu land, at sunset.',
    waysTitlePre: 'Three ways to ',
    waysTitleWord: 'help',
    ways: [
      { icon: HandHeartIcon, t: 'Sponsor', d: 'Sponsoring means supporting one child, and only one, every month. Your commitment keeps their support going: school, medical follow-up, someone to listen. After your payment, you receive their first name, age and wishes, then a message every quarter and a yearly report. Contact always goes through our team, and you can stop at any time.', cta: 'Sponsor a child', bg: 'bg-sand', fg: 'text-ink', fg2: 'text-ink-body', ic: 'text-copper-700', href: '/parrainer' },
      { icon: HeartIcon, t: 'Give', d: 'A gift, one-off or monthly, directly funds our work on the ground: workshops, teaching materials, medical and psychosocial follow-up for the children. Unless you say otherwise, it goes where the needs are greatest. You can also set it aside for a specific project, such as the One Love Village, by mentioning it in your transfer reference.', cta: 'Donate', bg: 'bg-night', fg: 'text-cream', fg2: 'text-on-dark-1', ic: 'text-gold-hover', href: '/dons' },
      { icon: UsersThreeIcon, t: 'Take part', d: 'Give your time as a volunteer, in Kinshasa during the workshops or remotely: communication, translation, fundraising. Donate equipment in good condition (school supplies, books, sports or computer equipment), run a fundraiser for a birthday, a charity run or a church event, or build a partnership with your company, church or foundation.', cta: 'Get involved', bg: 'bg-sage-100', fg: 'text-ink', fg2: 'text-ink-body', ic: 'text-sage-700', href: '/s-impliquer' }
    ],
    testimonials: [
      { q: '“Since we met in 2010, my wife and I have shared one dream: to love and help those in need.”', name: 'Kanda Kabangu', role: 'co-founder' },
    ]
  }
};

// Photos et cadrage de chaque moment de « Une journée » (communs FR/EN).
const dayMedia = [
  { img: '/centre-aere/2023-12-02/09.webp', pos: '50% 35%' },
  { img: '/centre-aere/2022-06/01.webp', pos: '50% 40%' },
  { img: '/centre-aere/2023-02/03.webp', pos: '50% 40%' },
  { img: '/centre-aere/2022-11/03.webp', pos: '50% 35%' }
];

// Mosaïque sur ordinateur (12 colonnes, 2 rangées) : grande photo à gauche,
// une large en haut à droite, deux plus petites dessous.
const dayTile = ['lg:col-span-5 lg:row-span-2', 'lg:col-span-7', 'lg:col-span-4', 'lg:col-span-3'];

export function HomePage({ locale }: { locale: Locale }) {
  const t = text[locale];
  const href = (p: string) => localeHref(p, locale);

  return (
    <>
      {/* Hero — desktop */}
      <section className="relative hidden min-h-[min(88vh,780px)] overflow-hidden bg-night text-cream dk:flex dk:items-center">
        <HeroBackground src={HOME_POOL[0].src} alt={t.heroImgAlt} position={HOME_POOL[0].position} pool={HOME_POOL} />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--scrim-5)_0%,var(--scrim-4)_34%,var(--scrim-1)_64%,var(--scrim-0)_100%)]" />
        <div className="relative mx-auto w-full max-w-[1280px] px-12 py-24">
          <div className="flex max-w-[600px] flex-col gap-7">
            <Eyebrow dark>{t.eyebrow}</Eyebrow>
            {/* p, pas h1 : le vrai h1 de la page est celui du hero mobile
                juste après (même texte) — un seul par page, cohérent avec
                l’indexation mobile-first (audit SEO du 27/09/2026). */}
            <p className="m-0 text-balance font-serif text-[clamp(48px,5.4vw,72px)] font-medium leading-[1.06] tracking-[-0.01em]">
              {t.titlePre}
              <BrushWord>{t.titleWord}</BrushWord>
              {t.titlePost}
            </p>
            <p className="m-0 max-w-[520px] text-pretty text-[20px] leading-[1.6] text-on-dark-1">{t.intro}</p>
            <div className="flex flex-wrap gap-3">
              <Link href={href('/dons')} className="inline-flex min-h-[48px] items-center justify-center gap-2 whitespace-nowrap rounded-full bg-gradient-to-br from-gold-hover to-gold px-7 text-[13px] font-bold uppercase tracking-wide text-night no-underline transition-opacity hover:text-night hover:opacity-90">
                <HeartIcon size="1em" aria-hidden />
                {t.donate}
              </Link>
              <Link href={href('/parrainer')} className="inline-flex min-h-[48px] items-center justify-center whitespace-nowrap rounded-full border border-cream/35 px-[26px] text-[13px] font-semibold uppercase tracking-wide text-cream no-underline transition-colors hover:border-gold hover:text-gold-hover">
                {t.sponsor}
              </Link>
            </div>
            <span className="flex items-center gap-2 text-[14px] text-on-dark-2">
              <SealCheckIcon size={20} className="text-sage-300" aria-hidden />
              {t.badge}
            </span>
          </div>
        </div>
      </section>

      {/* Hero — mobile */}
      <section className="relative flex min-h-svh flex-col justify-end overflow-hidden bg-night text-cream dk:hidden">
        <HeroBackground src={HOME_POOL[0].src} alt={t.heroImgAlt} position={HOME_POOL[0].position} pool={HOME_POOL} />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,var(--scrim-1)_0%,var(--scrim-2)_30%,var(--scrim-5)_58%,var(--scrim-5)_100%)]" />
        <div className="relative flex flex-col items-center gap-[14px] px-5 pb-10 pt-[120px] text-center">
          <Eyebrow dark className="text-[12px]">
            {t.eyebrow}
          </Eyebrow>
          <h1 className="m-0 font-serif text-[32px] font-medium leading-[1.1]">
            {t.titlePre}
            <BrushWord>{t.titleWord}</BrushWord>
            {t.titlePost}
          </h1>
          <p className="-mt-1 m-0 max-w-[34rem] text-[15px] leading-[1.5] text-on-dark-1">{t.intro}</p>
          <div className="flex w-full flex-col gap-2.5">
            <Link href={href('/dons')} className="inline-flex min-h-[48px] items-center justify-center gap-2 whitespace-nowrap rounded-full bg-gradient-to-br from-gold-hover to-gold px-7 text-[13px] font-bold uppercase tracking-wide text-night no-underline transition-opacity hover:text-night hover:opacity-90">
              <HeartIcon size="1em" aria-hidden />
              {t.donate}
            </Link>
            <Link href={href('/parrainer')} className="inline-flex min-h-[48px] items-center justify-center whitespace-nowrap rounded-full border border-cream/35 px-[26px] text-[13px] font-semibold uppercase tracking-wide text-cream no-underline transition-colors hover:border-gold hover:text-gold-hover">
              {t.sponsor}
            </Link>
          </div>
          <span className="flex items-center gap-2 text-[13px] text-on-dark-2">
            <SealCheckIcon size={18} className="text-sage-300" aria-hidden />
            {t.badge}
          </span>
        </div>
      </section>

      {/* Le chemin parcouru — mêmes chiffres que la page Notre histoire, en
          frise plutôt qu’à plat : ce sont quatre étapes d’une progression
          dans le temps, pas quatre chiffres indépendants (revu le
          27/09/2026, l’ancienne grille 2×2/4×1 laissait beaucoup de vide). */}
      <section aria-labelledby="chemin-titre-accueil" className="mx-auto max-w-[1200px] px-[clamp(20px,4vw,32px)] py-[clamp(40px,5vw,64px)]">
        <div className="flex flex-col gap-8 dk:flex-row dk:items-center dk:gap-14">
          <Reveal className="flex max-w-[300px] flex-none flex-col gap-3">
            <h2 id="chemin-titre-accueil" className="m-0 font-serif text-[clamp(24px,2.8vw,32px)] font-medium leading-[1.15]">
              {t.pathTitle}
            </h2>
            <p className="m-0 text-[15px] leading-[1.55] text-ink-body">{t.pathIntro}</p>
            <Link
              href={href('/histoire')}
              className="inline-flex min-h-11 w-fit items-center gap-1.5 text-[14px] font-bold text-copper-700 no-underline"
            >
              {t.pathLink}
              <ArrowRightIcon aria-hidden />
            </Link>
          </Reveal>
          <div className="flex-1">
            <PathTimeline steps={t.path.map((s) => ({ ...s }))} />
          </div>
        </div>
      </section>

      {/* Grand projet : le One Love Village */}
      <section className="relative overflow-hidden bg-night text-cream">
        <Image src="/histoire/village-hero.webp" alt={t.villageImgAlt} fill sizes="100vw" className="photo-tone object-cover object-[50%_55%]" />
        <div className="relative mx-auto max-w-[1280px] px-[clamp(12px,4vw,48px)] py-[clamp(40px,8vw,120px)]">
          <Reveal className="flex max-w-[520px] flex-col gap-[18px] rounded-card bg-[color:var(--scrim-5)] p-[clamp(28px,4vw,48px)]">
            <Eyebrow dark>{t.villageEyebrow}</Eyebrow>
            <h2 className="m-0 font-serif text-[clamp(40px,5vw,64px)] font-medium leading-none">{t.villageTitle}</h2>
            <p className="m-0 text-[17px] leading-[1.65] text-on-dark-1">{t.villageText}</p>
            <div className="pt-1">
              <Link href={href('/projets/village')} className="inline-flex min-h-[52px] items-center gap-1.5 whitespace-nowrap rounded-full bg-gold px-6 text-[16px] font-extrabold text-night no-underline hover:bg-gold-hover hover:text-night">
                {t.villageLink}
                <ArrowRightIcon aria-hidden />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Une journée */}
      {/* Mosaïque sans aucune zone de défilement horizontal, ni inclinaison :
          les cartes penchées débordaient de 4 px et accrochaient le geste du
          trackpad (voir CLAUDE.md, 27/09/2026). */}
      <section aria-labelledby="journee-titre" className="bg-sand">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-8 px-[clamp(20px,4vw,32px)] py-[clamp(56px,8vw,104px)] md:gap-10">
          {/* Deux publics distincts (demande du 04/10/2026). Sources : publications
              Instagram de l'association (2021-2025) ; chiffres datés. */}
          <Reveal className="mx-auto flex max-w-[680px] flex-col items-center gap-3 text-center">
            <Eyebrow>{t.orgEyebrow}</Eyebrow>
            <h2 id="journee-titre" className={h2Class}>
              {t.orgTitlePre}
              <BrushWord>{t.orgTitleWord}</BrushWord>
            </h2>
            <p className="m-0 mt-1 text-pretty text-[17px] leading-[1.6] text-ink-body">{t.orgIntro}</p>
          </Reveal>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] gap-5">
            {t.groups.map((g, i) => (
              <Reveal key={g.t} delay={i * 90} className="h-full">
                {/* Carte entière cliquable via le lien du titre (étendu en
                    ::after) ; le bouton pause du diaporama reste au-dessus. */}
                <div className="ol-news-card ol-spot group relative flex h-full flex-col overflow-hidden rounded-card bg-cream text-ink shadow-ol-sm">
                  <div className="relative aspect-[16/10] overflow-hidden bg-night">
                    <PhotoCycle photos={g.cycle} alt={g.alt} sizes="(max-width: 900px) 92vw, 580px" label={t.cycleLabel} />
                  </div>
                  <div className="flex flex-1 flex-col gap-2.5 p-[clamp(22px,2.6vw,32px)]">
                    <span className="text-[13px] font-extrabold uppercase tracking-[0.1em] text-copper-700">{g.k}</span>
                    <h3 className="m-0 font-serif text-[clamp(24px,2.4vw,30px)] font-medium text-ink">
                      <Link href={href(g.href)} className="text-ink no-underline after:absolute after:inset-0 after:z-20 after:content-[''] hover:text-ink">
                        {g.t}
                      </Link>
                    </h3>
                    <p className="m-0 flex-1 text-pretty text-[16px] leading-[1.65] text-ink-body">{g.d}</p>
                    <span className="inline-flex items-center gap-1.5 pt-1 font-extrabold text-copper-700" aria-hidden>
                      {g.more}
                      <ArrowRightIcon aria-hidden />
                    </span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="mx-auto mt-[clamp(16px,3vw,32px)] flex max-w-[640px] flex-col items-center gap-3 text-center">
            <Eyebrow>{t.dayEyebrow}</Eyebrow>
            <h3 className={h2Class}>
              {t.dayTitlePre}
              <BrushWord>{t.dayTitleWord}</BrushWord>
            </h3>
            <p className="m-0 mt-1 text-pretty text-[17px] leading-[1.6] text-ink-body">{t.daySubtitle}</p>
          </Reveal>

          <ol className="m-0 grid list-none grid-cols-1 gap-3 p-0 md:grid-cols-2 md:gap-4 lg:h-[clamp(560px,50vw,620px)] lg:grid-cols-12 lg:grid-rows-2">
            {t.day.map(([dt, d, alt], i) => {
              const { img, pos } = dayMedia[i];
              const step = String(i + 1).padStart(2, '0');
              const isLead = i === 0;
              return (
                <li key={dt} className={dayTile[i]}>
                  {/* Photo plein cadre, texte posé sur un dégradé. Sur téléphone,
                      seule la première garde ce format ; les suivantes passent en
                      ligne compacte (vignette + texte) juste en dessous. */}
                  <Reveal delay={i * 90} className={`h-full ${isLead ? '' : 'hidden md:block'}`}>
                    <figure className="ol-news-frame ol-gallery-frame relative m-0 aspect-[4/5] h-full overflow-hidden rounded-card bg-night shadow-ol-photo lg:aspect-auto">
                      <Reveal variant="zoom" className="absolute inset-0">
                        <Image
                          src={img}
                          alt={alt}
                          fill
                          sizes={isLead ? '(max-width: 1024px) 92vw, 480px' : '(max-width: 1024px) 46vw, 680px'}
                          loading="lazy"
                          className="photo-tone ol-kenburns object-cover"
                          style={{ objectPosition: pos, animationDelay: `${-i * 4}s` }}
                        />
                      </Reveal>
                      {/* Petites tuiles : texte dès mi-hauteur, dégradé plus haut
                          (sinon le numéro doré se perd sur la photo noir et blanc). */}
                      <div
                        className={`pointer-events-none absolute inset-0 ${
                          isLead
                            ? 'bg-[linear-gradient(180deg,var(--scrim-0)_45%,var(--scrim-3)_70%,var(--scrim-5)_100%)]'
                            : 'bg-[linear-gradient(180deg,var(--scrim-0)_18%,var(--scrim-4)_50%,var(--scrim-5)_100%)]'
                        }`}
                      />
                      <figcaption className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-[clamp(20px,2.2vw,32px)] text-cream">
                        <span className="text-[13px] font-extrabold tracking-[0.12em] text-gold">{step}</span>
                        <h3
                          className={`m-0 text-balance font-serif font-semibold leading-[1.15] ${
                            isLead ? 'text-[clamp(26px,2.6vw,36px)]' : 'text-[22px]'
                          }`}
                        >
                          {dt}
                        </h3>
                        <p className={`m-0 text-pretty text-on-dark-1 ${isLead ? 'max-w-[360px] text-[16px] leading-[1.55]' : 'text-[15px] leading-[1.5]'}`}>
                          {d}
                        </p>
                      </figcaption>
                    </figure>
                  </Reveal>

                  {!isLead && (
                    <Reveal delay={i * 90} className="md:hidden">
                      <div className="flex items-center gap-4 rounded-card bg-cream p-3 pr-4 shadow-ol-sm">
                        <div className="relative h-[104px] w-[84px] shrink-0 overflow-hidden rounded-xl bg-night">
                          <Image src={img} alt={alt} fill sizes="84px" loading="lazy" className="photo-tone object-cover" style={{ objectPosition: pos }} />
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-[12px] font-extrabold tracking-[0.12em] text-copper-700">{step}</span>
                          <h3 className="m-0 font-serif text-[19px] font-semibold leading-[1.2] text-ink">{dt}</h3>
                          <p className="m-0 text-[14px] leading-[1.45] text-ink-body">{d}</p>
                        </div>
                      </div>
                    </Reveal>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* Trois façons d'aider — overflow-x-clip (pas hidden) : les cartes
          partent de l’extérieur pendant l’éventail sans créer de zone de
          défilement horizontal ni de débordement de page. */}
      <section className="overflow-x-clip">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-8 px-[clamp(20px,4vw,32px)] pt-[clamp(32px,5vw,56px)] pb-[clamp(64px,9vw,112px)]">
          <Reveal className="text-center">
            <h2 className={h2Class}>
              {t.waysTitlePre}
              <BrushWord>{t.waysTitleWord}</BrushWord>
            </h2>
          </Reveal>
          <ScrollFan className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-4">
            {t.ways.map((w) => {
              const Icon = w.icon;
              const cls = `ol-spot flex h-full min-h-[280px] flex-col gap-3.5 rounded-card ${w.bg} ${w.fg} px-7 py-8 no-underline transition-transform hover:-translate-y-[3px] hover:${w.fg}`;
              return (
                <Link key={w.t} href={href(w.href)} className={cls}>
                  <Icon size={36} className={w.ic} aria-hidden />
                  <h3 className="m-0 font-serif text-[32px] font-medium">{w.t}</h3>
                  <p className={`m-0 flex-1 text-[16px] leading-[1.6] ${w.fg2}`}>{w.d}</p>
                  <span className={`inline-flex items-center gap-1.5 font-extrabold ${w.ic}`}>
                    {w.cta}
                    <ArrowRightIcon aria-hidden />
                  </span>
                </Link>
              );
            })}
          </ScrollFan>
        </div>
      </section>

      {/* Témoignages */}
      <section className="mx-auto max-w-[1200px] px-[clamp(20px,4vw,32px)] pb-[clamp(40px,6vw,72px)]">
        {t.testimonials.map((f, i) => (
          <Reveal key={f.name} delay={i * 90}>
            <figure className="mx-auto my-0 flex max-w-[760px] flex-col items-center gap-4 rounded-card bg-white p-8 text-center shadow-ol-sm dk:px-14 dk:py-12">
              <blockquote className="m-0 font-serif text-[22px] italic leading-[1.45]">{f.q}</blockquote>
              <figcaption className="text-[15px]">
                <b>{f.name}</b> · {f.role}
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </section>

      <div className="pt-[clamp(8px,2vw,24px)]">
        <FacebookBand locale={locale} />
      </div>

      <div>
        <PartnersMarquee locale={locale} />
      </div>
    </>
  );
}
