'use client';

import { useId, useState } from 'react';
import type { Locale } from '@/lib/i18n';

const text = {
  fr: {
    label: 'Adresse e-mail',
    submit: "S'inscrire",
    pending: 'Envoi…',
    sent: 'Vérifiez votre boîte de réception : un lien de confirmation vient de vous être envoyé.',
    already: "Cette adresse est déjà inscrite à notre lettre d'information.",
    unconfigured: "Votre inscription est enregistrée. L'envoi des confirmations sera activé prochainement.",
    error: 'Une erreur est survenue. Merci de réessayer.'
  },
  en: {
    label: 'Email address',
    submit: 'Subscribe',
    pending: 'Sending…',
    sent: 'Check your inbox: we have just sent you a confirmation link.',
    already: 'This address is already subscribed to our newsletter.',
    unconfigured: 'Your subscription is saved. Confirmation emails will be switched on soon.',
    error: 'Something went wrong. Please try again.'
  }
};

export function NewsletterForm({ locale = 'fr' }: { locale?: Locale }) {
  const id = useId();
  const t = text[locale];
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sent' | 'already' | 'unconfigured' | 'error'>('idle');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setStatus('idle');

    // Capturée AVANT le premier `await` : event.currentTarget redevient null
    // une fois le gestionnaire d'événement terminé.
    const formEl = event.currentTarget;
    const email = String(new FormData(formEl).get('email') || '');

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

  if (status === 'sent' || status === 'already' || status === 'unconfigured') {
    return (
      <p role="status" className="m-0 text-[15px] leading-[1.5] text-on-dark-1">
        {t[status]}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-2" noValidate>
      <label htmlFor={id} className="sr-only">
        {t.label}
      </label>
      <input
        id={id}
        name="email"
        type="email"
        required
        maxLength={180}
        autoComplete="email"
        placeholder={t.label}
        className="min-h-12 min-w-0 flex-1 rounded-lg border-[1.5px] border-dark-border bg-dark-surface px-3.5 text-[15px] text-cream placeholder:text-on-dark-3"
      />
      <button
        type="submit"
        disabled={pending}
        className="min-h-12 cursor-pointer rounded-full border-2 border-gold bg-transparent px-[18px] text-[15px] font-bold text-gold-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? t.pending : t.submit}
      </button>
      {status === 'error' && (
        <p role="alert" className="m-0 w-full text-[13px] font-bold text-gold-hover">
          {t.error}
        </p>
      )}
    </form>
  );
}
