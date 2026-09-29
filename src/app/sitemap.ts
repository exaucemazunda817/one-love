import type { MetadataRoute } from 'next';

// `||` et non `??` : sur Vercel une variable peut exister avec une valeur vide.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

const paths = [
  '',
  '/association',
  '/histoire',
  '/actions',
  '/projets/reves-2',
  '/projets/village',
  '/parrainer',
  '/s-impliquer',
  '/transparence',
  '/galerie',
  '/dons',
  '/contact'
];

export default function sitemap(): MetadataRoute.Sitemap {
  return paths.flatMap((path) => {
    const fr = `${siteUrl}${path}`;
    const en = path === '' ? `${siteUrl}/en` : `${siteUrl}/en${path}`;
    // Pas de lastmod : la date de construction serait la même pour toutes les pages, Google l'ignore quand elle n'est pas fiable.
    const base = {
      changeFrequency: path === '' ? ('weekly' as const) : ('monthly' as const),
      priority: path === '' ? 1 : 0.7,
      alternates: { languages: { fr, en } }
    };
    return [
      { url: fr, ...base },
      { url: en, ...base }
    ];
  });
}
