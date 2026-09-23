import Image from 'next/image';
import { org, identity, quotes } from '@/lib/content';

// Page d'attente du jalon 0. Elle existe pour prouver que la chaîne complète
// fonctionne — police, tokens de couleur, image, construction de production —
// avant de construire la vraie vitrine au jalon 1.
export default function HomePage() {
  return (
    <main className="min-h-screen bg-ol-night text-ol-cream">
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-10 px-5 py-20 sm:px-8">
        <Image
          src="/brand/logo-one-love.png"
          alt={org.name}
          width={185}
          height={55}
          priority
          className="h-auto w-[185px] brightness-0 invert"
        />

        <div className="space-y-5">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-ol-amber">
            Site en construction
          </p>
          <h1 className="text-hero font-black leading-tight sm:text-display">
            {org.tagline}
          </h1>
          <p className="max-w-measure text-lg leading-relaxed text-ol-sand">
            {quotes.hero}
          </p>
        </div>

        <div className="max-w-measure space-y-3 border-l-2 border-ol-ember pl-5">
          <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-ol-amber">
            Notre mission
          </h2>
          <p className="leading-relaxed text-ol-sand">{identity.mission}</p>
        </div>

        <p className="text-sm text-ol-sand">
          Le site actuel reste accessible sur{' '}
          <a
            href={org.websiteUrl}
            className="font-bold text-ol-amber underline underline-offset-4"
          >
            associationonelove.org
          </a>
          .
        </p>
      </div>
    </main>
  );
}
