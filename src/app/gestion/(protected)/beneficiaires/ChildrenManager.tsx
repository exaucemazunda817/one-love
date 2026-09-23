'use client';

import { useId, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ChildRow {
  id: string;
  referenceCode: string;
  firstName: string;
  lastNameInitial: string | null;
  status: string;
  firstContactOn: string;
  neighbourhood: string | null;
}

const STATUS_LABELS: Record<string, string> = {
  FIRST_CONTACT: 'Premier contact',
  ACTIVE_FOLLOW_UP: 'Suivi actif',
  IN_REINTEGRATION: 'En réinsertion',
  EXITED_POSITIVE: 'Sortie positive',
  LOST_CONTACT: 'Perdu de vue',
  ARCHIVED: 'Archivé'
};

export function ChildrenManager({
  initialChildren,
  projects
}: {
  initialChildren: ChildRow[];
  projects: { id: string; name: string }[];
}) {
  const id = useId();
  const router = useRouter();
  const [children, setChildren] = useState(initialChildren);
  const [showForm, setShowForm] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);

    const formEl = event.currentTarget;
    const formData = new FormData(formEl);
    const birthYear = String(formData.get('birthYear') || '');
    const estimatedAge = String(formData.get('estimatedAge') || '');
    const payload = {
      firstName: String(formData.get('firstName') || ''),
      lastNameInitial: String(formData.get('lastNameInitial') || ''),
      sex: String(formData.get('sex') || ''),
      birthYear: birthYear ? Number(birthYear) : null,
      estimatedAge: estimatedAge ? Number(estimatedAge) : null,
      neighbourhood: String(formData.get('neighbourhood') || ''),
      firstContactOn: String(formData.get('firstContactOn') || '')
    };

    try {
      const response = await fetch('/api/gestion/enfants', {
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
      setChildren((prev) => [
        {
          id: data.id,
          referenceCode: data.referenceCode,
          firstName: payload.firstName,
          lastNameInitial: payload.lastNameInitial || null,
          status: 'FIRST_CONTACT',
          firstContactOn: new Date(payload.firstContactOn).toISOString(),
          neighbourhood: payload.neighbourhood || null
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
      <div>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="rounded-full bg-ol-ember-ink px-6 py-3 text-sm font-bold text-ol-white transition-opacity hover:opacity-90"
        >
          {showForm ? 'Annuler' : 'Nouveau premier contact'}
        </button>
      </div>

      {showForm && (
        <section className="rounded-xl border border-ol-line bg-ol-white p-6">
          <h2 className="text-lg font-black text-ol-charcoal">Nouvel enfant</h2>
          <p className="mt-1 text-sm text-ol-muted">
            Le nom de famille complet et l&apos;adresse précise ne sont jamais demandés.
          </p>
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
              <label htmlFor={`${id}-lastNameInitial`} className="mb-1.5 block text-sm font-bold text-ol-charcoal">
                Initiale du nom <span className="font-normal text-ol-muted">(facultatif)</span>
              </label>
              <input
                id={`${id}-lastNameInitial`}
                name="lastNameInitial"
                maxLength={1}
                placeholder="Ex. : K."
                className="w-full rounded-lg border border-ol-line-strong bg-ol-white px-4 py-2.5 text-[0.95rem] focus:border-ol-ember focus:outline-none focus:ring-2 focus:ring-ol-ember/30"
              />
            </div>
            <div>
              <label htmlFor={`${id}-sex`} className="mb-1.5 block text-sm font-bold text-ol-charcoal">
                Sexe <span className="font-normal text-ol-muted">(facultatif)</span>
              </label>
              <select
                id={`${id}-sex`}
                name="sex"
                defaultValue=""
                className="w-full rounded-lg border border-ol-line-strong bg-ol-white px-4 py-2.5 text-[0.95rem] focus:border-ol-ember focus:outline-none focus:ring-2 focus:ring-ol-ember/30"
              >
                <option value="">Non précisé</option>
                <option value="F">F</option>
                <option value="M">M</option>
              </select>
            </div>
            <div>
              <label htmlFor={`${id}-firstContactOn`} className="mb-1.5 block text-sm font-bold text-ol-charcoal">
                Date du premier contact
              </label>
              <input
                id={`${id}-firstContactOn`}
                name="firstContactOn"
                type="date"
                required
                defaultValue={new Date().toISOString().slice(0, 10)}
                className="w-full rounded-lg border border-ol-line-strong bg-ol-white px-4 py-2.5 text-[0.95rem] focus:border-ol-ember focus:outline-none focus:ring-2 focus:ring-ol-ember/30"
              />
            </div>
            <div>
              <label htmlFor={`${id}-birthYear`} className="mb-1.5 block text-sm font-bold text-ol-charcoal">
                Année de naissance <span className="font-normal text-ol-muted">(si connue)</span>
              </label>
              <input
                id={`${id}-birthYear`}
                name="birthYear"
                type="number"
                min={new Date().getFullYear() - 25}
                max={new Date().getFullYear()}
                className="w-full rounded-lg border border-ol-line-strong bg-ol-white px-4 py-2.5 text-[0.95rem] focus:border-ol-ember focus:outline-none focus:ring-2 focus:ring-ol-ember/30"
              />
            </div>
            <div>
              <label htmlFor={`${id}-estimatedAge`} className="mb-1.5 block text-sm font-bold text-ol-charcoal">
                Âge estimé <span className="font-normal text-ol-muted">(si l&apos;année est inconnue)</span>
              </label>
              <input
                id={`${id}-estimatedAge`}
                name="estimatedAge"
                type="number"
                min={0}
                max={25}
                className="w-full rounded-lg border border-ol-line-strong bg-ol-white px-4 py-2.5 text-[0.95rem] focus:border-ol-ember focus:outline-none focus:ring-2 focus:ring-ol-ember/30"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor={`${id}-neighbourhood`} className="mb-1.5 block text-sm font-bold text-ol-charcoal">
                Quartier <span className="font-normal text-ol-muted">(jamais une adresse précise)</span>
              </label>
              <input
                id={`${id}-neighbourhood`}
                name="neighbourhood"
                maxLength={80}
                className="w-full max-w-sm rounded-lg border border-ol-line-strong bg-ol-white px-4 py-2.5 text-[0.95rem] focus:border-ol-ember focus:outline-none focus:ring-2 focus:ring-ol-ember/30"
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
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-ol-line text-xs font-bold uppercase tracking-[0.1em] text-ol-muted">
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Prénom</th>
              <th className="px-4 py-3">Quartier</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3">Premier contact</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {children.map((child) => (
              <tr key={child.id} className="border-b border-ol-line last:border-0">
                <td className="px-4 py-3 font-mono text-xs text-ol-muted">{child.referenceCode}</td>
                <td className="px-4 py-3 font-bold text-ol-charcoal">
                  {child.firstName} {child.lastNameInitial ? `${child.lastNameInitial}.` : ''}
                </td>
                <td className="px-4 py-3 text-ol-ink">{child.neighbourhood ?? '—'}</td>
                <td className="px-4 py-3 text-ol-ink">{STATUS_LABELS[child.status] ?? child.status}</td>
                <td className="px-4 py-3 text-ol-muted">
                  {new Date(child.firstContactOn).toLocaleDateString('fr-FR', { timeZone: 'UTC' })}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/gestion/beneficiaires/${child.id}`}
                    className="text-sm font-bold text-ol-ember-ink hover:underline"
                  >
                    Ouvrir
                  </Link>
                </td>
              </tr>
            ))}
            {children.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-ol-muted">
                  Aucun enfant enregistré.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
