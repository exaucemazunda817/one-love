import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireGestionRole } from '@/lib/auth';
import { lockTransaction, AccountingError } from '@/lib/accounting';

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const actor = await requireGestionRole(['COMPTABLE']);
  if (!actor) return NextResponse.json({ error: 'Accès réservé au comptable.' }, { status: 403 });

  const { id } = await params;

  try {
    const entry = await lockTransaction(id);
    await prisma.auditLog.create({
      data: {
        actorId: actor.id,
        actorEmail: actor.email,
        action: 'LOCK',
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
