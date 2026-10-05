import type { Metadata } from 'next';
import { HeartIcon, ClockIcon, PlayIcon, BookOpenIcon, SoccerBallIcon, BowlFoodIcon, HandsPrayingIcon, FirstAidIcon } from '@phosphor-icons/react/ssr';
import { pageMetadata } from '@/lib/seo';
import { Reveal } from '@/components/Reveal';
import { InnerHero } from '@/components/site/InnerHero';
import { CallBanner, Eyebrow, BrushWord, h2Class } from '@/components/site/ui';
import { PhotoArchive } from '@/components/site/PhotoArchive';
import { CENTRE_MONTHS } from '@/lib/centre-aere';
import { localeHref, type Locale } from '@/lib/i18n';

// Page du centre aéré. Textes : publications de l'association (Instagram,
// 2021-2025) et précisions de Mazunda du 05/10/2026 (dimanche : Parole de Dieu
// de 14h à 15h, puis riz et haricots ; One Love Ministry, dans le centre aéré). Photos : Drive de l'association, classées par
// année et par mois.

const text = {
  fr: {
    title: 'Le centre aéré One Love, à Kinshasa',
    desc: 'Le mercredi, le samedi et le dimanche, le One Love Center accueille une centaine d’enfants des quartiers défavorisés de Kinshasa : ateliers, jeux, goûter, Parole de Dieu et repas. Toutes les photos, mois par mois.',
    eyebrow: 'Chaque semaine',
    titlePre: 'Le centre ',
    titleWord: 'aéré',
    intro: 'Un lieu sûr où les enfants des quartiers viennent apprendre, jouer, partager un repas et grandir dans l’amour.',
    heroAlt: 'Deux garçons du centre aéré, bras dessus, bras dessous, souriants.',
    whoEyebrow: 'Qui vient au centre',
    whoTitlePre: 'Des enfants des ',
    whoTitleWord: 'quartiers',
    who: [
      'Le centre aéré accueille des enfants des quartiers défavorisés de Kinshasa, filles et garçons de 5 à 12 ans et de 13 à 17 ans. Ils ne vivent pas au centre : ils y viennent plusieurs fois par semaine, puis rentrent chez eux. Certains viennent de loin et ne manquent presque jamais un rendez-vous.',
      'Ils sont une centaine chaque semaine. Un samedi de mars 2022, 90 enfants étaient présents. Le One Love Center n’est pas une simple garderie : c’est une maison sécurisée, à l’abri de la rue, où l’amitié grandit et où chacun est accueilli avec amour.'
    ],
    daysEyebrow: 'Le programme',
    daysTitlePre: 'Mercredi, samedi et ',
    daysTitleWord: 'dimanche',
    days: [
      { icon: PlayIcon, t: 'Le mercredi : jeux et film', d: 'Le mercredi est exclusivement réservé aux jeux. Les enfants jouent ensemble, puis regardent un film.' },
      { icon: BookOpenIcon, t: 'Le samedi après-midi', d: 'Accueil des enfants, puis ateliers en petits groupes : bibliothèque et lecture, informatique, chant et chorale, ateliers de cuisine animés par nos bénévoles.' },
      { icon: SoccerBallIcon, t: 'Sport et jeux', d: 'Football, basketball, jeux de société, jouets : on joue, on rit, on apprend à vivre ensemble et on reprend confiance.' },
      { icon: ClockIcon, t: 'Le déroulé, de 12h30 à 16h', d: 'Les animateurs arrivent à 12h30 et préparent les jeux du jour dès 13h. Les enfants sont inscrits à 13h30, entrent à 14h pour un temps de prière et de consignes, puis jouent en groupes de 5 ou de 10. Vers 15h30, bilan, prière et jus et pain, avant la sortie à 16h pile.' },
      { icon: BowlFoodIcon, t: 'Le goûter', d: 'Avant de rentrer chez eux, les enfants partagent un goûter ou un repas.' },
      { icon: HandsPrayingIcon, t: 'Le dimanche', d: 'Chaque dimanche, de 14h à 16h, les enfants se retrouvent au sein de One Love Ministry, qui fait partie du centre aéré. Ils écoutent la Parole de Dieu, qui les nourrit spirituellement et les aide à grandir, puis on leur sert un repas de riz et de haricots.' },
      { icon: FirstAidIcon, t: 'Soins et écoute', d: 'Beaucoup d’enfants arrivent avec des plaies ou des soucis de santé. Nos éducateurs, formés aux premiers secours, les soignent, et nous veillons sur leur santé et sur leur cœur.' }
    ],
    galleryEyebrow: 'En images',
    galleryTitlePre: 'Le centre, ',
    galleryTitleWord: 'mois après mois',
    galleryText: 'Toutes nos photos du centre aéré, classées par année et par mois. Touchez une photo pour l’agrandir.',
    altPrefix: 'Enfants au centre aéré One Love',
    bannerTitle: 'Un après-midi au centre change une semaine.',
    bannerText: 'Un don finance les ateliers, le goûter et le repas du dimanche. Un parrainage accompagne un enfant dans la durée.',
    donate: 'Faire un don',
    sponsor: 'Parrainer un enfant'
  },
  en: {
    title: 'The One Love day centre in Kinshasa',
    desc: 'On Wednesdays, Saturdays and Sundays, the One Love Center welcomes around a hundred children from disadvantaged neighbourhoods of Kinshasa: workshops, games, snacks, the Word of God and a meal. All the photos, month by month.',
    eyebrow: 'Every week',
    titlePre: 'The day ',
    titleWord: 'centre',
    intro: 'A safe place where children from the neighbourhoods come to learn, play, share a meal and grow up in love.',
    heroAlt: 'Two boys from the day centre, arm in arm, smiling.',
    whoEyebrow: 'Who comes to the centre',
    whoTitlePre: 'Children from the ',
    whoTitleWord: 'neighbourhoods',
    who: [
      'The day centre welcomes children from disadvantaged neighbourhoods of Kinshasa, girls and boys aged 5 to 12 and 13 to 17. They do not live at the centre: they come several times a week, then go back home. Some come from far away and almost never miss a day.',
      'Around a hundred come every week. On one Saturday in March 2022, 90 children were there. The One Love Center is not just a day-care: it is a safe house, away from the street, where friendship grows and everyone is welcomed with love.'
    ],
    daysEyebrow: 'The programme',
    daysTitlePre: 'Wednesday, Saturday and ',
    daysTitleWord: 'Sunday',
    days: [
      { icon: PlayIcon, t: 'Wednesdays: games and a film', d: 'Wednesday is reserved exclusively for games. The children play together, then watch a film.' },
      { icon: BookOpenIcon, t: 'Saturday afternoons', d: 'The children are welcomed, then workshops in small groups: library and reading, computers, singing and choir, cooking workshops led by our volunteers.' },
      { icon: SoccerBallIcon, t: 'Sport and games', d: 'Football, basketball, board games, toys: we play, laugh, learn to live together and regain confidence.' },
      { icon: ClockIcon, t: 'The schedule, 12:30 to 4 pm', d: 'Facilitators arrive at 12:30 and prepare the day’s games from 1 pm. The children sign in at 1:30 pm, enter at 2 pm for a time of prayer and guidelines, then play in groups of 5 or 10. Around 3:30 pm, a review, a prayer and juice and bread, before the 4 pm sharp finish.' },
      { icon: BowlFoodIcon, t: 'Snack time', d: 'Before going home, the children share a snack or a meal.' },
      { icon: HandsPrayingIcon, t: 'On Sundays', d: 'Every Sunday, from 2 pm to 4 pm, the children gather within One Love Ministry, which is part of the day centre. They listen to the Word of God, which feeds them spiritually and helps them grow, then are served a meal of rice and beans.' },
      { icon: FirstAidIcon, t: 'Care and listening', d: 'Many children arrive with wounds or health problems. Our educators, trained in first aid, take care of them, and we look after their health and their hearts.' }
    ],
    galleryEyebrow: 'In pictures',
    galleryTitlePre: 'The centre, ',
    galleryTitleWord: 'month after month',
    galleryText: 'All our day-centre photos, sorted by year and month. Tap a photo to enlarge it.',
    altPrefix: 'Children at the One Love day centre',
    bannerTitle: 'One afternoon at the centre changes a week.',
    bannerText: 'A gift funds the workshops, the snack and the Sunday meal. A sponsorship supports one child over time.',
    donate: 'Donate',
    sponsor: 'Sponsor a child'
  }
};

