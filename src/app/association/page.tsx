import type { Metadata } from 'next';
import { PageHero } from '@/components/PageHero';
import { Reveal } from '@/components/Reveal';
import { org, identity, foundersWord, teamWord, quotes } from '@/lib/content';

export const metadata: Metadata = {
  title: "L'association",
  description: identity.vision
};

export default function AssociationPage() {
  return (
    <>
      <PageHero
        eyebrow="Qui nous sommes"
        title="Une équipe, une conviction"
        intro={quotes.need}
      />

      <section className="bg-ol-white">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <div className="grid gap-12 md:grid-cols-2">
            <Reveal>
              <div className="space-y-3">
                <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-ol-ember-ink">
                  Notre vision
                </h2>
                <p className="max-w-measure leading-relaxed text-ol-ink">{identity.vision}</p>
              </div>
            </Reveal>
            <Reveal delay={90}>
              <div className="space-y-3">
                <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-ol-ember-ink">
                  Notre mission
                </h2>
                <p className="max-w-measure leading-relaxed text-ol-ink">{identity.mission}</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-ol-cream">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <Reveal>
            <h2 className="text-3xl font-black text-ol-charcoal sm:text-4xl">Nos objectifs</h2>
          </Reveal>
          <ol className="mt-8 grid gap-5 sm:grid-cols-3">
            {identity.objectifs.map((objectif, index) => (
              <Reveal key={objectif} delay={index * 90}>
                <li className="h-full rounded-xl border border-ol-line bg-ol-white p-6">
                  <span className="text-3xl font-black text-ol-ember">{index + 1}</span>
                  <p className="mt-3 text-[0.95rem] leading-relaxed text-ol-ink">{objectif}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-ol-white">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <Reveal>
            <h2 className="text-3xl font-black text-ol-charcoal sm:text-4xl">
              Les fondateurs
            </h2>
          </Reveal>
          <Reveal delay={90}>
            <figure className="mt-8 max-w-3xl border-l-2 border-ol-ember pl-6">
              <blockquote className="text-xl font-bold leading-snug text-ol-charcoal sm:text-2xl">
                «&nbsp;{foundersWord.body}&nbsp;»
              </blockquote>
              <figcaption className="mt-4 text-sm font-bold text-ol-ember-ink">
                {foundersWord.author}
              </figcaption>
            </figure>
          </Reveal>
          <Reveal>
            <p className="mt-10 max-w-measure leading-relaxed text-ol-ink">{teamWord}</p>
          </Reveal>
          <Reveal>
            <p className="mt-6 text-sm text-ol-muted">
              L&apos;association a été fondée en {org.foundedYear} par {org.founders}.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-ol-cream">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <Reveal>
            <h2 className="text-3xl font-black text-ol-charcoal sm:text-4xl">Nos valeurs</h2>
          </Reveal>
          <ul className="mt-8 grid gap-4 sm:grid-cols-3">
            {identity.valeurs.map((valeur, index) => (
              <Reveal key={valeur} delay={index * 90}>
                <li className="border-l-2 border-ol-ember pl-5 text-lg font-bold leading-snug text-ol-charcoal">
                  {valeur}
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
