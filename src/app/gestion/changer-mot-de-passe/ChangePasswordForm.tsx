'use client';

import { useId, useState } from 'react';
import { useRouter } from 'next/navigation';

export function ChangePasswordForm({ redirectTo }: { redirectTo: string }) {
  const id = useId();
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);

    const formEl = event.currentTarget;
    const formData = new FormData(formEl);
    const newPassword = String(formData.get('newPassword') || '');
    const confirmPassword = String(formData.get('confirmPassword') || '');

    if (newPassword !== confirmPassword) {
      setError('Les deux mots de passe ne correspondent pas.');
      setPending(false);
      return;
    }

    try {
      const response = await fetch('/api/gestion/changer-mot-de-passe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: String(formData.get('currentPassword') || ''),
          newPassword
        })
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(data.error || 'Une erreur est survenue.');
        return;
      }

      router.push(redirectTo);
      router.refresh();
    } catch {
      setError('Une erreur est survenue. Merci de réessayer.');
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div>
        <label htmlFor={`${id}-current`} className="mb-1.5 block text-sm font-bold text-ol-charcoal">
          Mot de passe actuel
        </label>
        <input
          id={`${id}-current`}
          name="currentPassword"
          type="password"
          required
          autoComplete="current-password"
          className="w-full rounded-lg border border-ol-line-strong bg-ol-white px-4 py-3 text-[0.95rem] text-ol-ink focus:border-ol-ember focus:outline-none focus:ring-2 focus:ring-ol-ember/30"
        />
      </div>
      <div>
        <label htmlFor={`${id}-new`} className="mb-1.5 block text-sm font-bold text-ol-charcoal">
          Nouveau mot de passe
        </label>
        <input
          id={`${id}-new`}
          name="newPassword"
          type="password"
          required
          minLength={12}
          autoComplete="new-password"
          className="w-full rounded-lg border border-ol-line-strong bg-ol-white px-4 py-3 text-[0.95rem] text-ol-ink focus:border-ol-ember focus:outline-none focus:ring-2 focus:ring-ol-ember/30"
        />
      </div>
      <div>
        <label htmlFor={`${id}-confirm`} className="mb-1.5 block text-sm font-bold text-ol-charcoal">
          Confirmer le nouveau mot de passe
        </label>
        <input
          id={`${id}-confirm`}
          name="confirmPassword"
          type="password"
          required
          minLength={12}
          autoComplete="new-password"
          className="w-full rounded-lg border border-ol-line-strong bg-ol-white px-4 py-3 text-[0.95rem] text-ol-ink focus:border-ol-ember focus:outline-none focus:ring-2 focus:ring-ol-ember/30"
        />
      </div>

      {error && (
        <p role="alert" className="text-sm font-bold text-ol-ember-ink">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-ol-ember-ink px-6 py-3.5 text-sm font-bold text-ol-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? 'Enregistrement…' : 'Enregistrer le nouveau mot de passe'}
      </button>
    </form>
  );
}
