import { NewsPage, newsMetadata } from '@/components/site/pages/NewsPage';

export const metadata = newsMetadata('fr');

export default function Page() {
  return <NewsPage locale="fr" />;
}
