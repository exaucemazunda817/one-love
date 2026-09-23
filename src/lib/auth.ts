import bcrypt from 'bcryptjs';
import { cache } from 'react';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { SESSION_COOKIE_NAME, verifySessionToken } from '@/lib/session';
import type { AppUser, UserRole } from '@prisma/client';

// bcryptjs (implémentation JavaScript pure) plutôt que bcrypt : pas de
// binaire natif à recompiler au déploiement Vercel — même choix qu'e-classe-rdc.
const BCRYPT_COST = 12;

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_COST);
}

export function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateTemporaryPassword(): string {
  // Alphabet sans caractères ambigus à l'oral/à l'écrit (0/O, 1/l/I) : ce mot
  // de passe est destiné à être relu à voix haute ou recopié à la main par la
  // direction vers un nouveau membre de l'équipe.
  const alphabet = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join('');
}

/**
 * Contrôle fin de la session /gestion : vérifie la signature du cookie PUIS
 * relit le compte en base (actif, `tokenVersion` à jour). C'est cette
 * fonction, pas le proxy, qui fait réellement foi — voir session.ts.
 * Renvoie `null` sans lever d'exception : à l'appelant de décider (redirection
 * pour une page, 401 pour une route API).
 *
 * Enveloppée dans `cache()` de React : le layout protégé ET chaque page
 * appellent cette fonction indépendamment (Next.js ne fait pas passer de
 * données du layout vers la page). Sans ce cache, chaque affichage de page
 * déclenchait DEUX requêtes Prisma identiques par visite — trouvé en
 * diagnostiquant une lenteur pendant les tests du jalon 5, aggravée par les
 * réveils de Neon. `cache()` déduplique les appels identiques au sein d'UNE
 * même requête serveur ; il n'existe pas d'un rendu à l'autre.
 */
export const getCurrentGestionUser = cache(async (): Promise<AppUser | null> => {
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  const payload = await verifySessionToken(token);
  if (!payload) return null;

  const user = await prisma.appUser.findUnique({ where: { id: payload.userId } });
  if (!user) return null;
  if (user.status !== 'ACTIVE') return null;
  if (user.tokenVersion !== payload.tokenVersion) return null;
  return user;
});

/** Garde de rôle pour une route API : renvoie l'utilisateur ou `null` si son
 * rôle ne figure pas dans `allowed`. Ne fait PAS la réponse HTTP elle-même,
 * pour laisser chaque route choisir son message d'erreur. */
export async function requireGestionRole(allowed: UserRole[]): Promise<AppUser | null> {
  const user = await getCurrentGestionUser();
  if (!user || !allowed.includes(user.role)) return null;
  return user;
}
