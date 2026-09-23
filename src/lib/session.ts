// Session du logiciel de gestion (/gestion).
//
// Signature HMAC-SHA256 en Web Crypto, donc lisible depuis proxy.ts en edge
// runtime — contrairement à un accès base de données ou à bcrypt.
//
// ÉTAT ACTUEL (jalon 2) : un seul mot de passe partagé, le temps que les
// formulaires publics aient un endroit où être relus. C'est suffisant pour
// consulter des messages, ce ne le sera PAS pour la comptabilité.
//
// AU JALON 5, la charge utile devient { userId, role, tokenVersion, exp } et
// les comptes deviennent nominatifs — une écriture comptable doit pouvoir être
// rattachée à la personne qui l'a saisie. Le mécanisme de signature, lui, ne
// change pas : seul le contenu du jeton évolue.

export const SESSION_COOKIE_NAME = 'ol_gestion_session';

// 8 heures, et non 7 jours : c'est un outil de gestion, pas un site de lecture.
const SESSION_DURATION_MS = 1000 * 60 * 60 * 8;

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET manquant dans les variables d'environnement.");
  }
  return secret;
}

export function gestionPassword(): string | undefined {
  return process.env.GESTION_PASSWORD;
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

export async function createSessionToken(): Promise<string> {
  const payload = JSON.stringify({ role: 'GESTION', exp: Date.now() + SESSION_DURATION_MS });
  const payloadBytes = new TextEncoder().encode(payload);
  const key = await hmacKey();
  const signature = new Uint8Array(await crypto.subtle.sign('HMAC', key, payloadBytes));
  return `${toBase64Url(payloadBytes)}.${toBase64Url(signature)}`;
}

export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const [payloadPart, signaturePart] = token.split('.');
  if (!payloadPart || !signaturePart) return false;

  try {
    const payloadBytes = fromBase64Url(payloadPart);
    const signatureBytes = fromBase64Url(signaturePart);
    const key = await hmacKey();
    const valid = await crypto.subtle.verify('HMAC', key, signatureBytes, payloadBytes);
    if (!valid) return false;

    const payload = JSON.parse(new TextDecoder().decode(payloadBytes)) as {
      role: string;
      exp: number;
    };
    if (payload.exp <= Date.now()) return false;
    return payload.role === 'GESTION';
  } catch {
    return false;
  }
}

export const SESSION_MAX_AGE_SECONDS = SESSION_DURATION_MS / 1000;
