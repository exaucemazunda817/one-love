// Lien vers le formulaire de don HelloAsso de l'association (https://www.helloasso.com/
// associations/<nom>/formulaires/<n>). Lu au build (NEXT_PUBLIC_) : après l'avoir
// renseigné sur Vercel (type Configuration, jamais Sensible), un redéploiement suffit
// pour que la carte apparaisse sur /dons. Tant que l'adresse est absente ou n'est
// pas une adresse HelloAsso en https, rien ne s'affiche.
export function helloAssoUrl(): string | null {
  const raw = process.env.NEXT_PUBLIC_HELLOASSO_URL?.trim();
  if (!raw) return null;
  try {
    const url = new URL(raw);
    const hostOk = url.hostname === 'www.helloasso.com' || url.hostname === 'helloasso.com';
    if (url.protocol !== 'https:' || !hostOk || !url.pathname.startsWith('/associations/')) return null;
    return url.toString();
  } catch {
    return null;
  }
}
