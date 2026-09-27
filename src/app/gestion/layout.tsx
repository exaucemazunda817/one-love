import type { Metadata } from 'next';
import { RootHtml } from '@/components/RootHtml';

// Layout RACINE (voir RootHtml.tsx) du logiciel de gestion — indépendant du
// site public, comme documenté depuis le jalon 5 (jamais hérité du layout
// public : pas de menu ni de bouton de don au-dessus de l'écran de
// connexion). `X-Robots-Tag: noindex` déjà posé par en-tête HTTP dans
// next.config.ts pour tout /gestion — le `robots` ici est une deuxième
// ceinture, pas une redite inutile : certains agrégateurs ne lisent que les
// métadonnées HTML.
export const metadata: Metadata = {
  robots: { index: false, follow: false }
};

export default function GestionRootLayout({ children }: { children: React.ReactNode }) {
  return <RootHtml lang="fr">{children}</RootHtml>;
}
