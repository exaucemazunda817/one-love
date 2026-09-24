import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { InnerHero } from '@/components/site/InnerHero';
import { NewsInteractive, type NewsText } from '@/components/site/pages/NewsInteractive';
import { FacebookBand } from '@/components/site/FacebookBand';
import type { Locale } from '@/lib/i18n';

const text: Record<Locale, NewsText & { title: string; desc: string; eyebrow: string; titlePre: string; titleWord: string; intro: string; heroAlt: string }> = {
  fr: {
    title: 'Actualités et galerie',
    desc: 'Nouvelles du terrain et galerie photo du programme RÊVES 2, au centre One Love à Kinshasa.',
    eyebrow: 'Actualités et galerie',
    titlePre: 'Nouvelles du ',
    titleWord: 'terrain',
    intro: 'Des photos du centre et de RÊVES 2. Nos nouvelles sont publiées sur notre page Facebook.',
    heroAlt: 'Un garçon rit et fait le signe de la paix.',
    galleryTitle: 'Galerie',
    galleryIntro: "Des moments de vie au centre. Touchez une photo pour l'agrandir.",
    galleryEmpty: 'Aucune photo publiable pour le moment.',
    lightboxClose: 'Fermer',
    lightboxOpenPrefix: 'Agrandir :'
  },
  en: {
    title: 'News and gallery',
    desc: 'News from the field and photo gallery of the RÊVES 2 programme, at the One Love centre in Kinshasa.',
    eyebrow: 'News and gallery',
    titlePre: 'News from the ',
    titleWord: 'field',
    intro: 'Photos from the centre and RÊVES 2. Our news is posted on our Facebook page.',
    heroAlt: 'A boy laughs and makes a peace sign.',
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
  const t = text[locale];

  return (
    <>
      <InnerHero
        locale={locale}
        eyebrow={t.eyebrow}
        titlePre={t.titlePre}
        titleWord={t.titleWord}
        intro={t.intro}
        image="/photos/photo-joie.jpg"
        imageAlt={t.heroAlt}
      />

      <NewsInteractive t={t} />

      <div className="pt-[clamp(40px,6vw,72px)]">
        <FacebookBand locale={locale} />
      </div>
    </>
  );
}
