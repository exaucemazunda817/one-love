import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentGestionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { formatDateOnly } from '@/lib/dates';
import { AccountsManager } from './AccountsManager';

export const metadata: Metadata = {
  title: 'Comptes — Gestion',
  robots: { index: false, follow: false }
};

export default async function ComptesPage() {
  const user = await getCurrentGestionUser();
  if (!user) redirect('/gestion/connexion');
  // Page entière réservée à la direction : ce n'est pas qu'un lien caché
  // dans le menu, la route elle-même refuse tout autre rôle.
  if (user.role !== 'DIRECTION') redirect('/gestion');

  const rows = await prisma.appUser.findMany({
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      status: true,
      lastLoginAt: true,
      mustChangePassword: true,
      createdAt: true
    }
  });

  // Dates formatées côté serveur, en chaînes : évite toute ambiguïté sur ce
  // que devient un objet Date une fois passé à un composant client.
  const users = rows.map((row) => ({
    ...row,
    lastLoginAt: row.lastLoginAt ? formatDateOnly(row.lastLoginAt) : null,
    createdAt: formatDateOnly(row.createdAt)
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-ol-charcoal">Comptes</h1>
        <p className="mt-1 text-sm text-ol-muted">
          Seule la direction crée et suspend des comptes.
        </p>
      </div>
      <AccountsManager initialUsers={users} currentUserId={user.id} />
    </div>
  );
}
