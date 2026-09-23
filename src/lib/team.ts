import { prisma } from '@/lib/prisma';
import { Prisma, type UserRole } from '@prisma/client';

// Logique du module Équipe et paie (jalon 8).
//
// Matrice d'accès du plan : RH a la pleine main sur l'annuaire, les contrats
// et la paie. DIRECTION lit tout (annuaire complet, contrats, paie) sans
// pouvoir modifier. COMPTABLE ne voit que le registre des versements de paie
// (les montants, pour son rapprochement comptable) — jamais l'annuaire complet
// ni les contrats. TERRAIN ne voit qu'un annuaire minimal de son équipe (nom,
// fonction, engagement), sans coordonnées ni aucune donnée salariale. LECTURE
// n'a aucun accès à ce module.

// Étiquettes partagées entre composants serveur et client. Volontairement
// placées ici plutôt que dans TeamManager.tsx (`'use client'`) : un composant
// serveur qui importe une constante depuis un module client ne la reçoit pas
// réellement (Next.js remplace les exports d'un module client par une
// référence pour l'hydratation) — bug réel trouvé en testant ce jalon, où
// `page.tsx` affichait la valeur brute de l'enum au lieu du libellé français.
export const ENGAGEMENT_LABELS: Record<string, string> = {
  SALARIED_DRC: 'Salarié — RDC',
  CONTRACTOR_DRC: 'Prestataire — RDC',
  VOLUNTEER_FRANCE: 'Bénévole — France',
  VOLUNTEER_DRC: 'Bénévole — RDC',
  BOARD_MEMBER: 'Membre du bureau'
};

export function canManageTeam(role: UserRole): boolean {
  return role === 'RH';
}
export function canViewTeamDirectory(role: UserRole): boolean {
  return role === 'RH' || role === 'DIRECTION';
}
export function canViewTeamDirectoryBasic(role: UserRole): boolean {
  return role === 'TERRAIN';
}
export function canViewPayrollLedger(role: UserRole): boolean {
  return role === 'RH' || role === 'DIRECTION' || role === 'COMPTABLE';
}
export function canManagePayroll(role: UserRole): boolean {
  return role === 'RH';
}

export class TeamError extends Error {}

/**
 * Passe un versement en APPROVED — simple étape de revue avant paiement,
 * réservée à RH comme le reste de la gestion de la paie (pas de séparation
 * des tâches ici : contrairement à une écriture comptable, il n'y a qu'un
 * seul rôle habilité à toucher la paie).
 */
export async function approvePayrollEntry(payrollEntryId: string) {
  const entry = await prisma.payrollEntry.findUnique({ where: { id: payrollEntryId } });
  if (!entry) throw new TeamError('Versement introuvable.');
  if (entry.status !== 'DRAFT') {
    throw new TeamError('Seul un versement en brouillon peut être approuvé.');
  }
  return prisma.payrollEntry.update({ where: { id: payrollEntryId }, data: { status: 'APPROVED' } });
}

/**
 * Marque un versement comme payé et génère l'écriture de dépense
 * correspondante — même règle que les dons (voir donations.ts) : une et une
 * seule Transaction par versement, relation 1-1 garantie par la contrainte
 * `@unique` sur `Transaction.payrollEntryId`. La Transaction créée démarre en
 * DRAFT et entre dans le cycle normal de validation/verrouillage déjà
 * construit au jalon 6 — pas de raccourci qui la ferait passer validée
 * d'office.
 *
 * Idempotente : appeler deux fois pour le même versement ne crée jamais de
 * doublon.
 */
export async function markPayrollEntryPaid(
  payrollEntryId: string,
  actorId: string,
  paidOn: Date
): Promise<{ alreadyPaid: boolean }> {
  const entry = await prisma.payrollEntry.findUnique({
    where: { id: payrollEntryId },
    include: { teamMember: { select: { firstName: true, lastName: true } } }
  });
  if (!entry) throw new TeamError('Versement introuvable.');

  if (entry.status === 'PAID') {
    return { alreadyPaid: true };
  }
  if (entry.status !== 'APPROVED') {
    throw new TeamError('Seul un versement approuvé peut être marqué comme payé.');
  }

  const monthLabel = `${String(entry.periodMonth).padStart(2, '0')}/${entry.periodYear}`;

  try {
    await prisma.$transaction(async (tx) => {
      await tx.payrollEntry.update({
        where: { id: payrollEntryId },
        data: { status: 'PAID', paidOn }
      });

      await tx.transaction.create({
        data: {
          kind: 'EXPENSE',
          status: 'DRAFT',
          occurredOn: paidOn,
          label: `Salaire — ${entry.teamMember.firstName} ${entry.teamMember.lastName} — ${monthLabel}`,
          amount: entry.amount,
          currency: entry.currency,
          fxRate: entry.fxRate,
          amountEur: entry.amountEur,
          projectId: entry.projectId,
          payrollEntryId,
          createdById: actorId
        }
      });
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      // Rejeu (double clic, requête relancée) arrivé entre la lecture
      // ci-dessus et l'écriture : traité comme un doublon inoffensif, la
      // première tentative a déjà tout créé.
      return { alreadyPaid: true };
    }
    throw error;
  }

  return { alreadyPaid: false };
}
