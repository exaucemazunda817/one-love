'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function LogoutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleLogout() {
    setPending(true);
    await fetch('/api/gestion/deconnexion', { method: 'POST' }).catch(() => {});
    router.push('/gestion/connexion');
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={pending}
      className="rounded-full border border-ol-line-strong px-4 py-2 text-sm font-bold text-ol-charcoal transition-colors hover:border-ol-ember-ink hover:text-ol-ember-ink disabled:opacity-60"
    >
      {pending ? '…' : 'Se déconnecter'}
    </button>
  );
}
