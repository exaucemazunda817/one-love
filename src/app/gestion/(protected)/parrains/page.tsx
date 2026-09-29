import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentGestionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { formatFieldDateTime } from '@/lib/dates';

export const metadata: Metadata = {
  title: 'Parrains — Gestion',
  robots: { index: false, follow: false }
};

export const dynamic = 'force-dynamic';

const MODE_LABELS = { CHILD: 'Parrainage d’un enfant', PROGRAMME: 'Soutien d’un programme' } as const;
const STATUS_LABELS = { ACTIVE: 'Actif', ENDED: 'Terminé' } as const;

// Liste INTERNE des parrains. Une ligne n'existe que si un paiement de
// parrainage a été confirmé (webhook Stripe) : sans paiement, personne
// n'apparaît ici. Aucun nom n'est publié sur le site.
export default async function ParrainsPage() {
  const user = await getCurrentGestionUser();
  if (!user) redirect('/gestion/connexion');
  if (user.role !== 'DIRECTION') redirect('/gestion');

  const sponsors = await prisma.sponsor.findMany({
    orderBy: { sponsorSince: 'desc' },
    take: 500,
    include: { donor: true }
  });

  const active = sponsors.filter((s) => s.status === 'ACTIVE');
  const monthlyTotal = active.reduce((sum, s) => sum + Number(s.monthlyAmountEur), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-ol-charcoal">Parrains</h1>
        <p className="mt-1 text-sm text-ol-muted">
          Chaque personne apparaît ici dès que son premier paiement de parrainage est confirmé. Sans paiement, personne
          ne devient parrain.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-ol-line bg-ol-white p-5">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-ol-muted">Parrains actifs</p>
          <p className="mt-1 text-3xl font-black text-ol-charcoal">{active.length}</p>
        </div>
        <div className="rounded-xl border border-ol-line bg-ol-white p-5">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-ol-muted">Engagement mensuel actif</p>
          <p className="mt-1 text-3xl font-black text-ol-charcoal">{monthlyTotal.toLocaleString('fr-FR')} €</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-ol-line bg-ol-white">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="border-b border-ol-line text-xs font-bold uppercase tracking-[0.1em] text-ol-muted">
              <th className="px-5 py-3">Parrain</th>
              <th className="px-5 py-3">Contact</th>
              <th className="px-5 py-3">Formule</th>
              <th className="px-5 py-3">Par mois</th>
              <th className="px-5 py-3">Depuis</th>
              <th className="px-5 py-3">Statut</th>
            </tr>
          </thead>
          <tbody>
            {sponsors.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-ol-muted">
                  Aucun parrain pour le moment.
                </td>
              </tr>
            )}
            {sponsors.map((s) => (
              <tr key={s.id} className="border-b border-ol-line last:border-0 align-top">
                <td className="px-5 py-3 font-bold text-ol-ink">
                  {[s.donor.firstName, s.donor.lastName].filter(Boolean).join(' ') || '—'}
                </td>
                <td className="px-5 py-3 text-ol-muted">
                  <div>{s.donor.email}</div>
                  {s.donor.phone && <div>{s.donor.phone}</div>}
                </td>
                <td className="px-5 py-3">
                  <div className="text-ol-ink">{s.planName}</div>
                  <div className="text-xs text-ol-muted">{MODE_LABELS[s.mode]}</div>
                </td>
                <td className="px-5 py-3 whitespace-nowrap text-ol-ink">
                  {Number(s.monthlyAmountEur).toLocaleString('fr-FR')} €
                </td>
                <td className="px-5 py-3 whitespace-nowrap text-ol-muted">{formatFieldDateTime(s.sponsorSince)}</td>
                <td className="px-5 py-3">
                  <span className={`text-xs font-bold ${s.status === 'ACTIVE' ? 'text-ol-ink' : 'text-ol-muted'}`}>
                    {STATUS_LABELS[s.status]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
