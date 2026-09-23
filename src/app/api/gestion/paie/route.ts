import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireGestionRole } from '@/lib/auth';
import { canViewPayrollLedger } from '@/lib/team';

// Registre transversal des versements de paie, tous membres confondus.
// COMPTABLE y accède en lecture pour son rapprochement (c'est la SEULE vue de
// ce module qui lui est ouverte — jamais l'annuaire complet ni les contrats,
// voir team.ts). RH et DIRECTION le voient aussi ; seul RH peut agir dessus.
export async function GET() {
  const actor = await requireGestionRole(['RH', 'DIRECTION', 'COMPTABLE']);
  if (!actor || !canViewPayrollLedger(actor.role)) {
    return NextResponse.json({ error: 'Accès refusé.' }, { status: 403 });
  }

  const entries = await prisma.payrollEntry.findMany({
    orderBy: [{ periodYear: 'desc' }, { periodMonth: 'desc' }, { createdAt: 'desc' }],
    take: 300,
    include: {
      teamMember: { select: { firstName: true, lastName: true } },
      project: { select: { name: true } },
      transaction: { select: { id: true, status: true } }
    }
  });

  return NextResponse.json({ entries });
}
