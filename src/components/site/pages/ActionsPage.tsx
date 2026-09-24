import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  HeartIcon,
  BookOpenIcon,
  FirstAidIcon,
  ChatCircleDotsIcon,
  SoccerBallIcon,
  BriefcaseIcon,
  ArrowRightIcon
} from '@phosphor-icons/react/ssr';
import { Reveal } from '@/components/Reveal';
import { InnerHero } from '@/components/site/InnerHero';
import { Eyebrow, CallBanner } from '@/components/site/ui';
import { localeHref, type Locale } from '@/lib/i18n';
import { currentProject } from '@/lib/content';

const text = {
  fr: {
    title: 'Nos actions',
    desc: "Alphabétisation, apprentissage du français, activités culturelles et sportives, suivi médical et psychosocial, formation des animateurs et (ré)insertion professionnelle à Kinshasa.",
    eyebrow: 'Nos actions',
    titlePre: 'Éduquer, soigner, ',
    titleWord: 'écouter',
    intro: "Nos programmes à Kinshasa permettent l'accès à un mode de vie décent par l'éducation et des actions sociales et sanitaires.",
    donate: 'Faire un don',
    sponsor: 'Parrainer un enfant',
    heroAlt: 'Un garçon écrit dans son cahier pendant un atelier.',
    areas: [
      { icon: BookOpenIcon, k: 'Éducation', t: 'Alphabétisation et apprentissage du français', d: "Apprendre à lire et à écrire est le premier levier d'autonomie. Maîtriser la langue de scolarisation conditionne l'accès à l'école et, plus tard, à une formation professionnelle.", img: '/photos/photo-ecriture.jpg', alt: 'Une jeune fille écrit dans son cahier.' },
      { icon: FirstAidIcon, k: 'Santé', t: 'Un suivi médical régulier', d: "Chaque enfant du programme bénéficie d'un suivi médical, pour que la santé ne soit jamais un frein à l'apprentissage.", img: '/photos/photo-joie.jpg', alt: 'Un garçon rit, assis sur un muret.' },
      { icon: ChatCircleDotsIcon, k: 'Écoute', t: 'Accompagnement psychosocial et spirituel', d: 'Un espace pour parler, être entendu et reprendre confiance, avec des encadrants formés.', img: '/photos/photo-mains.jpg', alt: 'Des mains colorient des lettres.' },
      { icon: SoccerBallIcon, k: 'Culture et sport', t: 'Activités culturelles, sportives et artistiques', d: 'Le jeu, le sport et la création ne sont pas des à-côtés : ils rendent la confiance et réapprennent la vie en groupe.', img: '/photos/photo-dessin.jpg', alt: 'Deux garçons dessinent ensemble.' },
      { icon: BriefcaseIcon, k: 'Insertion', t: '(Ré)insertion professionnelle', d: 'Co-construire des programmes de (ré)insertion professionnelle et accompagner chacun dans son accomplissement professionnel et personnel.', img: '/photos/photo-atelier.jpg', alt: 'Un garçon écrit, concentré.' }
    ],
    revesEyebrow: 'Projet en cours · septembre à décembre 2026',
    revesText:
      "Sur une période de 4 mois, RÊVES 2 propose aux enfants de One Love un accompagnement structuré combinant alphabétisation, apprentissage du français, activités culturelles, sportives et artistiques. Le projet comprend également la formation des animateurs, le renforcement des ressources pédagogiques et la mise à disposition de matériel informatique.",
    revesLink: 'Découvrir le projet',
    bannerTitle: 'Chaque programme tient grâce à des soutiens réguliers.',
    bannerText: 'Choisissez un programme à soutenir, ou laissez l’équipe affecter votre don là où il est le plus utile.'
  },
  en: {
    title: 'Our work',
    desc: 'Literacy, French lessons, cultural and sports activities, medical and psychosocial care, facilitator training and professional (re)integration in Kinshasa.',
    eyebrow: 'Our work',
    titlePre: 'Educate, care, ',
    titleWord: 'listen',
    intro: 'Our programmes in Kinshasa give children access to a decent way of life through education, social and health work.',
    donate: 'Donate',
    sponsor: 'Sponsor a child',
    heroAlt: 'A boy writes in his notebook during a workshop.',
    areas: [
      { icon: BookOpenIcon, k: 'Education', t: 'Literacy and French lessons', d: 'Learning to read and write is the first step towards independence. Mastering the language of school opens the door to education and, later, to vocational training.', img: '/photos/photo-ecriture.jpg', alt: 'A girl writes in her notebook.' },
      { icon: FirstAidIcon, k: 'Health', t: 'Regular medical care', d: 'Every child in the programme receives medical follow-up, so that health never gets in the way of learning.', img: '/photos/photo-joie.jpg', alt: 'A boy laughs, sitting on a low wall.' },
      { icon: ChatCircleDotsIcon, k: 'Listening', t: 'Psychosocial and spiritual support', d: 'A space to talk, be heard and regain confidence, with trained staff.', img: '/photos/photo-mains.jpg', alt: 'Hands colouring in letters.' },
      { icon: SoccerBallIcon, k: 'Culture and sport', t: 'Cultural, sports and art activities', d: 'Play, sport and creativity are not extras: they restore confidence and teach children to live together again.', img: '/photos/photo-dessin.jpg', alt: 'Two boys drawing together.' },
      { icon: BriefcaseIcon, k: 'Integration', t: 'Professional (re)integration', d: 'Co-designing professional (re)integration programmes and supporting each person in their professional and personal fulfilment.', img: '/photos/photo-atelier.jpg', alt: 'A boy writes, focused.' }
    ],
    revesEyebrow: 'Current project · September to December 2026',
    revesText:
      "Over 4 months, RÊVES 2 offers One Love's children structured support combining literacy, French lessons, and cultural, sports and art activities. It also includes facilitator training, stronger teaching resources and computer equipment.",
    revesLink: 'Discover the project',
    bannerTitle: 'Every programme relies on regular support.',
    bannerText: 'Choose a programme to support, or let the team allocate your gift where it helps most.'
  }
};

