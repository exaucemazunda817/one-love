'use client';

import { useId, useState } from 'react';
import { useRouter } from 'next/navigation';

type Kind = 'INCOME' | 'EXPENSE';

interface CategoryRow {
  id: string;
  code: string;
  label: string;
  kind: Kind;
  parentId: string | null;
  isActive: boolean;
}

export function CategoriesManager({ initialCategories }: { initialCategories: CategoryRow[] }) {
  const router = useRouter();
  const id = useId();
  const [categories, setCategories] = useState(initialCategories);
  const [kind, setKind] = useState<Kind>('EXPENSE');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const topLevelOfKind = categories.filter((c) => !c.parentId && c.kind === kind);

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);

    const formEl = event.currentTarget;
    const formData = new FormData(formEl);
    const payload = {
      code: String(formData.get('code') || ''),
      label: String(formData.get('label') || ''),
      kind,
      parentId: String(formData.get('parentId') || '')
    };

    try {
      const response = await fetch('/api/gestion/comptabilite/categories', {
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
      router.refresh();
      setCategories((prev) => [
        ...prev,
        {
          id: data.id,
          code: payload.code.toUpperCase(),
          label: payload.label,
          kind,
          parentId: payload.parentId || null,
          isActive: true
        }
      ]);
    } catch {
      setError('Une erreur est survenue. Merci de réessayer.');
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-8">
      <section className="rounded-xl border border-ol-line bg-ol-white p-6">
        <h2 className="text-lg font-black text-ol-charcoal">Ajouter une catégorie</h2>
        <div role="radiogroup" aria-label="Type" className="mt-4 inline-flex rounded-full border border-ol-line-strong p-1">
          {(['EXPENSE', 'INCOME'] as const).map((option) => (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={kind === option}
              onClick={() => setKind(option)}
              className={`rounded-full px-5 py-2 text-sm font-bold transition-colors ${
                kind === option ? 'bg-ol-ember-ink text-ol-white' : 'text-ol-charcoal hover:text-ol-ember-ink'
              }`}
            >
              {option === 'EXPENSE' ? 'Dépense' : 'Recette'}
            </button>
          ))}
        </div>

        <form onSubmit={handleCreate} className="mt-5 grid gap-4 sm:grid-cols-2" noValidate>
          <div>
            <label htmlFor={`${id}-code`} className="mb-1.5 block text-sm font-bold text-ol-charcoal">
              Code
            </label>
            <input
              id={`${id}-code`}
              name="code"
              required
              maxLength={30}
              placeholder="Ex. : SALAIRES, MATERIEL_PEDA"
              className="w-full rounded-lg border border-ol-line-strong bg-ol-white px-4 py-2.5 text-[0.95rem] uppercase focus:border-ol-ember focus:outline-none focus:ring-2 focus:ring-ol-ember/30"
            />
          </div>
          <div>
            <label htmlFor={`${id}-label`} className="mb-1.5 block text-sm font-bold text-ol-charcoal">
              Libellé
            </label>
            <input
              id={`${id}-label`}
              name="label"
              required
              maxLength={120}
              placeholder="Ex. : Salaires et rémunérations"
              className="w-full rounded-lg border border-ol-line-strong bg-ol-white px-4 py-2.5 text-[0.95rem] focus:border-ol-ember focus:outline-none focus:ring-2 focus:ring-ol-ember/30"
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor={`${id}-parent`} className="mb-1.5 block text-sm font-bold text-ol-charcoal">
              Catégorie parente <span className="font-normal text-ol-muted">(facultatif, un seul niveau)</span>
            </label>
            <select
              id={`${id}-parent`}
              name="parentId"
              defaultValue=""
              className="w-full max-w-sm rounded-lg border border-ol-line-strong bg-ol-white px-4 py-2.5 text-[0.95rem] focus:border-ol-ember focus:outline-none focus:ring-2 focus:ring-ol-ember/30"
            >
              <option value="">Aucune — catégorie principale</option>
              {topLevelOfKind.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
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
              {pending ? 'Création…' : 'Ajouter la catégorie'}
            </button>
          </div>
        </form>
      </section>

      <section className="grid gap-6 sm:grid-cols-2">
        {(['EXPENSE', 'INCOME'] as const).map((section) => (
          <div key={section} className="rounded-xl border border-ol-line bg-ol-white p-6">
            <h3 className="text-sm font-bold uppercase tracking-[0.1em] text-ol-muted">
              {section === 'EXPENSE' ? 'Dépenses' : 'Recettes'}
            </h3>
            <ul className="mt-3 space-y-2">
              {categories
                .filter((c) => c.kind === section)
                .map((cat) => (
                  <li key={cat.id} className="text-sm text-ol-ink">
                    {cat.parentId && <span className="text-ol-muted">↳ </span>}
                    <span className="font-bold">{cat.label}</span>{' '}
                    <span className="text-ol-muted">({cat.code})</span>
                  </li>
                ))}
              {categories.filter((c) => c.kind === section).length === 0 && (
                <li className="text-sm text-ol-muted">Aucune catégorie.</li>
              )}
            </ul>
          </div>
        ))}
      </section>
    </div>
  );
}
