// Formulaire de don HelloAsso de l'association, déjà utilisé par l'ancien site
// WordPress (page « Faire un don », iframe du formulaire 6). Vérifié ouvert le
// 28/10/2026, dons ponctuels et mensuels, carte bancaire et prélèvement SEPA.
// NEXT_PUBLIC_HELLOASSO_URL peut le remplacer (lu au build, type Configuration
// sur Vercel). Une adresse qui n'est pas un formulaire HelloAsso en https est
// refusée.
//
// Le formulaire est intégré dans la page /dons (iframe), décision de Mazunda du
// 28/10/2026 : le donateur ne quitte jamais le site. Carte et prélèvement passent
// tous par HelloAsso ; Stripe est mis de côté (le code serveur reste en place).
const DEFAULT_URL = 'https://www.helloasso.com/associations/association-one-love/formulaires/6';

/** Seule origine dont on accepte les messages de l'iframe (et à qui on écrit). */
export const HELLOASSO_ORIGIN = 'https://www.helloasso.com';

export function helloAssoUrl(): string | null {
  const raw = (process.env.NEXT_PUBLIC_HELLOASSO_URL || DEFAULT_URL).trim();
  try {
    const url = new URL(raw);
    const hostOk = url.hostname === 'www.helloasso.com' || url.hostname === 'helloasso.com';
    if (url.protocol !== 'https:' || !hostOk || !url.pathname.startsWith('/associations/')) return null;
    return url.toString();
  } catch {
    return null;
  }
}

/** Adresse du formulaire en mode « widget », prévu pour être intégré en iframe. */
export function helloAssoWidgetUrl(): string | null {
  const url = helloAssoUrl();
  if (!url) return null;
  const u = new URL(url);
  u.pathname = u.pathname.replace(/\/+$/, '').replace(/\/widget$/, '') + '/widget';
  return u.toString();
}
