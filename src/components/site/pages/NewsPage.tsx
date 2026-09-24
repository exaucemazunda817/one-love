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
    intro: 'Suivez RÊVES 2 et la vie du centre, semaine après semaine.',
    heroAlt: 'Un garçon rit et fait le signe de la paix.',
    categoriesLabel: 'Catégories',
    categories: ['Tout', 'RÊVES 2', 'Éducation', 'Culture', 'Partenariat'],
    // Articles de la maquette, limités à ce qui est vérifié (visuels Facebook
    // de RÊVES 2). L'article « Premier bilan médical » (oct. 2026) a été
    // écarté : il annonçait comme passé un événement pas encore arrivé.
    posts: [
      { tag: 'RÊVES 2', date: '5 sept. 2026', t: "Premiers pas dans l'alphabétisation", d: "Samedi 5 septembre, les enfants ont ouvert leurs cahiers pour le lancement de RÊVES 2.", img: '/photos/photo-ecriture.jpg', alt: 'Une jeune fille écrit.' },
      { tag: 'Éducation', date: 'Sept. 2026', t: "Le français, langue de l'école", d: "Pourquoi l'apprentissage du français est au cœur de la deuxième phase.", img: '/photos/photo-cahier.jpg', alt: 'Un garçon écrit dans son cahier.' },
      { tag: 'Culture', date: 'Sept. 2026', t: 'Jeu, sport et création', d: 'Dessin, musique et football : réapprendre la vie en groupe.', img: '/photos/photo-dessin.jpg', alt: 'Deux garçons dessinent.' },
      { tag: 'RÊVES 2', date: 'Sept. 2026', t: 'Nos formateurs mobilisés', d: "L'équipe d'animateurs formée pour encadrer les ateliers.", img: '/photos/photo-mains.jpg', alt: 'Des mains colorient des lettres.' },
      { tag: 'Partenariat', date: '2026', t: 'Angel Foundation à nos côtés', d: 'Un partenaire engagé à nos côtés pour la deuxième phase du projet RÊVES.', img: '/photos/coeur-degrade.jpg', alt: '' }
    ],
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
    intro: 'Follow RÊVES 2 and life at the centre, week by week.',
    heroAlt: 'A boy laughs and makes a peace sign.',
    categoriesLabel: 'Categories',
    categories: ['All', 'RÊVES 2', 'Education', 'Culture', 'Partnership'],
    posts: [
      { tag: 'RÊVES 2', date: '5 Sept. 2026', t: 'First steps in literacy', d: 'On Saturday 5 September, the children opened their notebooks for the launch of RÊVES 2.', img: '/photos/photo-ecriture.jpg', alt: 'A girl writing.' },
      { tag: 'Education', date: 'Sept. 2026', t: 'French, the language of school', d: 'Why learning French is at the heart of the second phase.', img: '/photos/photo-cahier.jpg', alt: 'A boy writes in his notebook.' },
      { tag: 'Culture', date: 'Sept. 2026', t: 'Play, sport and creativity', d: 'Drawing, music and football: learning to live together again.', img: '/photos/photo-dessin.jpg', alt: 'Two boys drawing.' },
      { tag: 'RÊVES 2', date: 'Sept. 2026', t: 'Our trainers at work', d: 'The team of facilitators trained to run the workshops.', img: '/photos/photo-mains.jpg', alt: 'Hands colouring in letters.' },
      { tag: 'Partnership', date: '2026', t: 'Angel Foundation by our side', d: 'A committed partner at our side for the second phase of the RÊVES project.', img: '/photos/coeur-degrade.jpg', alt: '' }
    ],
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
