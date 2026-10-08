import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentGestionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { formatMoney, type Currency } from '@/lib/money';
import { formatDateOnly } from '@/lib/dates';
import { TransfersBoard, type TransferRow } from './TransfersBoard';

export const metadata: Metadata = {
  title: 'Virements — Gestion',
  robots: { index: false, follow: false }
};

export const dynamic = 'force-dynamic';

/** Les donateurs mensuels sans virement depuis 150 jours sortent de la liste. */
function recentCutoff(): Date {
  return new Date(Date.now() - 150 * 24 * 3600 * 1000);
}

// Virements bancaires annoncés sur le site (08/10/2026). Le site ne voit pas
// le compte : l'équipe compare avec le relevé, grâce à la référence
// (OL-DON-…, OL-VIL-…, OL-PAR-…) que le donateur a recopiée, et confirme ici.
export default async function VirementsPage() {
  const user = await getCurrentGestionUser();
  if (!user) redirect('/gestion/connexion');
  if (!['DIRECTION', 'COMPTABLE'].includes(user.role)) redirect('/gestion');

  const since = recentCutoff();
  const [pendingDonations, pendingSponsors, monthlyDonations, activeSponsors] = await Promise.all([
    prisma.donation.findMany({
      where: { method: 'BANK_TRANSFER', status: 'PENDING' },
      orderBy: { createdAt: 'desc' },
      take: 300,
      include: { donor: true, project: { select: { name: true } } }
    }),
    prisma.sponsor.findMany({
      where: { paymentMethod: 'BANK_TRANSFER', status: 'PENDING' },
      orderBy: { createdAt: 'desc' },
      take: 300,
      include: { donor: true }
    }),
    // Dernier versement de chaque donateur mensuel par virement (même référence).
    prisma.donation.findMany({
      where: { method: 'BANK_TRANSFER', status: 'CONFIRMED', isRecurring: true, receivedOn: { gte: since }, bankReference: { startsWith: 'OL-' }, NOT: { bankReference: { startsWith: 'OL-PAR-' } } },
      orderBy: { receivedOn: 'desc' },
      distinct: ['bankReference'],
      take: 300,
      include: { donor: true, project: { select: { name: true } } }
    }),
    prisma.sponsor.findMany({
      where: { paymentMethod: 'BANK_TRANSFER', status: 'ACTIVE' },
      orderBy: { sponsorSince: 'desc' },
      take: 300,
      include: { donor: true }
    })
  ]);

  const lastSponsorTransfers = await prisma.donation.findMany({
    where: { bankReference: { in: activeSponsors.map((s) => s.bankReference).filter((r): r is string => Boolean(r)) }, status: 'CONFIRMED' },
    orderBy: { receivedOn: 'desc' },
    distinct: ['bankReference'],
    select: { bankReference: true, receivedOn: true }
  });
  const lastByRef = new Map(lastSponsorTransfers.map((d) => [d.bankReference, d.receivedOn]));

  const name = (d: { firstName: string | null; lastName: string | null; email: string | null } | null, fallback?: string | null) =>
    d ? [d.firstName, d.lastName].filter(Boolean).join(' ') || d.email || '—' : fallback?.replace(/^Nom indiqué : /, '') || 'Donateur non identifié';

  const toRow = (base: Omit<TransferRow, 'amountLabel'>): TransferRow => ({
    ...base,
    amountLabel: formatMoney(base.amount, base.currency, 'fr')
  });

  const awaiting: TransferRow[] = [
    ...pendingSponsors.map((s) =>
      toRow({
        kind: 'parrain',
        id: s.id,
        reference: s.bankReference ?? '—',
        who: name(s.donor),
        contact: [s.donor.email, s.donor.phone].filter(Boolean).join(' · '),
        purpose: `Parrainage — ${s.planName}`,
        amount: Number(s.monthlyAmount ?? s.monthlyAmountEur),
        currency: s.currency as Currency,
        monthly: true,
        dateLabel: `Demandé le ${formatDateOnly(s.createdAt)}`
      })
    ),
    ...pendingDonations.map((d) =>
      toRow({
        kind: 'don',
        id: d.id,
        reference: d.bankReference ?? '—',
        who: name(d.donor, d.message),
        contact: d.donor?.email ?? '',
        purpose: d.project ? `Don — ${d.project.name}` : 'Don à l’association',
        amount: Number(d.amount),
        currency: d.currency as Currency,
        monthly: d.isRecurring,
        dateLabel: `Annoncé le ${formatDateOnly(d.createdAt)}`
      })
    )
  ];

  const recurring: TransferRow[] = [
    ...activeSponsors.map((s) => {
      const last = s.bankReference ? lastByRef.get(s.bankReference) : null;
      return toRow({
        kind: 'parrain',
        id: s.id,
        reference: s.bankReference ?? '—',
        who: name(s.donor),
        contact: [s.donor.email, s.donor.phone].filter(Boolean).join(' · '),
        purpose: `Parrainage — ${s.planName}`,
        amount: Number(s.monthlyAmount ?? s.monthlyAmountEur),
        currency: s.currency as Currency,
        monthly: true,
        dateLabel: last ? `Dernier virement le ${formatDateOnly(last)}` : `Parrain depuis le ${formatDateOnly(s.sponsorSince)}`
      });
    }),
    ...monthlyDonations.map((d) =>
      toRow({
        kind: 'don',
        id: d.id,
        reference: d.bankReference ?? '—',
        who: name(d.donor, d.message),
        contact: d.donor?.email ?? '',
        purpose: d.project ? `Don mensuel — ${d.project.name}` : 'Don mensuel à l’association',
        amount: Number(d.amount),
        currency: d.currency as Currency,
        monthly: true,
        dateLabel: `Dernier virement le ${formatDateOnly(d.receivedOn)}`
      })
    )
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-ol-charcoal">Virements</h1>
        <p className="mt-1 max-w-3xl text-sm text-ol-muted">
          Le site ne voit pas le compte bancaire. Quand un virement apparaît sur le relevé, retrouvez sa référence
          (OL-DON-…, OL-VIL-…, OL-PAR-…) ci-dessous et cliquez « Virement reçu » : le don est alors rangé dans le bon
          fonds, et un parrain par virement devient parrain à ce moment-là.
        </p>
      </div>
      <TransfersBoard awaiting={awaiting} recurring={recurring} />
    </div>
  );
}
