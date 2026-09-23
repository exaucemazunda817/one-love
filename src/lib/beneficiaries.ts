import { prisma } from '@/lib/prisma';
import type { UserRole } from '@prisma/client';

// Logique du module Bénéficiaires (jalon 7) — voir le commentaire au-dessus
// du modèle `Child` dans prisma/schema.prisma pour les règles de fond
// (aucun champ de notes libres, aucun contenu clinique, identité séparée du
// reste du logiciel).
//
// Matrice d'accès du plan : TERRAIN est le SEUL rôle à lire ou écrire
// l'identité d'un enfant. DIRECTION ne voit que des compteurs agrégés,
// jamais un nom. COMPTABLE, RH et LECTURE n'ont aucun accès.

export function canManageBeneficiariesGate(role: UserRole): boolean {
  return role === 'DIRECTION';
}
export function canViewAggregateOnly(role: UserRole): boolean {
  return role === 'DIRECTION';
}
export function canAccessChildIdentity(role: UserRole): boolean {
  return role === 'TERRAIN';
}

export async function isBeneficiariesModuleEnabled(): Promise<boolean> {
  const settings = await prisma.appSettings.findUnique({ where: { id: 'singleton' } });
  return settings?.beneficiariesEnabled ?? false;
}

/**
 * Active le module. Volontairement irréversible depuis cette fonction (pas
 * de « désactiver ») : une fois de vraies fiches créées, couper l'accès
 * sans plan de conservation/suppression serait pire que de le laisser actif.
 * Si une désactivation devient nécessaire, elle doit être une décision
 * consciente prise directement en base, pas un bouton qu'on presse par erreur.
 */
export async function enableBeneficiariesModule(actorId: string) {
  return prisma.appSettings.upsert({
    where: { id: 'singleton' },
    update: { beneficiariesEnabled: true, beneficiariesEnabledAt: new Date(), beneficiariesEnabledById: actorId },
    create: {
      id: 'singleton',
      beneficiariesEnabled: true,
      beneficiariesEnabledAt: new Date(),
      beneficiariesEnabledById: actorId
    }
  });
}

/** OL-2026-0001, OL-2026-0002… — jamais le nom, c'est ce code qui circule
 * partout ailleurs (comptabilité, exports, rapports). */
export async function generateReferenceCode(): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `OL-${year}-`;
  const count = await prisma.child.count({ where: { referenceCode: { startsWith: prefix } } });
  return `${prefix}${String(count + 1).padStart(4, '0')}`;
}

export interface BeneficiaryAggregate {
  totalActive: number;
  byStatus: { status: string; count: number }[];
  byProject: { projectId: string; projectName: string; count: number }[];
}

/** Compteurs pour le tableau de bord DIRECTION — jamais un nom, jamais une
 * liste individuelle. */
export async function getBeneficiaryAggregate(): Promise<BeneficiaryAggregate> {
  const [totalActive, statusGroups, enrollments] = await Promise.all([
    prisma.child.count({ where: { status: { notIn: ['ARCHIVED', 'LOST_CONTACT'] } } }),
    prisma.child.groupBy({ by: ['status'], _count: { _all: true } }),
    prisma.childEnrollment.findMany({
      where: { endedOn: null },
      select: { projectId: true, project: { select: { name: true } } }
    })
  ]);

  const byProjectMap = new Map<string, { projectId: string; projectName: string; count: number }>();
  for (const enrollment of enrollments) {
    const existing = byProjectMap.get(enrollment.projectId);
    if (existing) existing.count += 1;
    else byProjectMap.set(enrollment.projectId, { projectId: enrollment.projectId, projectName: enrollment.project.name, count: 1 });
  }

  return {
    totalActive,
    byStatus: statusGroups.map((g) => ({ status: g.status, count: g._count._all })),
    byProject: [...byProjectMap.values()]
  };
}
