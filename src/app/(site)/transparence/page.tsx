import { TransparencyPage, transparencyMetadata } from '@/components/site/pages/TransparencyPage';

export const metadata = transparencyMetadata('fr');

export default function Page() {
  return <TransparencyPage locale="fr" />;
}
