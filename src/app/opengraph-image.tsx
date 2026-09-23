import { ImageResponse } from 'next/og';
import { org, identity } from '@/lib/content';

// Aperçu affiché quand un lien du site est partagé (WhatsApp, Facebook,
// Messenger) — canal de diffusion principal en RDC. Sans ce fichier, le
// partage n'affichait aucune vignette, seulement du texte.
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px 96px',
          background: '#1a1917',
          color: '#fbf8f4'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="#ffb119">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          <span
            style={{
              fontSize: 26,
              fontWeight: 700,
              letterSpacing: 4,
              textTransform: 'uppercase',
              color: '#ffb119'
            }}
          >
            Association loi 1901 · Kinshasa, RDC
          </span>
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 76,
            fontWeight: 900,
            lineHeight: 1.08,
            marginTop: 32,
            maxWidth: 980
          }}
        >
          {org.tagline}
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 30,
            lineHeight: 1.4,
            marginTop: 28,
            maxWidth: 880,
            color: '#f2ece3'
          }}
        >
          {identity.mission}
        </div>
      </div>
    ),
    { ...size }
  );
}
