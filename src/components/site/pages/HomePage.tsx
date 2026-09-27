import Image from 'next/image';
import Link from 'next/link';
import { HeartIcon, HandHeartIcon, UsersThreeIcon, ArrowRightIcon, SealCheckIcon } from '@phosphor-icons/react/ssr';
import { Reveal } from '@/components/Reveal';
import { MobilePhotoCard } from '@/components/site/MobilePhotoCard';
import { HeroBackground } from '@/components/site/HeroBackground';
import { FacebookBand } from '@/components/site/FacebookBand';
import { PartnersMarquee } from '@/components/site/PartnersMarquee';
import { Brush, BrushWord, Eyebrow, h2Class } from '@/components/site/ui';
import { localeHref, type Locale } from '@/lib/i18n';
import { CountUp } from '@/components/site/effects/CountUp';
import { currentProject } from '@/lib/content';

const text = {
  fr: {
    eyebrow: 'Kinshasa, RDC · depuis 2013',
    titlePre: "L'",
    titleWord: 'amour',
    titlePost: ' et la foi, notre carburant.',
    intro:
      "Notre désir est de communiquer l'amour que nous avons reçu. À Kinshasa, nous accompagnons des enfants par l'éducation, le soin et l'écoute.",
    donate: 'Faire un don',
    sponsor: 'Parrainer un enfant',
    badge: 'Association loi 1901 · RNA W951001528',
    heroImgAlt: 'Deux garçons dessinent à une table en plein air, au centre One Love.',
    pathTitle: 'Le chemin parcouru',
    // Mêmes chiffres, mêmes sources datées que la page Notre histoire —
    // ne pas laisser diverger si l'un des deux est corrigé un jour.
    path: [
      { value: 3, prefix: '', label: 'garçons rencontrés dans la rue', when: 'été 2016' },
      { value: 21, prefix: '', label: 'garçons accueillis à la One Love House', when: 'janvier 2020' },
      { value: 90, prefix: '', label: 'enfants au centre aéré, un samedi', when: 'mars 2022' },
      { value: 100, prefix: '≈ ', label: 'enfants accueillis chaque semaine', when: '2024' }
    ] as const,
    dayEyebrow: 'RÊVES 2 · carnet de bord',
    dayTitle: 'Une journée à One Love',
    daySubtitle: 'Ce que votre soutien rend possible, au fil de la journée.',
    day: [
      ["L'arrivée", 'Les enfants arrivent au centre, prêts à découvrir et apprendre.', '/photos/photo-joie.jpg', 'Un garçon rit en arrivant au centre.', '-1.5deg'],
      ["Atelier d'écriture", "Lire et écrire en petits groupes : le premier levier d'autonomie.", '/photos/photo-ecriture.jpg', 'Une jeune fille écrit dans son cahier.', '1deg'],
      ['Français', "Maîtriser la langue de l'école pour ouvrir l'accès à la scolarité.", '/photos/photo-cahier.jpg', 'Un garçon écrit, concentré.', '-1deg'],
      ['Création et jeu', 'Dessin, sport, musique : retrouver la confiance et la vie en groupe.', '/photos/photo-mains.jpg', 'Des mains colorient des lettres.', '1.5deg']
    ] as const,
    projectEyebrow: 'Projet en cours · sept. à déc. 2026',
    projectSupport: 'Soutenir RÊVES 2',
    projectLink: 'Le projet',
    projectImgAlt: 'Une jeune fille écrit dans son cahier pendant un atelier.',
    waysTitle: 'Trois façons d’aider',
    ways: [
      { icon: HeartIcon, t: 'Donner', d: 'Un don ponctuel ou mensuel finance les ateliers, le matériel et le suivi des enfants.', cta: 'Faire un don', bg: 'bg-night', fg: 'text-cream', fg2: 'text-on-dark-1', ic: 'text-gold-hover', href: '/dons' },
      { icon: HandHeartIcon, t: 'Parrainer', d: 'Un engagement mensuel pour la continuité de l’accompagnement, avec des nouvelles régulières.', cta: 'Devenir parrain', bg: 'bg-sand', fg: 'text-ink', fg2: 'text-ink-body', ic: 'text-copper-700', href: '/parrainer' },
      { icon: UsersThreeIcon, t: 'S’engager', d: 'Bénévolat, dons en nature, collectes, partenariats avec des entreprises ou des églises.', cta: 'S’impliquer', bg: 'bg-sage-100', fg: 'text-ink', fg2: 'text-ink-body', ic: 'text-sage-700', href: '/s-impliquer' }
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
    heroImgAlt: 'Two boys drawing at an outdoor table at the One Love centre.',
    pathTitle: 'How far we have come',
    path: [
      { value: 3, prefix: '', label: 'boys met on the street', when: 'summer 2016' },
      { value: 21, prefix: '', label: 'boys living at the One Love House', when: 'January 2020' },
      { value: 90, prefix: '', label: 'children at the day centre, one Saturday', when: 'March 2022' },
      { value: 100, prefix: '≈ ', label: 'children welcomed every week', when: '2024' }
    ] as const,
    dayEyebrow: 'RÊVES 2 · logbook',
    dayTitle: 'A day at One Love',
    daySubtitle: 'What your support makes possible, through the day.',
    day: [
      ['Arrival', 'The children arrive at the centre, ready to discover and learn.', '/photos/photo-joie.jpg', 'A boy laughs as he arrives at the centre.', '-1.5deg'],
      ['Writing workshop', 'Reading and writing in small groups: the first step towards independence.', '/photos/photo-ecriture.jpg', 'A girl writes in her notebook.', '1deg'],
      ['French', 'Mastering the language of school opens the door to education.', '/photos/photo-cahier.jpg', 'A boy writes, focused.', '-1deg'],
      ['Creativity and play', 'Drawing, sport, music: regaining confidence and group life.', '/photos/photo-mains.jpg', 'Hands colouring in letters.', '1.5deg']
    ] as const,
    projectEyebrow: 'Current project · Sept. to Dec. 2026',
    projectSupport: 'Support RÊVES 2',
    projectLink: 'The project',
    projectImgAlt: 'A girl writes in her notebook during a workshop.',
    waysTitle: 'Three ways to help',
    ways: [
      { icon: HeartIcon, t: 'Give', d: 'A one-off or monthly gift funds workshops, materials and the children’s follow-up.', cta: 'Donate', bg: 'bg-night', fg: 'text-cream', fg2: 'text-on-dark-1', ic: 'text-gold-hover', href: '/dons' },
      { icon: HandHeartIcon, t: 'Sponsor', d: 'A monthly commitment for continuous support, with regular updates.', cta: 'Become a sponsor', bg: 'bg-sand', fg: 'text-ink', fg2: 'text-ink-body', ic: 'text-copper-700', href: '/parrainer' },
      { icon: UsersThreeIcon, t: 'Take part', d: 'Volunteering, in-kind gifts, fundraising, partnerships with companies or churches.', cta: 'Get involved', bg: 'bg-sage-100', fg: 'text-ink', fg2: 'text-ink-body', ic: 'text-sage-700', href: '/s-impliquer' }
    ],
    testimonials: [
      { q: '“Since we met in 2010, my wife and I have shared one dream: to love and help those in need.”', name: 'Kanda Kabangu', role: 'co-founder' },
    ]
  }
};

export function HomePage({ locale }: { locale: Locale }) {
  const t = text[locale];
  const href = (p: string) => localeHref(p, locale);

  return (
    <>
      {/* Hero — desktop */}
      <section className="relative hidden min-h-[min(88vh,780px)] overflow-hidden bg-night text-cream dk:flex dk:items-center">
        <HeroBackground src="/photos/photo-dessin.jpg" alt={t.heroImgAlt} position="50% 42%" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,10,10,.92)_0%,rgba(10,10,10,.78)_34%,rgba(10,10,10,.1)_64%,rgba(10,10,10,0)_100%)]" />
        <div className="relative mx-auto w-full max-w-[1280px] px-12 py-24">
          <div className="flex max-w-[600px] flex-col gap-7">
            <Eyebrow dark>{t.eyebrow}</Eyebrow>
            {/* p, pas h1 : le vrai h1 de la page est celui du hero mobile
                juste après (même texte) — un seul par page, cohérent avec
                l'indexation mobile-first (audit SEO du 27/09/2026). */}
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
        <HeroBackground src="/photos/photo-dessin.jpg" alt={t.heroImgAlt} position="62% 30%" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,.15)_0%,rgba(10,10,10,.35)_30%,rgba(10,10,10,.88)_58%,rgba(10,10,10,.95)_100%)]" />
        <div className="relative flex flex-col items-center gap-[14px] px-5 pb-10 pt-[120px] text-center">
          <Eyebrow dark className="text-[12px]">
            {t.eyebrow}
          </Eyebrow>
          <h1 className="m-0 font-serif text-[32px] font-medium leading-[1.1]">
            {t.titlePre}
            <BrushWord>{t.titleWord}</BrushWord>
            {t.titlePost}
          </h1>
          <p className="-mt-1 m-0 text-[15px] leading-[1.5] text-on-dark-1">{t.intro}</p>
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

      <PartnersMarquee locale={locale} />

      {/* Le chemin parcouru — mêmes chiffres que la page Notre histoire */}
      <section aria-labelledby="chemin-titre-accueil" className="mx-auto max-w-[1200px] px-[clamp(20px,4vw,32px)] py-[clamp(36px,5vw,56px)]">
        <Reveal>
          <h2 id="chemin-titre-accueil" className="m-0 mb-7 font-serif text-[clamp(24px,2.8vw,32px)] font-medium leading-[1.15]">
            {t.pathTitle}
          </h2>
        </Reveal>
        <div className="grid grid-cols-2 gap-x-5 gap-y-8 md:grid-cols-4">
          {t.path.map((item) => (
            <Reveal key={item.label} className="flex flex-col gap-1.5">
              <CountUp
                value={item.value}
                prefix={item.prefix}
                className="font-serif text-[clamp(36px,4vw,52px)] font-medium leading-none text-copper-600"
              />
              <span className="text-[15px] leading-[1.35] text-ink-body">{item.label}</span>
              <span className="text-[13px] font-extrabold uppercase tracking-[0.1em] text-ink-soft">{item.when}</span>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Projet en cours */}
      <section className="relative overflow-hidden bg-night text-cream">
        <Image src="/photos/photo-ecriture.jpg" alt={t.projectImgAlt} fill sizes="100vw" className="photo-tone object-cover object-[60%_30%]" />
        <div className="relative mx-auto max-w-[1280px] px-[clamp(12px,4vw,48px)] py-[clamp(40px,8vw,120px)]">
          <Reveal className="flex max-w-[520px] flex-col gap-[18px] rounded-card bg-[rgba(10,10,10,.9)] p-[clamp(28px,4vw,48px)]">
            <Eyebrow dark>{t.projectEyebrow}</Eyebrow>
            <h2 className="m-0 font-serif text-[clamp(40px,5vw,64px)] font-medium leading-none">{currentProject.name}</h2>
            <p className="m-0 text-[15px] font-bold tracking-[0.04em] text-gold-hover">{currentProject.acronymMeaning}</p>
            <p className="m-0 text-[17px] leading-[1.65] text-on-dark-1">{currentProject.intro}</p>
            <div className="flex flex-wrap gap-3 pt-1">
              <Link href={href('/dons')} className="inline-flex min-h-[52px] items-center whitespace-nowrap rounded-full bg-gold px-6 text-[16px] font-extrabold text-night no-underline hover:bg-gold-hover hover:text-night">
                {t.projectSupport}
              </Link>
              <Link href={href('/projets/reves-2')} className="inline-flex min-h-[52px] items-center gap-1.5 whitespace-nowrap px-2 font-bold text-gold-hover no-underline">
                {t.projectLink}
                <ArrowRightIcon aria-hidden />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Une journée */}
      <section className="overflow-hidden bg-sand">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-10 px-[clamp(20px,4vw,32px)] py-[clamp(64px,9vw,112px)]">
          <Reveal className="flex max-w-[640px] flex-col gap-3">
            <Eyebrow>{t.dayEyebrow}</Eyebrow>
            <h2 className={h2Class}>{t.dayTitle}</h2>
            <p className="m-0 text-[17px] leading-[1.6] text-ink-body">{t.daySubtitle}</p>
          </Reveal>
          {/* Défilement horizontal natif, sans script : l'ancien intercepteur de
              molette (HorizontalGallery) relançait une animation de défilement
              fluide à chaque cran de trackpad — saccades au survol, signalées
              par Mazunda le 27/09/2026. Sans scroll-snap, le navigateur
              transmet déjà seul la molette verticale à la page. */}
          <div className="no-scrollbar grid auto-cols-[minmax(280px,1fr)] grid-flow-col gap-4 md:auto-cols-[minmax(240px,1fr)] md:gap-6 overflow-x-auto pb-3 [overscroll-behavior-x:contain]">
            {t.day.map(([dt, d, img, alt, rot], i) => (
              <div key={dt}>
              <div className="md:hidden">
                <MobilePhotoCard
                  src={img}
                  alt={alt}
                  heightClass="h-[420px]"
                  title={dt}
                  text={d}
                />
              </div>
              <Reveal delay={i * 90} className="hidden flex-col gap-3.5 md:flex">
                <div
                  className="ol-news-frame ol-gallery-frame relative aspect-[4/5] overflow-hidden rounded-xl shadow-ol-card"
                  style={{ transform: `rotate(${rot})` }}
                >
                  <Reveal variant="zoom" className="absolute inset-0">
                    <Image src={img} alt={alt} fill sizes="(max-width: 768px) 60vw, 280px" loading="lazy" className="photo-tone object-cover object-[50%_35%]" />
                  </Reveal>
                </div>
                <Reveal variant="soft" delay={180 + i * 90}>
                  <Brush fill="var(--clay)" className="h-2 w-full" stretch />
                </Reveal>
                <Reveal variant="soft" delay={280 + i * 90}>
                  <h3 className="m-0 font-serif text-[22px] font-semibold">{dt}</h3>
                </Reveal>
                <Reveal variant="soft" delay={380 + i * 90}>
                  <p className="m-0 text-[16px] leading-[1.55] text-ink-body">{d}</p>
                </Reveal>
              </Reveal>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trois façons d'aider */}
      <section className="mx-auto flex max-w-[1200px] flex-col gap-8 px-[clamp(20px,4vw,32px)] pt-[clamp(32px,5vw,56px)] pb-[clamp(64px,9vw,112px)]">
        <Reveal>
          <h2 className={h2Class}>{t.waysTitle}</h2>
        </Reveal>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-4">
          {t.ways.map((w, i) => {
            const Icon = w.icon;
            const cls = `flex min-h-[280px] flex-col gap-3.5 rounded-card ${w.bg} ${w.fg} px-7 py-8 no-underline transition-transform hover:-translate-y-[3px] hover:${w.fg}`;
            return (
              <Reveal key={w.t} delay={i * 90}>
                <Link href={href(w.href)} className={cls}>
                  <Icon size={36} className={w.ic} aria-hidden />
                  <h3 className="m-0 font-serif text-[32px] font-medium">{w.t}</h3>
                  <p className={`m-0 flex-1 text-[16px] leading-[1.6] ${w.fg2}`}>{w.d}</p>
                  <span className={`inline-flex items-center gap-1.5 font-extrabold ${w.ic}`}>
                    {w.cta}
                    <ArrowRightIcon aria-hidden />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Témoignages */}
      <section className="mx-auto max-w-[1200px] px-[clamp(20px,4vw,32px)] pb-[clamp(40px,6vw,72px)]">
        {t.testimonials.map((f, i) => (
          <Reveal key={f.name} delay={i * 90}>
            <figure className="m-0 flex max-w-[760px] flex-col gap-4 rounded-card bg-white p-8 shadow-ol-sm">
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
    </>
  );
}
