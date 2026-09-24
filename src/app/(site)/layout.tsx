import { SiteShell } from '@/components/site/SiteShell';

// Site public en français (langue par défaut, routes historiques).
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell locale="fr">{children}</SiteShell>;
}
