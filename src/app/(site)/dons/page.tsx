import { DonsPage, donsMetadata } from '@/components/site/pages/DonsPage';

export const metadata = donsMetadata('fr');

export default function Page() {
  return <DonsPage locale="fr" />;
}
