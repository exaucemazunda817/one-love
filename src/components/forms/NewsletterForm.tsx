'use client';

import { useId, useState } from 'react';

export function NewsletterForm() {
  const id = useId();
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sent' | 'already' | 'unconfigured' | 'error'>('idle');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setStatus('idle');

    // Capturée AVANT le premier `await` : voir ContactForm pour l'explication
    // complète (event.currentTarget redevient null après le dispatch).
    const formEl = event.currentTarget;
    const formData = new FormData(formEl);
    const email = String(formData.get('email') || '');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await response.json().catch(() => ({}));

      if (response.status === 201) {
        setStatus('sent');
        formEl.reset();
      } else if (response.status === 200 && data.status === 'already-confirmed') {
        setStatus('already');
      } else if (response.status === 202) {
        setStatus('unconfigured');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    } finally {
      setPending(false);
    }
  }

  if (status === 'sent') {
    return (
      <p role="status" className="text-sm leading-relaxed">
        Vérifiez votre boîte de réception : un lien de confirmation vient de vous être envoyé.
      </p>
    );
  }
  if (status === 'already') {
    return (
      <p role="status" className="text-sm leading-relaxed">
        Cette adresse est déjà inscrite à notre lettre d&apos;information.
      </p>
    );
  }
  if (status === 'unconfigured') {
    return (
      <p role="status" className="text-sm leading-relaxed">
        Votre inscription est enregistrée. L&apos;envoi des confirmations sera activé prochainement.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row" noValidate>
      <label htmlFor={id} className="sr-only">
        Adresse e-mail
      </label>
      <input
        id={id}
        name="email"
        type="email"
        required
        maxLength={180}
        autoComplete="email"
        placeholder="Votre adresse e-mail"
        className="w-full rounded-full border border-white/25 bg-transparent px-5 py-3 text-sm text-ol-cream placeholder:text-ol-sand/70 focus:border-ol-amber focus:outline-none"
      />
      <button
        type="submit"
        disabled={pending}
        className="shrink-0 rounded-full bg-ol-amber px-6 py-3 text-sm font-bold text-ol-night transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? 'Envoi…' : "S'inscrire"}
      </button>
      {status === 'error' && (
        <p role="alert" className="text-sm font-bold text-ol-amber sm:hidden">
          Une erreur est survenue.
        </p>
      )}
    </form>
  );
}
