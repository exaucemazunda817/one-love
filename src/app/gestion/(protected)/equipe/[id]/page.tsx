import type { Metadata } from 'next';
import { redirect, notFound } from 'next/navigation';
import { getCurrentGestionUser } from '@/lib/auth';
import { canViewTeamDirectory } from '@/lib/team';
import { prisma } from '@/lib/prisma';
import { MemberDetailManager } from './MemberDetailManager';

export const metadata: Metadata = {
  title: 'Fiche équipe — Gestion',
  robots: { index: false, follow: false }
};

export default async function MemberDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentGestionUser();
  if (!user) redirect('/gestion/connexion');
  if (!canViewTeamDirectory(user.role)) redirect('/gestion/equipe');

  const { id } = await params;
  const [member, projects] = await Promise.all([
    prisma.teamMember.findUnique({
      where: { id },
      include: {
        contracts: { orderBy: { startsOn: 'desc' } },
        payrollEntries: {
          orderBy: [{ periodYear: 'desc' }, { periodMonth: 'desc' }],
          include: { project: { select: { name: true } } }
        }
      }
    }),
    prisma.project.findMany({ orderBy: { name: 'asc' }, select: { id: true, name: true } })
  ]);
  if (!member) notFound();

  return (
    <MemberDetailManager
      canManage={user.role === 'RH'}
      member={{
        id: member.id,
        firstName: member.firstName,
        lastName: member.lastName,
        engagement: member.engagement,
        jobTitle: member.jobTitle,
        email: member.email,
        phone: member.phone,
        city: member.city,
        startedOn: member.startedOn?.toISOString() ?? null,
        endedOn: member.endedOn?.toISOString() ?? null,
        isActive: member.isActive,
        contracts: member.contracts.map((c) => ({
          id: c.id,
          reference: c.reference,
          startsOn: c.startsOn.toISOString(),
          endsOn: c.endsOn?.toISOString() ?? null,
          status: c.status,
          grossAmount: c.grossAmount.toString(),
          grossCurrency: c.grossCurrency,
          periodicity: c.periodicity
        })),
        payrollEntries: member.payrollEntries.map((p) => ({
          id: p.id,
          periodYear: p.periodYear,
          periodMonth: p.periodMonth,
          amount: p.amount.toString(),
          currency: p.currency,
          amountEur: p.amountEur.toString(),
          status: p.status,
          projectName: p.project?.name ?? null
        }))
      }}
      projects={projects}
    />
  );
}
