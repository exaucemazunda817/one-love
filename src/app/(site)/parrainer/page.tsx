import { ParrainerPage, parrainerMetadata } from '@/components/site/pages/ParrainerPage';

export const metadata = parrainerMetadata('fr');

export default function Page() {
  return <ParrainerPage locale="fr" />;
}
