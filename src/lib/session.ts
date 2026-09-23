// Session du logiciel de gestion (/gestion) — comptes nominatifs.
//
// Signature HMAC-SHA256 en Web Crypto (utilisable en edge runtime, donc
// lisible depuis src/proxy.ts). Le proxy ne fait QUE le contrôle grossier :
// signature valide, jeton non expiré. Le contrôle fin — compte actif, rôle
// réel — se fait en base, dans getCurrentGestionUser() (src/lib/auth.ts), qui
// tourne en runtime Node (layout serveur, routes API) : bcrypt et Prisma ne
// fonctionnent pas en edge.
//
// Le jeton ne porte volontairement PAS le rôle : porter une donnée qui peut
// changer en base créerait la tentation de l'utiliser sans revérifier. Toute
// décision d'autorisation lit le rôle FRAIS depuis AppUser, jamais depuis le
// jeton — un changement de rôle prend donc effet à la requête suivante, sans
// rien à révoquer.
//
// tokenVersion : incrémenté au changement de mot de passe. Un cookie signé
// est par nature apatride (non révocable avant expiration) ; comparer sa
// version à celle enregistrée en base rend une session révocable
// immédiatement — utile si un cookie a pu fuiter avant la rotation du mot de
// passe. La suspension d'un compte, elle, n'a pas besoin de ce mécanisme :
// `status !== 'ACTIVE'` est déjà vérifié frais à chaque requête.

export const SESSION_COOKIE_NAME = 'ol_gestion_session';

// 8 heures : outil de gestion (comptabilité, données de bénéficiaires), pas
// un site de lecture — durée volontairement courte.
const SESSION_DURATION_MS = 1000 * 60 * 60 * 8;

export interface SessionPayload {
  userId: string;
  tokenVersion: number;
  exp: number;
}

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET manquant dans les variables d'environnement.");
  }
  return secret;
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(value: string): Uint8Array<ArrayBuffer> {
  const padded = value
    .replace(/-/g, '+')
    .replace(/_/g, '/')
    .padEnd(value.length + ((4 - (value.length % 4)) % 4), '=');
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function hmacKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(getSecret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

export async function createSessionToken(userId: string, tokenVersion: number): Promise<string> {
  const payload: SessionPayload = { userId, tokenVersion, exp: Date.now() + SESSION_DURATION_MS };
  const payloadBytes = new TextEncoder().encode(JSON.stringify(payload));
  const key = await hmacKey();
  const signature = new Uint8Array(await crypto.subtle.sign('HMAC', key, payloadBytes));
  return `${toBase64Url(payloadBytes)}.${toBase64Url(signature)}`;
}

/**
 * Contrôle grossier uniquement : signature valide et jeton non expiré. Ne dit
 * rien sur l'état réel du compte — voir getCurrentGestionUser() dans
 * src/lib/auth.ts pour le contrôle qui fait réellement foi.
 */
export async function verifySessionToken(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;
  const [payloadPart, signaturePart] = token.split('.');
  if (!payloadPart || !signaturePart) return null;

  try {
    const payloadBytes = fromBase64Url(payloadPart);
    const signatureBytes = fromBase64Url(signaturePart);
    const key = await hmacKey();
    const valid = await crypto.subtle.verify('HMAC', key, signatureBytes, payloadBytes);
    if (!valid) return null;

    const payload = JSON.parse(new TextDecoder().decode(payloadBytes)) as SessionPayload;
    if (typeof payload.userId !== 'string' || typeof payload.tokenVersion !== 'number') return null;
    if (payload.exp <= Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export const SESSION_MAX_AGE_SECONDS = SESSION_DURATION_MS / 1000;
