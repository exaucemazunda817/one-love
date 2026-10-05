import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeftIcon, HeartIcon, InstagramLogoIcon } from '@phosphor-icons/react/ssr';
import { pageMetadata } from '@/lib/seo';
import { Reveal } from '@/components/Reveal';
import { InnerHero } from '@/components/site/InnerHero';
import { CallBanner } from '@/components/site/ui';
import { localeHref, type Locale } from '@/lib/i18n';
import { NEWS, NEWS_TAGS, formatNewsDate, type NewsArticle } from '@/lib/news';

const text = {
  fr: {
    back: 'Toutes les actualités',
    source: 'Voir la publication d’origine sur Instagram',
    more: 'À lire aussi',
    bannerTitle: 'Ces moments existent grâce à vous.',
    bannerText: 'Un don ou un parrainage permet à One Love de continuer.',
    donate: 'Faire un don',
    sponsor: 'Parrainer un enfant'
  },
  en: {
    back: 'All news',
    source: 'See the original post on Instagram',
    more: 'Read also',
    bannerTitle: 'These moments happen thanks to you.',
    bannerText: 'A gift or a sponsorship keeps One Love going.',
    donate: 'Donate',
    sponsor: 'Sponsor a child'
  }
};

export function newsArticleMetadata(a: NewsArticle, locale: Locale): Metadata {
  return pageMetadata({ locale, path: `/galerie/${a.slug}`, title: a.title[locale], description: a.lead[locale] });
}

export function NewsArticlePage({ article: a, locale }: { article: NewsArticle; locale: Locale }) {
  const t = text[locale];
  const href = (p: string) => localeHref(p, locale);
  const others = [...NEWS]
    .filter((n) => n.slug !== a.slug)
    .sort((x, y) => (x.tag === a.tag ? -1 : 0) - (y.tag === a.tag ? -1 : 0) || y.date.localeCompare(x.date))
    .slice(0, 3);

  return (
    <>
      <InnerHero
        locale={locale}
        eyebrow={`${NEWS_TAGS[a.tag][locale]} · ${formatNewsDate(a.date, locale)}`}
        titlePre={a.title[locale]}
        image={a.img}
        imageAlt={a.alt[locale]}
        still
      />

      <article className="mx-auto flex max-w-[760px] flex-col gap-5 px-[clamp(20px,4vw,32px)] py-[clamp(48px,7vw,88px)]">
        <Reveal>
          <p className="m-0 text-pretty font-serif text-[clamp(21px,2.2vw,25px)] leading-[1.5] text-ink">{a.lead[locale]}</p>
        </Reveal>
        {a.body[locale].map((para, i) => (
          <Reveal key={para.slice(0, 24)} delay={80 + i * 60}>
            <p className="m-0 text-pretty text-[17px] leading-[1.75] text-ink-body">{para}</p>
          </Reveal>
        ))}
        <Reveal delay={200} className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-3">
          <a href={a.source} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 text-[15px] font-bold text-copper-700 no-underline">
            <InstagramLogoIcon size="1.2em" aria-hidden />
            {t.source}
          </a>
          <Link href={href('/galerie')} className="inline-flex min-h-11 items-center gap-1.5 text-[15px] font-bold no-underline">
            <ArrowLeftIcon aria-hidden />
            {t.back}
          </Link>
        </Reveal>
      </article>

      <section className="bg-sand">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-6 px-[clamp(20px,4vw,32px)] py-[clamp(48px,7vw,88px)]">
          <h2 className="m-0 font-serif text-[clamp(26px,3vw,34px)] font-medium">{t.more}</h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-5">
            {others.map((n, i) => (
              <Reveal key={n.slug} delay={i * 80} className="h-full">
                <Link href={href(`/galerie/${n.slug}`)} className="ol-news-card ol-spot flex h-full flex-col overflow-hidden rounded-card bg-white text-ink no-underline shadow-ol-sm hover:text-ink">
                  <div className="relative aspect-[4/3] overflow-hidden bg-night">
                    <Image src={n.img} alt={n.alt[locale]} fill sizes="(max-width: 1200px) 50vw, 380px" loading="lazy" className="photo-tone object-cover" />
                  </div>
                  <div className="flex flex-col gap-2 p-5">
                    <span className="text-[13px] font-extrabold uppercase tracking-[0.08em] text-copper-700">
                      {NEWS_TAGS[n.tag][locale]} <span className="text-ink-soft">· {formatNewsDate(n.date, locale)}</span>
                    </span>
                    <h3 className="m-0 font-serif text-[20px] font-semibold leading-[1.25]">{n.title[locale]}</h3>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
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
