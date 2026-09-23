import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireGestionRole } from '@/lib/auth';
import { payrollEntrySchema } from '@/lib/schemas';
import { canManagePayroll } from '@/lib/team';
import { computeAmountEur } from '@/lib/accounting';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const actor = await requireGestionRole(['RH']);
  if (!actor || !canManagePayroll(actor.role)) {
    return NextResponse.json({ error: 'Accès refusé.' }, { status: 403 });
  }

  const { id } = await params;
  const member = await prisma.teamMember.findUnique({ where: { id } });
  if (!member) return NextResponse.json({ error: 'Introuvable.' }, { status: 404 });

  const body = await request.json().catch(() => null);
  const parsed = payrollEntrySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Formulaire invalide.', issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }
  const data = parsed.data;

  let amountEur: string;
  try {
    amountEur = computeAmountEur(data.amount, data.currency, data.fxRate || '1');
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }

  // La contrainte @@unique([teamMemberId, periodYear, periodMonth]) est le
  // vrai verrou anti-doublon ; cette vérification préalable n'est qu'un
  // message d'erreur plus lisible que le P2002 brut.
  const existing = await prisma.payrollEntry.findUnique({
    where: {
      teamMemberId_periodYear_periodMonth: {
        teamMemberId: id,
        periodYear: data.periodYear,
        periodMonth: data.periodMonth
      }
    }
  });
  if (existing) {
    return NextResponse.json(
      { error: 'Un versement existe déjà pour cette personne et cette période.' },
      { status: 409 }
    );
  }

  const entry = await prisma.payrollEntry.create({
    data: {
      teamMemberId: id,
      periodYear: data.periodYear,
      periodMonth: data.periodMonth,
      amount: data.amount,
      currency: data.currency,
      fxRate: data.currency === 'EUR' ? '1' : data.fxRate || '1',
      amountEur,
      projectId: data.projectId || null
    }
  });

  await prisma.auditLog.create({
    data: {
      actorId: actor.id,
      actorEmail: actor.email,
      action: 'CREATE',
      entity: 'PayrollEntry',
      entityId: entry.id,
      changes: { teamMemberId: id, periodYear: data.periodYear, periodMonth: data.periodMonth, amount: data.amount }
    }
  });

  return NextResponse.json({ id: entry.id }, { status: 201 });
}
