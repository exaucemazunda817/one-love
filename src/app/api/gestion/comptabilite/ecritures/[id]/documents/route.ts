import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireGestionRole } from '@/lib/auth';
import { storeDocument } from '@/lib/documents';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const actor = await requireGestionRole(['COMPTABLE', 'TERRAIN']);
  if (!actor) return NextResponse.json({ error: 'Accès refusé.' }, { status: 403 });

  const { id } = await params;
  const entry = await prisma.transaction.findUnique({ where: { id } });
  if (!entry) return NextResponse.json({ error: 'Écriture introuvable.' }, { status: 404 });

  // Un compte TERRAIN ne peut joindre un justificatif qu'à SA PROPRE écriture,
  // jamais à celle d'un autre.
  if (actor.role === 'TERRAIN' && entry.createdById !== actor.id) {
    return NextResponse.json({ error: 'Vous ne pouvez modifier que vos propres écritures.' }, { status: 403 });
  }
  if (entry.status === 'LOCKED') {
    return NextResponse.json({ error: 'Cette écriture est verrouillée.' }, { status: 400 });
  }

  const formData = await request.formData().catch(() => null);
  const file = formData?.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Fichier manquant.' }, { status: 400 });
  }

  let stored;
  try {
    stored = await storeDocument(file);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }

  const document = await prisma.document.create({
    data: {
      blobKey: stored.blobKey,
      fileName: stored.fileName,
      mimeType: stored.mimeType,
      sizeBytes: stored.sizeBytes,
      transactionId: id,
      uploadedById: actor.id
    }
  });

  return NextResponse.json({ id: document.id, fileName: document.fileName }, { status: 201 });
}
