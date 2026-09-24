import { ParrainerPage, parrainerMetadata } from '@/components/site/pages/ParrainerPage';

export const metadata = parrainerMetadata('en');

export default function Page() {
  return <ParrainerPage locale="en" />;
}
