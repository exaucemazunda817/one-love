'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, XCircle } from 'lucide-react';

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
    return <p className="text-ol-muted">Confirmation en cours…</p>;
  }

  if (state === 'confirmed') {
    return (
      <div className="flex items-start gap-3">
        <CheckCircle2 size={24} className="mt-0.5 shrink-0 text-ol-ember-ink" aria-hidden />
        <p className="leading-relaxed text-ol-ink">
          Votre inscription est confirmée. Merci de nous suivre !
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3">
      <XCircle size={24} className="mt-0.5 shrink-0 text-ol-ember-ink" aria-hidden />
      <p className="leading-relaxed text-ol-ink">
        Ce lien de confirmation n&apos;est plus valide.{' '}
        <Link href="/" className="font-bold text-ol-ember-ink underline underline-offset-2">
          Retour à l&apos;accueil
        </Link>
        .
      </p>
    </div>
  );
}
