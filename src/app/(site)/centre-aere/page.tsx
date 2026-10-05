import { CentreAerePage, centreAereMetadata } from '@/components/site/pages/CentreAerePage';

export const metadata = centreAereMetadata('fr');

export default function Page() {
  return <CentreAerePage locale="fr" />;
}
