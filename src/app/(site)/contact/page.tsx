import type { Metadata } from 'next';
import { Mail, ExternalLink } from 'lucide-react';
import { PageHero } from '@/components/PageHero';
import { Reveal } from '@/components/Reveal';
import { ContactTabs } from './ContactTabs';
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

        </div>
      </section>

      <section className="bg-ol-cream">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <Reveal>
            <h2 className="text-3xl font-black text-ol-charcoal sm:text-4xl">
              Écrivez-nous directement
            </h2>
            <p className="mt-3 max-w-measure leading-relaxed text-ol-muted">
              Choisissez le formulaire qui correspond à votre demande.
            </p>
          </Reveal>
          <div className="mt-8">
            <ContactTabs />
          </div>
        </div>
      </section>
    </>
  );
}
