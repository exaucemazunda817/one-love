import type { Metadata } from 'next';
import { getCurrentGestionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Tableau de bord — Gestion',
  robots: { index: false, follow: false }
};

// Layout parent garantit déjà un utilisateur actif : on peut supposer non-null
// ici. Pas de compteurs de dons/comptabilité/bénéficiaires/équipe/inventaire
// sur cet écran — ces modules ont chacun leur propre tableau de bord, cette
// page ne garde que ce qui n'a pas encore d'écran dédié.
export default async function DashboardPage() {
  const user = (await getCurrentGestionUser())!;

  const counts =
    user.role === 'DIRECTION'
      ? await Promise.all([
          prisma.contactMessage.count({ where: { status: 'NEW' } }),
          prisma.volunteerApplication.count({ where: { status: 'NEW' } }),
          prisma.partnershipRequest.count({ where: { status: 'NEW' } }),
          prisma.newsletterSubscriber.count({ where: { confirmedAt: { not: null } } })
        ])
      : null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-ol-charcoal">Bonjour {user.firstName}</h1>
        <p className="mt-1 text-sm text-ol-muted">
          Bienvenue dans le logiciel de gestion de One Love.
        </p>
      </div>

      {counts && (
        <div className="grid gap-4 sm:grid-cols-4">
          {[
            { label: 'Messages non lus', value: counts[0] },
            { label: 'Candidatures bénévoles', value: counts[1] },
            { label: 'Propositions de partenariat', value: counts[2] },
            { label: 'Abonnés à la lettre', value: counts[3] }
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-ol-line bg-ol-white p-5">
              <p className="text-3xl font-black text-ol-charcoal">{item.value}</p>
              <p className="mt-1 text-sm text-ol-muted">{item.label}</p>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-xl border border-ol-line bg-ol-white p-6">
        <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-ol-muted">
          Retrouvez chaque module dans le menu
        </h2>
        <p className="mt-2 max-w-measure text-[0.95rem] leading-relaxed text-ol-ink">
          Comptabilité, bénéficiaires, équipe et paie, inventaire — chacun a son propre écran,
          visible selon votre rôle.
        </p>
      </div>
    </div>
  );
}
