import type { Metadata } from 'next';
import { localeHref, type Locale } from '@/lib/i18n';

// Métadonnées d'une page publique : titre, description ET aperçu de partage
// propres à la page, dans sa langue. Sans ça, Next ne recopie que l'aperçu
// de l'accueil (défini dans la racine) : un lien « Parrainer un enfant »
// partagé sur WhatsApp s'affichait avec le titre et le texte de l'accueil.
//
// Définir `openGraph` dans une page REMPLACE celui du parent, image comprise :
// l'image est donc toujours redonnée explicitement ici.
//
// Images d'aperçu : public/og/partage-{fr,en}.jpg (1200 × 630, ~80 Ko). JPEG
// statiques et non générées à la volée : une image générée sortait en PNG de
// ~780 Ko, au-delà de ce que WhatsApp affiche de façon fiable (~300 Ko).
const SITE_NAME = 'One Love';

export function pageMetadata({
  locale,
  path,
  title,
  description,
  absoluteTitle = false,
  noindex = false,
  frOnly = false
}: {
  locale: Locale;
  /** Chemin français de la page (« /parrainer ») : le chemin anglais s'en déduit. */
  path: string;
  title: string;
  description: string;
  /** Titre affiché tel quel, sans le suffixe « — One Love » (accueil). */
  absoluteTitle?: boolean;
  noindex?: boolean;
  /** Page sans version anglaise (mentions légales…) : pas de lien vers /en. */
  frOnly?: boolean;
}): Metadata {
  const fullTitle = absoluteTitle ? title : `${title} — ${SITE_NAME}`;
  const image = locale === 'en' ? '/og/partage-en.jpg' : '/og/partage-fr.jpg';
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical: localeHref(path, locale),
      ...(frOnly ? {} : { languages: { fr: path, en: localeHref(path, 'en'), 'x-default': path } })
    },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      locale: locale === 'en' ? 'en_GB' : 'fr_FR',
      ...(frOnly ? {} : { alternateLocale: locale === 'en' ? 'fr_FR' : 'en_GB' }),
      url: localeHref(path, locale),
      title: fullTitle,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: fullTitle }]
    },
    twitter: { card: 'summary_large_image', title: fullTitle, description, images: [image] },
    ...(noindex ? { robots: { index: false } } : {})
  };
}
