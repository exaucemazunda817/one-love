import type { Metadata } from 'next';
import { HomePage } from '@/components/site/pages/HomePage';
import { org, identity } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  locale: 'fr',
  path: '/',
  title: `${org.name} — ${org.tagline}`,
  description: identity.mission,
  absoluteTitle: true
});

export default function Page() {
  return <HomePage locale="fr" />;
}
