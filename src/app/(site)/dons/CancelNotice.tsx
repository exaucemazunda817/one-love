'use client';

import { useSearchParams } from 'next/navigation';
import type { Locale } from '@/lib/i18n';

const text = {
  fr: 'Le paiement a été annulé. Aucun montant n’a été prélevé.',
  en: 'The payment was cancelled. No amount was charged.'
};

export function CancelNotice({ locale = 'fr' }: { locale?: Locale }) {
  const params = useSearchParams();
  if (params.get('statut') !== 'annule') return null;

  return (
    <p
      role="status"
      className="mx-auto mt-6 max-w-[1200px] rounded-lg border border-card-line bg-cream px-4 py-3 text-sm text-ink"
    >
      {text[locale]}
    </p>
  );
}
