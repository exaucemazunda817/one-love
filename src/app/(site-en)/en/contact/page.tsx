import { ContactPage, contactMetadata } from '@/components/site/pages/ContactPage';

export const metadata = contactMetadata('en');

export default function Page() {
  return <ContactPage locale="en" />;
}
