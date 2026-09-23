import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentGestionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { canManageTeam, canViewTeamDirectory, canViewTeamDirectoryBasic, ENGAGEMENT_LABELS } from '@/lib/team';
import { TeamManager } from './TeamManager';

export const metadata: Metadata = {
  title: 'Équipe — Gestion',
  robots: { index: false, follow: false }
};

export default async function EquipePage() {
  const user = await getCurrentGestionUser();
  if (!user) redirect('/gestion/connexion');
  if (!canViewTeamDirectory(user.role) && !canViewTeamDirectoryBasic(user.role)) {
    redirect('/gestion');
  }

  if (canViewTeamDirectory(user.role)) {
    const members = await prisma.teamMember.findMany({
      orderBy: [{ isActive: 'desc' }, { lastName: 'asc' }],
      select: {
        id: true,
        firstName: true,
        lastName: true,
        engagement: true,
        jobTitle: true,
        email: true,
        phone: true,
        isActive: true
      }
    });
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-black text-ol-charcoal">Équipe</h1>
          <p className="mt-1 text-sm text-ol-muted">
            {members.length} personne{members.length > 1 ? 's' : ''} enregistrée{members.length > 1 ? 's' : ''}.
          </p>
        </div>
        <TeamManager initialMembers={members} canManage={canManageTeam(user.role)} />
      </div>
    );
  }

  // TERRAIN : annuaire minimal — nom, fonction, engagement. Jamais de
  // coordonnées ni de donnée salariale, filtré côté serveur (voir team.ts).
  const members = await prisma.teamMember.findMany({
    where: { isActive: true },
    orderBy: { lastName: 'asc' },
    select: { id: true, firstName: true, lastName: true, engagement: true, jobTitle: true }
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-ol-charcoal">Équipe</h1>
        <p className="mt-1 text-sm text-ol-muted">Annuaire de l&apos;équipe active.</p>
      </div>
      <section className="overflow-x-auto rounded-xl border border-ol-line bg-ol-white">
        <table className="w-full min-w-[480px] text-left text-sm">
          <thead>
            <tr className="border-b border-ol-line text-xs font-bold uppercase tracking-[0.1em] text-ol-muted">
              <th className="px-4 py-3">Nom</th>
              <th className="px-4 py-3">Engagement</th>
              <th className="px-4 py-3">Fonction</th>
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
              </tr>
            ))}
            {members.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-ol-muted">
                  Aucune personne active.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
