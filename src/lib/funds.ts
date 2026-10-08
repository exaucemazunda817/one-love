// Raisons d'un don et fonds correspondants (08/10/2026, demande de Mazunda) :
// le formulaire de don demande d'abord « pourquoi donnez-vous ? », et chaque
// paiement est rangé dans le bon fonds pour les bilans.
//
//   association → aucun projet : fonds général, selon les besoins
//   village     → projet `one-love-village`
//   parrainage  → projet `parrainage` + inscription dans la liste des parrains
//
// Fichier sans dépendance serveur : il est lu par le formulaire (navigateur)
// comme par les routes de paiement. Les deux slugs doivent exister dans la
// table `projects` : sans la ligne, un don fléché serait refusé à
// l'ouverture du paiement (route /api/dons/stripe/session), jamais rangé
// en silence dans le fonds général.

export type DonationReason = 'association' | 'village' | 'parrainage';

export const VILLAGE_SLUG = 'one-love-village';
/** Fonds interne (non publié, non proposé ailleurs) où arrivent les mensualités de parrainage. */
export const SPONSORSHIP_FUND_SLUG = 'parrainage';

/** Lecture du paramètre `?affectation=` d'un lien « Soutenir ce projet ». */
export function reasonFromParam(value: string | null): DonationReason | null {
  if (value === 'village') return 'village';
  if (value === 'parrainage') return 'parrainage';
  if (value === 'association') return 'association';
  return null;
}
