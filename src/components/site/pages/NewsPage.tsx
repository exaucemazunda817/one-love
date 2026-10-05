import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { InnerHero } from '@/components/site/InnerHero';
import { NewsInteractive, type NewsText } from '@/components/site/pages/NewsInteractive';
import { FacebookBand } from '@/components/site/FacebookBand';
import { localeHref, type Locale } from '@/lib/i18n';
import { NEWS, NEWS_TAGS, formatNewsDate, type NewsTag } from '@/lib/news';

const text: Record<Locale, NewsText & { title: string; desc: string; eyebrow: string; titlePre: string; titleWord: string; intro: string; heroAlt: string }> = {
  fr: {
    title: 'Nouvelles du terrain : actualités et galerie',
    desc: 'Les nouvelles de One Love à Kinshasa : vie du centre, rentrées, fêtes, dîners caritatifs, avancée du One Love Village et projet RÊVES 2.',
    eyebrow: 'Actualités et galerie',
    titlePre: 'Nouvelles du ',
    titleWord: 'terrain',
    intro: 'Ce qui se passe et ce qui vient de se passer à One Love, raconté par notre équipe.',
    heroAlt: 'Un groupe d’enfants du centre aéré, souriants.',
    categoriesLabel: 'Catégories',
    listTitle: 'Dernières nouvelles',
    readLabel: 'Lire l’article',
    categories: [],
    posts: [],
    galleryTitle: 'Galerie',
    galleryIntro: "Des moments de vie au centre. Touchez une photo pour l’agrandir.",
    galleryEmpty: 'Aucune photo publiable pour le moment.',
    lightboxClose: 'Fermer',
    lightboxOpenPrefix: 'Agrandir :'
  },
  en: {
    title: 'News from the field: updates and gallery',
    desc: 'News from One Love in Kinshasa: life at the centre, back to school, celebrations, charity dinners, the One Love Village and the RÊVES 2 project.',
    eyebrow: 'News and gallery',
    titlePre: 'News from the ',
    titleWord: 'field',
    intro: 'What is happening, and what has just happened, at One Love, told by our team.',
    heroAlt: 'A group of smiling children from the day centre.',
    categoriesLabel: 'Categories',
    listTitle: 'Latest news',
    readLabel: 'Read the article',
    categories: [],
    posts: [],
    galleryTitle: 'Gallery',
    galleryIntro: 'Moments of life at the centre. Tap a photo to enlarge it.',
    galleryEmpty: 'No publishable photo at the moment.',
    lightboxClose: 'Close',
    lightboxOpenPrefix: 'Enlarge:'
  }
};

export function newsMetadata(locale: Locale): Metadata {
  const t = text[locale];
  return pageMetadata({ locale, path: '/galerie', title: t.title, description: t.desc });
}

export function NewsPage({ locale }: { locale: Locale }) {
  const base = text[locale];
  // Articles et catégories viennent de src/lib/news.ts, du plus récent au plus ancien.
  const sorted = [...NEWS].sort((a, b) => b.date.localeCompare(a.date));
  const tags = (Object.keys(NEWS_TAGS) as NewsTag[]).filter((k) => sorted.some((n) => n.tag === k));
  const t: typeof base = {
    ...base,
    categories: [locale === 'fr' ? 'Tout' : 'All', ...tags.map((k) => NEWS_TAGS[k][locale])],
    posts: sorted.map((n) => ({
      tag: NEWS_TAGS[n.tag][locale],
      date: formatNewsDate(n.date, locale),
      t: n.title[locale],
      url: localeHref(`/galerie/${n.slug}`, locale),
      d: n.lead[locale],
      img: n.img,
      alt: n.alt[locale]
    }))
  };

  return (
    <>
      <InnerHero
        locale={locale}
        eyebrow={t.eyebrow}
        titlePre={t.titlePre}
        titleWord={t.titleWord}
        intro={t.intro}
        image="/centre-aere/2023-12-02/05.webp"
        imageAlt={t.heroAlt}
      />

      <NewsInteractive t={t} />

      <div className="pt-[clamp(40px,6vw,72px)]">
        <FacebookBand locale={locale} />
      </div>
    </>
  );
}
