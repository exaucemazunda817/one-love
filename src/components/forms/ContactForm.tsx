'use client';

import { useId, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Field, TextInput, TextArea, SubmitButton } from './fields';

type Errors = Record<string, string[]>;

export function ContactForm() {
  const id = useId();
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setErrors({});
    setStatus('idle');

    // Capturée AVANT le premier `await` : `event.currentTarget` redevient
    // `null` dès que la phase de dispatch de l'événement se termine, un
    // comportement standard du DOM. Y accéder après un `await` lève une
    // exception qui atterrissait dans le catch — l'envoi réussissait côté
    // serveur mais l'utilisateur voyait « Une erreur est survenue ».
    const formEl = event.currentTarget;
    const formData = new FormData(formEl);
    const payload = {
      fullName: String(formData.get('fullName') || ''),
      email: String(formData.get('email') || ''),
      phone: String(formData.get('phone') || ''),
      subject: String(formData.get('subject') || ''),
      message: String(formData.get('message') || '')
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.status === 201) {
        setStatus('success');
        formEl.reset();
      } else if (response.status === 400) {
        const data = await response.json();
        setErrors(data.issues || {});
        setStatus('error');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    } finally {
      setPending(false);
    }
  }

  if (status === 'success') {
    return (
      <div
        role="status"
        className="flex items-start gap-3 rounded-xl border border-ol-line bg-ol-cream p-6"
      >
        <CheckCircle2 size={22} className="mt-0.5 shrink-0 text-ol-ember-ink" aria-hidden />
        <p className="leading-relaxed text-ol-ink">
          Votre message a bien été envoyé. Nous vous répondrons dès que possible.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Nom complet" htmlFor={`${id}-fullName`} error={errors.fullName?.[0]}>
          <TextInput id={`${id}-fullName`} name="fullName" required maxLength={120} autoComplete="name" />
        </Field>
        <Field label="E-mail" htmlFor={`${id}-email`} error={errors.email?.[0]}>
          <TextInput
            id={`${id}-email`}
            name="email"
            type="email"
            required
            maxLength={180}
            autoComplete="email"
          />
        </Field>
      </div>
      <Field label="Téléphone" htmlFor={`${id}-phone`} optional error={errors.phone?.[0]}>
        <TextInput id={`${id}-phone`} name="phone" type="tel" maxLength={40} autoComplete="tel" />
      </Field>
      <Field label="Sujet" htmlFor={`${id}-subject`} error={errors.subject?.[0]}>
        <TextInput id={`${id}-subject`} name="subject" required maxLength={140} />
      </Field>
      <Field label="Message" htmlFor={`${id}-message`} error={errors.message?.[0]}>
        <TextArea id={`${id}-message`} name="message" required minLength={10} maxLength={4000} />
      </Field>

      {status === 'error' && Object.keys(errors).length === 0 && (
        <p role="alert" className="text-sm font-bold text-ol-ember-ink">
          Une erreur est survenue. Merci de réessayer dans un instant.
        </p>
      )}

      <SubmitButton pending={pending}>Envoyer le message</SubmitButton>
    </form>
  );
}
