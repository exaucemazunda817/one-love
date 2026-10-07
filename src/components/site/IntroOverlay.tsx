'use client';

// Écran d'ouverture : le logo One Love s'écrit, le cœur apparaît puis bat, la
// devise s'affiche, puis le volet se referme en cercle. Joué à chaque
// chargement complet ou actualisation de page (demande de Mazunda du
// 05/10/2026). Tout est piloté en CSS (globals.css, html[data-intro]) : la page
// n'est jamais bloquée, même si le JavaScript arrive tard. Le bouton permet de
// passer l'intro.
export function IntroOverlay({ lang }: { lang: 'fr' | 'en' }) {
  return (
    <div className="ol-intro" aria-hidden="true">
      <div className="ol-intro-halo" />
      <div className="ol-intro-logo">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="ol-intro-text" src="/brand/intro-texte.webp" alt="" width={1100} height={327} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="ol-intro-heart" src="/brand/intro-coeur.webp" alt="" width={1100} height={327} />
      </div>
      <p className="ol-intro-tag">{lang === 'en' ? 'Love and faith are what drive us.' : 'L’amour et la foi, notre carburant.'}</p>
      <button type="button" className="ol-intro-skip" tabIndex={-1} onClick={() => document.documentElement.removeAttribute('data-intro')}>
        {lang === 'en' ? 'Skip intro' : 'Passer l’intro'}
      </button>
    </div>
  );
}
