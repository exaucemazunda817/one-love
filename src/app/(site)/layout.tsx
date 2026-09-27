import type { Metadata } from 'next';
import { RootHtml } from '@/components/RootHtml';
import { SiteShell } from '@/components/site/SiteShell';
import { org, identity } from '@/lib/content';

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

// Layout RACINE (voir RootHtml.tsx) du site public en français, langue par
// défaut et routes historiques.
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <RootHtml lang="fr">
      <SiteShell locale="fr">{children}</SiteShell>
    </RootHtml>
  );
}
