import { CentreAerePage, centreAereMetadata } from '@/components/site/pages/CentreAerePage';

export const metadata = centreAereMetadata('en');

export default function Page() {
  return <CentreAerePage locale="en" />;
}
