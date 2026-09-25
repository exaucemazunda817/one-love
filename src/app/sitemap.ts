import type { MetadataRoute } from 'next';

// `||` et non `??` : sur Vercel une variable peut exister avec une valeur vide.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

const paths = [
  '',
  '/association',
  '/histoire',
  '/actions',
  '/projets/reves-2',
  '/parrainer',
  '/s-impliquer',
  '/transparence',
  '/galerie',
  '/dons',
  '/contact'
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return paths.flatMap((path) => {
    const fr = `${siteUrl}${path}`;
    const en = path === '' ? `${siteUrl}/en` : `${siteUrl}/en${path}`;
    const base = {
      lastModified,
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
