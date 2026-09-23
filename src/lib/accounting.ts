import { prisma } from '@/lib/prisma';
import type { UserRole, Currency } from '@prisma/client';

// Logique métier de la comptabilité de trésorerie (jalon 6). Comptabilité de
// trésorerie assumée — pas de partie double, pas de plan comptable ANC
// 2018-06 : disproportionné pour cette association, et inutilisable sans
// quelqu'un sachant tenir une partie double. Voir prisma/schema.prisma pour
// le détail des décisions de modélisation.

// --- Rôles ---------------------------------------------------------------
// Matrice reprise du plan : seul COMPTABLE a la pleine main, DIRECTION lit et
// valide, TERRAIN ne fait que saisir ses dépenses de terrain, LECTURE ne voit
// que le bilan agrégé (jamais le journal détaillé, ligne par ligne).

export function canViewAccountingSetup(role: UserRole): boolean {
  return role === 'COMPTABLE' || role === 'DIRECTION';
}
export function canManageAccountingSetup(role: UserRole): boolean {
  return role === 'COMPTABLE';
}
export function canViewJournal(role: UserRole): boolean {
  return role === 'COMPTABLE' || role === 'DIRECTION';
}
export function canCreateFullEntry(role: UserRole): boolean {
  return role === 'COMPTABLE';
}
export function canCreateTerrainExpense(role: UserRole): boolean {
  return role === 'TERRAIN' || role === 'COMPTABLE';
}
export function canValidateEntry(role: UserRole): boolean {
  return role === 'COMPTABLE' || role === 'DIRECTION';
}
export function canLockEntry(role: UserRole): boolean {
  return role === 'COMPTABLE';
}
export function canViewBalanceSheet(role: UserRole): boolean {
  return role === 'COMPTABLE' || role === 'DIRECTION' || role === 'LECTURE';
}
export function canExportJournal(role: UserRole): boolean {
  return role === 'COMPTABLE' || role === 'DIRECTION';
}

// --- Devises ---------------------------------------------------------------
//
// Convention à respecter PARTOUT dans ce module, sans exception : `fxRate`
// signifie « 1 EUR = fxRate unités de `currency` » (ex. 2900 pour le CDF).
// C'est le sens dans lequel un bureau de change affiche ses taux, celui que
// la personne qui saisit l'écriture va lire sur son bordereau. Inverser ce
// sens quelque part serait une source d'erreur silencieuse sur de l'argent
// réel — d'où ce commentaire répété à chaque endroit qui touche à fxRate.
export function computeAmountEur(amount: string, currency: Currency, fxRate: string): string {
  const amountNum = Number(amount);
  if (!Number.isFinite(amountNum)) throw new Error('Montant invalide.');
  if (currency === 'EUR') return amountNum.toFixed(2);

  const rateNum = Number(fxRate);
  if (!Number.isFinite(rateNum) || rateNum <= 0) throw new Error('Taux de change invalide.');
  return (amountNum / rateNum).toFixed(2);
}

// --- Cycle de vie d'une écriture --------------------------------------------
//
// DRAFT → VALIDATED → LOCKED, ou DRAFT → CANCELLED. Jamais d'autre chemin :
// une écriture validée ne redevient pas brouillon, une écriture verrouillée
// ne se modifie plus jamais (exercice clos).

export class AccountingError extends Error {}

/**
 * Valide une écriture en brouillon. Séparation des tâches OBLIGATOIRE : la
 * personne qui valide ne peut pas être celle qui a saisi — sans ce
 * contrôle, la validation ne servirait à rien.
 */
export async function validateTransaction(transactionId: string, actorId: string) {
  const entry = await prisma.transaction.findUnique({ where: { id: transactionId } });
  if (!entry) throw new AccountingError('Écriture introuvable.');
  if (entry.status !== 'DRAFT') {
    throw new AccountingError('Seule une écriture en brouillon peut être validée.');
  }
  if (entry.createdById && entry.createdById === actorId) {
    throw new AccountingError(
      'Vous ne pouvez pas valider une écriture que vous avez saisie vous-même.'
    );
  }
  return prisma.transaction.update({
    where: { id: transactionId },
    data: { status: 'VALIDATED', validatedById: actorId, validatedAt: new Date() }
  });
}

/** Verrouille (clôture) une écriture déjà validée — dernière étape, plus de
 * retour en arrière possible. */
