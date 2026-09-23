import type { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Le logiciel de gestion contient des données de personnes : il ne doit
      // jamais être exploré ni indexé.
      disallow: ['/gestion', '/api/', '/mentions-legales', '/confidentialite']
    },
    sitemap: `${siteUrl}/sitemap.xml`
  };
}
