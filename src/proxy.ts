import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE_NAME, verifySessionToken } from '@/lib/session';

// Ce fichier DOIT rester dans src/ : le projet a un dossier src, et Next ne
// charge le proxy que s'il s'y trouve. Placé à la racine, il est silencieusement
// ignoré et l'espace protégé devient accessible à tous — c'est arrivé sur
// gospel-nation.
//
// Le proxy ne fait que le contrôle grossier : le cookie est-il signé et non
// expiré ? Il ne touche jamais à la base et ne fait jamais de bcrypt, qui ne
// tournent pas en edge runtime. Le contrôle fin (compte actif, rôle, version
// du jeton) appartiendra au layout serveur de /gestion, au jalon 5.
//
// Les routes API protégées sont gardées ICI aussi, pas seulement les pages :
// sur abg-rdc, une première version ne protégeait que les pages et laissait
// les routes de validation appelables sans authentification.
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected =
    (pathname.startsWith('/gestion') && pathname !== '/gestion/connexion') ||
    pathname.startsWith('/api/gestion');

  if (!isProtected) return NextResponse.next();

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (await verifySessionToken(token)) return NextResponse.next();

  if (pathname.startsWith('/api/')) {
    return NextResponse.json({ error: 'Non authentifié.' }, { status: 401 });
  }
  return NextResponse.redirect(new URL('/gestion/connexion', request.url));
}

export const config = {
  matcher: ['/gestion/:path*', '/api/gestion/:path*']
};
