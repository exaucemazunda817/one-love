import type { Metadata } from 'next';
import { Lora, Nunito_Sans } from 'next/font/google';
import { headers } from 'next/headers';
import './globals.css';
import { org, identity } from '@/lib/content';

// Les deux familles du design system 2026 : Lora pour les titres, chiffres
// et citations ; Nunito Sans pour le texte et l'interface.
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

// `||` et non `??` : sur Vercel une variable peut exister avec une valeur
// VIDE, et `??` ne réagit qu'à undefined. Ce piège avait figé l'aperçu de
// partage de gospel-nation sur localhost pendant plusieurs jours.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${org.name} — ${org.tagline}`,
    template: `%s — ${org.name}`
  },
  description: identity.mission,
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: org.name,
    title: `${org.name} — ${org.tagline}`,
    description: identity.mission,
    images: [{ url: '/og/partage-fr.jpg', width: 1200, height: 630, alt: `${org.name} — ${org.tagline}` }]
  }
};

// Racine minimale, commune au site public ET au logiciel de gestion : police,
// métadonnées, html/body. L'en-tête et le pied de page publics vivent dans
// (site)/layout.tsx, pas ici — /gestion a sa propre coquille indépendante
// (voir gestion/connexion/page.tsx et gestion/(protected)/layout.tsx).
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Posé par src/proxy.ts sur chaque requête (en-tête x-locale) : la racine
  // est commune à (site) et (site-en) et n'a pas accès au pathname
  // autrement. Corrigé le 27/09/2026 (audit SEO) : `lang` était auparavant
  // toujours "fr" dans le HTML servi par le serveur, y compris sous /en,
  // et n'était rectifié qu'après coup par un script — invisible pour un
  // robot ou un lecteur d'écran qui ne l'exécute pas.
  const locale = (await headers()).get('x-locale') === 'en' ? 'en' : 'fr';

  return (
    <html lang={locale} className={`${lora.variable} ${nunito.variable}`} suppressHydrationWarning>
      <head>
        {/* Pose `js` avant le premier affichage : c'est ce qui autorise le
            masquage des blocs d'apparition (voir globals.css). */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="flex min-h-screen flex-col">{children}</body>
    </html>
  );
}
