import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

// Habillage du site PUBLIC uniquement (en-tête, pied de page, lien d'évitement).
// Le logiciel de gestion (/gestion) est un groupe de routes séparé, sans ce
// fichier au-dessus de lui : il ne doit jamais hériter du bouton « Faire un
// don » ni du menu public — c'est un outil interne, pas une page du site.
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
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
    </>
  );
}
