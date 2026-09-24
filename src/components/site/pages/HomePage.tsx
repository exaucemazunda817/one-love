import Image from 'next/image';
import Link from 'next/link';
import {
  HeartIcon,
  HandHeartIcon,
  UsersThreeIcon,
  ArrowRightIcon,
  SealCheckIcon,
  ShieldCheckIcon,
  BankIcon,
  LockKeyIcon
} from '@phosphor-icons/react/ssr';
import { Reveal } from '@/components/Reveal';
import { MobilePhotoCard } from '@/components/site/MobilePhotoCard';
import { Brush, BrushWord, Eyebrow, h2Class } from '@/components/site/ui';
import { DonationQuick } from '@/components/site/DonationQuick';
import { localeHref, type Locale } from '@/lib/i18n';
import { currentProject } from '@/lib/content';

const text = {
  fr: {
    eyebrow: 'Kinshasa, RDC · depuis 2010',
    titlePre: "L'",
    titleWord: 'amour',
    titlePost: ' et la foi, notre carburant.',
    intro:
      "Notre désir est de communiquer l'amour que nous avons reçu. À Kinshasa, nous accompagnons des enfants par l'éducation, le soin et l'écoute.",
    donate: 'Faire un don',
    sponsor: 'Parrainer un enfant',
    badge: 'Association loi 1901 · RNA W951001528',
    heroImgAlt: 'Deux garçons dessinent à une table en plein air, au centre One Love.',
    stats: [
      ['2010', '', 'année de fondation'],
      ['48', '*', 'enfants accompagnés en 2026'],
      ['6', '*', 'formateurs et animateurs'],
      ['3', '', 'axes : éducation, soin, insertion']
    ] as const,
    statsNote: '* Chiffres à confirmer par l’association.',
    dayEyebrow: 'RÊVES 2 · carnet de bord',
    dayTitle: 'Une journée à One Love',
    daySubtitle: 'Ce que votre soutien rend possible, heure par heure.',
    day: [
      ['8 h', "L'arrivée", 'Les enfants arrivent au centre, prêts à découvrir et apprendre.', '/photos/photo-joie.jpg', 'Un garçon rit en arrivant au centre.', '-1.5deg'],
      ['9 h', "Atelier d'écriture", "Lire et écrire en petits groupes : le premier levier d'autonomie.", '/photos/photo-ecriture.jpg', 'Une jeune fille écrit dans son cahier.', '1deg'],
      ['11 h', 'Français', "Maîtriser la langue de l'école pour ouvrir l'accès à la scolarité.", '/photos/photo-atelier.jpg', 'Un garçon écrit, concentré.', '-1deg'],
      ['14 h', 'Création et jeu', 'Dessin, sport, musique : retrouver la confiance et la vie en groupe.', '/photos/photo-mains.jpg', 'Des mains colorient des lettres.', '1.5deg']
    ] as const,
    dayNote: 'Horaires indicatifs, à confirmer.',
    projectEyebrow: 'Projet en cours · sept. à déc. 2026',
    projectSupport: 'Soutenir RÊVES 2',
    projectLink: 'Le projet',
    projectImgAlt: 'Une jeune fille écrit dans son cahier pendant un atelier.',
    waysTitle: 'Trois façons d’aider',
    ways: [
      { icon: HeartIcon, t: 'Donner', d: 'Un don ponctuel ou mensuel finance les ateliers, le matériel et le suivi des enfants.', cta: 'Faire un don', bg: 'bg-night', fg: 'text-cream', fg2: 'text-on-dark-1', ic: 'text-gold-hover', href: '#don' },
      { icon: HandHeartIcon, t: 'Parrainer', d: 'Un engagement mensuel pour la continuité de l’accompagnement, avec des nouvelles régulières.', cta: 'Devenir parrain', bg: 'bg-sand', fg: 'text-ink', fg2: 'text-ink-body', ic: 'text-copper-700', href: '/parrainer' },
      { icon: UsersThreeIcon, t: 'S’engager', d: 'Bénévolat, dons en nature, collectes, partenariats avec des entreprises ou des églises.', cta: 'S’impliquer', bg: 'bg-sage-100', fg: 'text-ink', fg2: 'text-ink-body', ic: 'text-sage-700', href: '/s-impliquer' }
    ],
    testimonials: [
      { q: '« Depuis que nous nous sommes rencontrés en 2010, ma femme et moi avons eu à cœur de vivre un rêve commun : aimer et aider ceux qui en ont besoin. »', name: 'Kanda Kabangu', role: 'cofondateur', fictional: false },
      { q: '« J’ai animé les ateliers d’écriture en septembre. Voir un enfant signer son prénom pour la première fois, ça ne s’oublie pas. »', name: 'Grâce N.', role: 'bénévole', fictional: true }
    ],
    fictionalNote: 'témoignage fictif, à remplacer',
    newsTitle: 'Nouvelles du terrain',
    newsSubtitle: 'Suivez RÊVES 2 semaine après semaine.',
    newsAll: 'Toutes les actualités',
    partners: 'Partenaires',
    partnerLogo: 'Logo partenaire',
    news: [
      ['/photos/photo-ecriture.jpg', 'Une jeune fille écrit.', 'RÊVES 2', '5 sept. 2026', 'Premiers pas dans l’alphabétisation'],
      ['/photos/photo-atelier.jpg', 'Un garçon écrit dans son cahier.', 'Éducation', 'Sept. 2026', 'Le français, langue de l’école'],
      ['/photos/photo-dessin.jpg', 'Deux garçons dessinent.', 'Culture', 'Sept. 2026', 'Jeu, sport et création']
    ] as const,
    donTitlePre: 'Chaque don prolonge un accompagnement qui a déjà ',
    donTitleWord: 'commencé',
    donTitlePost: '.',
    donText:
      'Votre don finance directement les programmes de terrain : ateliers, matériel pédagogique, suivi médical et psychosocial des enfants.',
    trust: [
      [ShieldCheckIcon, 'Paiement sécurisé par Stripe, reçu par e-mail'],
      [BankIcon, 'Aussi par virement : IBAN sur la page Faire un don'],
      [LockKeyIcon, 'Vos données ne sont jamais revendues']
    ] as const
  },
  en: {
    eyebrow: 'Kinshasa, DRC · since 2010',
    titlePre: '',
    titleWord: 'Love',
    titlePost: ' and faith are what drive us.',
    intro:
      'Our desire is to share the love we have received. In Kinshasa, we support children through education, care and listening.',
    donate: 'Donate',
    sponsor: 'Sponsor a child',
    badge: 'Registered non-profit (France) · RNA W951001528',
    heroImgAlt: 'Two boys drawing at an outdoor table at the One Love centre.',
    stats: [
      ['2010', '', 'year founded'],
      ['48', '*', 'children supported in 2026'],
      ['6', '*', 'trainers and facilitators'],
      ['3', '', 'focus areas: education, care, integration']
    ] as const,
    statsNote: '* Figures to be confirmed by the association.',
    dayEyebrow: 'RÊVES 2 · logbook',
    dayTitle: 'A day at One Love',
    daySubtitle: 'What your support makes possible, hour by hour.',
    day: [
      ['8 am', 'Arrival', 'The children arrive at the centre, ready to discover and learn.', '/photos/photo-joie.jpg', 'A boy laughs as he arrives at the centre.', '-1.5deg'],
      ['9 am', 'Writing workshop', 'Reading and writing in small groups: the first step towards independence.', '/photos/photo-ecriture.jpg', 'A girl writes in her notebook.', '1deg'],
      ['11 am', 'French', 'Mastering the language of school opens the door to education.', '/photos/photo-atelier.jpg', 'A boy writes, focused.', '-1deg'],
      ['2 pm', 'Creativity and play', 'Drawing, sport, music: regaining confidence and group life.', '/photos/photo-mains.jpg', 'Hands colouring in letters.', '1.5deg']
    ] as const,
    dayNote: 'Indicative times, to be confirmed.',
    projectEyebrow: 'Current project · Sept. to Dec. 2026',
    projectSupport: 'Support RÊVES 2',
    projectLink: 'The project',
    projectImgAlt: 'A girl writes in her notebook during a workshop.',
    waysTitle: 'Three ways to help',
    ways: [
      { icon: HeartIcon, t: 'Give', d: 'A one-off or monthly gift funds workshops, materials and the children’s follow-up.', cta: 'Donate', bg: 'bg-night', fg: 'text-cream', fg2: 'text-on-dark-1', ic: 'text-gold-hover', href: '#don' },
      { icon: HandHeartIcon, t: 'Sponsor', d: 'A monthly commitment for continuous support, with regular updates.', cta: 'Become a sponsor', bg: 'bg-sand', fg: 'text-ink', fg2: 'text-ink-body', ic: 'text-copper-700', href: '/parrainer' },
      { icon: UsersThreeIcon, t: 'Take part', d: 'Volunteering, in-kind gifts, fundraising, partnerships with companies or churches.', cta: 'Get involved', bg: 'bg-sage-100', fg: 'text-ink', fg2: 'text-ink-body', ic: 'text-sage-700', href: '/s-impliquer' }
    ],
    testimonials: [
      { q: '“Since we met in 2010, my wife and I have shared one dream: to love and help those in need.”', name: 'Kanda Kabangu', role: 'co-founder', fictional: false },
      { q: '“I led the writing workshops in September. Seeing a child sign their name for the first time is something you never forget.”', name: 'Grâce N.', role: 'volunteer', fictional: true }
    ],
    fictionalNote: 'sample testimonial, to be replaced',
    newsTitle: 'News from the field',
    newsSubtitle: 'Follow RÊVES 2 week by week.',
    newsAll: 'All news',
    partners: 'Partners',
    partnerLogo: 'Partner logo',
    news: [
      ['/photos/photo-ecriture.jpg', 'A girl writing.', 'RÊVES 2', '5 Sept. 2026', 'First steps in literacy'],
      ['/photos/photo-atelier.jpg', 'A boy writes in his notebook.', 'Education', 'Sept. 2026', 'French, the language of school'],
      ['/photos/photo-dessin.jpg', 'Two boys drawing.', 'Culture', 'Sept. 2026', 'Play, sport and creativity']
    ] as const,
    donTitlePre: 'Every gift extends support that has already ',
    donTitleWord: 'begun',
    donTitlePost: '.',
    donText:
      "Your gift directly funds our field programmes: workshops, teaching materials, and the children's medical and psychosocial care.",
    trust: [
      [ShieldCheckIcon, 'Secure payment via Stripe, receipt by email'],
      [BankIcon, 'Also by bank transfer: IBAN on the Donate page'],
      [LockKeyIcon, 'Your data is never sold']
    ] as const
  }
};

