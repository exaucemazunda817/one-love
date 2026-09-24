'use client';

import { useState } from 'react';
import { PaperPlaneTiltIcon, CheckIcon } from '@phosphor-icons/react';

export function ContactFormCard({
  t
}: {
  t: {
    formTitle: string;
    name: string;
    email: string;
    subject: string;
    subjects: string[];
    message: string;
    send: string;
    sending: string;
    note: string;
    thanksTitle: string;
    thanksText: string;
    sendAnother: string;
    error: string;
  };
}) {
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError('');
    const formEl = event.currentTarget;
    const formData = new FormData(formEl);
    const payload = {
      fullName: String(formData.get('name') || ''),
      email: String(formData.get('email') || ''),
      phone: '',
      subject: String(formData.get('subject') || t.subjects[0]),
      message: String(formData.get('message') || '')
    };
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.status === 201) {
        setSent(true);
        formEl.reset();
      } else {
        const data = await response.json().catch(() => ({}));
        setError(data.error || t.error);
      }
    } catch {
      setError(t.error);
    } finally {
      setPending(false);
    }
  }

  if (sent) {
    return (
      <div className="flex flex-col items-start gap-3 rounded-card bg-white p-[clamp(20px,3vw,32px)] shadow-ol-sm">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-sage-100">
          <CheckIcon size={28} className="text-sage-700" aria-hidden />
        </span>
        <h3 className="m-0 font-serif text-[24px] font-semibold leading-[1.25]">{t.thanksTitle}</h3>
        <p className="m-0 text-pretty text-[17px] leading-[1.65] text-ink-body">{t.thanksText}</p>
        <button type="button" onClick={() => setSent(false)} className="min-h-11 cursor-pointer border-0 bg-transparent p-0 text-[15px] font-bold text-copper-600">
          {t.sendAnother}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4 rounded-card bg-white p-[clamp(20px,3vw,32px)] shadow-ol-sm">
      <h2 className="m-0 font-serif text-[24px] font-semibold leading-[1.25]">{t.formTitle}</h2>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,180px),1fr))] gap-3.5">
        <label className="flex flex-col gap-2">
          <span className="text-[15px] font-bold">{t.name}</span>
          <input name="name" required autoComplete="name" maxLength={120} className="min-h-[52px] rounded-lg border-[1.5px] border-field-line bg-white px-3.5 text-[17px] text-ink outline-none focus:border-copper-600" />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-[15px] font-bold">{t.email}</span>
          <input name="email" type="email" required autoComplete="email" maxLength={180} className="min-h-[52px] rounded-lg border-[1.5px] border-field-line bg-white px-3.5 text-[17px] text-ink outline-none focus:border-copper-600" />
        </label>
      </div>
      <label className="flex flex-col gap-2">
        <span className="text-[15px] font-bold">{t.subject}</span>
        <select name="subject" defaultValue={t.subjects[0]} className="min-h-[52px] rounded-lg border-[1.5px] border-field-line bg-white px-3.5 text-[17px] text-ink outline-none focus:border-copper-600">
          {t.subjects.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-2">
        <span className="text-[15px] font-bold">{t.message}</span>
        <textarea name="message" required minLength={10} maxLength={4000} rows={5} className="resize-y rounded-lg border-[1.5px] border-field-line p-3.5 text-[17px] leading-[1.5] outline-none focus:border-copper-600" />
      </label>
      {error && (
        <p role="alert" className="m-0 text-[14px] font-bold text-error">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-[52px] cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full border-0 bg-copper-600 px-7 text-[17px] font-bold text-white hover:bg-copper-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <PaperPlaneTiltIcon aria-hidden />
        {pending ? t.sending : t.send}
      </button>
      <span className="text-[13px] text-ink-soft">{t.note}</span>
    </form>
  );
}
