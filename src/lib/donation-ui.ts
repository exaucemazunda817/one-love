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

// Mémoire du dernier paiement commencé dans ce navigateur (protection contre
// le double paiement, 17/10/2026). Si la connexion coupe après le paiement,
// avant la page de remerciement, le formulaire relit cette mémoire au retour
// et demande au site si le paiement est passé avant de laisser recommencer.
// Rangée dans le navigateur seulement, sans nom ni e-mail.
export interface StartedCheckout {
  sessionId: string;
  kind: 'don' | 'parrainage';
  amount: number;
  currency: Currency;
  startedAt: number;
}
const CHECKOUT_KEY = 'ol-paiement-en-cours';
const CHECKOUT_TTL_MS = 48 * 60 * 60 * 1000;

export function rememberCheckout(checkout: StartedCheckout): void {
  try {
    window.localStorage.setItem(CHECKOUT_KEY, JSON.stringify(checkout));
  } catch {
    // Stockage indisponible (navigation privée stricte) : le contrôle par
    // e-mail côté serveur reste actif.
  }
}

export function readCheckout(): StartedCheckout | null {
  try {
    const raw = window.localStorage.getItem(CHECKOUT_KEY);
    if (!raw) return null;
    const value = JSON.parse(raw) as Partial<StartedCheckout>;
    const valid =
      typeof value.sessionId === 'string' &&
      /^cs_(test|live)_[A-Za-z0-9]{10,200}$/.test(value.sessionId) &&
      (value.kind === 'don' || value.kind === 'parrainage') &&
      typeof value.amount === 'number' &&
      (value.currency === 'EUR' || value.currency === 'USD' || value.currency === 'CDF') &&
      typeof value.startedAt === 'number';
    if (!valid || Date.now() - (value.startedAt as number) > CHECKOUT_TTL_MS) {
      window.localStorage.removeItem(CHECKOUT_KEY);
      return null;
    }
    return value as StartedCheckout;
  } catch {
    return null;
  }
}

export function forgetCheckout(): void {
  try {
    window.localStorage.removeItem(CHECKOUT_KEY);
  } catch {
    // Rien à faire.
  }
}

export interface CheckoutResult {
  /** Message à afficher ; absent si le visiteur part vers Stripe. */
  error?: string;
  /** Un paiement identique semble déjà passé : demander confirmation. */
  alreadyPaid?: boolean;
}

/** Lance le paiement via la session Stripe Checkout existante. Renvoie une
 * erreur, ou redirige (et ne revient pas). */
export async function startStripeCheckout(params: {
  /** Montant dans la devise choisie : c'est exactement ce qui est prélevé. */
  amount: number;
  currency: Currency;
  frequency: 'once' | 'monthly';
  /** Carte bancaire ou prélèvement SEPA (euros seulement). */
  paymentMethod?: 'card' | 'sepa';
  projectSlug?: string;
  donorEmail?: string;
  donorFirstName?: string;
  donorLastName?: string;
  donorCountry?: string;
  /** Dernière session ouverte dans ce navigateur, et confirmation de payer à nouveau. */
  previousSessionId?: string;
  confirmAgain?: boolean;
  locale: Locale;
}): Promise<CheckoutResult> {
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
        paymentMethod: params.paymentMethod ?? 'card',
        projectSlug: params.projectSlug || undefined,
        donorEmail: params.donorEmail || undefined,
        donorFirstName: params.donorFirstName || undefined,
        donorLastName: params.donorLastName || undefined,
        donorCountry: params.donorCountry || undefined,
        previousSessionId: params.previousSessionId,
        confirmAgain: params.confirmAgain || undefined
      })
    });
    if (response.status === 201) {
      const data = await response.json();
      if (typeof data.sessionId === 'string') {
        rememberCheckout({
          sessionId: data.sessionId,
          kind: 'don',
          amount: params.amount,
          currency: params.currency,
          startedAt: Date.now()
        });
      }
      // Page de paiement hébergée par Stripe. La confirmation du don ne
      // vient JAMAIS de cette redirection, seulement du webhook vérifié.
      window.location.href = data.url;
      return {};
    }
    if (response.status === 503) {
      return {
        error:
          params.locale === 'fr'
            ? "Le paiement en ligne n'est pas encore activé. Merci d'utiliser le virement bancaire (page Faire un don)."
            : 'Online payment is not switched on yet. Please use a bank transfer (Donate page).'
      };
    }
    const data = await response.json().catch(() => ({}));
    if (response.status === 409 && data.code === 'ALREADY_PAID') return { alreadyPaid: true };
    return { error: data.error || fallback };
  } catch {
    return { error: fallback };
  }
}
