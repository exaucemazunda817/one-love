import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireGestionRole } from '@/lib/auth';
import { childEnrollmentSchema } from '@/lib/schemas';
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
  const parsed = childEnrollmentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Formulaire invalide.', issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }
  const data = parsed.data;

  const project = await prisma.project.findUnique({ where: { id: data.projectId } });
  if (!project) return NextResponse.json({ error: 'Projet introuvable.' }, { status: 400 });

  const existing = await prisma.childEnrollment.findUnique({
    where: { childId_projectId: { childId: id, projectId: data.projectId } }
  });
  if (existing) {
    return NextResponse.json({ error: 'Déjà inscrit à ce projet.' }, { status: 409 });
  }

  const enrollment = await prisma.childEnrollment.create({
    data: { childId: id, projectId: data.projectId, enrolledOn: new Date(data.enrolledOn) }
  });

  return NextResponse.json({ id: enrollment.id }, { status: 201 });
}
