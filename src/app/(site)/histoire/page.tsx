import { HistoryPage, historyMetadata } from '@/components/site/pages/HistoryPage';

export const metadata = historyMetadata('fr');

export default function Page() {
  return <HistoryPage locale="fr" />;
}
