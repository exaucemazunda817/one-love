import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentGestionUser } from '@/lib/auth';
import {
  canAccessChildIdentity,
  canManageBeneficiariesGate,
  isBeneficiariesModuleEnabled,
  getBeneficiaryAggregate
} from '@/lib/beneficiaries';
import { prisma } from '@/lib/prisma';
import { ActivationPanel } from './ActivationPanel';
import { ChildrenManager } from './ChildrenManager';

export const metadata: Metadata = {
  title: 'Bénéficiaires — Gestion',
  robots: { index: false, follow: false }
};

const STATUS_LABELS: Record<string, string> = {
  FIRST_CONTACT: 'Premier contact',
  ACTIVE_FOLLOW_UP: 'Suivi actif',
  IN_REINTEGRATION: 'En réinsertion',
  EXITED_POSITIVE: 'Sortie positive',
  LOST_CONTACT: 'Perdu de vue',
  ARCHIVED: 'Archivé'
};

export default async function BeneficiairesPage() {
  const user = await getCurrentGestionUser();
  if (!user) redirect('/gestion/connexion');
  if (!canManageBeneficiariesGate(user.role) && !canAccessChildIdentity(user.role)) {
    redirect('/gestion');
  }

  const enabled = await isBeneficiariesModuleEnabled();

  // DIRECTION : compteurs agrégés uniquement, jamais un nom — voir
  // lib/beneficiaries.ts. C'est délibéré, pas un manque de fonctionnalité.
  if (canManageBeneficiariesGate(user.role)) {
    const aggregate = enabled ? await getBeneficiaryAggregate() : null;
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-black text-ol-charcoal">Bénéficiaires</h1>
          <p className="mt-1 text-sm text-ol-muted">
            Vue agrégée uniquement — l&apos;identité des enfants n&apos;est accessible qu&apos;au
            rôle Terrain.
          </p>
        </div>

        {!enabled && <ActivationPanel />}

        {enabled && aggregate && (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-ol-line bg-ol-white p-5">
                <p className="text-xs font-bold uppercase tracking-[0.1em] text-ol-muted">
                  Enfants suivis activement
                </p>
                <p className="mt-1 text-3xl font-black text-ol-charcoal">{aggregate.totalActive}</p>
              </div>
            </div>

            <section className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-xl border border-ol-line bg-ol-white p-6">
                <h2 className="text-sm font-bold uppercase tracking-[0.1em] text-ol-muted">Par statut</h2>
                <ul className="mt-3 space-y-2">
                  {aggregate.byStatus.map((s) => (
                    <li key={s.status} className="flex justify-between text-sm">
                      <span className="text-ol-ink">{STATUS_LABELS[s.status] ?? s.status}</span>
                      <span className="font-bold text-ol-charcoal">{s.count}</span>
                    </li>
                  ))}
                  {aggregate.byStatus.length === 0 && <li className="text-sm text-ol-muted">Aucune donnée.</li>}
                </ul>
              </div>
              <div className="rounded-xl border border-ol-line bg-ol-white p-6">
                <h2 className="text-sm font-bold uppercase tracking-[0.1em] text-ol-muted">Par projet</h2>
                <ul className="mt-3 space-y-2">
                  {aggregate.byProject.map((p) => (
                    <li key={p.projectId} className="flex justify-between text-sm">
                      <span className="text-ol-ink">{p.projectName}</span>
                      <span className="font-bold text-ol-charcoal">{p.count}</span>
                    </li>
                  ))}
                  {aggregate.byProject.length === 0 && <li className="text-sm text-ol-muted">Aucune donnée.</li>}
                </ul>
              </div>
            </section>
          </>
        )}
      </div>
    );
  }

  // TERRAIN : seul rôle avec accès à l'identité, mais rien tant que le
  // module n'est pas activé par la direction.
  if (!enabled) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-black text-ol-charcoal">Bénéficiaires</h1>
        <div className="rounded-xl border border-ol-line bg-ol-white p-6">
          <p className="text-sm leading-relaxed text-ol-ink">
            Ce module n&apos;est pas encore activé par la direction. Les décisions nécessaires
            (référent RGPD, base légale du suivi, durées de conservation, politique de
            protection de l&apos;enfance) doivent être prises par l&apos;association avant toute
            saisie réelle.
          </p>
        </div>
      </div>
    );
  }

  const [children, projects] = await Promise.all([
    prisma.child.findMany({
      where: { status: { not: 'ARCHIVED' } },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        referenceCode: true,
        firstName: true,
        lastNameInitial: true,
        status: true,
        firstContactOn: true,
        neighbourhood: true
      }
    }),
    prisma.project.findMany({ orderBy: { name: 'asc' }, select: { id: true, name: true } })
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-ol-charcoal">Bénéficiaires</h1>
        <p className="mt-1 text-sm text-ol-muted">
          {children.length} enfant{children.length > 1 ? 's' : ''} suivi{children.length > 1 ? 's' : ''}.
        </p>
      </div>
      <ChildrenManager
        initialChildren={children.map((c) => ({ ...c, firstContactOn: c.firstContactOn.toISOString() }))}
        projects={projects}
      />
    </div>
  );
}
