// Bilingue FR / EN. Le français est à la racine (routes existantes
// conservées), l'anglais sous /en avec les MÊMES chemins : /dons ↔ /en/dons.
// Ce parallélisme strict est ce qui permet au sélecteur de langue de mener
// à la même page dans l'autre langue sans table de correspondance.

export type Locale = 'fr' | 'en';

export function localeHref(path: string, locale: Locale): string {
  if (locale === 'fr') return path;
  return path === '/' ? '/en' : `/en${path}`;
}

/** Même page dans l'autre langue, à partir du chemin courant. */
export function alternateHref(pathname: string): { locale: Locale; href: string } {
  if (pathname === '/en' || pathname.startsWith('/en/')) {
    return { locale: 'en', href: pathname.slice(3) || '/' };
  }
  return { locale: 'fr', href: pathname === '/' ? '/en' : `/en${pathname}` };
}

// Pas de numéro WhatsApp tant que l'association n'a pas fourni le vrai : le
// numéro de la maquette était fictif.
export const CONTACT_EMAIL = 'contact@associationonelove.org';
export const FACEBOOK_URL = 'https://www.facebook.com/associationonelove';
// Adresses relevées sur les liens que l'association publiait sur son ancien site.
export const INSTAGRAM_URL = 'https://www.instagram.com/associationonelove/';
export const YOUTUBE_URL = 'https://www.youtube.com/channel/UCC3TmpanbTEEr5nRhdz2Bgw';
export const FACEBOOK_REELS_URL = 'https://www.facebook.com/associationonelove/reels';

export const chrome = {
  fr: {
    home: 'One Love, accueil',
    nav: [
      { label: 'Accueil', href: '/' },
      { label: 'Notre histoire', href: '/histoire' },
      { label: 'Le village', href: '/projets/village' },
      { label: 'Nos actions', href: '/actions' },
      { label: 'Actualités', href: '/galerie' },
      { label: 'Parrainer', href: '/parrainer' },
      { label: "S’impliquer", href: '/s-impliquer' },
      { label: 'À propos', href: '/association' },
      { label: 'Contact', href: '/contact' }
    ],
    donate: 'Faire un don',
    openMenu: 'Ouvrir le menu',
    closeMenu: 'Fermer le menu',
    whatsapp: 'Écrire sur WhatsApp',
    footer: {
      motto: "L’amour et la foi, notre carburant.",
      explore: 'DÉCOUVRIR',
      links: [
        { label: 'Notre histoire', href: '/histoire' },
        { label: 'Le One Love Village', href: '/projets/village' },
        { label: 'Nos actions', href: '/actions' },
        { label: 'Actualités', href: '/galerie' },
        { label: 'À propos', href: '/association' },
        { label: 'Parrainer un enfant', href: '/parrainer' },
        { label: 'Faire un don', href: '/dons' }
      ],
      reach: 'NOUS JOINDRE',
      newsletter: "LETTRE D’INFORMATION",
      newsletterText: 'Recevez nos actualités de terrain, quelques fois par an.',
      emailLabel: 'Adresse e-mail',
      subscribe: "S’inscrire",
      legalLine: '© 2026 Association One Love · association loi 1901, RNA W951001528',
      legal: [
        { label: 'Transparence', href: '/transparence' },
        { label: 'Mentions légales', href: '/mentions-legales' },
        { label: 'Confidentialité', href: '/confidentialite' },
        { label: "Protection de l’enfance", href: '/parrainer#charte' }
      ]
    }
  },
  en: {
    home: 'One Love, home',
    nav: [
      { label: 'Home', href: '/' },
      { label: 'Our story', href: '/histoire' },
      { label: 'The village', href: '/projets/village' },
      { label: 'Our work', href: '/actions' },
      { label: 'News', href: '/galerie' },
      { label: 'Sponsor', href: '/parrainer' },
      { label: 'Get involved', href: '/s-impliquer' },
      { label: 'About us', href: '/association' },
      { label: 'Contact', href: '/contact' }
    ],
    donate: 'Donate',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    whatsapp: 'Message us on WhatsApp',
    footer: {
      motto: 'Love and faith are what drive us.',
      explore: 'EXPLORE',
      links: [
        { label: 'Our story', href: '/histoire' },
        { label: 'The One Love Village', href: '/projets/village' },
        { label: 'Our work', href: '/actions' },
        { label: 'News', href: '/galerie' },
        { label: 'About us', href: '/association' },
        { label: 'Sponsor a child', href: '/parrainer' },
        { label: 'Donate', href: '/dons' }
      ],
      reach: 'CONTACT US',
      newsletter: 'NEWSLETTER',
      newsletterText: 'News from the field, a few times a year.',
      emailLabel: 'Email address',
      subscribe: 'Subscribe',
      legalLine: '© 2026 One Love · French non-profit association (loi 1901), RNA W951001528',
      // Les pages légales n'existent qu'en français : liens vers la version FR.
      legal: [
        { label: 'Transparency', href: '/transparence' },
        { label: 'Legal notice', href: '/mentions-legales', frOnly: true },
        { label: 'Privacy', href: '/confidentialite', frOnly: true },
        { label: 'Child protection', href: '/parrainer#charte' }
      ]
    }
  }
} as const;
