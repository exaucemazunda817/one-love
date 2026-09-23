import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireGestionRole } from '@/lib/auth';
import { transactionCategorySchema } from '@/lib/schemas';

export async function GET() {
  // Toute personne pouvant saisir une écriture doit pouvoir lire la liste
  // des catégories pour remplir le formulaire — TERRAIN inclus.
  const actor = await requireGestionRole(['DIRECTION', 'COMPTABLE', 'TERRAIN']);
  if (!actor) return NextResponse.json({ error: 'Accès refusé.' }, { status: 403 });

  const categories = await prisma.transactionCategory.findMany({
    where: { isActive: true },
    orderBy: [{ kind: 'asc' }, { label: 'asc' }]
  });
  return NextResponse.json({ categories });
}

export async function POST(request: NextRequest) {
  const actor = await requireGestionRole(['COMPTABLE']);
  if (!actor) return NextResponse.json({ error: 'Accès réservé au comptable.' }, { status: 403 });

  const body = await request.json().catch(() => null);
  const parsed = transactionCategorySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Formulaire invalide.', issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }
  const data = parsed.data;

  const existing = await prisma.transactionCategory.findUnique({ where: { code: data.code } });
  if (existing) {
    return NextResponse.json({ error: 'Ce code existe déjà.' }, { status: 409 });
  }

  // Arborescence à un seul niveau (voir schema.prisma) : on refuse un parent
  // qui a lui-même un parent, plutôt que de laisser une hiérarchie s'empiler
  // silencieusement.
  if (data.parentId) {
    const parent = await prisma.transactionCategory.findUnique({ where: { id: data.parentId } });
    if (!parent) {
      return NextResponse.json({ error: 'Catégorie parente introuvable.' }, { status: 400 });
    }
    if (parent.parentId) {
      return NextResponse.json(
        { error: 'Une catégorie parente ne peut pas elle-même avoir un parent (un seul niveau).' },
        { status: 400 }
      );
    }
    if (parent.kind !== data.kind) {
      return NextResponse.json(
        { error: 'Une sous-catégorie doit avoir le même type (recette/dépense) que son parent.' },
        { status: 400 }
      );
    }
  }

  const category = await prisma.transactionCategory.create({
    data: {
      code: data.code,
      label: data.label,
      kind: data.kind,
      parentId: data.parentId || null
    }
  });

  await prisma.auditLog.create({
    data: {
      actorId: actor.id,
      actorEmail: actor.email,
      action: 'CREATE',
      entity: 'TransactionCategory',
      entityId: category.id,
      changes: { code: category.code, label: category.label, kind: category.kind }
    }
  });

  return NextResponse.json({ id: category.id }, { status: 201 });
}
