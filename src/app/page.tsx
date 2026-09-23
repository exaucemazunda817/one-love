import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import {
  identity,
  quotes,
  pillars,
  actions,
  currentProject,
  publishableGallery
} from '@/lib/content';

const cover = publishableGallery[0];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-ol-night text-ol-cream">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[1.15fr_1fr] lg:items-center">
          <div className="space-y-6">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-ol-amber">
              Association loi 1901 · Kinshasa, RDC
            </p>
            <h1 className="text-hero font-black leading-[1.08] sm:text-display">
              L&apos;amour et la foi,
              <br />
              notre carburant.
            </h1>
            <p className="max-w-measure text-lg leading-relaxed text-ol-sand">
              {quotes.hero}
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/dons"
                className="inline-flex items-center gap-2 rounded-full bg-ol-ember-ink px-6 py-3.5 text-sm font-bold text-ol-white transition-opacity hover:opacity-90"
              >
                Soutenir l&apos;association
                <ArrowRight size={16} aria-hidden />
              </Link>
              <Link
                href="/actions"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3.5 text-sm font-bold text-ol-cream transition-colors hover:border-ol-amber hover:text-ol-amber"
              >
                Découvrir nos actions
              </Link>
            </div>
          </div>

          <div className="relative aspect-4/5 overflow-hidden rounded-2xl lg:aspect-square">
            <Image
              src={cover.src}
              alt={cover.caption}
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              priority
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Les trois piliers */}
      <section className="bg-ol-white">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <Reveal>
            <h2 className="text-3xl font-black text-ol-charcoal sm:text-4xl">
              Qu&apos;est-ce que One Love ?
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {pillars.map((pillar, index) => (
              <Reveal key={pillar.title} delay={index * 90}>
                <div className="space-y-3 border-t-2 border-ol-ember pt-5">
                  <h3 className="text-lg font-black text-ol-charcoal">{pillar.title}</h3>
                  <p className="text-[0.95rem] leading-relaxed text-ol-muted">{pillar.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Vision et mission */}
      <section className="bg-ol-cream">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <Reveal>
            <p className="max-w-3xl text-2xl font-black leading-snug text-ol-charcoal sm:text-3xl">
              «&nbsp;{quotes.need}&nbsp;»
            </p>
          </Reveal>
          <div className="mt-12 grid gap-10 md:grid-cols-2">
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

          <Reveal>
            <ul className="mt-12 grid gap-4 sm:grid-cols-3">
              {identity.objectifs.map((objectif) => (
                <li
                  key={objectif}
                  className="rounded-xl border border-ol-line bg-ol-white p-5 text-[0.95rem] leading-relaxed text-ol-ink"
                >
                  {objectif}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Nos actions, aperçu */}
      <section className="bg-ol-white">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <Reveal>
              <h2 className="text-3xl font-black text-ol-charcoal sm:text-4xl">Nos actions</h2>
            </Reveal>
            <Reveal>
              <Link
                href="/actions"
                className="inline-flex items-center gap-2 text-sm font-bold text-ol-ember-ink hover:underline"
              >
                Tout voir
                <ArrowRight size={15} aria-hidden />
              </Link>
            </Reveal>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {actions.slice(0, 3).map((action, index) => (
              <Reveal key={action.title} delay={index * 90}>
                <article className="h-full rounded-xl border border-ol-line p-6">
                  <h3 className="text-lg font-black text-ol-charcoal">{action.title}</h3>
                  <p className="mt-2.5 text-[0.95rem] leading-relaxed text-ol-muted">
                    {action.body}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Projet en cours */}
      <section className="bg-ol-night text-ol-cream">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <div className="space-y-5">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-ol-amber">
                Projet en cours
              </p>
              <h2 className="text-3xl font-black sm:text-4xl">{currentProject.name}</h2>
              <p className="text-sm font-bold text-ol-sand">
                {currentProject.acronymMeaning}
              </p>
              <p className="max-w-measure leading-relaxed text-ol-sand">
                {currentProject.intro}
              </p>
              <p className="text-sm text-ol-sand">
                {currentProject.period} · avec {currentProject.partnerName}
              </p>
              <Link
                href="/projets/reves-2"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3.5 text-sm font-bold text-ol-cream transition-colors hover:border-ol-amber hover:text-ol-amber"
              >
                Découvrir le projet
                <ArrowRight size={16} aria-hidden />
              </Link>
            </div>
          </Reveal>

          <Reveal delay={90}>
            {/* Largeur plafonnée à 420 px : le fichier source de l'affiche ne
                fait que 640 × 800 px (récupéré depuis Facebook, qui
                recompresse). Au-delà, l'image est agrandie et devient floue
                sur les écrans à forte densité. À rouvrir quand l'association
                aura fourni les originaux. */}
            <div className="mx-auto w-full max-w-[420px] lg:mx-0">
              <div className="relative aspect-4/5 overflow-hidden rounded-2xl">
                <Image
                  src="/projets/reves-2/reves2-annonce.jpg"
                  alt="Affiche du lancement de RÊVES 2, samedi 5 septembre 2026."
                  fill
                  sizes="(max-width: 420px) 100vw, 420px"
                  className="object-cover"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Valeurs */}
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
          <Reveal>
            <p className="mt-12 max-w-3xl leading-relaxed text-ol-ink">
              «&nbsp;{quotes.actions}&nbsp;»
            </p>
          </Reveal>
        </div>
      </section>

      {/* Appel */}
      <section className="bg-ol-white">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <Reveal>
            <div className="rounded-2xl bg-ol-sand p-8 sm:p-12">
              <h2 className="max-w-measure text-2xl font-black leading-snug text-ol-charcoal sm:text-3xl">
                Chaque don prolonge un accompagnement qui a déjà commencé.
              </h2>
              <p className="mt-4 max-w-measure leading-relaxed text-ol-ink">
                Vous pouvez soutenir nos programmes de terrain, rejoindre l&apos;équipe
                comme bénévole, ou construire un partenariat avec l&apos;association.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/dons"
                  className="inline-flex items-center gap-2 rounded-full bg-ol-ember-ink px-6 py-3.5 text-sm font-bold text-ol-white transition-opacity hover:opacity-90"
                >
                  Faire un don
                  <ArrowRight size={16} aria-hidden />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full border border-ol-line-strong px-6 py-3.5 text-sm font-bold text-ol-charcoal transition-colors hover:border-ol-ember-ink hover:text-ol-ember-ink"
                >
                  Nous écrire
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
