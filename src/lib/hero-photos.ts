// Photos d'enfants qui tournent, au hasard, dans les bandeaux des pages.
// Refaites le 06/10/2026 depuis les originaux du Drive : une version
// panoramique (2,4:1, visages entiers dans le cadre) pour l'ordinateur et une
// version verticale pour le téléphone (voir hero-mobile.ts). Choisies pour la
// joie, les regards et les détails ; aucune photo du programme RÊVES 2.
export const HERO_PHOTOS = [
  { src: '/hero-desktop/boys-2023-rentree-ol-photo-007.webp', position: '50% 50%' },
  { src: '/hero-desktop/boys-2023-rentree-ol-photo-001.webp', position: '50% 50%' },
  { src: '/hero-desktop/centre-aere-2024-07-ol-photo-006.webp', position: '50% 50%' },
  { src: '/hero-desktop/centre-aere-2024-07-ol-photo-009.webp', position: '50% 50%' },
  { src: '/hero-desktop/centre-aere-2023-12-25-ol-photo-013.webp', position: '50% 50%' },
  { src: '/hero-desktop/centre-aere-2023-02-tim-pt-002.webp', position: '50% 50%' },
  { src: '/hero-desktop/centre-aere-2023-02-tim-pt-009.webp', position: '50% 50%' },
  { src: '/hero-desktop/centre-aere-2023-02-tim-pt-012.webp', position: '50% 50%' },
  { src: '/hero-desktop/centre-aere-2023-02-tim-pt-015.webp', position: '50% 50%' },
  { src: '/hero-desktop/centre-aere-2024-07-camp-23-ol-photo-023.webp', position: '50% 50%' },
  { src: '/hero-desktop/centre-aere-2024-03-ol-photo-002.webp', position: '50% 50%' },
  { src: '/hero-desktop/centre-aere-2024-03-ol-photo-003.webp', position: '50% 50%' },
  { src: '/hero-desktop/centre-aere-2024-03-ol-photo-009.webp', position: '50% 50%' },
  { src: '/hero-desktop/centre-aere-2024-02-ol-photo-002.webp', position: '50% 50%' },
  { src: '/hero-desktop/centre-aere-2024-02-ol-photo-006.webp', position: '50% 50%' },
  { src: '/hero-desktop/centre-aere-2024-02-ol-photo-010.webp', position: '50% 50%' },
  { src: '/hero-desktop/centre-aere-2022-06-tim-0160.webp', position: '50% 50%' },
  { src: '/hero-desktop/centre-aere-2022-06-tim-7516.webp', position: '50% 50%' },
  { src: '/hero-desktop/centre-aere-2023-12-02-ol-photo-008.webp', position: '50% 50%' },
  { src: '/hero-desktop/centre-aere-2023-12-02-ol-photo-012.webp', position: '50% 50%' },
  { src: '/hero-desktop/centre-aere-2023-09-17-ol-photo-012.webp', position: '50% 50%' },
  { src: '/hero-desktop/boys-2022-noel-tim-pt-001.webp', position: '50% 50%' },
  { src: '/hero-desktop/boys-2022-noel-tim-pt-004.webp', position: '50% 50%' },
  { src: '/hero-desktop/boys-2022-noel-tim-pt-012.webp', position: '50% 50%' }
] as const;

// Photos sans version panoramique (visages trop grands pour une bande large) :
// elles ne passent que sur téléphone et tablette.
export const DESKTOP_SKIP: ReadonlySet<string> = new Set([
  '/hero-accueil/bonnets-1.webp',
  '/hero-accueil/bonnets-2.webp',
  '/hero-accueil/peace.webp',
  '/hero-accueil/sourire.webp',
  '/hero-accueil/trois-garcons.webp',
  '/photos/drive/boys-noel-2022.jpg'
]);

// Photos de basse résolution (anciennes photos de la page du village) : elles
// ne passent que sur ordinateur, trop floues une fois agrandies sur téléphone.
export const MOBILE_SKIP: ReadonlySet<string> = new Set([
  '/histoire/village-hero.webp',
  '/histoire/village-terrain-ciel.webp',
  '/histoire/village-terrain-equipe.webp',
  '/histoire/village-terrain-chemin.webp',
  '/histoire/village-terrain-palmier.webp',
  '/histoire/village-terrain-piste.webp',
  '/histoire/village-chantier-coucher-soleil.webp',
  '/histoire/2018-kasangulu.webp',
  '/histoire/2018-kasangulu-2.webp',
  '/histoire/2023-kasangulu.webp',
  '/histoire/2023-kasangulu-2.webp'
]);
