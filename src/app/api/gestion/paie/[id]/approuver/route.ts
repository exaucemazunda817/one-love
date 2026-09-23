import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireGestionRole } from '@/lib/auth';
import { canManagePayroll, approvePayrollEntry, TeamError } from '@/lib/team';

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const actor = await requireGestionRole(['RH']);
  if (!actor || !canManagePayroll(actor.role)) {
    return NextResponse.json({ error: 'Accès refusé.' }, { status: 403 });
  }

  const { id } = await params;
  try {
    await approvePayrollEntry(id);
  } catch (error) {
    if (error instanceof TeamError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    throw error;
  }

  await prisma.auditLog.create({
    data: { actorId: actor.id, actorEmail: actor.email, action: 'UPDATE', entity: 'PayrollEntry', entityId: id, changes: { status: 'APPROVED' } }
  });

  return NextResponse.json({ ok: true });
}
