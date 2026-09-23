import type { MetadataRoute } from 'next';

// `||` et non `??` : sur Vercel une variable peut exister avec une valeur vide.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

const paths = ['', '/association', '/actions', '/projets/reves-2', '/galerie', '/dons', '/contact'];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return paths.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified,
    changeFrequency: path === '' ? 'weekly' : 'monthly',
    priority: path === '' ? 1 : 0.7
  }));
}
