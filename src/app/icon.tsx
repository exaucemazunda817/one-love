import { ImageResponse } from 'next/og';

// Favicon généré à la volée (Next.js le sert automatiquement en /icon,
// référencé dans le <head>) : le logo réel (public/brand/logo-one-love.png)
// est un mot-symbole horizontal en 185×55, illisible une fois réduit à la
// taille d'un onglet. Le cœur, déjà l'élément central du logo entre « One »
// et « Love », redessiné en aplat pour rester net à 32 px — pas une
// approximation, c'est la même idée visuelle que la marque réelle.
export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#1a1917',
          borderRadius: 7
        }}
      >
        <svg width="19" height="19" viewBox="0 0 24 24" fill="#ffb119">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
