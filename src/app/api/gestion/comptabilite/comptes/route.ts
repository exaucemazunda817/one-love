import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireGestionRole } from '@/lib/auth';
import { financialAccountSchema } from '@/lib/schemas';
import { getAccountBalance } from '@/lib/accounting';

export async function GET() {
  const actor = await requireGestionRole(['DIRECTION', 'COMPTABLE']);
  if (!actor) {
    return NextResponse.json({ error: 'Accès refusé.' }, { status: 403 });
  }

  const accounts = await prisma.financialAccount.findMany({ orderBy: { createdAt: 'asc' } });
  const withBalance = await Promise.all(
    accounts.map(async (account) => ({
      ...account,
      balance: await getAccountBalance(account.id)
    }))
  );

  return NextResponse.json({ accounts: withBalance });
}

export async function POST(request: NextRequest) {
  const actor = await requireGestionRole(['COMPTABLE']);
  if (!actor) {
    return NextResponse.json({ error: 'Accès réservé au comptable.' }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const parsed = financialAccountSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Formulaire invalide.', issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }
  const data = parsed.data;

  const account = await prisma.financialAccount.create({
    data: {
      name: data.name,
      currency: data.currency,
      kind: data.kind,
      bankName: data.bankName || null,
      ibanLast4: data.ibanLast4 || null
    }
  });

  await prisma.auditLog.create({
    data: {
      actorId: actor.id,
      actorEmail: actor.email,
      action: 'CREATE',
      entity: 'FinancialAccount',
      entityId: account.id,
      changes: { name: account.name, currency: account.currency, kind: account.kind }
    }
  });

  return NextResponse.json({ id: account.id }, { status: 201 });
}
