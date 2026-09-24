import { ActionsPage, actionsMetadata } from '@/components/site/pages/ActionsPage';

export const metadata = actionsMetadata('en');

export default function Page() {
  return <ActionsPage locale="en" />;
}
