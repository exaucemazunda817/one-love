'use client';

import { useId, useState } from 'react';
import { useRouter } from 'next/navigation';

export function LoginForm() {
  const id = useId();
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);

    // Capturée avant le premier `await` : voir src/components/forms/ContactForm.tsx
    // pour l'explication (event.currentTarget redevient null après le dispatch).
    const formEl = event.currentTarget;
    const formData = new FormData(formEl);

    try {
      const response = await fetch('/api/gestion/connexion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: String(formData.get('email') || ''),
          password: String(formData.get('password') || '')
        })
      });

      if (response.status === 429) {
        const data = await response.json().catch(() => ({}));
        setError(data.error || 'Trop de tentatives. Merci de réessayer plus tard.');
        return;
      }
      if (!response.ok) {
        setError('Identifiants invalides.');
        return;
      }

      const data = await response.json();
      router.push(data.mustChangePassword ? '/gestion/changer-mot-de-passe' : '/gestion');
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
        <label htmlFor={`${id}-email`} className="mb-1.5 block text-sm font-bold text-ol-charcoal">
          E-mail
        </label>
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          required
          autoComplete="email"
          autoFocus
          className="w-full rounded-lg border border-ol-line-strong bg-ol-white px-4 py-3 text-[0.95rem] text-ol-ink focus:border-ol-ember focus:outline-none focus:ring-2 focus:ring-ol-ember/30"
        />
      </div>
      <div>
        <label htmlFor={`${id}-password`} className="mb-1.5 block text-sm font-bold text-ol-charcoal">
          Mot de passe
        </label>
        <input
          id={`${id}-password`}
          name="password"
          type="password"
          required
          autoComplete="current-password"
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
        {pending ? 'Connexion…' : 'Se connecter'}
      </button>
    </form>
  );
}
