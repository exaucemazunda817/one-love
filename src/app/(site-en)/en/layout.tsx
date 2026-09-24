import { SiteShell } from '@/components/site/SiteShell';

// Site public en anglais, sous /en. Le <html lang="fr"> de la racine est
// commun à tout le site : `lang="en"` sur ce conteneur indique aux lecteurs
// d'écran et aux moteurs que tout ce qu'il contient est en anglais.
export default function EnglishLayout({ children }: { children: React.ReactNode }) {
  return (
    <div lang="en" className="flex min-h-screen flex-col">
      <SiteShell locale="en">{children}</SiteShell>
    </div>
  );
}
