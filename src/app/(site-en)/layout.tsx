import type { Metadata } from 'next';
import { RootHtml } from '@/components/RootHtml';
import { SiteShell } from '@/components/site/SiteShell';
import { org, identity } from '@/lib/content';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

// Base pour cette racine séparée — chaque page /en pose déjà ses propres
// métadonnées complètes via pageMetadata(), mais metadataBase ne se
// transmet pas entre deux layouts racines distincts (voir RootHtml.tsx) : il
// doit être posé une fois ici aussi, sinon les images og: résolvent en
// relatif.
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: `${org.name} — Love and faith are what drive us.`,
  description: identity.mission
};

// Layout RACINE (voir RootHtml.tsx) du site public en anglais, sous /en.
export default function EnglishSiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <RootHtml lang="en" intro>
      <SiteShell locale="en">{children}</SiteShell>
    </RootHtml>
  );
}
