import { DonsPage, donsMetadata } from '@/components/site/pages/DonsPage';

export const metadata = donsMetadata('en');

export default function Page() {
  return <DonsPage locale="en" />;
}
