import { HtmlLang } from '@/components/HtmlLang';
import { SiteShell } from '@/components/site/SiteShell';

// Site public en français (langue par défaut, routes historiques).
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HtmlLang lang="fr" />
      <SiteShell locale="fr">{children}</SiteShell>
    </>
  );
}
