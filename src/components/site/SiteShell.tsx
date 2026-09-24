import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { BrushDefs } from '@/components/site/ui';
import { org, identity } from '@/lib/content';
import { FACEBOOK_URL, CONTACT_EMAIL, type Locale } from '@/lib/i18n';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

// Données structurées : aident les moteurs de recherche à relier le site à la
// page Facebook de l'association et à la présenter comme une ONG.
const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'NGO',
  name: org.name,
  legalName: org.legalName,
  url: siteUrl,
  logo: `${siteUrl}/brand/logo-one-love-rond.png`,
  slogan: org.tagline,
  description: identity.mission,
  foundingDate: String(org.foundedYear),
  email: CONTACT_EMAIL,
  sameAs: [FACEBOOK_URL]
};

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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      <BrushDefs />
      <Header locale={locale} />
      <main id="contenu" className="flex-1">
        {children}
      </main>
      <Footer locale={locale} />
    </>
  );
}
