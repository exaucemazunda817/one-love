import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

// Limitation de débit par adresse IP, stockée en base : sur Vercel chaque
// requête peut tomber sur une instance différente, un compteur en mémoire ne
// limiterait rien.
//
// Vercel remplace l'en-tête x-forwarded-for par l'IP réelle du visiteur : la
// première valeur ne peut donc pas être falsifiée par le client.
export function clientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  return forwarded?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'inconnue';
}

const CLEANUP_AFTER_MS = 24 * 60 * 60 * 1000;

/**
 * Renvoie true si la requête peut passer, false si la limite est atteinte.
 *
 * En cas de panne de la base (Neon endormie, table absente), on laisse passer
 * par défaut : un frein anti-abus ne doit jamais mettre tout le site hors
 * service. Ce choix ne convient PAS pour la connexion au logiciel de
 * gestion — `failClosed: true` y refuse la requête à la place, pour ne
 * jamais perdre le frein anti-brute-force sur ce seul point d'entrée qui en
 * a le plus besoin, même si la table de limitation spécifiquement devient
 * indisponible alors que le reste de la base répond encore (audit du
 * 27/09/2026 : jusqu'ici le commentaire promettait ce comportement sans que
 * le code le fasse).
 */
export async function allowRequest(
  bucket: string,
  request: NextRequest,
  max: number,
  windowMs: number,
  options?: { failClosed?: boolean }
): Promise<boolean> {
  const key = `${bucket}:${clientIp(request)}`;
  try {
    const recent = await prisma.rateLimitAttempt.count({
      where: { key, createdAt: { gte: new Date(Date.now() - windowMs) } }
    });
    if (recent >= max) return false;
    await prisma.rateLimitAttempt.create({ data: { key } });
    if (Math.random() < 0.02) {
      await prisma.rateLimitAttempt.deleteMany({
        where: { createdAt: { lt: new Date(Date.now() - CLEANUP_AFTER_MS) } }
      });
    }
    return true;
  } catch (error) {
    console.error('Limitation de débit indisponible', error);
    return !options?.failClosed;
  }
}

export const TOO_MANY_REQUESTS_MESSAGE =
  'Trop de tentatives. Merci de réessayer dans quelques minutes.';
