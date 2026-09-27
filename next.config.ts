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
  images: {
    // Plafonné à 1920 px : le réglage par défaut monte à 3840 px et fabrique à
    // la demande des images géantes pour des cadres de 320 px (1,3 à 2,4 s
    // chacune, mesuré sur gospel-nation).
    deviceSizes: [640, 750, 828, 1080, 1200, 1920]
  }
};

export default nextConfig;
