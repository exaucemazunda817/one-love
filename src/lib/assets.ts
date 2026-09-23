import { prisma } from '@/lib/prisma';
import type { UserRole, Asset } from '@prisma/client';

// Logique du module Inventaire (jalon 9) — voir le commentaire au-dessus du
// modèle `Asset` dans prisma/schema.prisma pour les décisions de fond.
//
// Aucun rôle dédié à la logistique n'existe dans la matrice du plan : DIRECTION
// et TERRAIN (présent à Kinshasa, là où sont les biens) gèrent le registre et
// les affectations. COMPTABLE lit le registre pour sa valeur financière
// (montant d'acquisition, projet financeur) mais ne le modifie jamais. RH et
// LECTURE n'ont aucun accès à ce module.

// Étiquettes partagées entre composants serveur et client — placées ici, pas
// dans un composant `'use client'`, pour la même raison que ENGAGEMENT_LABELS
// dans lib/team.ts : un composant serveur qui importe une constante depuis un
// module client ne reçoit pas sa vraie valeur (vrai bug trouvé au jalon 8).
export const ASSET_CATEGORY_LABELS: Record<string, string> = {
  VEHICLE: 'Véhicule',
  FURNITURE: 'Mobilier',
  IT_EQUIPMENT: 'Informatique',
  TEACHING_MATERIAL: 'Matériel pédagogique',
  MEDICAL_EQUIPMENT: 'Matériel médical',
  REAL_ESTATE: 'Immobilier',
  OTHER: 'Autre'
};
export const ASSET_CONDITION_LABELS: Record<string, string> = {
  NEW: 'Neuf',
  GOOD: 'Bon état',
  WORN: 'Usagé',
  OUT_OF_ORDER: 'Hors service'
};
export const ASSET_STATUS_LABELS: Record<string, string> = {
  IN_USE: 'En service',
  IN_STOCK: 'En stock',
  UNDER_REPAIR: 'En réparation',
  DISPOSED: 'Retiré',
  LOST: 'Perdu'
};

export function canManageAssets(role: UserRole): boolean {
  return role === 'DIRECTION' || role === 'TERRAIN';
}
export function canViewAssetRegistry(role: UserRole): boolean {
  return role === 'DIRECTION' || role === 'TERRAIN' || role === 'COMPTABLE';
}

/** BIEN-2026-0001, BIEN-2026-0002… — même principe que le code de référence
 * des enfants : un identifiant stable, jamais réutilisé. */
export async function generateInventoryCode(): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `BIEN-${year}-`;
  const count = await prisma.asset.count({ where: { inventoryCode: { startsWith: prefix } } });
  return `${prefix}${String(count + 1).padStart(4, '0')}`;
}

/**
 * Valeur indicative en euros, en linéaire simple à partir de la valeur
 * d'acquisition et de la durée de vie utile. Purement informative pour
 * l'inventaire et les rapports aux bailleurs — voir le commentaire du modèle
 * `Asset` : ce n'est JAMAIS une écriture comptable, l'association ne
 * pratique pas l'amortissement (comptabilité de trésorerie).
 * `null` si les données nécessaires (montant, durée de vie, date
 * d'acquisition) manquent — pas de valeur inventée par défaut.
 */
export function computeIndicativeValueEur(
  asset: Pick<Asset, 'acquisitionEur' | 'usefulLifeYears' | 'acquiredOn'>
): number | null {
  if (!asset.acquisitionEur || !asset.usefulLifeYears || asset.usefulLifeYears <= 0 || !asset.acquiredOn) {
    return null;
  }
  const acquisitionEur = Number(asset.acquisitionEur);
  const elapsedYears = (Date.now() - asset.acquiredOn.getTime()) / (365.25 * 24 * 3600 * 1000);
  const remainingFraction = Math.max(0, 1 - elapsedYears / asset.usefulLifeYears);
  return Math.round(acquisitionEur * remainingFraction * 100) / 100;
}
