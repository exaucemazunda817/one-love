'use client';

import { useId, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Copy, Check } from 'lucide-react';

type Role = 'DIRECTION' | 'COMPTABLE' | 'TERRAIN' | 'RH' | 'LECTURE';
type Status = 'ACTIVE' | 'SUSPENDED';

interface UserRow {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  status: Status;
  lastLoginAt: string | null;
  mustChangePassword: boolean;
  createdAt: string;
}

const ROLE_LABELS: Record<Role, string> = {
  DIRECTION: 'Direction',
  COMPTABLE: 'Comptable',
  TERRAIN: 'Terrain',
  RH: 'RH',
  LECTURE: 'Lecture'
};
const ROLES: Role[] = ['DIRECTION', 'COMPTABLE', 'TERRAIN', 'RH', 'LECTURE'];

export function AccountsManager({
  initialUsers,
  currentUserId
}: {
  initialUsers: UserRow[];
  currentUserId: string;
}) {
  const router = useRouter();
  const id = useId();
  const [users, setUsers] = useState(initialUsers);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [newAccount, setNewAccount] = useState<{ email: string; temporaryPassword: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCreating(true);
    setCreateError(null);
    setNewAccount(null);

    const formEl = event.currentTarget;
    const formData = new FormData(formEl);
    const payload = {
      email: String(formData.get('email') || ''),
      firstName: String(formData.get('firstName') || ''),
      lastName: String(formData.get('lastName') || ''),
      role: String(formData.get('role') || 'LECTURE')
    };

    try {
      const response = await fetch('/api/gestion/comptes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setCreateError(data.error || 'Une erreur est survenue.');
        return;
      }

      setNewAccount({ email: data.email, temporaryPassword: data.temporaryPassword });
      formEl.reset();
      router.refresh();
      setUsers((prev) => [
        ...prev,
        {
          id: data.id,
          email: payload.email,
          firstName: payload.firstName,
          lastName: payload.lastName,
          role: payload.role as Role,
          status: 'ACTIVE',
          lastLoginAt: null,
          mustChangePassword: true,
          createdAt: "à l'instant"
        }
      ]);
    } catch {
      setCreateError('Une erreur est survenue. Merci de réessayer.');
    } finally {
      setCreating(false);
    }
  }

  async function toggleStatus(user: UserRow) {
    setBusyId(user.id);
    setActionError(null);
    const nextStatus: Status = user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      const response = await fetch(`/api/gestion/comptes/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setActionError(data.error || 'Action refusée.');
        return;
      }
      setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, status: nextStatus } : u)));
    } catch {
      setActionError('Une erreur est survenue.');
    } finally {
      setBusyId(null);
    }
  }

  async function copyPassword() {
    if (!newAccount) return;
    try {
      await navigator.clipboard.writeText(newAccount.temporaryPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Le presse-papiers peut être refusé par le navigateur : le mot de
      // passe reste affiché à l'écran, la copie manuelle marche toujours.
    }
  }

  return (
    <div className="space-y-8">
      <section className="rounded-xl border border-ol-line bg-ol-white p-6">
        <h2 className="text-lg font-black text-ol-charcoal">Créer un compte</h2>
        <form onSubmit={handleCreate} className="mt-4 grid gap-4 sm:grid-cols-2" noValidate>
          <div>
            <label htmlFor={`${id}-firstName`} className="mb-1.5 block text-sm font-bold text-ol-charcoal">
              Prénom
            </label>
            <input
              id={`${id}-firstName`}
              name="firstName"
              required
              maxLength={120}
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
              maxLength={120}
              className="w-full rounded-lg border border-ol-line-strong bg-ol-white px-4 py-2.5 text-[0.95rem] focus:border-ol-ember focus:outline-none focus:ring-2 focus:ring-ol-ember/30"
            />
          </div>
          <div>
            <label htmlFor={`${id}-email`} className="mb-1.5 block text-sm font-bold text-ol-charcoal">
              E-mail
            </label>
            <input
              id={`${id}-email`}
              name="email"
              type="email"
              required
              maxLength={180}
              className="w-full rounded-lg border border-ol-line-strong bg-ol-white px-4 py-2.5 text-[0.95rem] focus:border-ol-ember focus:outline-none focus:ring-2 focus:ring-ol-ember/30"
            />
          </div>
          <div>
            <label htmlFor={`${id}-role`} className="mb-1.5 block text-sm font-bold text-ol-charcoal">
              Rôle
            </label>
            <select
              id={`${id}-role`}
              name="role"
              defaultValue="LECTURE"
              className="w-full rounded-lg border border-ol-line-strong bg-ol-white px-4 py-2.5 text-[0.95rem] focus:border-ol-ember focus:outline-none focus:ring-2 focus:ring-ol-ember/30"
            >
              {ROLES.map((role) => (
                <option key={role} value={role}>
                  {ROLE_LABELS[role]}
                </option>
              ))}
            </select>
          </div>

          {createError && (
            <p role="alert" className="sm:col-span-2 text-sm font-bold text-ol-ember-ink">
              {createError}
            </p>
          )}

          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={creating}
              className="rounded-full bg-ol-ember-ink px-6 py-3 text-sm font-bold text-ol-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {creating ? 'Création…' : 'Créer le compte'}
            </button>
          </div>
        </form>

        {newAccount && (
          <div className="mt-5 rounded-xl border border-ol-ember bg-ol-cream p-5">
            <p className="text-sm font-bold text-ol-charcoal">
              Compte créé pour {newAccount.email}. Communiquez ce mot de passe provisoire de
              vive voix ou par un canal sûr — il ne sera plus affiché ensuite.
            </p>
            <div className="mt-3 flex items-center gap-2">
              <code className="rounded-lg bg-ol-white px-4 py-2.5 font-mono text-[0.95rem] font-bold tracking-wide text-ol-charcoal">
                {newAccount.temporaryPassword}
              </code>
              <button
                type="button"
                onClick={copyPassword}
                className="grid h-10 w-10 place-items-center rounded-lg border border-ol-line-strong text-ol-charcoal hover:border-ol-ember-ink"
                aria-label="Copier le mot de passe"
              >
                {copied ? <Check size={16} aria-hidden /> : <Copy size={16} aria-hidden />}
              </button>
            </div>
          </div>
        )}
      </section>

      <section className="overflow-x-auto rounded-xl border border-ol-line bg-ol-white">
        {actionError && (
          <p role="alert" className="border-b border-ol-line px-5 py-3 text-sm font-bold text-ol-ember-ink">
            {actionError}
          </p>
        )}
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-ol-line text-xs font-bold uppercase tracking-[0.1em] text-ol-muted">
              <th className="px-5 py-3">Nom</th>
              <th className="px-5 py-3">Rôle</th>
              <th className="px-5 py-3">Statut</th>
              <th className="px-5 py-3">Dernière connexion</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-ol-line last:border-0">
                <td className="px-5 py-3">
                  <div className="font-bold text-ol-charcoal">
                    {user.firstName} {user.lastName}
                  </div>
                  <div className="text-ol-muted">{user.email}</div>
                </td>
                <td className="px-5 py-3 text-ol-ink">{ROLE_LABELS[user.role]}</td>
                <td className="px-5 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                      user.status === 'ACTIVE'
                        ? 'bg-ol-sand text-ol-ember-ink'
                        : 'bg-ol-charcoal/10 text-ol-muted'
                    }`}
                  >
                    {user.status === 'ACTIVE' ? 'Actif' : 'Suspendu'}
                  </span>
                  {user.mustChangePassword && (
                    <span className="ml-2 text-xs text-ol-muted">mot de passe à changer</span>
                  )}
                </td>
                <td className="px-5 py-3 text-ol-muted">{user.lastLoginAt || 'Jamais'}</td>
                <td className="px-5 py-3 text-right">
                  {user.id === currentUserId ? (
                    <span className="text-xs text-ol-muted">Vous</span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => toggleStatus(user)}
                      disabled={busyId === user.id}
                      className="rounded-full border border-ol-line-strong px-4 py-1.5 text-xs font-bold text-ol-charcoal transition-colors hover:border-ol-ember-ink hover:text-ol-ember-ink disabled:opacity-60"
                    >
                      {busyId === user.id
                        ? '…'
                        : user.status === 'ACTIVE'
                          ? 'Suspendre'
                          : 'Réactiver'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
