import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE_NAME, verifySessionToken } from '@/lib/session';

// Ce fichier DOIT rester dans src/ : le projet a un dossier src, et Next ne
// charge le proxy que s'il s'y trouve. Placé à la racine, il est silencieusement
// ignoré et l'espace protégé devient accessible à tous — c'est arrivé sur
// gospel-nation.
//
// Le proxy ne fait que le contrôle grossier : le cookie est-il signé et non
// expiré ? Il ne touche jamais à la base et ne fait jamais de bcrypt, qui ne
// tournent pas en edge runtime. Le contrôle fin (compte actif, rôle réel)
// appartient à getCurrentGestionUser() (src/lib/auth.ts), appelé par le
// layout serveur de /gestion et par chaque route API sensible.
//
// Les routes API protégées sont gardées ICI aussi, pas seulement les pages :
// sur abg-rdc, une première version ne protégeait que les pages et laissait
// les routes de validation appelables sans authentification.
//
// N'intervient que sur /gestion — le matcher a brièvement été élargi à tout
// le site le 27/09/2026 pour poser un en-tête `x-locale` (lu par un layout
// racine unique via `headers()`, pour corriger `<html lang>`), le temps de
// s'apercevoir que ça rendait TOUT le site public dynamique (1 à 2,5 s par
// page en prod, confirmé par Mazunda). Remplacé le jour même par plusieurs
// layouts racines, un par section — voir RootHtml.tsx — qui n'ont besoin
// d'aucun en-tête de proxy et gardent le rendu statique.
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublicGestionRoute =
    pathname === '/gestion/connexion' || pathname === '/api/gestion/connexion';
  const isProtected =
    (pathname.startsWith('/gestion') || pathname.startsWith('/api/gestion')) &&
    !isPublicGestionRoute;

  if (!isProtected) return NextResponse.next();

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const payload = await verifySessionToken(token);
  if (payload) return NextResponse.next();

  if (pathname.startsWith('/api/')) {
    return NextResponse.json({ error: 'Non authentifié.' }, { status: 401 });
  }
  return NextResponse.redirect(new URL('/gestion/connexion', request.url));
}

export const config = {
  matcher: ['/gestion/:path*', '/api/gestion/:path*']
};
