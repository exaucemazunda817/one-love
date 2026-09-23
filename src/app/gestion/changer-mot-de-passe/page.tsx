import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentGestionUser } from '@/lib/auth';
import { ChangePasswordForm } from './ChangePasswordForm';

export const metadata: Metadata = {
  title: 'Changer de mot de passe — Gestion',
  robots: { index: false, follow: false }
};

// Page volontairement en dehors du groupe (protected) : c'est la page vers
// laquelle CE groupe redirige quand mustChangePassword est vrai. La mettre à
// l'intérieur créerait une boucle de redirection.
export default async function ChangerMotDePassePage() {
  const user = await getCurrentGestionUser();
  if (!user) redirect('/gestion/connexion');

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-5 py-16">
      <h1 className="text-xl font-black text-ol-charcoal">
        {user.mustChangePassword ? 'Choisissez votre mot de passe' : 'Changer de mot de passe'}
      </h1>
      <p className="mt-1 text-sm text-ol-muted">
        {user.mustChangePassword
          ? "Votre mot de passe provisoire doit être remplacé avant de continuer."
          : 'Au moins 12 caractères.'}
      </p>
      <div className="mt-6">
        <ChangePasswordForm redirectTo="/gestion" />
      </div>
    </main>
  );
}
