import { ActionsPage, actionsMetadata } from '@/components/site/pages/ActionsPage';

export const metadata = actionsMetadata('fr');

export default function Page() {
  return <ActionsPage locale="fr" />;
}
