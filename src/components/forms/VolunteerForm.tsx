'use client';

import { useId, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Field, TextInput, TextArea, SubmitButton } from './fields';

type Errors = Record<string, string[]>;

export function VolunteerForm() {
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
      firstName: String(formData.get('firstName') || ''),
      lastName: String(formData.get('lastName') || ''),
      email: String(formData.get('email') || ''),
      phone: String(formData.get('phone') || ''),
      country: String(formData.get('country') || ''),
      availability: String(formData.get('availability') || ''),
      skills: String(formData.get('skills') || ''),
      motivation: String(formData.get('motivation') || '')
    };

    try {
      const response = await fetch('/api/benevole', {
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
          Merci pour votre candidature. Nous revenons vers vous prochainement.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Prénom" htmlFor={`${id}-firstName`} error={errors.firstName?.[0]}>
          <TextInput id={`${id}-firstName`} name="firstName" required maxLength={120} autoComplete="given-name" />
        </Field>
        <Field label="Nom" htmlFor={`${id}-lastName`} error={errors.lastName?.[0]}>
          <TextInput id={`${id}-lastName`} name="lastName" required maxLength={120} autoComplete="family-name" />
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
      <Field label="Pays" htmlFor={`${id}-country`} optional error={errors.country?.[0]}>
        <TextInput id={`${id}-country`} name="country" maxLength={80} autoComplete="country-name" />
      </Field>
      <Field label="Disponibilités" htmlFor={`${id}-availability`} optional error={errors.availability?.[0]}>
        <TextInput id={`${id}-availability`} name="availability" maxLength={200} placeholder="Ex. : week-ends, sur place à Kinshasa…" />
      </Field>
      <Field label="Compétences" htmlFor={`${id}-skills`} optional error={errors.skills?.[0]}>
        <TextArea id={`${id}-skills`} name="skills" maxLength={600} />
      </Field>
      <Field label="Motivation" htmlFor={`${id}-motivation`} error={errors.motivation?.[0]}>
        <TextArea id={`${id}-motivation`} name="motivation" required minLength={20} maxLength={3000} />
      </Field>

      {status === 'error' && Object.keys(errors).length === 0 && (
        <p role="alert" className="text-sm font-bold text-ol-ember-ink">
          Une erreur est survenue. Merci de réessayer dans un instant.
        </p>
      )}

      <SubmitButton pending={pending}>Envoyer ma candidature</SubmitButton>
    </form>
  );
}
