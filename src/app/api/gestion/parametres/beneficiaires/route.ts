import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireGestionRole } from '@/lib/auth';
import { isBeneficiariesModuleEnabled, enableBeneficiariesModule } from '@/lib/beneficiaries';

export async function GET() {
  const actor = await requireGestionRole(['DIRECTION']);
  if (!actor) return NextResponse.json({ error: 'Accès réservé à la direction.' }, { status: 403 });

  return NextResponse.json({ enabled: await isBeneficiariesModuleEnabled() });
}

// Activation explicite : exige une confirmation littérale dans le corps de
// la requête, pas un simple bouton — c'est une décision qui engage
// l'association sur des données de mineurs, elle ne doit jamais être
// déclenchée par erreur (double-clic, script, etc.).
const schema = z.object({ confirm: z.literal('J’ACTIVE LE SUIVI DES BÉNÉFICIAIRES') });

export async function POST(request: NextRequest) {
  const actor = await requireGestionRole(['DIRECTION']);
  if (!actor) return NextResponse.json({ error: 'Accès réservé à la direction.' }, { status: 403 });

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Confirmation manquante ou incorrecte.' }, { status: 400 });
  }

  await enableBeneficiariesModule(actor.id);

  await prisma.auditLog.create({
    data: {
      actorId: actor.id,
      actorEmail: actor.email,
      action: 'UPDATE',
      entity: 'AppSettings',
      entityId: 'singleton',
      changes: { beneficiariesEnabled: true }
    }
  });

  return NextResponse.json({ enabled: true });
}
