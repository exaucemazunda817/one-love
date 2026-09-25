import { HistoryPage, historyMetadata } from '@/components/site/pages/HistoryPage';

export const metadata = historyMetadata('en');

export default function Page() {
  return <HistoryPage locale="en" />;
}
