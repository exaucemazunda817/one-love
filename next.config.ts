import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // En-têtes de sécurité envoyés sur toutes les pages. Pas de Content-Security-
  // Policy pour l'instant : Stripe Checkout sera branché au jalon 4 et une règle
  // écrite trop tôt casserait l'intégration sans qu'on puisse la tester.
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' }
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
