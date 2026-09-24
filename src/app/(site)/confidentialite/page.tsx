import type { Metadata } from 'next';
import { TextHero } from '@/components/site/ui';
import { org, donationNotice } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Politique de confidentialité',
  description:
    "Quelles données ce site collecte, comment elles sont utilisées et comment exercer vos droits RGPD auprès de l'association One Love.",
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
      <TextHero title="Politique de confidentialité" />

      <section className="bg-cream">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-10 px-[clamp(20px,4vw,32px)] py-[clamp(48px,7vw,88px)]">
          <div className="flex max-w-measure flex-col gap-3">
            <h2 className="m-0 font-serif text-[26px] font-medium leading-[1.2]">
              Données collectées par ce site
            </h2>
            <p className="m-0 text-[17px] leading-[1.65] text-ink-body">
              En l&apos;état, ce site ne collecte aucune donnée personnelle : il ne
              comporte ni formulaire, ni compte, ni traceur publicitaire, et ne dépose
              aucun cookie de mesure d&apos;audience.
            </p>
          </div>

          <div className="flex max-w-measure flex-col gap-3">
            <h2 className="m-0 font-serif text-[26px] font-medium leading-[1.2]">Si vous nous écrivez</h2>
            <p className="m-0 text-[17px] leading-[1.65] text-ink-body">
              Les courriels que vous nous adressez sont conservés le temps nécessaire au
              traitement de votre demande. Ils ne sont ni cédés ni revendus.
            </p>
          </div>

          <div className="flex max-w-measure flex-col gap-3">
            <h2 className="m-0 font-serif text-[26px] font-medium leading-[1.2]">Donateurs</h2>
            <p className="m-0 text-[17px] leading-[1.65] text-ink-body">
              {donationNotice.privacy} Les informations liées à un virement sont conservées
              par l&apos;association pour les seuls besoins de sa comptabilité, dans les
              délais légaux applicables.
            </p>
          </div>

          <div className="flex max-w-measure flex-col gap-3">
            <h2 className="m-0 font-serif text-[26px] font-medium leading-[1.2]">Vos droits</h2>
            <p className="m-0 text-[17px] leading-[1.65] text-ink-body">
              Conformément au Règlement général sur la protection des données et à la loi
              Informatique et Libertés du 6 janvier 1978, vous disposez d&apos;un droit
              d&apos;accès, de rectification, d&apos;effacement, de limitation et
              d&apos;opposition sur vos données. Pour l&apos;exercer, écrivez à{' '}
              {org.privacyEmail}, ou par courrier à {org.legalName},{' '}
              {org.addressAsPublished}.
            </p>
          </div>

          <div className="flex max-w-measure flex-col gap-3">
            <h2 className="m-0 font-serif text-[26px] font-medium leading-[1.2]">Images des enfants</h2>
            <p className="m-0 text-[17px] leading-[1.65] text-ink-body">
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
