'use client';

import { useId, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ENGAGEMENT_LABELS } from '@/lib/team';

interface MemberRow {
  id: string;
  firstName: string;
  lastName: string;
  engagement: string;
  jobTitle: string | null;
  email: string | null;
  phone: string | null;
  isActive: boolean;
}

export function TeamManager({
  initialMembers,
  canManage
}: {
  initialMembers: MemberRow[];
  canManage: boolean;
}) {
  const id = useId();
  const router = useRouter();
  const [members, setMembers] = useState(initialMembers);
  const [showForm, setShowForm] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);

    const formEl = event.currentTarget;
    const formData = new FormData(formEl);
    const payload = {
      firstName: String(formData.get('firstName') || ''),
      lastName: String(formData.get('lastName') || ''),
      engagement: String(formData.get('engagement') || ''),
      jobTitle: String(formData.get('jobTitle') || ''),
      email: String(formData.get('email') || ''),
      phone: String(formData.get('phone') || ''),
      city: String(formData.get('city') || ''),
      startedOn: String(formData.get('startedOn') || '')
    };

    try {
      const response = await fetch('/api/gestion/equipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(data.error || 'Une erreur est survenue.');
        return;
      }
      formEl.reset();
      setShowForm(false);
      router.refresh();
      setMembers((prev) => [
        {
          id: data.id,
          firstName: payload.firstName,
          lastName: payload.lastName,
          engagement: payload.engagement,
          jobTitle: payload.jobTitle || null,
          email: payload.email || null,
          phone: payload.phone || null,
          isActive: true
        },
        ...prev
      ]);
    } catch {
      setError('Une erreur est survenue. Merci de réessayer.');
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-8">
      {canManage && (
        <div>
          <button
            type="button"
            onClick={() => setShowForm((v) => !v)}
            className="rounded-full bg-ol-ember-ink px-6 py-3 text-sm font-bold text-ol-white transition-opacity hover:opacity-90"
          >
            {showForm ? 'Annuler' : 'Nouvelle personne'}
          </button>
        </div>
      )}

      {canManage && showForm && (
        <section className="rounded-xl border border-ol-line bg-ol-white p-6">
          <h2 className="text-lg font-black text-ol-charcoal">Nouvelle personne</h2>
          <form onSubmit={handleSubmit} className="mt-4 grid gap-4 sm:grid-cols-2" noValidate>
            <div>
              <label htmlFor={`${id}-firstName`} className="mb-1.5 block text-sm font-bold text-ol-charcoal">
                Prénom
              </label>
              <input
                id={`${id}-firstName`}
                name="firstName"
                required
                maxLength={80}
                className="w-full rounded-lg border border-ol-line-strong bg-ol-white px-4 py-2.5 text-[0.95rem] focus:border-ol-ember focus:outline-none focus:ring-2 focus:ring-ol-ember/30"
              />
            </div>
            <div>
              <label htmlFor={`${id}-lastName`} className="mb-1.5 block text-sm font-bold text-ol-charcoal">
                Nom
              </label>
              <input
                id={`${id}-lastName`}
                name="lastName"
                required
                maxLength={80}
                className="w-full rounded-lg border border-ol-line-strong bg-ol-white px-4 py-2.5 text-[0.95rem] focus:border-ol-ember focus:outline-none focus:ring-2 focus:ring-ol-ember/30"
              />
            </div>
            <div>
              <label htmlFor={`${id}-engagement`} className="mb-1.5 block text-sm font-bold text-ol-charcoal">
                Type d&apos;engagement
              </label>
              <select
                id={`${id}-engagement`}
                name="engagement"
                required
                defaultValue=""
                className="w-full rounded-lg border border-ol-line-strong bg-ol-white px-4 py-2.5 text-[0.95rem] focus:border-ol-ember focus:outline-none focus:ring-2 focus:ring-ol-ember/30"
              >
                <option value="" disabled>
                  Choisir…
                </option>
                {Object.entries(ENGAGEMENT_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor={`${id}-jobTitle`} className="mb-1.5 block text-sm font-bold text-ol-charcoal">
                Fonction <span className="font-normal text-ol-muted">(facultatif)</span>
              </label>
              <input
                id={`${id}-jobTitle`}
                name="jobTitle"
                maxLength={120}
                className="w-full rounded-lg border border-ol-line-strong bg-ol-white px-4 py-2.5 text-[0.95rem] focus:border-ol-ember focus:outline-none focus:ring-2 focus:ring-ol-ember/30"
              />
            </div>
            <div>
              <label htmlFor={`${id}-email`} className="mb-1.5 block text-sm font-bold text-ol-charcoal">
                E-mail <span className="font-normal text-ol-muted">(facultatif)</span>
              </label>
              <input
                id={`${id}-email`}
                name="email"
                type="email"
                maxLength={180}
                className="w-full rounded-lg border border-ol-line-strong bg-ol-white px-4 py-2.5 text-[0.95rem] focus:border-ol-ember focus:outline-none focus:ring-2 focus:ring-ol-ember/30"
              />
            </div>
            <div>
              <label htmlFor={`${id}-phone`} className="mb-1.5 block text-sm font-bold text-ol-charcoal">
                Téléphone <span className="font-normal text-ol-muted">(facultatif)</span>
              </label>
              <input
                id={`${id}-phone`}
                name="phone"
                maxLength={40}
                className="w-full rounded-lg border border-ol-line-strong bg-ol-white px-4 py-2.5 text-[0.95rem] focus:border-ol-ember focus:outline-none focus:ring-2 focus:ring-ol-ember/30"
              />
            </div>
            <div>
              <label htmlFor={`${id}-city`} className="mb-1.5 block text-sm font-bold text-ol-charcoal">
                Ville <span className="font-normal text-ol-muted">(facultatif)</span>
              </label>
              <input
                id={`${id}-city`}
                name="city"
                maxLength={80}
                placeholder="Ex. : Kinshasa"
                className="w-full rounded-lg border border-ol-line-strong bg-ol-white px-4 py-2.5 text-[0.95rem] focus:border-ol-ember focus:outline-none focus:ring-2 focus:ring-ol-ember/30"
              />
            </div>
            <div>
              <label htmlFor={`${id}-startedOn`} className="mb-1.5 block text-sm font-bold text-ol-charcoal">
                Date de début <span className="font-normal text-ol-muted">(facultatif)</span>
              </label>
              <input
                id={`${id}-startedOn`}
                name="startedOn"
                type="date"
                className="w-full rounded-lg border border-ol-line-strong bg-ol-white px-4 py-2.5 text-[0.95rem] focus:border-ol-ember focus:outline-none focus:ring-2 focus:ring-ol-ember/30"
              />
            </div>

            {error && (
              <p role="alert" className="sm:col-span-2 text-sm font-bold text-ol-ember-ink">
                {error}
              </p>
            )}

            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={pending}
                className="rounded-full bg-ol-ember-ink px-6 py-3 text-sm font-bold text-ol-white transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {pending ? 'Enregistrement…' : 'Enregistrer'}
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="overflow-x-auto rounded-xl border border-ol-line bg-ol-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-ol-line text-xs font-bold uppercase tracking-[0.1em] text-ol-muted">
              <th className="px-4 py-3">Nom</th>
              <th className="px-4 py-3">Engagement</th>
              <th className="px-4 py-3">Fonction</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id} className="border-b border-ol-line last:border-0">
                <td className="px-4 py-3 font-bold text-ol-charcoal">
                  {member.firstName} {member.lastName}
                </td>
                <td className="px-4 py-3 text-ol-ink">{ENGAGEMENT_LABELS[member.engagement] ?? member.engagement}</td>
                <td className="px-4 py-3 text-ol-ink">{member.jobTitle ?? '—'}</td>
                <td className="px-4 py-3 text-ol-muted">{member.email ?? member.phone ?? '—'}</td>
                <td className="px-4 py-3">
                  <span
                    className={
                      member.isActive
                        ? 'rounded-full bg-ol-charcoal/10 px-2.5 py-1 text-xs font-bold text-ol-charcoal'
                        : 'rounded-full bg-ol-line px-2.5 py-1 text-xs font-bold text-ol-muted'
                    }
                  >
                    {member.isActive ? 'Actif' : 'Parti'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/gestion/equipe/${member.id}`} className="text-sm font-bold text-ol-ember-ink hover:underline">
                    Ouvrir
                  </Link>
                </td>
              </tr>
            ))}
            {members.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-ol-muted">
                  Aucune personne enregistrée.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