export function actionsMetadata(locale: Locale): Metadata {
  const t = text[locale];
  return { title: t.title, description: t.desc };
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
        image="/photos/photo-ecriture.jpg"
        imageAlt={t.heroAlt}
        cta={{ donate: t.donate, sponsor: t.sponsor }}
      />

      <section className="mx-auto flex max-w-[1200px] flex-col gap-[clamp(56px,8vw,96px)] px-[clamp(20px,4vw,32px)] py-[clamp(56px,8vw,104px)]">
        {t.areas.map((a, i) => {
          const Icon = a.icon;
          const imgFirst = i % 2 === 0;
          return (
            <Reveal
              key={a.t}
              className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,360px),1fr))] items-center gap-[clamp(28px,5vw,64px)]"
            >
              <div className={`relative aspect-[4/3] overflow-hidden rounded-[20px] ${imgFirst ? 'dk:order-1' : 'dk:order-2'}`}>
                <Image src={a.img} alt={a.alt} fill sizes="(max-width: 1200px) 100vw, 560px" loading="lazy" className="photo-tone object-cover object-[50%_35%]" />
              </div>
              <div className={`flex flex-col gap-3.5 ${imgFirst ? 'dk:order-2' : 'dk:order-1'}`}>
                <div className="flex items-center gap-3">
                  <span className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-copper-tint-2">
                    <Icon size={28} className="text-copper-600" aria-hidden />
                  </span>
                  <Eyebrow>{a.k}</Eyebrow>
                </div>
                <h2 className="m-0 font-serif text-[clamp(28px,3vw,38px)] font-medium leading-[1.2]">{a.t}</h2>
                <p className="m-0 text-pretty text-[17px] leading-[1.65] text-ink-body">{a.d}</p>
              </div>
            </Reveal>
          );
        })}
      </section>

      <section className="bg-sand">
        <div className="mx-auto grid max-w-[1200px] grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] items-center gap-x-16 gap-y-8 px-[clamp(20px,4vw,32px)] py-[clamp(56px,8vw,104px)]">
          <Reveal className="flex flex-col gap-3.5">
            <Eyebrow>{t.revesEyebrow}</Eyebrow>
            <h2 className="m-0 text-balance font-serif text-[clamp(30px,3.6vw,46px)] font-medium leading-[1.15]">{currentProject.name}</h2>
            <p className="m-0 text-[15px] font-extrabold tracking-[0.04em] text-copper-700">{currentProject.acronymMeaning}</p>
          </Reveal>
          <Reveal delay={90} className="flex flex-col gap-4">
            <p className="m-0 text-pretty text-[17px] leading-[1.65] text-ink-body">{t.revesText}</p>
            <Link href={href('/projets/reves-2')} className="inline-flex min-h-11 items-center gap-1.5 font-bold no-underline">
              {t.revesLink}
              <ArrowRightIcon aria-hidden />
            </Link>
          </Reveal>
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
