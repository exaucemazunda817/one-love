import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireGestionRole } from '@/lib/auth';
import { mediaConsentSchema } from '@/lib/schemas';
import { canAccessChildIdentity, isBeneficiariesModuleEnabled } from '@/lib/beneficiaries';

// Un consentement par (enfant, portée) — enregistrer un nouveau statut pour
// une portée déjà connue MET À JOUR la ligne existante plutôt que d'en créer
// une seconde, pour ne jamais avoir deux vérités contradictoires sur la même
// portée.
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
  const parsed = mediaConsentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Formulaire invalide.', issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }
  const data = parsed.data;

  const consent = await prisma.mediaConsent.upsert({
    where: { childId_scope: { childId: id, scope: data.scope } },
    update: {
      status: data.status,
      signedByName: data.signedByName || null,
      signedByRole: data.signedByRole || null,
      signedOn: data.signedOn ? new Date(data.signedOn) : null,
      revokedOn: data.status === 'WITHDRAWN' ? new Date() : null
    },
    create: {
      childId: id,
      scope: data.scope,
      status: data.status,
      signedByName: data.signedByName || null,
      signedByRole: data.signedByRole || null,
      signedOn: data.signedOn ? new Date(data.signedOn) : null
    }
  });

  await prisma.auditLog.create({
    data: {
      actorId: actor.id,
      actorEmail: actor.email,
      action: 'UPDATE',
      entity: 'MediaConsent',
      entityId: consent.id,
      changes: { scope: consent.scope, status: consent.status }
    }
  });

  return NextResponse.json({ id: consent.id, status: consent.status }, { status: 200 });
}
