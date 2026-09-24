'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircleIcon, XCircleIcon } from '@phosphor-icons/react';

export function ConfirmClient() {
  const params = useSearchParams();
  const token = params.get('token');
  const [state, setState] = useState<'pending' | 'confirmed' | 'error'>('pending');

  useEffect(() => {
    if (!token) {
      setState('error');
      return;
    }
    fetch('/api/newsletter/confirmer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    })
      .then((response) => setState(response.ok ? 'confirmed' : 'error'))
      .catch(() => setState('error'));
  }, [token]);

  if (state === 'pending') {
    return <p className="text-ink-soft">Confirmation en cours…</p>;
  }

  if (state === 'confirmed') {
    return (
      <div className="flex items-start gap-3">
        <CheckCircleIcon size={28} weight="fill" className="mt-0.5 shrink-0 text-sage-700" aria-hidden />
        <p className="text-[17px] leading-[1.65] text-ink-body">
          Votre inscription est confirmée. Merci de nous suivre !
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3">
      <XCircleIcon size={28} weight="fill" className="mt-0.5 shrink-0 text-copper-700" aria-hidden />
      <p className="text-[17px] leading-[1.65] text-ink-body">
        Ce lien de confirmation n&apos;est plus valide.{' '}
        <Link href="/" className="font-bold text-copper-700 underline underline-offset-2">
          Retour à l&apos;accueil
        </Link>
        .
      </p>
    </div>
  );
}
