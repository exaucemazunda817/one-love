import { NextResponse } from 'next/server';
import ExcelJS from 'exceljs';
import { prisma } from '@/lib/prisma';
import { requireGestionRole } from '@/lib/auth';
import { formatDateOnly } from '@/lib/dates';

const STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Brouillon',
  VALIDATED: 'Validée',
  LOCKED: 'Verrouillée',
  CANCELLED: 'Annulée'
};
const KIND_LABELS: Record<string, string> = { INCOME: 'Recette', EXPENSE: 'Dépense', TRANSFER: 'Transfert' };

export async function GET() {
  const actor = await requireGestionRole(['COMPTABLE', 'DIRECTION']);
  if (!actor) return NextResponse.json({ error: 'Accès refusé.' }, { status: 403 });

  const entries = await prisma.transaction.findMany({
    orderBy: { occurredOn: 'desc' },
    include: {
      project: { select: { name: true } },
      category: { select: { label: true } },
      account: { select: { name: true } },
      createdBy: { select: { firstName: true, lastName: true } },
      validatedBy: { select: { firstName: true, lastName: true } }
    }
  });

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Journal');
  sheet.columns = [
    { header: 'Date', key: 'date', width: 14 },
    { header: 'Type', key: 'kind', width: 12 },
    { header: 'Statut', key: 'status', width: 12 },
    { header: 'Libellé', key: 'label', width: 32 },
    { header: 'Projet', key: 'project', width: 20 },
    { header: 'Catégorie', key: 'category', width: 20 },
    { header: 'Compte', key: 'account', width: 18 },
    { header: 'Montant', key: 'amount', width: 16 },
    { header: 'Devise', key: 'currency', width: 8 },
    { header: 'Taux (unités / 1 €)', key: 'fxRate', width: 16 },
    { header: 'Contre-valeur EUR', key: 'amountEur', width: 16 },
    { header: 'Saisie par', key: 'createdBy', width: 20 },
    { header: 'Validée par', key: 'validatedBy', width: 20 }
  ];
  sheet.getRow(1).font = { bold: true };

  for (const entry of entries) {
    sheet.addRow({
      date: formatDateOnly(entry.occurredOn),
      kind: KIND_LABELS[entry.kind] ?? entry.kind,
      status: STATUS_LABELS[entry.status] ?? entry.status,
      label: entry.label,
      project: entry.project?.name ?? 'Fonds général',
      category: entry.category?.label ?? '',
      account: entry.account?.name ?? '',
      amount: Number(entry.amount),
      currency: entry.currency,
      fxRate: Number(entry.fxRate),
      amountEur: Number(entry.amountEur),
      createdBy: entry.createdBy ? `${entry.createdBy.firstName} ${entry.createdBy.lastName}` : '',
      validatedBy: entry.validatedBy ? `${entry.validatedBy.firstName} ${entry.validatedBy.lastName}` : ''
    });
  }

  const buffer = await workbook.xlsx.writeBuffer();

  await prisma.auditLog.create({
    data: {
      actorId: actor.id,
      actorEmail: actor.email,
      action: 'EXPORT',
      entity: 'Transaction',
      entityId: 'journal-complet'
    }
  });

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="journal-comptable-${new Date().toISOString().slice(0, 10)}.xlsx"`
    }
  });
}
