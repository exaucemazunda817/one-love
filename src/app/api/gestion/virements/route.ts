import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireGestionRole } from '@/lib/auth';
import {
  confirmTransferPledge,
  recordNextMonthlyTransfer,
  cancelTransferPledge,
  activateTransferSponsor,
  recordSponsorTransfer,
  endTransferSponsor
} from '@/lib/bank-transfer';

// Actions de l'équipe sur les virements (08/10/2026). Le site ne voit pas le
// compte bancaire : c'est ce clic, fait en regardant le relevé, qui confirme
// qu'un virement est arrivé. Réservé à la direction et au comptable ; chaque
// action est tracée dans le journal d'audit.
const schema = z.object({
  kind: z.enum(['don', 'parrain']),
  id: z.string().min(1).max(60),
  action: z.enum(['confirm', 'next', 'cancel', 'end']),
  /** Montant réellement reçu, s'il diffère de celui annoncé. */
  amount: z.number().finite().positive().max(310_000_000).optional(),
  /** Date du virement sur le relevé (AAAA-MM-JJ). */
  receivedOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()
});

export async function POST(request: NextRequest) {
  const actor = await requireGestionRole(['DIRECTION', 'COMPTABLE']);
  if (!actor) {
    return NextResponse.json({ error: 'Accès réservé à la direction et à la comptabilité.' }, { status: 403 });
  }

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Demande invalide.' }, { status: 400 });
  const { kind, id, action, amount } = parsed.data;

  const receivedOn = parsed.data.receivedOn ? new Date(`${parsed.data.receivedOn}T12:00:00Z`) : new Date();
  if (Number.isNaN(receivedOn.getTime()) || receivedOn.getTime() > Date.now() + 24 * 3600 * 1000) {
    return NextResponse.json({ error: 'Date de réception invalide.' }, { status: 400 });
  }
  const received = { amount, receivedOn };

  let ok = false;
  if (kind === 'don') {
    if (action === 'confirm') ok = await confirmTransferPledge(id, actor.id, received);
    else if (action === 'next') ok = await recordNextMonthlyTransfer(id, actor.id, received);
    else if (action === 'cancel') ok = await cancelTransferPledge(id);
  } else {
    if (action === 'confirm') ok = await activateTransferSponsor(id, actor.id, received);
    else if (action === 'next') ok = await recordSponsorTransfer(id, actor.id, received);
    else if (action === 'end') ok = await endTransferSponsor(id);
  }

  if (!ok) {
    return NextResponse.json(
      { error: 'Action impossible : ce virement a peut-être déjà été traité. Rechargez la page.' },
      { status: 409 }
    );
  }

  await prisma.auditLog.create({
    data: {
      actorId: actor.id,
      actorEmail: actor.email,
      action: action === 'confirm' ? 'VALIDATE' : action === 'next' ? 'CREATE' : 'UPDATE',
      entity: kind === 'don' ? 'Donation' : 'Sponsor',
      entityId: id,
      changes: { virement: action, ...(amount !== undefined ? { amount } : {}), receivedOn: received.receivedOn.toISOString().slice(0, 10) }
    }
  });

  return NextResponse.json({ ok: true });
}
