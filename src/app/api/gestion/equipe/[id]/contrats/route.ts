import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireGestionRole } from '@/lib/auth';
import { employmentContractSchema } from '@/lib/schemas';
import { canManageTeam } from '@/lib/team';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const actor = await requireGestionRole(['RH']);
  if (!actor || !canManageTeam(actor.role)) {
    return NextResponse.json({ error: 'Accès refusé.' }, { status: 403 });
  }

  const { id } = await params;
  const member = await prisma.teamMember.findUnique({ where: { id } });
  if (!member) return NextResponse.json({ error: 'Introuvable.' }, { status: 404 });

  const body = await request.json().catch(() => null);
  const parsed = employmentContractSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Formulaire invalide.', issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }
  const data = parsed.data;

  const contract = await prisma.employmentContract.create({
    data: {
      teamMemberId: id,
      reference: data.reference || null,
      startsOn: new Date(data.startsOn),
      endsOn: data.endsOn ? new Date(data.endsOn) : null,
      grossAmount: data.grossAmount,
      grossCurrency: data.grossCurrency,
      periodicity: data.periodicity
    }
  });

  await prisma.auditLog.create({
    data: {
      actorId: actor.id,
      actorEmail: actor.email,
      action: 'CREATE',
      entity: 'EmploymentContract',
      entityId: contract.id,
      changes: { teamMemberId: id, grossAmount: data.grossAmount, grossCurrency: data.grossCurrency }
    }
  });

  return NextResponse.json({ id: contract.id }, { status: 201 });
}
