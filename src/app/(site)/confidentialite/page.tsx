import type { Metadata } from 'next';
import { PageHero } from '@/components/PageHero';
import { org, donationNotice } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Politique de confidentialité',
  robots: { index: false }
};

// Cette page décrit ce que le site fait RÉELLEMENT aujourd'hui : il ne
// collecte aucune donnée, puisque les formulaires n'existent pas encore
// (jalon 2). Elle devra être complétée à chaque nouvelle collecte — formulaire
// de contact, candidature bénévole, lettre d'information, dons en ligne.
//
// Le registre des traitements, les durées de conservation et la base légale du
// suivi des enfants relèvent de l'association, pas du prestataire.
export default function ConfidentialitePage() {
  return (
    <>
      <PageHero title="Politique de confidentialité" />

      <section className="bg-ol-white">
        <div className="mx-auto max-w-6xl space-y-10 px-5 py-16 sm:px-8 sm:py-20">
          <div className="max-w-measure space-y-3">
            <h2 className="text-xl font-black text-ol-charcoal">
              Données collectées par ce site
            </h2>
            <p className="leading-relaxed text-ol-ink">
              En l&apos;état, ce site ne collecte aucune donnée personnelle : il ne
              comporte ni formulaire, ni compte, ni traceur publicitaire, et ne dépose
              aucun cookie de mesure d&apos;audience.
            </p>
          </div>

          <div className="max-w-measure space-y-3">
            <h2 className="text-xl font-black text-ol-charcoal">Si vous nous écrivez</h2>
            <p className="leading-relaxed text-ol-ink">
              Les courriels que vous nous adressez sont conservés le temps nécessaire au
              traitement de votre demande. Ils ne sont ni cédés ni revendus.
            </p>
          </div>

          <div className="max-w-measure space-y-3">
            <h2 className="text-xl font-black text-ol-charcoal">Donateurs</h2>
            <p className="leading-relaxed text-ol-ink">
              {donationNotice.privacy} Les informations liées à un virement sont conservées
              par l&apos;association pour les seuls besoins de sa comptabilité, dans les
              délais légaux applicables.
            </p>
          </div>

          <div className="max-w-measure space-y-3">
            <h2 className="text-xl font-black text-ol-charcoal">Vos droits</h2>
            <p className="leading-relaxed text-ol-ink">
              Conformément au Règlement général sur la protection des données et à la loi
              Informatique et Libertés du 6 janvier 1978, vous disposez d&apos;un droit
              d&apos;accès, de rectification, d&apos;effacement, de limitation et
              d&apos;opposition sur vos données. Pour l&apos;exercer, écrivez à{' '}
              {org.privacyEmail}, ou par courrier à {org.legalName},{' '}
              {org.addressAsPublished}.
            </p>
          </div>

          <div className="max-w-measure space-y-3">
            <h2 className="text-xl font-black text-ol-charcoal">Images des enfants</h2>
            <p className="leading-relaxed text-ol-ink">
              L&apos;association accompagne des mineurs. Les photographies publiées sur ce
              site sont sélectionnées avec une attention particulière, et toute demande de
              retrait adressée à {org.privacyEmail} est traitée sans délai.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
