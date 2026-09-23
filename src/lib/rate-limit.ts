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
 * En cas de panne de la base (Neon endormie, table absente), on laisse passer :
 * un frein anti-abus ne doit jamais mettre tout le site hors service. Ce choix
 * est délibéré — il ne convient PAS pour la connexion au logiciel de gestion,
 * où l'on préférera refuser (voir le jalon 5).
 */
export async function allowRequest(
  bucket: string,
  request: NextRequest,
  max: number,
  windowMs: number
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
    console.error('Limitation de débit indisponible, requête autorisée', error);
    return true;
  }
}

export const TOO_MANY_REQUESTS_MESSAGE =
  'Trop de tentatives. Merci de réessayer dans quelques minutes.';
