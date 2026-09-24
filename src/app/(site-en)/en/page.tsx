import type { Metadata } from 'next';
import { HomePage } from '@/components/site/pages/HomePage';

const description =
  'Our desire is to share the love we have received. In Kinshasa, we support children through education, care and listening.';

export const metadata: Metadata = {
  title: { absolute: 'One Love — Love and faith are what drive us.' },
  description,
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    siteName: 'One Love',
    title: 'One Love — Love and faith are what drive us.',
    description
  }
};

export default function Page() {
  return <HomePage locale="en" />;
}
