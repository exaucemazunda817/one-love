import { VillagePage, villageMetadata } from '@/components/site/pages/VillagePage';

export const metadata = villageMetadata('fr');

export default function Page() {
  return <VillagePage locale="fr" />;
}
