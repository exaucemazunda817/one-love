// Photos des One Love Boys, classées par année comme dans le Drive de
// l'association (One Love - Photographie / One Love - Boys). Originaux du
// photographe, réduits à 1 600 px en WebP (05/10/2026).
import type { CentreMonth } from '@/lib/centre-aere';

export const BOYS_ALBUMS: CentreMonth[] = [
  {
    key: 'boys-2022-noel',
    year: '2022',
    label: { fr: 'Noël 2022', en: 'Christmas 2022' },
    caption: { fr: 'La séance photo de Noël à la One Love House : bonnets, rires et complicité.', en: 'The Christmas photo shoot at the One Love House: hats, laughter and friendship.' },
    photos: [{ src: '/photos/drive/boys-noel-2022.jpg', w: 2560, h: 1707 }, { src: '/one-love-boys/2022-noel/01.webp', w: 1280, h: 1600 }, { src: '/one-love-boys/2022-noel/02.webp', w: 1337, h: 1600 }, { src: '/one-love-boys/2022-noel/03.webp', w: 1280, h: 1600 }, { src: '/one-love-boys/2022-noel/04.webp', w: 1280, h: 1600 }, { src: '/one-love-boys/2022-noel/05.webp', w: 1280, h: 1600 }, { src: '/one-love-boys/2022-noel/06.webp', w: 1280, h: 1600 }, { src: '/one-love-boys/2022-noel/07.webp', w: 1280, h: 1600 }, { src: '/one-love-boys/2022-noel/08.webp', w: 1280, h: 1600 }, { src: '/one-love-boys/2022-noel/09.webp', w: 1280, h: 1600 }, { src: '/one-love-boys/2022-noel/10.webp', w: 1600, h: 1067 }, { src: '/one-love-boys/2022-noel/11.webp', w: 1600, h: 1032 }, { src: '/one-love-boys/2022-noel/12.webp', w: 1600, h: 1067 }, { src: '/one-love-boys/2022-noel/13.webp', w: 1280, h: 1600 }]
  },
  {
    key: 'boys-2023-famille',
    year: '2023',
    label: { fr: 'Photo de famille 2023', en: 'Family photo 2023' },
    caption: { fr: 'Les garçons, l’équipe et les fondateurs réunis.', en: 'The boys, the team and the founders together.' },
    photos: [{ src: '/one-love-boys/2023-famille/01.webp', w: 1600, h: 1067 }, { src: '/one-love-boys/2023-famille/02.webp', w: 1600, h: 1067 }, { src: '/one-love-boys/2023-famille/03.webp', w: 1600, h: 1067 }]
  },
  {
    key: 'boys-2023-rentree',
    year: '2023',
    label: { fr: 'Rentrée 2023', en: 'Back to school 2023' },
    caption: { fr: 'En uniforme, sac au dos, sur le chemin de l’école.', en: 'In uniform, backpack on, on the way to school.' },
    photos: [{ src: '/one-love-boys/2023-rentree/01.webp', w: 1600, h: 1067 }, { src: '/one-love-boys/2023-rentree/02.webp', w: 1600, h: 1067 }, { src: '/one-love-boys/2023-rentree/03.webp', w: 1280, h: 1600 }, { src: '/one-love-boys/2023-rentree/04.webp', w: 1280, h: 1600 }, { src: '/one-love-boys/2023-rentree/05.webp', w: 1280, h: 1600 }]
  }
];
