import type { Metadata } from 'next';
import { Lato } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { org, identity } from '@/lib/content';

// Lato est la police du site actuel : la garder évite de casser la
// reconnaissance de la marque au moment de la bascule.
const lato = Lato({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-lato',
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
    description: identity.mission
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={lato.variable}>
      <body className="flex min-h-screen flex-col">
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-ol-ember-ink focus:px-5 focus:py-3 focus:text-sm focus:font-bold focus:text-ol-white"
        >
          Aller au contenu
        </a>
        <Header />
        <main id="contenu" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
