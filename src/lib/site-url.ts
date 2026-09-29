// Adresse publique du site, utilisée pour les retours de paiement Stripe.
//
// Avant le 29/09/2026 : `process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'`.
// Une variable créée vide sur Vercel (piège déjà vécu sur d'autres projets)
// aurait renvoyé les donateurs vers localhost après paiement. En production,
// une adresse absente ou invalide est maintenant une erreur explicite.
export function getSiteUrl(): string {
  const value = (process.env.NEXT_PUBLIC_SITE_URL || '').trim();
  if (/^https?:\/\/[^\s/]+/.test(value)) return value.replace(/\/+$/, '');
  if (process.env.VERCEL_ENV === 'production') {
    throw new Error('NEXT_PUBLIC_SITE_URL est absente ou invalide en production.');
  }
  return 'http://localhost:3000';
}
