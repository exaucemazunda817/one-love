import type { Locale } from '@/lib/i18n';
import { SYMBOL, type Currency } from '@/lib/money';

// Logique d'affichage partagée par les modules de don (page Faire un don,
// parrainage). Depuis le 07/10/2026, le paiement se fait dans la devise
// choisie par le visiteur (euro, dollar ou franc congolais), sans
// reconversion : voir src/lib/money.ts.
export type { Currency } from '@/lib/money';
export { SYMBOL, RATE } from '@/lib/money';
const NUM_LOCALE: Record<Locale, string> = { fr: 'fr-FR', en: 'en-GB' };

// Touches de la rangée du haut d'un clavier AZERTY tapées sans Maj (Mac et
// Windows) : & é " ' ( § - è ! _ ç à. Sur un champ de type « number », le
// navigateur les rejetait en silence et rien ne s'affichait (signalé par
// Mazunda le 26/09/2026). On les convertit en chiffres.
const AZERTY_DIGITS: Record<string, string> = {
  '&': '1', 'é': '2', '"': '3', "'": '4', '(': '5',
  '§': '6', '-': '6', 'è': '7', '!': '8', '_': '8', 'ç': '9', 'à': '0'
};

/**
 * Nettoie la saisie d'un montant libre : chiffres uniquement (touches AZERTY
 * converties), un seul séparateur décimal (virgule ou point) et deux
 * décimales au plus.
 */
export function sanitizeAmount(raw: string): string {
  let out = '';
  let sep = false;
  for (const ch of raw) {
    const c = AZERTY_DIGITS[ch] ?? ch;
    if (c >= '0' && c <= '9') {
      const decimals = sep ? out.length - Math.max(out.indexOf(','), out.indexOf('.')) - 1 : 0;
      if (!sep || decimals < 2) out += c;
    } else if ((c === ',' || c === '.') && !sep && out.length > 0) {
      out += c;
      sep = true;
    }
  }
  return out.slice(0, 9);
}

/** Montant saisi dans la devise choisie, tel qu'affiché. */
export function formatCustom(value: number, currency: Currency, locale: Locale): string {
  return `${value.toLocaleString(NUM_LOCALE[locale])} ${SYMBOL[currency]}`;
}

/** Lance le paiement via la session Stripe Checkout existante. Renvoie un
 * message d'erreur, ou redirige (et ne revient pas). */
export async function startStripeCheckout(params: {
  /** Montant dans la devise choisie : c'est exactement ce qui est prélevé. */
  amount: number;
  currency: Currency;
  frequency: 'once' | 'monthly';
  projectSlug?: string;
  donorEmail?: string;
  donorFirstName?: string;
  donorLastName?: string;
  donorCountry?: string;
  locale: Locale;
}): Promise<string> {
  const fallback =
    params.locale === 'fr'
      ? 'Une erreur est survenue. Merci de réessayer.'
      : 'Something went wrong. Please try again.';
  try {
    const response = await fetch('/api/dons/stripe/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: params.amount,
        currency: params.currency,
        frequency: params.frequency,
        projectSlug: params.projectSlug || undefined,
        donorEmail: params.donorEmail || undefined,
        donorFirstName: params.donorFirstName || undefined,
        donorLastName: params.donorLastName || undefined,
        donorCountry: params.donorCountry || undefined
      })
    });
    if (response.status === 201) {
      const data = await response.json();
      // Page de paiement hébergée par Stripe. La confirmation du don ne
      // vient JAMAIS de cette redirection, seulement du webhook vérifié.
      window.location.href = data.url;
      return '';
    }
    if (response.status === 503) {
      return params.locale === 'fr'
        ? "Le paiement en ligne n'est pas encore activé. Merci d'utiliser le virement bancaire (page Faire un don)."
        : 'Online payment is not switched on yet. Please use a bank transfer (Donate page).';
    }
    const data = await response.json().catch(() => ({}));
    return data.error || fallback;
  } catch {
    return fallback;
  }
}
