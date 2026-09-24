import { AssociationPage, associationMetadata } from '@/components/site/pages/AssociationPage';

export const metadata = associationMetadata('fr');

export default function Page() {
  return <AssociationPage locale="fr" />;
}
