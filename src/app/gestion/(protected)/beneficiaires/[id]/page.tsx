import type { Metadata } from 'next';
import { redirect, notFound } from 'next/navigation';
import { getCurrentGestionUser } from '@/lib/auth';
import { canAccessChildIdentity, isBeneficiariesModuleEnabled } from '@/lib/beneficiaries';
import { prisma } from '@/lib/prisma';
import { ChildDetailManager } from './ChildDetailManager';

export const metadata: Metadata = {
  title: 'Fiche bénéficiaire — Gestion',
  robots: { index: false, follow: false }
};

export default async function ChildDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentGestionUser();
  if (!user) redirect('/gestion/connexion');
  if (!canAccessChildIdentity(user.role)) redirect('/gestion/beneficiaires');
  if (!(await isBeneficiariesModuleEnabled())) redirect('/gestion/beneficiaires');

  const { id } = await params;
  const [child, projects] = await Promise.all([
    prisma.child.findUnique({
      where: { id },
      include: {
        enrollments: { include: { project: { select: { name: true } } }, orderBy: { enrolledOn: 'desc' } },
        careEvents: { orderBy: { occurredOn: 'desc' }, take: 50 },
        consents: true
      }
    }),
    prisma.project.findMany({ orderBy: { name: 'asc' }, select: { id: true, name: true } })
  ]);
  if (!child) notFound();

  // Consultation d'une fiche = donnée sensible relue.
  await prisma.auditLog.create({
    data: { actorId: user.id, actorEmail: user.email, action: 'VIEW_SENSITIVE', entity: 'Child', entityId: child.id }
  });

  return (
    <ChildDetailManager
      child={{
        id: child.id,
        referenceCode: child.referenceCode,
        firstName: child.firstName,
        lastNameInitial: child.lastNameInitial,
        sex: child.sex,
        birthYear: child.birthYear,
        estimatedAge: child.estimatedAge,
        neighbourhood: child.neighbourhood,
        status: child.status,
        firstContactOn: child.firstContactOn.toISOString(),
        enrollments: child.enrollments.map((e) => ({
          id: e.id,
          projectName: e.project.name,
          enrolledOn: e.enrolledOn.toISOString(),
          endedOn: e.endedOn?.toISOString() ?? null
        })),
        careEvents: child.careEvents.map((c) => ({
          id: c.id,
          kind: c.kind,
          occurredOn: c.occurredOn.toISOString(),
          providerName: c.providerName,
          costAmount: c.costAmount?.toString() ?? null,
          costCurrency: c.costCurrency
        })),
        consents: child.consents.map((c) => ({
          id: c.id,
          scope: c.scope,
          status: c.status,
          signedByName: c.signedByName,
          signedOn: c.signedOn?.toISOString() ?? null
        }))
      }}
      projects={projects}
    />
  );
}
