// Formulaire de don HelloAsso de l'association, déjà utilisé par l'ancien site
// WordPress (page « Faire un don », iframe du formulaire 6). Vérifié ouvert le
// 28/10/2026, dons ponctuels et mensuels. NEXT_PUBLIC_HELLOASSO_URL peut le
// remplacer (lu au build, type Configuration sur Vercel). Une adresse qui n'est
// pas un formulaire HelloAsso en https n'affiche rien.
const DEFAULT_URL = 'https://www.helloasso.com/associations/association-one-love/formulaires/6';

export function helloAssoUrl(): string | null {
  const raw = (process.env.NEXT_PUBLIC_HELLOASSO_URL || DEFAULT_URL).trim();
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
