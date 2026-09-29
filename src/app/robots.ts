import type { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Le logiciel de gestion contient des données de personnes : il ne doit
      // jamais être exploré ni indexé.
      // Les pages légales ne sont plus bloquées ici : elles portent déjà
      // `noindex`, et Google ne peut lire un noindex que sur une page qu'il a
      // le droit de visiter.
      disallow: ['/gestion', '/api/']
    },
    sitemap: `${siteUrl}/sitemap.xml`
  };
}
