import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRightIcon, HeartIcon } from '@phosphor-icons/react/ssr';
import { pageMetadata } from '@/lib/seo';
import { Reveal } from '@/components/Reveal';
import { InnerHero } from '@/components/site/InnerHero';
import { Brush, BrushWord, CallBanner, Eyebrow, h2Class } from '@/components/site/ui';
import { MediaItem, photo, video, type Media } from '@/components/site/pages/HistoryPage';
import { FACEBOOK_URL, INSTAGRAM_URL, YOUTUBE_URL, localeHref, type Locale } from '@/lib/i18n';

// Page « One Love Village » : le grand projet de Kasangulu. Tout ce qui est
// affiché vient de faits déjà publiés sur « Notre histoire » (dates, dîners,
// partenaires) et des médias de l'association. Surface, plans, budget et
// calendrier de construction ne sont pas connus : ils n'apparaissent pas.
// Photos : public/histoire (village-*.webp), vidéos : public/histoire/videos.

type L = { fr: string; en: string };

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
const heroPool = [
  { src: '/histoire/village-hero.webp', position: '50% 55%' },
  { src: '/histoire/village-terrain-ciel.webp', position: '50% 75%' },
  { src: '/histoire/village-terrain-equipe.webp', position: '50% 60%' },
  { src: '/histoire/village-terrain-chemin.webp', position: '50% 55%' },
  { src: '/histoire/village-terrain-palmier.webp', position: '50% 70%' },
  { src: '/histoire/village-terrain-piste.webp', position: '50% 62%' },
  { src: '/histoire/village-chantier-coucher-soleil.webp', position: '50% 60%' },
  { src: '/histoire/2018-kasangulu.webp', position: '50% 50%' },
  { src: '/histoire/2018-kasangulu-2.webp', position: '50% 50%' },
  { src: '/histoire/2023-kasangulu.webp', position: '50% 50%' },
  { src: '/histoire/2023-kasangulu-2.webp', position: '50% 50%' }
];

