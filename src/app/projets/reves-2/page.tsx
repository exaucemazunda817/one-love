import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PageHero } from '@/components/PageHero';
import { Reveal } from '@/components/Reveal';
import { currentProject, publishableGallery } from '@/lib/content';

export const metadata: Metadata = {
  title: `${currentProject.name} — ${currentProject.acronymMeaning}`,
  description: currentProject.intro
};

const steps = currentProject.acronymMeaning.split('–').map((word) => word.trim());

export default function Reves2Page() {
  return (
    <>
      <PageHero
        eyebrow="Projet en cours"
        title={currentProject.name}
        intro={currentProject.intro}
      />

      <section className="bg-ol-white">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <Reveal>
            <ul className="flex flex-wrap gap-2.5">
              {steps.map((step) => (
                <li
                  key={step}
                  className="rounded-full border border-ol-ember px-4 py-2 text-sm font-bold text-ol-ember-ink"
                >
                  {step}
                </li>
              ))}
            </ul>
          </Reveal>

          <div className="mt-12 grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-start">
            <Reveal>
              <div className="space-y-5">
                <p className="max-w-measure leading-relaxed text-ol-ink">
                  {currentProject.description}
                </p>
                <div className="rounded-xl border border-ol-line bg-ol-cream p-6">
                  <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-ol-ember-ink">
                    Objectif
                  </h2>
                  <p className="mt-2 leading-relaxed text-ol-ink">{currentProject.objectif}</p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={90}>
              <dl className="space-y-5 rounded-xl border border-ol-line p-6">
                <div>
                  <dt className="text-xs font-bold uppercase tracking-[0.15em] text-ol-muted">
                    Période
                  </dt>
                  <dd className="mt-1 font-bold text-ol-charcoal">{currentProject.period}</dd>
                </div>
                <div>
                  <dt className="text-xs font-bold uppercase tracking-[0.15em] text-ol-muted">
                    Partenaire
                  </dt>
                  <dd className="mt-1 font-bold text-ol-charcoal">
                    {currentProject.partnerName}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-bold uppercase tracking-[0.15em] text-ol-muted">
                    Première étape
                  </dt>
                  <dd className="mt-1 font-bold text-ol-charcoal">
                    {currentProject.firstMilestone.label}
                  </dd>
                  <dd className="text-sm text-ol-muted">{currentProject.firstMilestone.date}</dd>
                </div>
              </dl>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-ol-cream">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <Reveal>
            <h2 className="text-3xl font-black text-ol-charcoal sm:text-4xl">En images</h2>
          </Reveal>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {publishableGallery.map((photo, index) => (
              <Reveal key={photo.src} delay={(index % 3) * 90}>
                <figure className="space-y-3">
                  <div className="relative aspect-4/5 overflow-hidden rounded-xl">
                    <Image
                      src={photo.src}
                      alt={photo.caption}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                  <figcaption className="text-sm leading-relaxed text-ol-muted">
                    {photo.caption}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ol-night text-ol-cream">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <Reveal>
            <h2 className="max-w-measure text-2xl font-black leading-snug sm:text-3xl">
              Le projet se poursuit jusqu&apos;en décembre.
            </h2>
            <p className="mt-4 max-w-measure leading-relaxed text-ol-sand">
              Chaque contribution finance directement les ateliers, le matériel pédagogique
              et le suivi des enfants.
            </p>
            <Link
              href="/dons"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-ol-amber px-6 py-3.5 text-sm font-bold text-ol-night transition-opacity hover:opacity-90"
            >
              Soutenir {currentProject.name}
              <ArrowRight size={16} aria-hidden />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
