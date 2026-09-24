import type { Metadata } from 'next';
import { HomePage } from '@/components/site/pages/HomePage';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  locale: 'en',
  path: '/',
  title: 'One Love — Love and faith are what drive us.',
  description:
    'Our desire is to share the love we have received. In Kinshasa, we support children through education, care and listening.',
  absoluteTitle: true
});

export default function Page() {
  return <HomePage locale="en" />;
}
