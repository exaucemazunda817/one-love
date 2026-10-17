'use client';

import { useEffect } from 'react';
import { forgetCheckout } from '@/lib/donation-ui';

// Page de remerciement atteinte : le paiement est terminé côté Stripe, le
// formulaire n'a plus besoin de s'en souvenir (protection anti-doublon).
export function ForgetCheckout() {
  useEffect(() => {
    forgetCheckout();
  }, []);
  return null;
}
