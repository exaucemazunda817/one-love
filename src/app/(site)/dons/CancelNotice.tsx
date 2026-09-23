'use client';

import { useSearchParams } from 'next/navigation';

export function CancelNotice() {
  const params = useSearchParams();
  if (params.get('statut') !== 'annule') return null;

  return (
    <p role="status" className="mb-6 rounded-lg border border-ol-line bg-ol-cream px-4 py-3 text-sm text-ol-ink">
      Le paiement a été annulé. Aucun montant n&apos;a été prélevé.
    </p>
  );
}
