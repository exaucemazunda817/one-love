import crypto from 'node:crypto';

// Intégration Stripe par appel REST direct (Basic Auth avec la clé secrète),
// sans le SDK officiel — même choix que src/lib/email.ts pour Resend : moins
// de dépendances, pas de surprise de version au déploiement.
//
// Couvre la carte et le prélèvement SEPA. Le virement bancaire manuel déjà en
// place (IBAN publié sur /dons) reste le canal virement : Stripe propose bien
// un moyen « virement » (customer_balance, avec instructions de virement
// générées par Stripe), mais il ajoute un délai de règlement et une
// complexité de webhook supplémentaire (payment_intent.processing) qu'on ne
// construit pas tant que le compte Stripe réel n'est pas ouvert. À reconsidérer
// une fois le compte actif, si Mazunda préfère centraliser les trois moyens
// chez Stripe plutôt que garder le virement manuel séparé.

const STRIPE_API_BASE = 'https://api.stripe.com/v1';

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export function isStripeWebhookConfigured(): boolean {
  return Boolean(process.env.STRIPE_WEBHOOK_SECRET);
}

/** Aplatit un objet en paires clé/valeur "notation à crochets", le format
 * attendu par l'API Stripe pour les corps de requête (jamais du JSON). */
function toFormEntries(value: unknown, prefix: string, out: [string, string][]): void {
  if (value === undefined || value === null || value === '') return;
  if (Array.isArray(value)) {
    value.forEach((item, index) => toFormEntries(item, `${prefix}[${index}]`, out));
    return;
  }
  if (typeof value === 'object') {
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      toFormEntries(val, prefix ? `${prefix}[${key}]` : key, out);
    }
    return;
  }
  out.push([prefix, String(value)]);
}

async function stripeRequest<T>(path: string, body: Record<string, unknown>): Promise<T> {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) throw new Error('STRIPE_SECRET_KEY manquant.');

  const entries: [string, string][] = [];
  toFormEntries(body, '', entries);
  const form = new URLSearchParams(entries);

  const response = await fetch(`${STRIPE_API_BASE}${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${secretKey}:`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: form.toString()
  });

  const data = await response.json();
  if (!response.ok) {
    const message = data?.error?.message || `Erreur Stripe (${response.status})`;
    throw new Error(message);
  }
  return data as T;
}

export interface StripeCheckoutSession {
  id: string;
  url: string | null;
}

/**
 * Crée une session Stripe Checkout pour un don unique. `amountEurCents` est
 * déjà converti en centimes (Stripe attend la plus petite unité monétaire) —
 * la conversion se fait à l'appel, pas ici, pour que ce module reste ignorant
 * du type Decimal de Prisma.
 */
export async function createDonationCheckoutSession({
  amountEurCents,
  donationId,
  description,
  donorEmail,
  successUrl,
  cancelUrl
}: {
  amountEurCents: number;
  donationId: string;
  description: string;
  donorEmail?: string | null;
  successUrl: string;
  cancelUrl: string;
}): Promise<StripeCheckoutSession> {
  return stripeRequest<StripeCheckoutSession>('/checkout/sessions', {
    mode: 'payment',
    payment_method_types: ['card', 'sepa_debit'],
    line_items: [
      {
        price_data: {
          currency: 'eur',
          unit_amount: amountEurCents,
          product_data: { name: description }
        },
        quantity: 1
      }
    ],
    customer_email: donorEmail || undefined,
    metadata: { donationId },
    // Stripe remplace ce littéral par l'identifiant réel de la session.
    success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: cancelUrl
  });
}

export interface StripeCheckoutSessionObject {
  id: string;
  payment_intent: string | null;
  payment_status: string;
  metadata: Record<string, string>;
}

/**
 * Événement webhook minimal : on ne type que ce qu'on lit réellement.
 * Le reste de la charge utile Stripe est ignoré plutôt que modélisé en entier.
 */
export interface StripeWebhookEvent {
  id: string;
  type: string;
  data: { object: StripeCheckoutSessionObject };
}

/**
 * Vérifie la signature d'un webhook Stripe (schéma documenté et stable
 * depuis des années : en-tête `t=...,v1=...`, HMAC-SHA256 du texte
 * `timestamp.corps_brut` avec le secret de webhook). Le corps DOIT être lu en
 * texte brut avant tout `JSON.parse` — une route App Router y a accès via
 * `request.text()`, sans configuration particulière (contrairement aux
 * anciennes Pages Router qui exigeaient `bodyParser: false`).
 *
 * Tolérance de 5 minutes sur l'horodatage : au-delà, on refuse même avec une
 * signature valide, pour empêcher qu'une requête interceptée soit rejouée.
 */
export function verifyStripeWebhookSignature(
  rawBody: string,
  signatureHeader: string | null,
  secret: string,
  toleranceSeconds = 300
): boolean {
  if (!signatureHeader) return false;

  const parts = Object.fromEntries(
    signatureHeader.split(',').map((part) => {
      const [key, value] = part.split('=');
      return [key, value];
    })
  );
  const timestamp = parts.t;
  const signature = parts.v1;
  if (!timestamp || !signature) return false;

  const age = Math.abs(Date.now() / 1000 - Number(timestamp));
  if (!Number.isFinite(age) || age > toleranceSeconds) return false;

  const expected = crypto
    .createHmac('sha256', secret)
    .update(`${timestamp}.${rawBody}`)
    .digest('hex');

  const expectedBuf = Buffer.from(expected, 'hex');
  const actualBuf = Buffer.from(signature, 'hex');
  if (expectedBuf.length !== actualBuf.length) return false;
  return crypto.timingSafeEqual(expectedBuf, actualBuf);
}
