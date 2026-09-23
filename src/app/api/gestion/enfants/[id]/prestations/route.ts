import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireGestionRole } from '@/lib/auth';
import { careEventSchema } from '@/lib/schemas';
import { canAccessChildIdentity, isBeneficiariesModuleEnabled } from '@/lib/beneficiaries';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const actor = await requireGestionRole(['TERRAIN']);
  if (!actor || !canAccessChildIdentity(actor.role)) {
    return NextResponse.json({ error: 'Accès refusé.' }, { status: 403 });
  }
  if (!(await isBeneficiariesModuleEnabled())) {
    return NextResponse.json({ error: 'Module non activé.' }, { status: 403 });
  }

  const { id } = await params;
  const child = await prisma.child.findUnique({ where: { id }, select: { id: true } });
  if (!child) return NextResponse.json({ error: 'Introuvable.' }, { status: 404 });

  const body = await request.json().catch(() => null);
  const parsed = careEventSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Formulaire invalide.', issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }
  const data = parsed.data;

  const event = await prisma.careEvent.create({
    data: {
      childId: id,
      kind: data.kind,
      occurredOn: new Date(data.occurredOn),
      providerName: data.providerName || null,
      recordedById: actor.id,
      costAmount: data.costAmount || null,
      costCurrency: data.costAmount ? data.costCurrency || 'CDF' : null
    }
  });

  return NextResponse.json({ id: event.id }, { status: 201 });
}
