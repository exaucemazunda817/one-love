import type { NextConfig } from "next";

// Content-Security-Policy, ajoutée le 27/09/2026 (audit SEO/sécurité) —
// repoussée jusqu'ici en attendant que Stripe Checkout soit branché (jalon
// 4, fait depuis). Aucune exception stripe.com n'est nécessaire : le
// paiement est une redirection de page complète vers checkout.stripe.com
// (`window.location.href`, voir DonationFlow.tsx), jamais un formulaire ou
// un iframe Stripe Elements intégré à nos pages — une CSP ne régit pas une
// navigation complète vers un autre site. `unsafe-inline` reste nécessaire
// pour les scripts d'hydratation de Next.js et nos deux scripts inline
// (classe `js`, JSON-LD) ; passer par des nonces serait plus strict mais
// demande de faire transiter un nonce dans chaque layout, pour un gain
// marginal ici.
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self'",
  // Lecteur vidéo « Notre histoire » (youtube-nocookie, chargé au clic
  // seulement — voir YouTubeLite.tsx).
  "frame-src https://www.youtube-nocookie.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  'upgrade-insecure-requests'
].join('; ');

// La construction de production échoue tant que l'adresse publique manque :
// sans elle, l'aperçu WhatsApp, le sitemap et les retours de paiement pointent
// vers localhost (variable créée vide sur Vercel, piège déjà rencontré).
if (process.env.VERCEL_ENV === 'production' && !/^https?:\/\//.test((process.env.NEXT_PUBLIC_SITE_URL || '').trim())) {
  throw new Error('NEXT_PUBLIC_SITE_URL est absente ou invalide : construction de production refusée.');
}

const nextConfig: NextConfig = {
  // En-têtes de sécurité envoyés sur toutes les pages.
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
          { key: 'Content-Security-Policy', value: CSP }
        ]
      },
      {
        // Le logiciel de gestion ne doit jamais être indexé ni apparaître dans
        // un moteur de recherche : il contient des données de personnes.
        source: '/gestion/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' }]
      }
    ];
  },
  // Anciennes adresses du site WordPress de l'association : elles n'ont d'effet
  // qu'une fois associationonelove.org branché sur ce site, mais ne coûtent
  // rien d'ici là. « /voyage-humanitaire » n'a pas d'équivalent : renvoyé vers
  // « S'impliquer » en attendant une décision de l'association.
  async redirects() {
    const perm = { permanent: true } as const;
    return [
      { source: '/un-peu-de-nous', destination: '/association', ...perm },
      { source: '/un-peu-de-nous/:slug*', destination: '/association', ...perm },
      { source: '/parrainage', destination: '/parrainer', ...perm },
      { source: '/ca-bouge', destination: '/galerie', ...perm },
      { source: '/infos-dons', destination: '/dons', ...perm },
      { source: '/voyage-humanitaire', destination: '/s-impliquer', ...perm },
      { source: '/actions/:slug+', destination: '/actions', ...perm },
      { source: '/en/un-peu-de-nous', destination: '/en/association', ...perm },
      { source: '/en/un-peu-de-nous/:slug*', destination: '/en/association', ...perm },
      { source: '/en/parrainage', destination: '/en/parrainer', ...perm },
      { source: '/en/ca-bouge', destination: '/en/galerie', ...perm },
      { source: '/en/infos-dons', destination: '/en/dons', ...perm },
      { source: '/en/voyage-humanitaire', destination: '/en/s-impliquer', ...perm },
      { source: '/en/actions/:slug+', destination: '/en/actions', ...perm }
    ];
  },
  images: {
    // Qualité 85 pour les photos de bandeau (nettes sur écran à 3 pixels par point).
    qualities: [75, 85],
    // Plafonné à 1920 px : le réglage par défaut monte à 3840 px et fabrique à
    // la demande des images géantes pour des cadres de 320 px (1,3 à 2,4 s
    // chacune, mesuré sur gospel-nation).
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    // Versions réduites gardées 31 jours par Vercel (au lieu de quelques
    // heures) : avec peu de visites, beaucoup de visiteurs tombaient sur une
    // photo « pas encore prête », fabriquée à la demande (1 à 2 s, jusqu'à
    // 10 s mesurées le 07/10/2026). Sans risque ici : une photo modifiée
    // change toujours de nom de fichier.
    minimumCacheTTL: 2678400
  }
};

export default nextConfig;
