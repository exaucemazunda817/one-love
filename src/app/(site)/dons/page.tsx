import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { Smartphone } from 'lucide-react';
import { PageHero } from '@/components/PageHero';
import { Reveal } from '@/components/Reveal';
import { StripeDonationForm } from '@/components/forms/StripeDonationForm';
import { CancelNotice } from './CancelNotice';
import { bankTransfer, donationNotice, currentProject } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Faire un don',
  description:
    "Soutenir les programmes de One Love à Kinshasa : alphabétisation, suivi médical et psychosocial, (ré)insertion professionnelle."
};

export default function DonsPage() {
  return (
    <>
      <PageHero
        eyebrow="Nous soutenir"
        title="Faire un don"
        intro="Votre don finance directement les programmes de terrain : ateliers, matériel pédagogique, suivi médical et psychosocial des enfants."
      />

      <section className="bg-ol-white">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <Suspense fallback={null}>
            <CancelNotice />
          </Suspense>

          <Reveal>
            <div className="rounded-2xl border border-ol-line bg-ol-cream p-7 sm:p-9">
              <h2 className="text-2xl font-black text-ol-charcoal">Don en ligne</h2>
              <p className="mt-3 max-w-measure leading-relaxed text-ol-ink">
                Par carte bancaire ou par prélèvement SEPA, en quelques instants.
              </p>
              <div className="mt-7">
                <StripeDonationForm projectSlug={currentProject.slug} />
              </div>
            </div>
          </Reveal>

          <Reveal delay={90}>
            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-ol-line p-6">
              <Smartphone size={22} className="mt-0.5 shrink-0 text-ol-muted" aria-hidden />
              <div>
                <h2 className="text-lg font-black text-ol-charcoal">Mobile Money</h2>
                <p className="mt-1.5 text-[0.95rem] leading-relaxed text-ol-muted">
                  Orange Money, Airtel Money et M-Pesa seront bientôt disponibles pour les
                  donateurs en RDC.
                </p>
              </div>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-start">
            <Reveal>
              <div className="rounded-2xl border border-ol-line p-7 sm:p-9">
                <h2 className="text-2xl font-black text-ol-charcoal">Par virement bancaire</h2>
                <p className="mt-3 max-w-measure leading-relaxed text-ol-ink">
                  Vous pouvez aussi effectuer un virement depuis votre banque, ponctuel ou
                  récurrent, en utilisant les coordonnées ci-dessous.
                </p>

                <dl className="mt-7 space-y-4 rounded-xl bg-ol-cream p-6">
                  <div>
                    <dt className="text-xs font-bold uppercase tracking-[0.15em] text-ol-muted">
                      Titulaire
                    </dt>
                    <dd className="mt-1 font-bold text-ol-charcoal">{bankTransfer.holder}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-bold uppercase tracking-[0.15em] text-ol-muted">
                      IBAN
                    </dt>
                    <dd className="mt-1 font-mono text-[0.95rem] font-bold tracking-wide text-ol-charcoal">
                      {bankTransfer.iban}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-bold uppercase tracking-[0.15em] text-ol-muted">
                      BIC
                    </dt>
                    <dd className="mt-1 font-mono text-[0.95rem] font-bold tracking-wide text-ol-charcoal">
                      {bankTransfer.bic}
                    </dd>
                  </div>
                </dl>

                <p className="mt-5 text-sm leading-relaxed text-ol-muted">
                  Pour soutenir un programme en particulier, comme{' '}
                  {currentProject.name}, indiquez-le dans le libellé du virement.
                </p>
              </div>
            </Reveal>

            <div className="space-y-6">
              <Reveal delay={90}>
                <div className="rounded-xl border border-ol-line p-6">
                  <h2 className="text-lg font-black text-ol-charcoal">
                    L&apos;emploi de vos dons
                  </h2>
                  <p className="mt-2.5 text-[0.95rem] leading-relaxed text-ol-muted">
                    {donationNotice.allocation}
                  </p>
                </div>
              </Reveal>

              <Reveal delay={180}>
                <div className="rounded-xl border border-ol-line p-6">
                  <h2 className="text-lg font-black text-ol-charcoal">
                    Respect de votre vie privée
                  </h2>
                  <p className="mt-2.5 text-[0.95rem] leading-relaxed text-ol-muted">
                    {donationNotice.privacy} Voir notre{' '}
                    <Link
                      href="/confidentialite"
                      className="font-bold text-ol-ember-ink underline underline-offset-2"
                    >
                      politique de confidentialité
                    </Link>
                    .
                  </p>
                </div>
              </Reveal>

              <Reveal delay={270}>
                <div className="rounded-xl bg-ol-sand p-6">
                  <h2 className="text-lg font-black text-ol-charcoal">Autrement qu&apos;un don</h2>
                  <p className="mt-2.5 text-[0.95rem] leading-relaxed text-ol-ink">
                    Vous pouvez aussi rejoindre l&apos;équipe comme bénévole ou construire
                    un partenariat avec l&apos;association.
                  </p>
                  <Link
                    href="/contact"
                    className="mt-5 inline-flex rounded-full bg-ol-ember-ink px-5 py-3 text-sm font-bold text-ol-white transition-opacity hover:opacity-90"
                  >
                    Prendre contact
                  </Link>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
