import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireGestionRole } from '@/lib/auth';
import { readDocument } from '@/lib/documents';

// Seule route qui sert le contenu d'un justificatif — jamais d'URL directe
// vers Vercel Blob ou vers storage/. Chaque accès passe par ici, donc par
// une vérification de rôle, ce qui rend un journal d'accès possible plus
// tard si nécessaire (VIEW_SENSITIVE existe déjà dans AuditAction).
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string; docId: string }> }
) {
  const actor = await requireGestionRole(['COMPTABLE', 'DIRECTION', 'TERRAIN']);
  if (!actor) return NextResponse.json({ error: 'Accès refusé.' }, { status: 403 });

  const { id, docId } = await params;
  const document = await prisma.document.findUnique({ where: { id: docId } });
  if (!document || document.transactionId !== id) {
    return NextResponse.json({ error: 'Document introuvable.' }, { status: 404 });
  }

  if (actor.role === 'TERRAIN') {
    const entry = await prisma.transaction.findUnique({ where: { id }, select: { createdById: true } });
    if (entry?.createdById !== actor.id) {
      return NextResponse.json({ error: 'Accès refusé.' }, { status: 403 });
    }
  }

  const data = await readDocument(document.blobKey);
  if (!data) return NextResponse.json({ error: 'Fichier introuvable.' }, { status: 404 });

  return new NextResponse(new Uint8Array(data), {
    headers: {
      'Content-Type': document.mimeType,
      'Content-Disposition': `inline; filename="${document.fileName.replace(/"/g, '')}"`
    }
  });
}
