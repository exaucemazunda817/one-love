import { TransparencyPage, transparencyMetadata } from '@/components/site/pages/TransparencyPage';

export const metadata = transparencyMetadata('en');

export default function Page() {
  return <TransparencyPage locale="en" />;
}
