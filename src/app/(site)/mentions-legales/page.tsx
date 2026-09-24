import type { Metadata } from 'next';
import { TextHero } from '@/components/site/ui';
import { Reveal } from '@/components/Reveal';
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
      <TextHero title="Mentions légales" />

      <section className="bg-cream">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-10 px-[clamp(20px,4vw,32px)] py-[clamp(48px,7vw,88px)]">
          <Reveal className="flex max-w-measure flex-col gap-3">
            <h2 className="m-0 font-serif text-[26px] font-medium leading-[1.2]">Éditeur du site</h2>
            <p className="m-0 text-[17px] leading-[1.65] text-ink-body">
              {org.legalName}, association régie par la loi du 1<sup>er</sup> juillet 1901,
              déclarée sous le numéro RNA {org.rna}.
              <br />
              Siège social : {org.addressAsPublished}.
              <br />
              Courriel : {org.contactEmail}
            </p>
          </Reveal>

          <Reveal className="flex max-w-measure flex-col gap-3">
            <h2 className="m-0 font-serif text-[26px] font-medium leading-[1.2]">Hébergement</h2>
            <p className="m-0 text-[17px] leading-[1.65] text-ink-body">
              Le site est hébergé par Vercel Inc., 440 N Barranca Ave #4133, Covina,
              CA 91723, États-Unis. Les données de l&apos;association sont stockées dans
              l&apos;Union européenne.
            </p>
          </Reveal>

          <Reveal className="flex max-w-measure flex-col gap-3">
            <h2 className="m-0 font-serif text-[26px] font-medium leading-[1.2]">Propriété intellectuelle</h2>
            <p className="m-0 text-[17px] leading-[1.65] text-ink-body">
              Les textes, photographies et éléments graphiques de ce site sont la
              propriété de {org.legalName}, sauf mention contraire. Toute reproduction
              sans autorisation est interdite.
            </p>
          </Reveal>

          <Reveal className="flex max-w-measure flex-col gap-3">
            <h2 className="m-0 font-serif text-[26px] font-medium leading-[1.2]">Droit à l&apos;image</h2>
            <p className="m-0 text-[17px] leading-[1.65] text-ink-body">
              Les personnes figurant sur les photographies publiées sur ce site ont été
              photographiées dans le cadre des activités de l&apos;association. Toute
              demande de retrait peut être adressée à {org.privacyEmail} et sera traitée
              sans délai.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
