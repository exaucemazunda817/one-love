import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireGestionRole } from '@/lib/auth';
import { validateTransaction, AccountingError } from '@/lib/accounting';

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const actor = await requireGestionRole(['COMPTABLE', 'DIRECTION']);
  if (!actor) return NextResponse.json({ error: 'Accès refusé.' }, { status: 403 });

  const { id } = await params;

  try {
    const entry = await validateTransaction(id, actor.id);
    await prisma.auditLog.create({
      data: {
        actorId: actor.id,
        actorEmail: actor.email,
        action: 'VALIDATE',
        entity: 'Transaction',
        entityId: entry.id
      }
    });
    return NextResponse.json({ status: entry.status });
  } catch (error) {
    if (error instanceof AccountingError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    throw error;
  }
}
