import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireGestionRole } from '@/lib/auth';

// Changement de statut d'une demande reçue par le site (message de contact —
// dont les demandes de parrainage et d'alerte Mobile Money —, candidature
// bénévole, proposition de partenariat). Réservé à la DIRECTION, comme les
// compteurs du tableau de bord.
const patchSchema = z.object({
  status: z.enum(['NEW', 'IN_REVIEW', 'ACCEPTED', 'DECLINED', 'ARCHIVED'])
});

const ENTITY = {
  messages: 'ContactMessage',
  benevoles: 'VolunteerApplication',
  partenariats: 'PartnershipRequest'
} as const;

type RequestType = keyof typeof ENTITY;

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ type: string; id: string }> }
) {
  const actor = await requireGestionRole(['DIRECTION']);
  if (!actor) {
    return NextResponse.json({ error: 'Accès réservé à la direction.' }, { status: 403 });
  }

  const { type, id } = await params;
  if (!(type in ENTITY)) {
    return NextResponse.json({ error: 'Type de demande inconnu.' }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Statut invalide.' }, { status: 400 });
  }
  const { status } = parsed.data;
  const data = { status, handledById: actor.id };

  // Trois appels explicites plutôt qu'un modèle choisi dynamiquement : Prisma
  // type chaque délégué séparément, et ça garde la liste des tables
  // modifiables fermée et lisible.
  let previous: { status: string } | null = null;
  switch (type as RequestType) {
    case 'messages':
      previous = await prisma.contactMessage.findUnique({ where: { id }, select: { status: true } });
      if (previous) await prisma.contactMessage.update({ where: { id }, data });
      break;
    case 'benevoles':
      previous = await prisma.volunteerApplication.findUnique({ where: { id }, select: { status: true } });
      if (previous) await prisma.volunteerApplication.update({ where: { id }, data });
      break;
    case 'partenariats':
      previous = await prisma.partnershipRequest.findUnique({ where: { id }, select: { status: true } });
      if (previous) await prisma.partnershipRequest.update({ where: { id }, data });
      break;
  }

  if (!previous) {
    return NextResponse.json({ error: 'Demande introuvable.' }, { status: 404 });
  }

  // Jamais le contenu de la demande dans le journal : seulement l'identifiant
  // et le changement de statut.
  await prisma.auditLog.create({
    data: {
      actorId: actor.id,
      actorEmail: actor.email,
      action: 'UPDATE',
      entity: ENTITY[type as RequestType],
      entityId: id,
      changes: { status: { from: previous.status, to: status } }
    }
  });

  return NextResponse.json({ id, status });
}
