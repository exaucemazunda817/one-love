import { Lora, Nunito_Sans } from 'next/font/google';
import '@/app/globals.css';

// Les deux familles du design system 2026 : Lora pour les titres, chiffres
// et citations ; Nunito Sans pour le texte et l'interface. Chargées ici et
// non dans chaque layout racine : next/font dédoublonne par configuration,
// donc l'appeler depuis les trois racines ((site), (site-en), gestion)
// produirait le même résultat, mais centraliser évite toute divergence.
const lora = Lora({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-lora',
  display: 'swap'
});
const nunito = Nunito_Sans({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-nunito',
  display: 'swap'
});

/**
 * Racine `<html>/<body>` commune aux TROIS layouts racines du site — (site),
 * (site-en), gestion — chacun l'utilisant avec sa propre langue. Next.js
 * n'autorise qu'un seul `<html>` par arbre de rendu ; comme (site) et
 * (site-en) doivent chacun poser `lang="fr"`/`lang="en"` dans le HTML servi
 * par le serveur (pas seulement corrigé après coup par un script, invisible
 * pour un robot ou un lecteur d'écran qui ne l'exécute pas — audit SEO du
 * 27/09/2026), il n'existe qu'une solution qui garde le rendu statique :
 * plusieurs layouts racines, un par section, plutôt qu'un layout racine
 * unique lisant le pathname via `headers()` — cette dernière approche a été
 * essayée puis abandonnée le jour même, elle rendait TOUT le site public
 * dynamique (1 à 2,5 s par page en production au lieu d'un rendu statique
 * instantané, mesuré et confirmé par Mazunda).
 *
 * Conséquence acceptée : Next.js fait un rechargement complet de page (pas
 * une navigation cliente) entre deux routes qui n'ont pas le même layout
 * racine — donc entre le site FR et /en, et entre le site public et
 * /gestion. Coût réel minime : ce sont des changements de section rares,
 * jamais la navigation courante à l'intérieur d'une même langue.
 */
const SCRIPT =
  "(function(){var h=document.documentElement,t=0;h.classList.add('js');" +
  "addEventListener('scroll',function(){if(!t)h.classList.add('is-scrolling');clearTimeout(t);" +
  "t=setTimeout(function(){h.classList.remove('is-scrolling');t=0},150)},{passive:true})})()";

export function RootHtml({ lang, children }: { lang: 'fr' | 'en'; children: React.ReactNode }) {
  return (
    <html lang={lang} className={`${lora.variable} ${nunito.variable}`} suppressHydrationWarning>
      <head>
        {/* Pose `js` avant le premier affichage : c'est ce qui autorise le
            masquage des blocs d’apparition (voir globals.css). Pose aussi
            `is-scrolling` le temps d’un défilement : les cartes photo
            ignorent alors le pointeur (voir globals.css). Écouteur passif, la
            classe n’est posée qu’au début et retirée à la fin d’un geste — pas
            à chaque image. */}
        <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />
      </head>
      <body className="flex min-h-screen flex-col">{children}</body>
    </html>
  );
}
