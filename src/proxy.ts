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
// Deuxième rôle, ajouté le 27/09/2026 (audit SEO) : poser un en-tête
// `x-locale` sur CHAQUE page, lu par le layout racine (`headers()`) pour
// poser `<html lang="…">` correctement dès le HTML servi par le serveur. Le
// layout racine est commun à (site) et (site-en) et n'a pas accès au
// pathname autrement ; sans ce correctif, les pages /en étaient livrées avec
// lang="fr" et corrigées seulement après coup par un script côté client, que
// les robots et lecteurs d'écran qui ne l'exécutent pas ne voient jamais. Le
// matcher est donc élargi à tout le site (hors fichiers statiques), pas
// seulement /gestion.
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const locale = pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'fr';

  const isPublicGestionRoute =
    pathname === '/gestion/connexion' || pathname === '/api/gestion/connexion';
  const isProtected =
    (pathname.startsWith('/gestion') || pathname.startsWith('/api/gestion')) &&
    !isPublicGestionRoute;

  if (isProtected) {
    const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const payload = await verifySessionToken(token);
    if (!payload) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Non authentifié.' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/gestion/connexion', request.url));
    }
  }

  const response = NextResponse.next();
  response.headers.set('x-locale', locale);
  return response;
}

export const config = {
  // Tout sauf les assets statiques Next (fichiers avec extension) : ces
  // derniers n'ont pas besoin de x-locale et ne doivent pas repasser par une
  // fonction serveur à chaque requête.
  matcher: ['/((?!_next/static|_next/image|favicon\\.ico|.*\\..*).*)']
};
