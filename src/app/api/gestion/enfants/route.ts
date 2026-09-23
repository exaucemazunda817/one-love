import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireGestionRole } from '@/lib/auth';
import { childSchema } from '@/lib/schemas';
import { canAccessChildIdentity, isBeneficiariesModuleEnabled, generateReferenceCode } from '@/lib/beneficiaries';

// TERRAIN est le SEUL rôle à passer par cette route — DIRECTION, COMPTABLE,
// RH et LECTURE n'ont accès à aucune identité d'enfant (voir la matrice du
// plan). Le module reste refusé tant que la DIRECTION ne l'a pas activé
// explicitement (voir /api/gestion/parametres/beneficiaires).
export async function GET() {
  const actor = await requireGestionRole(['TERRAIN']);
  if (!actor || !canAccessChildIdentity(actor.role)) {
    return NextResponse.json({ error: 'Accès refusé.' }, { status: 403 });
  }
  if (!(await isBeneficiariesModuleEnabled())) {
    return NextResponse.json({ error: 'Ce module n’est pas encore activé par la direction.' }, { status: 403 });
  }

  const children = await prisma.child.findMany({
    where: { status: { not: 'ARCHIVED' } },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      referenceCode: true,
      firstName: true,
      lastNameInitial: true,
      status: true,
      firstContactOn: true,
      neighbourhood: true
    }
  });
  return NextResponse.json({ children });
}

export async function POST(request: NextRequest) {
  const actor = await requireGestionRole(['TERRAIN']);
  if (!actor || !canAccessChildIdentity(actor.role)) {
    return NextResponse.json({ error: 'Accès refusé.' }, { status: 403 });
  }
  if (!(await isBeneficiariesModuleEnabled())) {
    return NextResponse.json({ error: 'Ce module n’est pas encore activé par la direction.' }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const parsed = childSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Formulaire invalide.', issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }
  const data = parsed.data;

  const referenceCode = await generateReferenceCode();
  const child = await prisma.child.create({
    data: {
      referenceCode,
      firstName: data.firstName,
      lastNameInitial: data.lastNameInitial || null,
      sex: data.sex || null,
      birthYear: data.birthYear ?? null,
      estimatedAge: data.estimatedAge ?? null,
      neighbourhood: data.neighbourhood || null,
      firstContactOn: new Date(data.firstContactOn),
      referentId: data.referentId || null
    }
  });

  await prisma.auditLog.create({
    data: {
      actorId: actor.id,
      actorEmail: actor.email,
      action: 'CREATE',
      entity: 'Child',
      entityId: child.id,
      // Jamais le nom dans le journal d'audit : seul le code de référence,
      // même principe que partout ailleurs dans le logiciel.
      changes: { referenceCode: child.referenceCode }
    }
  });

  return NextResponse.json({ id: child.id, referenceCode: child.referenceCode }, { status: 201 });
}
