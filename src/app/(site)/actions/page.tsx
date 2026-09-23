import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/PageHero';
import { Reveal } from '@/components/Reveal';
import { actions, quotes, currentProject } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Nos actions',
  description:
    "Alphabétisation, apprentissage du français, activités culturelles et sportives, suivi médical et psychosocial, formation des animateurs et (ré)insertion professionnelle à Kinshasa."
};

export default function ActionsPage() {
  return (
    <>
      <PageHero
        eyebrow="Sur le terrain"
        title="Nos actions"
        intro="Six domaines d'intervention, pensés ensemble : sortir un enfant de la rue ne se joue jamais sur un seul levier."
      />

      <section className="bg-ol-white">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {actions.map((action, index) => (
              <Reveal key={action.title} delay={(index % 3) * 90}>
                <article className="h-full rounded-xl border border-ol-line p-6">
                  <h2 className="text-lg font-black text-ol-charcoal">{action.title}</h2>
                  <p className="mt-2.5 text-[0.95rem] leading-relaxed text-ol-muted">
                    {action.body}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ol-cream">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <Reveal>
            <p className="max-w-3xl text-xl font-bold leading-snug text-ol-charcoal sm:text-2xl">
              «&nbsp;{quotes.actions}&nbsp;»
            </p>
          </Reveal>
          <Reveal delay={90}>
            <div className="mt-10">
              <Link
                href="/projets/reves-2"
                className="inline-flex items-center rounded-full bg-ol-ember-ink px-6 py-3.5 text-sm font-bold text-ol-white transition-opacity hover:opacity-90"
              >
                Voir {currentProject.name}, notre projet en cours
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
