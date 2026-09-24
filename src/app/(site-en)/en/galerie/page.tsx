import { NewsPage, newsMetadata } from '@/components/site/pages/NewsPage';

export const metadata = newsMetadata('en');

export default function Page() {
  return <NewsPage locale="en" />;
}
