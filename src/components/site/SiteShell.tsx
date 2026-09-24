import { Header, MobileDonateBar } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { BrushDefs } from '@/components/site/ui';
import type { Locale } from '@/lib/i18n';

// Habillage commun aux deux langues du site PUBLIC. Le logiciel de gestion
// (/gestion) est un groupe de routes séparé qui n'hérite jamais de ceci.
export function SiteShell({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return (
    <>
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-copper-600 focus:px-5 focus:py-3 focus:text-sm focus:font-bold focus:text-white"
      >
        {locale === 'fr' ? 'Aller au contenu' : 'Skip to content'}
      </a>
      <BrushDefs />
      <Header locale={locale} />
      <main id="contenu" className="flex-1">
        {children}
      </main>
      <Footer locale={locale} />
      <MobileDonateBar locale={locale} />
    </>
  );
}