export function HomePage({ locale }: { locale: Locale }) {
  const t = text[locale];
  const href = (p: string) => localeHref(p, locale);

  return (
    <>
      {/* Hero — desktop */}
      <section className="relative hidden min-h-[min(88vh,780px)] overflow-hidden bg-night text-cream dk:flex dk:items-center">
        <Image
          src="/photos/photo-dessin.jpg"
          alt={t.heroImgAlt}
          fill
          priority
          sizes="100vw"
          className="photo-tone object-cover object-[50%_42%]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,10,10,.92)_0%,rgba(10,10,10,.78)_34%,rgba(10,10,10,.1)_64%,rgba(10,10,10,0)_100%)]" />
        <div className="relative mx-auto w-full max-w-[1280px] px-12 py-24">
          <div className="flex max-w-[600px] flex-col gap-7">
            <Eyebrow dark>{t.eyebrow}</Eyebrow>
            <h1 className="m-0 text-balance font-serif text-[clamp(48px,5.4vw,72px)] font-medium leading-[1.06] tracking-[-0.01em]">
              {t.titlePre}
              <BrushWord>{t.titleWord}</BrushWord>
              {t.titlePost}
            </h1>
            <p className="m-0 max-w-[520px] text-pretty text-[20px] leading-[1.6] text-on-dark-1">{t.intro}</p>
            <div className="flex flex-wrap gap-3">
              <a href="#don" className="inline-flex min-h-[52px] items-center gap-2 whitespace-nowrap rounded-full px-7 text-[17px] font-bold no-underline border border-cream/35 bg-white/10 text-cream backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,.25)] hover:bg-white/20 hover:text-cream">
                <HeartIcon size="1em" aria-hidden />
                {t.donate}
              </a>
              <Link href={href('/parrainer')} className="inline-flex min-h-[52px] items-center whitespace-nowrap rounded-full px-[26px] text-[17px] font-bold no-underline border border-cream/35 bg-white/10 text-cream backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,.25)] hover:bg-white/20 hover:text-cream">
                {t.sponsor}
              </Link>
            </div>
            <span className="flex items-center gap-2 text-[14px] text-on-dark-2">
              <SealCheckIcon size={20} color="#9DB5A2" aria-hidden />
              {t.badge}
            </span>
          </div>
        </div>
      </section>

      {/* Hero — mobile */}
      <section className="relative flex min-h-svh flex-col justify-end overflow-hidden bg-night text-cream dk:hidden">
        <Image
          src="/photos/photo-dessin.jpg"
          alt={t.heroImgAlt}
          fill
          priority
          sizes="100vw"
          className="photo-tone object-cover object-[62%_30%]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,.15)_0%,rgba(10,10,10,.35)_30%,rgba(10,10,10,.88)_58%,rgba(10,10,10,.95)_100%)]" />
        <div className="relative flex flex-col gap-[18px] px-5 pb-10 pt-[120px]">
          <Eyebrow dark className="text-[12px]">
            {t.eyebrow}
          </Eyebrow>
          <h1 className="m-0 font-serif text-[38px] font-medium leading-[1.1]">
            {t.titlePre}
            <BrushWord>{t.titleWord}</BrushWord>
            {t.titlePost}
          </h1>
          <p className="m-0 text-[17px] leading-[1.6] text-on-dark-1">{t.intro}</p>
          <div className="flex flex-col gap-2.5">
            <a href="#don" className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full text-[17px] font-bold no-underline border border-cream/35 bg-white/10 text-cream backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,.25)] hover:bg-white/20 hover:text-cream">
              <HeartIcon size="1em" aria-hidden />
              {t.donate}
            </a>
            <Link href={href('/parrainer')} className="inline-flex min-h-[52px] items-center justify-center rounded-full text-[17px] font-bold no-underline border border-cream/35 bg-white/10 text-cream backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,.25)] hover:bg-white/20 hover:text-cream">
              {t.sponsor}
            </Link>
          </div>
          <span className="flex items-center gap-2 text-[13px] text-on-dark-2">
            <SealCheckIcon size={18} color="#9DB5A2" aria-hidden />
            {t.badge}
          </span>
        </div>
      </section>

      {/* Chiffres */}
      <section className="mx-auto max-w-[1200px] px-[clamp(20px,4vw,32px)] py-[clamp(56px,8vw,96px)]">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-x-6 gap-y-8">
          {t.stats.map(([n, mark, l]) => (
            <Reveal key={l} className="flex flex-col gap-1.5">
              <span className="font-serif text-[clamp(40px,4.4vw,56px)] font-semibold leading-none">
                {n}
                <sup className="text-[0.4em] text-copper-600">{mark}</sup>
              </span>
              <Brush className="h-2 w-14" />
              <span className="text-[16px] leading-[1.4] text-ink-body">{l}</span>
            </Reveal>
          ))}
        </div>
        <Reveal><p className="mt-6 text-[13px] text-ink-soft">{t.statsNote}</p></Reveal>
      </section>

      {/* Une journée */}
      <section className="overflow-hidden bg-sand">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-10 px-[clamp(20px,4vw,32px)] py-[clamp(64px,9vw,112px)]">
          <Reveal className="flex max-w-[640px] flex-col gap-3">
            <Eyebrow>{t.dayEyebrow}</Eyebrow>
            <h2 className={h2Class}>{t.dayTitle}</h2>
            <p className="m-0 text-[17px] leading-[1.6] text-ink-body">{t.daySubtitle}</p>
          </Reveal>
          <div className="no-scrollbar grid auto-cols-[minmax(280px,1fr)] grid-flow-col gap-4 md:auto-cols-[minmax(240px,1fr)] md:gap-6 overflow-x-auto pb-3 [scroll-snap-type:x_mandatory]">
            {t.day.map(([h, dt, d, img, alt, rot], i) => (
              <div key={h} className="[scroll-snap-align:start]">
              <div className="md:hidden">
                <MobilePhotoCard
                  src={img}
                  alt={alt}
                  heightClass="h-[420px]"
                  badge={<span className="rounded-full bg-cream px-2.5 py-1 text-[13px] font-extrabold text-night">{h}</span>}
                  title={dt}
                  text={d}
                />
              </div>
              <Reveal delay={i * 90} className="hidden flex-col gap-3.5 md:flex">
                <div className="relative aspect-[4/5] overflow-hidden rounded-xl shadow-[0_8px_24px_rgba(60,35,15,.12)]" style={{ transform: `rotate(${rot})` }}>
                  <Image src={img} alt={alt} fill sizes="(max-width: 768px) 60vw, 280px" loading="lazy" className="photo-tone object-cover object-[50%_35%]" />
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="rounded-full bg-ink px-2.5 py-1 text-[13px] font-extrabold text-cream">{h}</span>
                  <Brush fill="#D9C7AE" className="h-2 flex-1" />
                </div>
                <h3 className="m-0 font-serif text-[22px] font-semibold">{dt}</h3>
                <p className="m-0 text-[16px] leading-[1.55] text-ink-body">{d}</p>
              </Reveal>
              </div>
            ))}
          </div>
          <span className="text-[13px] text-ink-soft">{t.dayNote}</span>
        </div>
      </section>

      {/* Projet en cours */}
      <section className="relative overflow-hidden bg-night text-cream">
        <Image src="/photos/photo-ecriture.jpg" alt={t.projectImgAlt} fill sizes="100vw" className="photo-tone object-cover object-[60%_30%]" />
        <div className="relative mx-auto max-w-[1280px] px-[clamp(12px,4vw,48px)] py-[clamp(40px,8vw,120px)]">
          <Reveal className="flex max-w-[520px] flex-col gap-[18px] rounded-[20px] bg-[rgba(10,10,10,.9)] p-[clamp(28px,4vw,48px)]">
            <Eyebrow dark>{t.projectEyebrow}</Eyebrow>
            <h2 className="m-0 font-serif text-[clamp(40px,5vw,64px)] font-medium leading-none">{currentProject.name}</h2>
            <p className="m-0 text-[15px] font-bold tracking-[0.04em] text-gold-hover">{currentProject.acronymMeaning}</p>
            <p className="m-0 text-[17px] leading-[1.65] text-on-dark-1">{currentProject.intro}</p>
            <div className="flex flex-wrap gap-3 pt-1">
              <a href="#don" className="inline-flex min-h-[52px] items-center whitespace-nowrap rounded-full bg-gold px-6 text-[16px] font-extrabold text-night no-underline hover:bg-gold-hover hover:text-night">
                {t.projectSupport}
              </a>
              <Link href={href('/projets/reves-2')} className="inline-flex min-h-[52px] items-center gap-1.5 whitespace-nowrap px-2 font-bold text-gold-hover no-underline">
                {t.projectLink}
                <ArrowRightIcon aria-hidden />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Trois façons d'aider */}
      <section className="mx-auto flex max-w-[1200px] flex-col gap-8 px-[clamp(20px,4vw,32px)] py-[clamp(64px,9vw,112px)]">
        <Reveal>
          <h2 className={h2Class}>{t.waysTitle}</h2>
        </Reveal>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-4">
          {t.ways.map((w, i) => {
            const Icon = w.icon;
            const isAnchor = w.href.startsWith('#');
            const cls = `flex min-h-[280px] flex-col gap-3.5 rounded-[20px] ${w.bg} ${w.fg} px-7 py-8 no-underline transition-transform hover:-translate-y-[3px] hover:${w.fg}`;
            const inner = (
              <>
                <Icon size={36} className={w.ic} aria-hidden />
                <h3 className="m-0 font-serif text-[32px] font-medium">{w.t}</h3>
                <p className={`m-0 flex-1 text-[16px] leading-[1.6] ${w.fg2}`}>{w.d}</p>
                <span className={`inline-flex items-center gap-1.5 font-extrabold ${w.ic}`}>
                  {w.cta}
                  <ArrowRightIcon aria-hidden />
                </span>
              </>
            );
            return (
              <Reveal key={w.t} delay={i * 90}>
                {isAnchor ? (
                  <a href={w.href} className={cls}>
                    {inner}
                  </a>
                ) : (
                  <Link href={href(w.href)} className={cls}>
                    {inner}
                  </Link>
                )}
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Témoignages */}
      <section className="mx-auto grid max-w-[1200px] grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] gap-5 px-[clamp(20px,4vw,32px)] pb-[clamp(64px,9vw,112px)]">
        {t.testimonials.map((f, i) => (
          <Reveal key={f.name} delay={i * 90}>
            <figure className="m-0 flex flex-col gap-4 rounded-[20px] bg-white p-8 shadow-ol-sm">
              <blockquote className="m-0 font-serif text-[22px] italic leading-[1.45]">{f.q}</blockquote>
              <figcaption className="text-[15px]">
                <b>{f.name}</b> · {f.role}
                {f.fictional && <span className="text-ink-soft"> · {t.fictionalNote}</span>}
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </section>

      {/* Nouvelles du terrain */}
      <section className="bg-sand">
        <div className="mx-auto grid max-w-[1280px] grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] gap-x-16 gap-y-10 px-[clamp(20px,4vw,48px)] py-[clamp(64px,9vw,120px)]">
          <Reveal className="flex flex-col gap-4">
            <h2 className={h2Class}>{t.newsTitle}</h2>
            <p className="m-0 text-[17px] leading-[1.6] text-ink-body">{t.newsSubtitle}</p>
            <Link href={href('/galerie')} className="inline-flex min-h-11 items-center gap-1.5 font-bold no-underline">
              {t.newsAll}
              <ArrowRightIcon aria-hidden />
            </Link>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-6">
              <span className="text-[13px] font-extrabold uppercase tracking-[0.12em] text-ink-soft">{t.partners}</span>
              <span className="text-[18px] font-extrabold">{currentProject.partnerName}</span>
              <span className="flex min-h-12 min-w-[120px] items-center justify-center rounded-lg border-[1.5px] border-dashed border-field-line text-[13px] text-ink-soft">
                {t.partnerLogo}
              </span>
            </div>
          </Reveal>
          <div className="flex flex-col gap-3">
            {t.news.map(([img, alt, tag, date, title], i) => (
              <Reveal key={title} delay={i * 90}>
                <Link href={href('/galerie')} className="grid grid-cols-[96px_minmax(0,1fr)] items-center gap-[18px] rounded-xl bg-cream p-3 text-ink no-underline hover:text-ink hover:shadow-ol-md">
                  <div className="relative h-24 w-24 overflow-hidden rounded-lg">
                    <Image src={img} alt={alt} fill sizes="96px" loading="lazy" className="photo-tone object-cover" />
                  </div>
                  <div className="flex min-w-0 flex-col gap-1.5">
                    <span className="text-[13px] font-bold text-ink-soft">
                      {tag} · {date}
                    </span>
                    <span className="font-serif text-[20px] font-semibold leading-[1.3]">{title}</span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Don */}
      <section id="don" className="mx-auto grid max-w-[1200px] scroll-mt-20 grid-cols-[repeat(auto-fit,minmax(min(100%,400px),1fr))] items-center gap-[clamp(32px,5vw,72px)] px-[clamp(20px,4vw,32px)] py-[clamp(64px,9vw,112px)]">
        <Reveal className="flex flex-col gap-[18px]">
          <h2 className={`${h2Class} text-balance`}>
            {t.donTitlePre}
            <BrushWord>{t.donTitleWord}</BrushWord>
            {t.donTitlePost}
          </h2>
          <p className="m-0 text-[18px] leading-[1.6] text-ink-body">{t.donText}</p>
          <div className="flex flex-col gap-2.5 pt-1.5">
            {t.trust.map(([Icon, label]) => (
              <span key={label} className="flex items-center gap-2.5 text-[15px]">
                <Icon size={22} color="#3F5A47" aria-hidden />
                {label}
              </span>
            ))}
          </div>
        </Reveal>
        <Reveal delay={90}>
          <DonationQuick locale={locale} />
        </Reveal>
      </section>
    </>
  );
}
