// Vérification côté serveur du captcha Cloudflare Turnstile.
//
// Sans TURNSTILE_SECRET_KEY, la vérification est désactivée : le site continue
// de fonctionner (seul le champ piège protège alors le formulaire). La clé
// secrète ne quitte jamais le serveur ; seule la clé publique
// (NEXT_PUBLIC_TURNSTILE_SITE_KEY) est envoyée au navigateur.
const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const VERIFY_TIMEOUT_MS = 5000;

export function isTurnstileEnabled(): boolean {
  return Boolean(process.env.TURNSTILE_SECRET_KEY);
}

/**
 * Renvoie true si le jeton est valide (ou si le captcha n'est pas configuré).
 *
 * Si Cloudflare lui-même est injoignable, on laisse passer : comme pour la
 * limitation de débit, un frein anti-abus ne doit pas empêcher un vrai visiteur
 * d'écrire à l'association le jour d'une panne chez un tiers. Un jeton absent
 * ou refusé par Cloudflare, lui, est toujours rejeté.
 */
export async function verifyTurnstile(token: string | undefined, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;

  try {
    const form = new URLSearchParams({ secret, response: token });
    if (ip && ip !== 'inconnue') form.set('remoteip', ip);
    const response = await fetch(VERIFY_URL, {
      method: 'POST',
      body: form,
      signal: AbortSignal.timeout(VERIFY_TIMEOUT_MS)
    });
    if (!response.ok) {
      console.error(`Turnstile indisponible (HTTP ${response.status}) : envoi accepté sans vérification`);
      return true;
    }
    const result = (await response.json()) as { success?: boolean };
    return result.success === true;
  } catch (error) {
    console.error('Turnstile injoignable : envoi accepté sans vérification', error instanceof Error ? error.name : error);
    return true;
  }
}
