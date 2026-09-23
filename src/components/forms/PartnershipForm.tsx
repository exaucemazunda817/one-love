'use client';

import { useId, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Field, TextInput, TextArea, SubmitButton } from './fields';

type Errors = Record<string, string[]>;

export function PartnershipForm() {
  const id = useId();
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setErrors({});
    setStatus('idle');

    // Capturée AVANT le premier `await` : voir ContactForm pour l'explication
    // complète (event.currentTarget redevient null après le dispatch).
    const formEl = event.currentTarget;
    const formData = new FormData(formEl);
    const payload = {
      organisationName: String(formData.get('organisationName') || ''),
      contactName: String(formData.get('contactName') || ''),
      email: String(formData.get('email') || ''),
      phone: String(formData.get('phone') || ''),
      website: String(formData.get('website') || ''),
      partnershipType: String(formData.get('partnershipType') || ''),
      message: String(formData.get('message') || '')
    };

    try {
      const response = await fetch('/api/partenariat', {
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
          Merci pour votre proposition. Nous reviendrons vers vous rapidement.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Organisation" htmlFor={`${id}-organisationName`} error={errors.organisationName?.[0]}>
          <TextInput id={`${id}-organisationName`} name="organisationName" required maxLength={120} />
        </Field>
        <Field label="Personne à contacter" htmlFor={`${id}-contactName`} error={errors.contactName?.[0]}>
          <TextInput id={`${id}-contactName`} name="contactName" required maxLength={120} autoComplete="name" />
        </Field>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="E-mail" htmlFor={`${id}-email`} error={errors.email?.[0]}>
          <TextInput id={`${id}-email`} name="email" type="email" required maxLength={180} autoComplete="email" />
        </Field>
        <Field label="Téléphone" htmlFor={`${id}-phone`} optional error={errors.phone?.[0]}>
          <TextInput id={`${id}-phone`} name="phone" type="tel" maxLength={40} autoComplete="tel" />
        </Field>
      </div>
      <Field label="Site web" htmlFor={`${id}-website`} optional error={errors.website?.[0]}>
        <TextInput id={`${id}-website`} name="website" type="url" maxLength={300} placeholder="https://" />
      </Field>
      <Field label="Type de partenariat" htmlFor={`${id}-partnershipType`} optional error={errors.partnershipType?.[0]}>
        <TextInput id={`${id}-partnershipType`} name="partnershipType" maxLength={120} placeholder="Ex. : financement, don en nature, mécénat de compétences…" />
      </Field>
      <Field label="Message" htmlFor={`${id}-message`} error={errors.message?.[0]}>
        <TextArea id={`${id}-message`} name="message" required minLength={20} maxLength={3000} />
      </Field>

      {status === 'error' && Object.keys(errors).length === 0 && (
        <p role="alert" className="text-sm font-bold text-ol-ember-ink">
          Une erreur est survenue. Merci de réessayer dans un instant.
        </p>
      )}

      <SubmitButton pending={pending}>Envoyer la proposition</SubmitButton>
    </form>
  );
}
