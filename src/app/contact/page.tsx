import type { Metadata } from 'next';
import { Mail, ExternalLink } from 'lucide-react';
import { PageHero } from '@/components/PageHero';
import { Reveal } from '@/components/Reveal';
import { org } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    "Écrire à l'association One Love : rejoindre l'équipe comme bénévole, proposer un partenariat ou poser une question."
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Nous joindre"
        title="Contact"
        intro="Une question, une envie de nous rejoindre, une proposition de partenariat ? Écrivez-nous."
      />

      <section className="bg-ol-white">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <div className="grid gap-6 sm:grid-cols-2">
            <Reveal>
              <a
                href={`mailto:${org.contactEmail}`}
                className="flex h-full items-start gap-4 rounded-xl border border-ol-line p-6 transition-colors hover:border-ol-ember"
              >
                <Mail size={22} className="mt-0.5 shrink-0 text-ol-ember-ink" aria-hidden />
                <span>
                  <span className="block text-lg font-black text-ol-charcoal">
                    Par courriel
                  </span>
                  <span className="mt-1 block text-[0.95rem] text-ol-muted">
                    {org.contactEmail}
                  </span>
                </span>
              </a>
            </Reveal>

            <Reveal delay={90}>
              <a
                href={org.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-full items-start gap-4 rounded-xl border border-ol-line p-6 transition-colors hover:border-ol-ember"
              >
                <ExternalLink size={22} className="mt-0.5 shrink-0 text-ol-ember-ink" aria-hidden />
                <span>
                  <span className="block text-lg font-black text-ol-charcoal">
                    Sur Facebook
                  </span>
                  <span className="mt-1 block text-[0.95rem] text-ol-muted">
                    Suivre nos actualités de terrain
                  </span>
                </span>
              </a>
            </Reveal>
          </div>

          <Reveal>
            <p className="mt-10 max-w-measure leading-relaxed text-ol-muted">
              Un formulaire de contact, une candidature bénévole en ligne et une inscription
              à notre lettre d&apos;information seront bientôt disponibles ici.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
