import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentGestionUser } from '@/lib/auth';
import { LogoutButton } from './LogoutButton';

const ROLE_LABELS: Record<string, string> = {
  DIRECTION: 'Direction',
  COMPTABLE: 'Comptable',
  TERRAIN: 'Terrain',
  RH: 'RH',
  LECTURE: 'Lecture'
};

// Page à laquelle CE groupe redirige quand le compte doit changer de mot de
// passe : force le changement avant tout accès au reste du logiciel.
export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentGestionUser();
  if (!user) redirect('/gestion/connexion');
  if (user.mustChangePassword) redirect('/gestion/changer-mot-de-passe');

  const isDirection = user.role === 'DIRECTION';

  return (
    <div className="min-h-screen bg-ol-cream">
      <header className="border-b border-ol-line bg-ol-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <div className="flex items-center gap-6">
            <Link href="/gestion" className="text-sm font-black text-ol-charcoal">
              One Love — Gestion
            </Link>
            <nav className="hidden items-center gap-5 sm:flex">
              <Link href="/gestion" className="text-sm font-bold text-ol-muted hover:text-ol-ember-ink">
                Tableau de bord
              </Link>
              {isDirection && (
                <>
                  <Link href="/gestion/comptes" className="text-sm font-bold text-ol-muted hover:text-ol-ember-ink">
                    Comptes
                  </Link>
                  <Link href="/gestion/audit" className="text-sm font-bold text-ol-muted hover:text-ol-ember-ink">
                    Journal d&apos;audit
                  </Link>
                </>
              )}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-ol-muted sm:inline">
              {user.firstName} — {ROLE_LABELS[user.role] ?? user.role}
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-5 py-10 sm:px-8">{children}</main>
    </div>
  );
}
