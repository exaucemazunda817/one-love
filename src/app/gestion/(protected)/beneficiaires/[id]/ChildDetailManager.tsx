'use client';

import { useId, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface Enrollment {
  id: string;
  projectName: string;
  enrolledOn: string;
  endedOn: string | null;
}
interface CareEvent {
  id: string;
  kind: string;
  occurredOn: string;
  providerName: string | null;
  costAmount: string | null;
  costCurrency: string | null;
}
interface Consent {
  id: string;
  scope: string;
  status: string;
  signedByName: string | null;
  signedOn: string | null;
}
interface ChildDetail {
  id: string;
  referenceCode: string;
  firstName: string;
  lastNameInitial: string | null;
  sex: string | null;
  birthYear: number | null;
  estimatedAge: number | null;
  neighbourhood: string | null;
  status: string;
  firstContactOn: string;
  enrollments: Enrollment[];
  careEvents: CareEvent[];
  consents: Consent[];
}

const CARE_LABELS: Record<string, string> = {
  MEAL: 'Repas',
  HYGIENE: 'Hygiène',
  MEDICAL_CONSULTATION: 'Consultation médicale',
  VACCINATION: 'Vaccination',
  PSYCHOSOCIAL_INTERVIEW: 'Entretien psychosocial',
  WORKSHOP: 'Atelier',
  SCHOOLING: 'Scolarisation',
  OTHER: 'Autre'
};
const SCOPE_LABELS: Record<string, string> = {
  WEBSITE: 'Site web',
  SOCIAL_MEDIA: 'Réseaux sociaux',
  DONOR_REPORTS: 'Rapports aux donateurs',
  INTERNAL_ONLY: 'Usage interne uniquement'
};
const CONSENT_STATUS_LABELS: Record<string, string> = {
  GRANTED: 'Accordé',
  REFUSED: 'Refusé',
  WITHDRAWN: 'Retiré',
  NOT_COLLECTED: 'Non recueilli'
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', { timeZone: 'UTC' });
}

export function ChildDetailManager({
  child,
  projects
}: {
  child: ChildDetail;
  projects: { id: string; name: string }[];
}) {
  const [enrollments, setEnrollments] = useState(child.enrollments);
  const [careEvents, setCareEvents] = useState(child.careEvents);
  const [consents, setConsents] = useState(child.consents);

  return (
    <div className="space-y-8">
      <Link
        href="/gestion/beneficiaires"
        className="inline-flex items-center gap-1.5 text-sm font-bold text-ol-muted hover:text-ol-ember-ink"
      >
        <ArrowLeft size={15} aria-hidden />
        Retour à la liste
      </Link>

      <div>
        <p className="font-mono text-xs text-ol-muted">{child.referenceCode}</p>
        <h1 className="text-2xl font-black text-ol-charcoal">
          {child.firstName} {child.lastNameInitial ? `${child.lastNameInitial}.` : ''}
        </h1>
        <dl className="mt-3 flex flex-wrap gap-x-8 gap-y-1 text-sm text-ol-muted">
          {child.sex && <div>Sexe : {child.sex}</div>}
          {child.birthYear && <div>Né(e) en {child.birthYear}</div>}
          {child.estimatedAge && <div>Âge estimé : {child.estimatedAge} ans</div>}
          {child.neighbourhood && <div>Quartier : {child.neighbourhood}</div>}
          <div>Premier contact : {formatDate(child.firstContactOn)}</div>
        </dl>
      </div>

      <EnrollmentsSection childId={child.id} projects={projects} enrollments={enrollments} onAdd={(e) => setEnrollments((prev) => [e, ...prev])} />
      <CareEventsSection childId={child.id} careEvents={careEvents} onAdd={(e) => setCareEvents((prev) => [e, ...prev])} />
      <ConsentsSection childId={child.id} consents={consents} onUpdate={(c) => setConsents((prev) => {
        const others = prev.filter((x) => x.scope !== c.scope);
        return [...others, c];
      })} />
    </div>
  );
}

function EnrollmentsSection({
  childId,
  projects,
  enrollments,
  onAdd
}: {
  childId: string;
  projects: { id: string; name: string }[];
  enrollments: Enrollment[];
  onAdd: (e: Enrollment) => void;
}) {
  const id = useId();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    const formEl = event.currentTarget;
    const formData = new FormData(formEl);
    const projectId = String(formData.get('projectId') || '');
    const enrolledOn = String(formData.get('enrolledOn') || '');

    try {
      const response = await fetch(`/api/gestion/enfants/${childId}/inscriptions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, enrolledOn })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(data.error || 'Une erreur est survenue.');
        return;
      }
      formEl.reset();
      onAdd({
        id: data.id,
        projectName: projects.find((p) => p.id === projectId)?.name ?? '',
        enrolledOn: new Date(enrolledOn).toISOString(),
        endedOn: null
      });
    } catch {
      setError('Une erreur est survenue.');
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="rounded-xl border border-ol-line bg-ol-white p-6">
      <h2 className="text-lg font-black text-ol-charcoal">Inscriptions aux projets</h2>
      <ul className="mt-3 space-y-1.5">
        {enrollments.map((e) => (
          <li key={e.id} className="text-sm text-ol-ink">
            <span className="font-bold">{e.projectName}</span> — depuis le {formatDate(e.enrolledOn)}
            {e.endedOn ? ` (terminé le ${formatDate(e.endedOn)})` : ''}
          </li>
        ))}
        {enrollments.length === 0 && <li className="text-sm text-ol-muted">Aucune inscription.</li>}
      </ul>

      <form onSubmit={handleSubmit} className="mt-5 flex flex-wrap items-end gap-3" noValidate>
        <div>
          <label htmlFor={`${id}-project`} className="mb-1.5 block text-xs font-bold text-ol-charcoal">
            Projet
          </label>
          <select
            id={`${id}-project`}
            name="projectId"
            required
            defaultValue=""
            className="rounded-lg border border-ol-line-strong bg-ol-white px-3 py-2 text-sm"
          >
            <option value="" disabled>
              Choisir…
            </option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={`${id}-date`} className="mb-1.5 block text-xs font-bold text-ol-charcoal">
            Date
          </label>
          <input
            id={`${id}-date`}
            name="enrolledOn"
            type="date"
            required
            defaultValue={new Date().toISOString().slice(0, 10)}
            className="rounded-lg border border-ol-line-strong bg-ol-white px-3 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-ol-ember-ink px-5 py-2.5 text-sm font-bold text-ol-white hover:opacity-90 disabled:opacity-60"
        >
          {pending ? '…' : 'Inscrire'}
        </button>
        {error && <p role="alert" className="w-full text-sm font-bold text-ol-ember-ink">{error}</p>}
      </form>
    </section>
  );
}

function CareEventsSection({
  childId,
  careEvents,
  onAdd
}: {
  childId: string;
  careEvents: CareEvent[];
  onAdd: (e: CareEvent) => void;
}) {
  const id = useId();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    const formEl = event.currentTarget;
    const formData = new FormData(formEl);
    const payload = {
      kind: String(formData.get('kind') || 'OTHER'),
      occurredOn: String(formData.get('occurredOn') || ''),
      providerName: String(formData.get('providerName') || ''),
      costAmount: String(formData.get('costAmount') || ''),
      costCurrency: String(formData.get('costCurrency') || 'CDF')
    };

    try {
      const response = await fetch(`/api/gestion/enfants/${childId}/prestations`, {
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
      onAdd({
        id: data.id,
        kind: payload.kind,
        occurredOn: new Date(payload.occurredOn).toISOString(),
        providerName: payload.providerName || null,
        costAmount: payload.costAmount || null,
        costCurrency: payload.costAmount ? payload.costCurrency : null
      });
    } catch {
      setError('Une erreur est survenue.');
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="rounded-xl border border-ol-line bg-ol-white p-6">
      <h2 className="text-lg font-black text-ol-charcoal">Prestations</h2>
      <p className="mt-1 text-xs text-ol-muted">
        Trace qu&apos;une prestation a eu lieu — jamais un diagnostic ni un compte rendu.
      </p>
      <ul className="mt-3 space-y-1.5">
        {careEvents.map((c) => (
          <li key={c.id} className="text-sm text-ol-ink">
            <span className="font-bold">{CARE_LABELS[c.kind] ?? c.kind}</span> — {formatDate(c.occurredOn)}
            {c.providerName ? ` · ${c.providerName}` : ''}
            {c.costAmount ? ` · ${Number(c.costAmount).toLocaleString('fr-FR')} ${c.costCurrency}` : ''}
          </li>
        ))}
        {careEvents.length === 0 && <li className="text-sm text-ol-muted">Aucune prestation enregistrée.</li>}
      </ul>

      <form onSubmit={handleSubmit} className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5" noValidate>
        <div>
          <label htmlFor={`${id}-kind`} className="mb-1.5 block text-xs font-bold text-ol-charcoal">
            Type
          </label>
          <select
            id={`${id}-kind`}
            name="kind"
            defaultValue="MEAL"
            className="w-full rounded-lg border border-ol-line-strong bg-ol-white px-3 py-2 text-sm"
          >
            {Object.entries(CARE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={`${id}-date`} className="mb-1.5 block text-xs font-bold text-ol-charcoal">
            Date
          </label>
          <input
            id={`${id}-date`}
            name="occurredOn"
            type="date"
            required
            defaultValue={new Date().toISOString().slice(0, 10)}
            className="w-full rounded-lg border border-ol-line-strong bg-ol-white px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor={`${id}-provider`} className="mb-1.5 block text-xs font-bold text-ol-charcoal">
            Prestataire <span className="text-ol-muted">(facultatif)</span>
          </label>
          <input
            id={`${id}-provider`}
            name="providerName"
            maxLength={120}
            className="w-full rounded-lg border border-ol-line-strong bg-ol-white px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor={`${id}-cost`} className="mb-1.5 block text-xs font-bold text-ol-charcoal">
            Coût <span className="text-ol-muted">(facultatif)</span>
          </label>
          <input
            id={`${id}-cost`}
            name="costAmount"
            inputMode="decimal"
            placeholder="0"
            className="w-full rounded-lg border border-ol-line-strong bg-ol-white px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor={`${id}-currency`} className="mb-1.5 block text-xs font-bold text-ol-charcoal">
            Devise
          </label>
          <select
            id={`${id}-currency`}
            name="costCurrency"
            defaultValue="CDF"
            className="w-full rounded-lg border border-ol-line-strong bg-ol-white px-3 py-2 text-sm"
          >
            <option value="CDF">CDF</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
        </div>
        {error && <p role="alert" className="lg:col-span-5 text-sm font-bold text-ol-ember-ink">{error}</p>}
        <div className="lg:col-span-5">
          <button
            type="submit"
            disabled={pending}
            className="rounded-full bg-ol-ember-ink px-5 py-2.5 text-sm font-bold text-ol-white hover:opacity-90 disabled:opacity-60"
          >
            {pending ? 'Enregistrement…' : 'Enregistrer la prestation'}
          </button>
        </div>
      </form>
    </section>
  );
}

function ConsentsSection({
  childId,
  consents,
  onUpdate
}: {
  childId: string;
  consents: Consent[];
  onUpdate: (c: Consent) => void;
}) {
  const id = useId();
  const [busyScope, setBusyScope] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const scopes = ['WEBSITE', 'SOCIAL_MEDIA', 'DONOR_REPORTS', 'INTERNAL_ONLY'] as const;

  async function setConsent(scope: string, status: string, signedByName: string, signedOn: string) {
    setBusyScope(scope);
    setError(null);
    try {
      const response = await fetch(`/api/gestion/enfants/${childId}/consentements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scope, status, signedByName, signedByRole: '', signedOn })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(data.error || 'Une erreur est survenue.');
        return;
      }
      onUpdate({ id: data.id, scope, status: data.status, signedByName: signedByName || null, signedOn: signedOn || null });
    } catch {
      setError('Une erreur est survenue.');
    } finally {
      setBusyScope(null);
    }
  }

  return (
    <section className="rounded-xl border border-ol-line bg-ol-white p-6">
      <h2 className="text-lg font-black text-ol-charcoal">Consentement à l&apos;image</h2>
      <p className="mt-1 text-xs text-ol-muted">
        Aucune photo n&apos;est publiable sans un consentement « Accordé » et non retiré.
      </p>
      {error && <p role="alert" className="mt-2 text-sm font-bold text-ol-ember-ink">{error}</p>}

      <div className="mt-4 space-y-4">
        {scopes.map((scope) => {
          const current = consents.find((c) => c.scope === scope);
          return (
            <div key={scope} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-ol-line p-4">
              <div>
                <p className="text-sm font-bold text-ol-charcoal">{SCOPE_LABELS[scope]}</p>
                <p className="text-xs text-ol-muted">
                  {current ? CONSENT_STATUS_LABELS[current.status] : 'Non recueilli'}
                  {current?.signedByName ? ` · signé par ${current.signedByName}` : ''}
                </p>
              </div>
              <form
                className="flex flex-wrap items-center gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.currentTarget;
                  const formData = new FormData(form);
                  setConsent(
                    scope,
                    'GRANTED',
                    String(formData.get(`${id}-name-${scope}`) || ''),
                    new Date().toISOString().slice(0, 10)
                  );
                }}
              >
                <input
                  name={`${id}-name-${scope}`}
                  placeholder="Nom du représentant légal"
                  maxLength={120}
                  className="rounded-lg border border-ol-line-strong bg-ol-white px-3 py-1.5 text-xs"
                />
                <button
                  type="submit"
                  disabled={busyScope === scope}
                  className="rounded-full border border-ol-line-strong px-3 py-1.5 text-xs font-bold text-ol-charcoal hover:border-ol-ember-ink disabled:opacity-60"
                >
                  Accordé
                </button>
              </form>
              <button
                type="button"
                disabled={busyScope === scope}
                onClick={() => setConsent(scope, 'REFUSED', '', '')}
                className="rounded-full border border-ol-line-strong px-3 py-1.5 text-xs font-bold text-ol-charcoal hover:border-ol-ember-ink disabled:opacity-60"
              >
                Refusé
              </button>
              {current?.status === 'GRANTED' && (
                <button
                  type="button"
                  disabled={busyScope === scope}
                  onClick={() => setConsent(scope, 'WITHDRAWN', '', '')}
                  className="rounded-full border border-ol-line-strong px-3 py-1.5 text-xs font-bold text-ol-ember-ink hover:border-ol-ember disabled:opacity-60"
                >
                  Retirer
                </button>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