const text = {
  fr: {
    title: 'One Love Village, notre projet à Kasangulu',
    desc: 'Le One Love Village, notre grand projet en construction à Kasangulu : son histoire depuis 2015, les dîners caritatifs, le terrain en photos et en vidéos.',
    eyebrow: 'Grand projet en construction',
    titlePre: 'One Love ',
    titleWord: 'Village',
    intro: 'Sur notre terrain de Kasangulu, nous construisons le One Love Village. Voici son histoire, pas à pas.',
    heroAlt: 'Des engins au travail sur le terrain de Kasangulu, au coucher du soleil.',
    leadEyebrow: 'Le projet',
    leadTitlePre: 'Bâtir quelque chose de ',
    leadTitleWord: 'durable',
    lead: 'Depuis 2015, nous voulons construire quelque chose de durable au Congo. Le terrain de Kasangulu est le lieu de ce projet : nous l’avons repéré, borné, débroussaillé, et les travaux ont commencé.',
    pathEyebrow: 'Le chemin parcouru',
    pathTitlePre: 'Du premier repérage aux ',
    pathTitleWord: 'premiers travaux',
    path: [
      { year: '2015', title: 'Un projet d’école', text: 'Notre but de départ est concret : construire une école au Congo. En août, nous repérons et bornons le terrain de Kasangulu.' },
      { year: '2018', title: 'Le premier débroussaillage', text: 'Notre équipe se met au travail sur le terrain pour le dégager.' },
      { year: '2023', title: 'Le premier dîner caritatif', text: 'Près de 260 invités à l’hôtel Pullman de Kinshasa, le 8 décembre, pour financer le One Love Village. Les travaux commencent à Kasangulu.' },
      { year: '2024', title: 'Une deuxième édition', text: 'Le 13 décembre, un nouveau dîner rassemble de grands partenaires, dont la Fondation Vodacom, autour du même projet.' }
    ],
    filmEyebrow: 'En vidéo',
    filmTitlePre: 'Le terrain, ',
    filmTitleWord: 'vu du ciel et de près',
    filmText: 'Ce film a été tourné sur le terrain de Kasangulu. La deuxième vidéo est celle de notre premier repérage, en 2015.',
    galleryEyebrow: 'En images',
    galleryTitlePre: 'Le terrain de ',
    galleryTitleWord: 'Kasangulu',
    dinnersEyebrow: 'Ceux qui le rendent possible',
    dinnersTitlePre: 'Deux dîners ',
    dinnersTitleWord: 'caritatifs',
    dinnersText: 'Ces dîners réunissent nos amis, nos partenaires et nos soutiens autour du village. Ils financent le chantier.',
    followTitle: 'Suivre le chantier',
    followText: 'Nous partageons l’avancée du projet sur nos réseaux.',
    facebook: 'Facebook',
    instagram: 'Instagram',
    youtube: 'YouTube',
    historyLink: 'Lire toute notre histoire',
    play: 'Lire la vidéo',
    bannerTitle: 'Le village se construit avec vous.',
    bannerText: 'Un don ou un parrainage nous aide à avancer, pour le village comme pour les enfants que nous accueillons déjà.',
    donate: 'Faire un don',
    sponsor: 'Parrainer un enfant'
  },
  en: {
    title: 'One Love Village, our project in Kasangulu',
    desc: 'The One Love Village, our large project under construction in Kasangulu: its story since 2015, the charity dinners, and the land in photos and videos.',
    eyebrow: 'Large project under construction',
    titlePre: 'One Love ',
    titleWord: 'Village',
    intro: 'On our land in Kasangulu, we are building the One Love Village. Here is its story, step by step.',
    heroAlt: 'Machines at work on the Kasangulu land, at sunset.',
    leadEyebrow: 'The project',
    leadTitlePre: 'Building something ',
    leadTitleWord: 'lasting',
    lead: 'Since 2015, we have wanted to build something lasting in Congo. The Kasangulu land is where it will happen: we surveyed it, marked it out, cleared it, and work has begun.',
    pathEyebrow: 'The road so far',
    pathTitlePre: 'From the first visit to the ',
    pathTitleWord: 'first works',
    path: [
      { year: '2015', title: 'A school project', text: 'Our starting goal is concrete: build a school in Congo. In August, we survey and mark out the Kasangulu land.' },
      { year: '2018', title: 'The first clearing', text: 'Our team gets to work on the land to clear it.' },
      { year: '2023', title: 'The first charity dinner', text: 'Nearly 260 guests at the Pullman hotel in Kinshasa on 8 December, to fund the One Love Village. Work begins in Kasangulu.' },
      { year: '2024', title: 'A second edition', text: 'On 13 December, a new dinner brings together major partners, including the Vodacom Foundation, around the same project.' }
    ],
    filmEyebrow: 'On video',
    filmTitlePre: 'The land, ',
    filmTitleWord: 'from the sky and up close',
    filmText: 'This film was shot on the Kasangulu land. The second video is from our first visit, in 2015.',
    galleryEyebrow: 'In pictures',
    galleryTitlePre: 'The land in ',
    galleryTitleWord: 'Kasangulu',
    dinnersEyebrow: 'Those who make it possible',
    dinnersTitlePre: 'Two ',
    dinnersTitleWord: 'charity dinners',
    dinnersText: 'These dinners bring our friends, partners and supporters together around the village. They fund the building work.',
    followTitle: 'Follow the building work',
    followText: 'We share the progress of the project on our social networks.',
    facebook: 'Facebook',
    instagram: 'Instagram',
    youtube: 'YouTube',
    historyLink: 'Read our whole story',
    play: 'Play video',
    bannerTitle: 'The village is built with you.',
    bannerText: 'A donation or a sponsorship helps us move forward, for the village and for the children we already welcome.',
    donate: 'Donate',
    sponsor: 'Sponsor a child'
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

  return (
    <>
      <InnerHero
        locale={locale}
        eyebrow={t.eyebrow}
        titlePre={t.titlePre}
        titleWord={t.titleWord}
        intro={t.intro}
        image="/histoire/village-hero.webp"
        imageAlt={t.heroAlt}
        objectPosition="50% 55%"
        photoPool={heroPool}
      />

      <section aria-labelledby="village-projet">
        <div className={`${wrap} dk:grid dk:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] dk:items-start dk:gap-14`}>
          <SectionHead eyebrow={t.leadEyebrow} pre={t.leadTitlePre} word={t.leadTitleWord} id="village-projet" />
          <Reveal delay={80} className="flex flex-col gap-5 rounded-card bg-copper-tint p-[clamp(24px,3vw,36px)]">
            <p className="m-0 max-w-measure text-[17px] leading-[1.7] text-ink-body">{t.lead}</p>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="village-chemin" className="bg-sand">
        <div className={wrap}>
          <SectionHead eyebrow={t.pathEyebrow} pre={t.pathTitlePre} word={t.pathTitleWord} id="village-chemin" />
          <ol className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,250px),1fr))] gap-6 p-0">
            {t.path.map((step, i) => (
              <li key={step.year}>
                <Reveal delay={i * 90} className="flex h-full flex-col gap-3 rounded-card border-t-[3px] border-copper-600 bg-cream p-6">
                <span className="font-serif text-[clamp(32px,3.4vw,42px)] font-medium leading-none tabular-nums text-copper-600">{step.year}</span>
                <h3 className="m-0 text-balance font-serif text-[22px] font-medium leading-[1.25] text-ink">{step.title}</h3>
                <p className="m-0 text-pretty text-[16px] leading-[1.6] text-ink-body">{step.text}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="village-film">
        <div className={wrap}>
          <SectionHead eyebrow={t.filmEyebrow} pre={t.filmTitlePre} word={t.filmTitleWord} id="village-film" />
          <p className="m-0 max-w-measure text-pretty text-[16px] leading-[1.65] text-ink-body">{t.filmText}</p>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <MediaItem m={film} locale={locale} playLabel={t.play} index={0} />
            <MediaItem m={youtube} locale={locale} playLabel={t.play} index={1} />
          </div>
        </div>
      </section>

      <section aria-labelledby="village-images" className="bg-sand">
        <div className={wrap}>
          <SectionHead eyebrow={t.galleryEyebrow} pre={t.galleryTitlePre} word={t.galleryTitleWord} id="village-images" />
          <div className="grid grid-flow-dense grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            {gallery.map((m, i) => (
              <MediaItem key={m.kind === 'photo' ? m.src : i} m={m} locale={locale} playLabel={t.play} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="village-diners">
        <div className={wrap}>
          <SectionHead eyebrow={t.dinnersEyebrow} pre={t.dinnersTitlePre} word={t.dinnersTitleWord} id="village-diners" />
          <p className="m-0 max-w-measure text-pretty text-[16px] leading-[1.65] text-ink-body">{t.dinnersText}</p>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {dinners.map((m, i) => (
              <MediaItem key={m.kind === 'video' ? m.src : i} m={m} locale={locale} playLabel={t.play} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="village-suivre" className="bg-sand">
        <div className={`${wrap} items-start gap-5`}>
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