export function centreAereMetadata(locale: Locale): Metadata {
  const t = text[locale];
  return pageMetadata({ locale, path: '/centre-aere', title: t.title, description: t.desc });
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

export function CentreAerePage({ locale }: { locale: Locale }) {
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
        image="/photos-hd/centre-aere/2023-12-02/07.webp"
        imageAlt={t.heroAlt}
        objectPosition="50% 30%"
        still
      />

      <section aria-labelledby="centre-qui">
        <div className={`${wrap} dk:grid dk:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] dk:items-start dk:gap-14`}>
          <Head eyebrow={t.whoEyebrow} pre={t.whoTitlePre} word={t.whoTitleWord} id="centre-qui" />
          <Reveal delay={80} className="flex flex-col gap-4 rounded-card bg-copper-tint p-[clamp(24px,3vw,36px)]">
            {t.who.map((p) => (
              <p key={p.slice(0, 24)} className="m-0 max-w-measure text-pretty text-[17px] leading-[1.7] text-ink-body">{p}</p>
            ))}
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="centre-programme" className="bg-sand">
        <div className={wrap}>
          <Head eyebrow={t.daysEyebrow} pre={t.daysTitlePre} word={t.daysTitleWord} id="centre-programme" />
          <ul className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-5 p-0">
            {t.days.map((d, i) => {
              const Icon = d.icon;
              return (
                <li key={d.t}>
                  <Reveal delay={i * 80} className="flex h-full flex-col gap-3 ol-spot rounded-card bg-cream p-6">
                    <span className="ol-beam" aria-hidden />
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

      <section aria-labelledby="centre-photos">
        <div className={wrap}>
          <Head eyebrow={t.galleryEyebrow} pre={t.galleryTitlePre} word={t.galleryTitleWord} id="centre-photos" />
          <p className="-mt-3 m-0 max-w-measure text-pretty text-[16px] leading-[1.6] text-ink-body">{t.galleryText}</p>
          <PhotoArchive months={CENTRE_MONTHS} locale={locale} altPrefix={t.altPrefix} />
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