export async function lockTransaction(transactionId: string) {
  const entry = await prisma.transaction.findUnique({ where: { id: transactionId } });
  if (!entry) throw new AccountingError('Écriture introuvable.');
  if (entry.status !== 'VALIDATED') {
    throw new AccountingError('Seule une écriture déjà validée peut être verrouillée.');
  }
  return prisma.transaction.update({
    where: { id: transactionId },
    data: { status: 'LOCKED', lockedAt: new Date() }
  });
}

/**
 * Annule une écriture — réservée aux brouillons : une erreur de saisie
 * repérée avant validation se corrige en annulant puis en resaisissant,
 * jamais en supprimant (la trace CANCELLED reste dans le journal).
 */
export async function cancelTransaction(
  transactionId: string,
  actorId: string,
  actorRole: UserRole
) {
  const entry = await prisma.transaction.findUnique({ where: { id: transactionId } });
  if (!entry) throw new AccountingError('Écriture introuvable.');
  if (entry.status !== 'DRAFT') {
    throw new AccountingError(
      'Seule une écriture en brouillon peut être annulée — une écriture validée ou verrouillée reste dans l’historique.'
    );
  }
  if (entry.createdById !== actorId && actorRole !== 'COMPTABLE') {
    throw new AccountingError('Vous ne pouvez annuler que vos propres écritures.');
  }
  return prisma.transaction.update({ where: { id: transactionId }, data: { status: 'CANCELLED' } });
}

// --- Bilan par projet --------------------------------------------------

export interface ProjectBalance {
  projectId: string | null;
  projectName: string;
  incomeEur: number;
  expenseEur: number;
  balanceEur: number;
}

/**
 * Bilan par projet — uniquement à partir des écritures VALIDATED ou LOCKED :
 * un brouillon n'est pas encore une figure fiable, il ne doit pas apparaître
 * dans un total présenté comme officiel. Les écritures TRANSFER (mouvement
 * interne entre comptes, pas un gain ni une perte réelle) sont exclues des
 * totaux — leur usage n'est pas encore construit dans l'interface.
 */
export async function getProjectBalanceSheet(): Promise<ProjectBalance[]> {
  const grouped = await prisma.transaction.groupBy({
    by: ['projectId', 'kind'],
    where: { status: { in: ['VALIDATED', 'LOCKED'] }, kind: { in: ['INCOME', 'EXPENSE'] } },
    _sum: { amountEur: true }
  });

  const projectIds = [...new Set(grouped.map((g) => g.projectId).filter((id): id is string => Boolean(id)))];
  const projects = projectIds.length
    ? await prisma.project.findMany({ where: { id: { in: projectIds } }, select: { id: true, name: true } })
    : [];
  const nameById = new Map(projects.map((p) => [p.id, p.name]));

  const byProject = new Map<string, ProjectBalance>();
  for (const group of grouped) {
    const key = group.projectId ?? '__general__';
    if (!byProject.has(key)) {
      byProject.set(key, {
        projectId: group.projectId,
        projectName: group.projectId ? (nameById.get(group.projectId) ?? 'Projet supprimé') : 'Fonds général',
        incomeEur: 0,
        expenseEur: 0,
        balanceEur: 0
      });
    }
    const entry = byProject.get(key)!;
    const sum = Number(group._sum.amountEur ?? 0);
    if (group.kind === 'INCOME') entry.incomeEur += sum;
    else entry.expenseEur += sum;
  }

  return [...byProject.values()]
    .map((entry) => ({ ...entry, balanceEur: entry.incomeEur - entry.expenseEur }))
    .sort((a, b) => b.balanceEur - a.balanceEur);
}

/** Solde d'un compte de trésorerie, DANS SA PROPRE DEVISE (pas en euros) :
 * c'est ce qu'on veut savoir pour une caisse — combien il reste réellement
 * dedans, pas sa contre-valeur. Mêmes règles : VALIDATED/LOCKED seulement. */
export async function getAccountBalance(accountId: string): Promise<number> {
  const grouped = await prisma.transaction.groupBy({
    by: ['kind'],
    where: { accountId, status: { in: ['VALIDATED', 'LOCKED'] }, kind: { in: ['INCOME', 'EXPENSE'] } },
    _sum: { amount: true }
  });
  let balance = 0;
  for (const group of grouped) {
    const sum = Number(group._sum.amount ?? 0);
    balance += group.kind === 'INCOME' ? sum : -sum;
  }
  return balance;
}
