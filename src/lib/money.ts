// Devises acceptées pour les paiements en ligne (décision de Mazunda du
// 07/10/2026) : le visiteur paie DANS la devise qu'il choisit, euro, dollar
// ou franc congolais. Plus aucune reconversion en euros avant paiement :
// Stripe prélève le montant exact affiché, dans cette devise.
//
// Ce module ne dépend de rien côté serveur : il est lu par les formulaires
// (navigateur) et par les routes de paiement (serveur), pour que l'affichage
// et le prélèvement ne puissent jamais diverger.

export type Currency = 'EUR' | 'USD' | 'CDF';
export const CURRENCIES: readonly Currency[] = ['EUR', 'USD', 'CDF'] as const;
export const SYMBOL: Record<Currency, string> = { EUR: '€', USD: '$', CDF: 'FC' };

/**
 * Taux INDICATIFS (« 1 EUR = taux unités de la devise », même convention que
 * fxRate dans lib/accounting.ts). Ils ne servent PLUS au paiement : seulement
 * à enregistrer une contre-valeur en euros dans la comptabilité interne
 * (Donation.amountEur, Sponsor.monthlyAmountEur). Le montant réellement
 * converti par Stripe lors du versement à l'association peut différer.
 */
export const RATE: Record<Currency, number> = { EUR: 1, USD: 1.1, CDF: 3100 };

/** Contre-valeur indicative en euros, 2 décimales. */
export function indicativeEur(amount: number, currency: Currency): number {
  return Math.round((amount / RATE[currency]) * 100) / 100;
}

/**
 * Stripe compte l'euro, le dollar et le franc congolais en centièmes
 * (devises « à deux décimales » d'après docs.stripe.com/currencies,
 * consulté le 07/10/2026) : 20 € = 2000, 62 000 FC = 6 200 000.
 */
export function toMinorUnits(amount: number): number {
  return Math.round(amount * 100);
}

export function isCurrency(value: unknown): value is Currency {
  return value === 'EUR' || value === 'USD' || value === 'CDF';
}

/** Bornes d'un montant libre, par devise. Stripe refuse tout paiement sous
 * l'équivalent de 0,50 $ : les minimums restent au-dessus. */
export const SPONSOR_LIMITS: Record<Currency, { min: number; max: number }> = {
  EUR: { min: 1, max: 5000 },
  USD: { min: 1, max: 5500 },
  CDF: { min: 3000, max: 15_500_000 }
};
export const DONATION_LIMITS: Record<Currency, { min: number; max: number }> = {
  EUR: { min: 1, max: 100_000 },
  USD: { min: 1, max: 110_000 },
  CDF: { min: 3000, max: 310_000_000 }
};

/** Montant le plus bas mis en avant pour parrainer (« dès 5 $ »). */
export const SPONSOR_FROM: Record<Currency, number> = { EUR: 5, USD: 5, CDF: 15_000 };

const NUM_LOCALE = { fr: 'fr-FR', en: 'en-GB' } as const;

/** « 62 000 FC », « 22 $ », « 20 € » selon la langue. */
export function formatMoney(amount: number, currency: Currency, locale: 'fr' | 'en'): string {
  return `${amount.toLocaleString(NUM_LOCALE[locale])} ${SYMBOL[currency]}`;
}
