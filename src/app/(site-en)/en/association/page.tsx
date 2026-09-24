import { AssociationPage, associationMetadata } from '@/components/site/pages/AssociationPage';

export const metadata = associationMetadata('en');

export default function Page() {
  return <AssociationPage locale="en" />;
}
