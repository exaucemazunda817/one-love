import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireGestionRole } from '@/lib/auth';

// Écran restreint de TERRAIN : uniquement SES propres dépenses, jamais le
// journal complet (réservé à COMPTABLE/DIRECTION, voir ecritures/route.ts).
export async function GET() {
  const actor = await requireGestionRole(['TERRAIN', 'COMPTABLE']);
  if (!actor) return NextResponse.json({ error: 'Accès refusé.' }, { status: 403 });

  const entries = await prisma.transaction.findMany({
    where: { createdById: actor.id, kind: 'EXPENSE' },
    orderBy: { occurredOn: 'desc' },
    take: 100,
    include: {
      project: { select: { name: true } },
      category: { select: { label: true } },
      _count: { select: { documents: true } }
    }
  });

  return NextResponse.json({ entries });
}
