import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireGestionRole } from '@/lib/auth';
import { transactionEntrySchema } from '@/lib/schemas';
import { computeAmountEur, canCreateFullEntry, canCreateTerrainExpense } from '@/lib/accounting';

// Journal complet — réservé à COMPTABLE et DIRECTION. Le rôle TERRAIN ne
// passe jamais par cette liste : voir ecritures/mes-depenses/route.ts pour
// son propre écran restreint à ses seules saisies.
export async function GET(request: NextRequest) {
  const actor = await requireGestionRole(['DIRECTION', 'COMPTABLE']);
  if (!actor) return NextResponse.json({ error: 'Accès refusé.' }, { status: 403 });

  const { searchParams } = request.nextUrl;
  const projectId = searchParams.get('projectId') || undefined;
  const status = searchParams.get('status') || undefined;
  const kind = searchParams.get('kind') || undefined;

  const entries = await prisma.transaction.findMany({
    where: {
      ...(projectId ? { projectId } : {}),
      ...(status ? { status: status as never } : {}),
      ...(kind ? { kind: kind as never } : {})
    },
    orderBy: { occurredOn: 'desc' },
    take: 200,
    include: {
      project: { select: { name: true } },
      category: { select: { label: true } },
      account: { select: { name: true } },
      createdBy: { select: { firstName: true, lastName: true } },
      validatedBy: { select: { firstName: true, lastName: true } },
      _count: { select: { documents: true } }
    }
  });

  return NextResponse.json({ entries });
}

export async function POST(request: NextRequest) {
  const actor = await requireGestionRole(['COMPTABLE', 'TERRAIN']);
  if (!actor) return NextResponse.json({ error: 'Accès refusé.' }, { status: 403 });

  const body = await request.json().catch(() => null);
  const parsed = transactionEntrySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Formulaire invalide.', issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }
  const data = parsed.data;

  // TERRAIN ne peut saisir que des dépenses, jamais de recette ni de compte
  // de trésorerie (il n'en gère aucun) — imposé ici, pas seulement dans le
  // formulaire, qui peut toujours être contourné par un appel direct à l'API.
  if (!canCreateFullEntry(actor.role)) {
    if (!canCreateTerrainExpense(actor.role) || data.kind !== 'EXPENSE') {
      return NextResponse.json(
        { error: 'Vous ne pouvez saisir que des dépenses de terrain.' },
        { status: 403 }
      );
    }
  }
  const accountId = canCreateFullEntry(actor.role) ? data.accountId || null : null;

  let amountEur: string;
  try {
    amountEur = computeAmountEur(data.amount, data.currency, data.fxRate || '1');
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }

  const entry = await prisma.transaction.create({
    data: {
      kind: data.kind,
      status: 'DRAFT',
      occurredOn: new Date(data.occurredOn),
      label: data.label,
      description: data.description || null,
      amount: data.amount,
      currency: data.currency,
      fxRate: data.currency === 'EUR' ? '1' : data.fxRate || '1',
      amountEur,
      accountId,
      categoryId: data.categoryId || null,
      projectId: data.projectId || null,
      createdById: actor.id
    }
  });

  await prisma.auditLog.create({
    data: {
      actorId: actor.id,
      actorEmail: actor.email,
      action: 'CREATE',
      entity: 'Transaction',
      entityId: entry.id,
      changes: { kind: entry.kind, amount: data.amount, currency: entry.currency }
    }
  });

  return NextResponse.json({ id: entry.id }, { status: 201 });
}
