import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireGestionRole } from '@/lib/auth';
import { canManagePayroll, markPayrollEntryPaid, TeamError } from '@/lib/team';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const actor = await requireGestionRole(['RH']);
  if (!actor || !canManagePayroll(actor.role)) {
    return NextResponse.json({ error: 'Accès refusé.' }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const paidOn = body?.paidOn && !Number.isNaN(Date.parse(body.paidOn)) ? new Date(body.paidOn) : new Date();

  let result;
  try {
    result = await markPayrollEntryPaid(id, actor.id, paidOn);
  } catch (error) {
    if (error instanceof TeamError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    throw error;
  }

  if (!result.alreadyPaid) {
    await prisma.auditLog.create({
      data: { actorId: actor.id, actorEmail: actor.email, action: 'UPDATE', entity: 'PayrollEntry', entityId: id, changes: { status: 'PAID' } }
    });
  }

  return NextResponse.json({ ok: true });
}
