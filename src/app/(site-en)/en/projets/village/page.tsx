import { VillagePage, villageMetadata } from '@/components/site/pages/VillagePage';

export const metadata = villageMetadata('en');

export default function Page() {
  return <VillagePage locale="en" />;
}
