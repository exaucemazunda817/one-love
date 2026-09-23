import type { Metadata } from 'next';
import { PageHero } from '@/components/PageHero';
import { org } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Mentions légales',
  description: 'Éditeur, hébergeur et informations légales du site de l’association One Love.',
  robots: { index: false }
};

// À FAIRE CONFIRMER AVANT MISE EN LIGNE :
//   1. L'adresse du siège. Le site actuel annonce le 44 rue de la Roquette
//      (Paris 11e) ; une base officielle indique Châtenay-Malabry. C'est
//      l'adresse publiée par l'association elle-même qui est reprise ici, mais
//      publier un siège inexact dans des mentions légales est un risque inutile.
//   2. Le nom du directeur de la publication (président de l'association).
//   3. L'hébergeur définitif, si le site n'est pas déployé sur Vercel.
export default function MentionsLegalesPage() {
  return (
    <>
      <PageHero title="Mentions légales" />

      <section className="bg-ol-white">
        <div className="mx-auto max-w-6xl space-y-10 px-5 py-16 sm:px-8 sm:py-20">
          <div className="max-w-measure space-y-3">
            <h2 className="text-xl font-black text-ol-charcoal">Éditeur du site</h2>
            <p className="leading-relaxed text-ol-ink">
              {org.legalName}, association régie par la loi du 1<sup>er</sup> juillet 1901,
              déclarée sous le numéro RNA {org.rna}.
              <br />
              Siège social : {org.addressAsPublished}.
              <br />
              Courriel : {org.contactEmail}
            </p>
          </div>

          <div className="max-w-measure space-y-3">
            <h2 className="text-xl font-black text-ol-charcoal">Hébergement</h2>
            <p className="leading-relaxed text-ol-ink">
              Le site est hébergé par Vercel Inc., 440 N Barranca Ave #4133, Covina,
              CA 91723, États-Unis. Les données de l&apos;association sont stockées dans
              l&apos;Union européenne.
            </p>
          </div>

          <div className="max-w-measure space-y-3">
            <h2 className="text-xl font-black text-ol-charcoal">Propriété intellectuelle</h2>
            <p className="leading-relaxed text-ol-ink">
              Les textes, photographies et éléments graphiques de ce site sont la
              propriété de {org.legalName}, sauf mention contraire. Toute reproduction
              sans autorisation est interdite.
            </p>
          </div>

          <div className="max-w-measure space-y-3">
            <h2 className="text-xl font-black text-ol-charcoal">Droit à l&apos;image</h2>
            <p className="leading-relaxed text-ol-ink">
              Les personnes figurant sur les photographies publiées sur ce site ont été
              photographiées dans le cadre des activités de l&apos;association. Toute
              demande de retrait peut être adressée à {org.privacyEmail} et sera traitée
              sans délai.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
