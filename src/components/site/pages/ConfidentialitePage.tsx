import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import {
  ShieldCheckIcon,
  EnvelopeSimpleIcon,
  HandshakeIcon,
  PaperPlaneTiltIcon,
  HandCoinsIcon,
  ScalesIcon,
  CameraIcon
} from '@phosphor-icons/react/ssr';
import { TextHero } from '@/components/site/ui';
import { Reveal } from '@/components/Reveal';
import { org, donationNotice } from '@/lib/content';

export const metadata: Metadata = pageMetadata({
  locale: 'fr',
  path: '/confidentialite',
  title: 'Politique de confidentialité',
  description:
    "Quelles données ce site collecte, comment elles sont utilisées et comment exercer vos droits RGPD auprès de l'association One Love.",
  noindex: true,
  frOnly: true
});

// Cette page décrit ce que le site fait RÉELLEMENT aujourd'hui. Mise à jour le
// 27/09/2026 : la version précédente affirmait encore « ce site ne collecte
// aucune donnée », vraie au jalon 2 (avant les formulaires) mais fausse
// depuis — contact, bénévolat, partenariat, parrainage, newsletter et dons
// collectent tous des données. À recompléter à chaque nouvelle collecte.
//
// Le registre des traitements, les durées de conservation et la base légale du
// suivi des enfants relèvent de l'association, pas du prestataire.
export default function ConfidentialitePage() {
  return (
    <>
      <TextHero
        eyebrow="Vos données"
        title="Politique de confidentialité"
        intro="Ce que ce site collecte, comment c’est utilisé, et comment exercer vos droits auprès de l’association."
      />

      <section className="bg-cream">
        <div className="mx-auto grid max-w-[1200px] grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-5 px-[clamp(20px,4vw,32px)] py-[clamp(56px,8vw,96px)]">
          <Reveal className="flex flex-col gap-3 rounded-card bg-white p-8 shadow-ol-sm">
            <ShieldCheckIcon size={36} className="text-copper-600" aria-hidden />
            <h2 className="m-0 font-serif text-[24px] font-medium leading-[1.2]">Données collectées par ce site</h2>
            <p className="m-0 text-[16px] leading-[1.65] text-ink-body">
              Ce site ne collecte des données que lorsque vous remplissez vous-même un
              formulaire (contact, bénévolat, partenariat, parrainage, don ou lettre
              d&apos;information) : les informations que vous y saisissez — nom, e-mail,
              téléphone si vous le donnez, message. Il ne comporte aucun compte
              utilisateur, aucun traceur publicitaire, et ne dépose aucun cookie de
              mesure d&apos;audience.
            </p>
          </Reveal>

          <Reveal delay={90} className="flex flex-col gap-3 rounded-card bg-white p-8 shadow-ol-sm">
            <EnvelopeSimpleIcon size={36} className="text-copper-600" aria-hidden />
            <h2 className="m-0 font-serif text-[24px] font-medium leading-[1.2]">Si vous nous écrivez</h2>
            <p className="m-0 text-[16px] leading-[1.65] text-ink-body">
              Les messages du formulaire de contact (nom, e-mail, téléphone facultatif,
              sujet, message) sont conservés le temps nécessaire au traitement de votre
              demande. Ils ne sont ni cédés ni revendus.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-sand">
        <div className="mx-auto grid max-w-[1200px] grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-5 px-[clamp(20px,4vw,32px)] py-[clamp(56px,8vw,96px)]">
          <Reveal className="flex flex-col gap-3 rounded-card bg-white p-8 shadow-ol-sm">
            <HandshakeIcon size={36} className="text-copper-600" aria-hidden />
            <h2 className="m-0 font-serif text-[24px] font-medium leading-[1.2]">Bénévolat, partenariat et parrainage</h2>
            <p className="m-0 text-[16px] leading-[1.65] text-ink-body">
              Une candidature bénévole (identité, coordonnées, disponibilités,
              motivation), une proposition de partenariat (organisation, contact,
              message) ou une demande de parrainage sont utilisées uniquement pour
              étudier votre demande et vous répondre, jamais pour un autre usage.
            </p>
          </Reveal>

          <Reveal delay={90} className="flex flex-col gap-3 rounded-card bg-white p-8 shadow-ol-sm">
            <PaperPlaneTiltIcon size={36} className="text-copper-600" aria-hidden />
            <h2 className="m-0 font-serif text-[24px] font-medium leading-[1.2]">Lettre d&apos;information</h2>
            <p className="m-0 text-[16px] leading-[1.65] text-ink-body">
              L&apos;inscription à la lettre d&apos;information se fait en double
              consentement (un e-mail de confirmation avant tout envoi). Nous conservons
              votre e-mail, et votre prénom si vous le donnez, pour vous envoyer nos
              actualités. Un lien de désinscription figure dans chaque message.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-cream">
        <div className="mx-auto grid max-w-[1200px] grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-5 px-[clamp(20px,4vw,32px)] py-[clamp(56px,8vw,96px)]">
          <Reveal className="flex flex-col gap-3 rounded-card bg-white p-8 shadow-ol-sm">
            <HandCoinsIcon size={36} className="text-copper-600" aria-hidden />
            <h2 className="m-0 font-serif text-[24px] font-medium leading-[1.2]">Donateurs</h2>
            <p className="m-0 text-[16px] leading-[1.65] text-ink-body">
              Pour un don par carte ou prélèvement, le paiement est traité par Stripe :
              votre numéro de carte ne transite jamais par nos serveurs et n&apos;y est
              jamais stocké. Nous conservons votre nom, votre e-mail et le montant de
              votre don pour la comptabilité de l&apos;association, dans les délais
              légaux applicables. {donationNotice.privacy}
            </p>
          </Reveal>

          <Reveal delay={90} className="flex flex-col gap-3 rounded-card bg-white p-8 shadow-ol-sm">
            <ScalesIcon size={36} className="text-copper-600" aria-hidden />
            <h2 className="m-0 font-serif text-[24px] font-medium leading-[1.2]">Vos droits</h2>
            <p className="m-0 text-[16px] leading-[1.65] text-ink-body">
              Conformément au Règlement général sur la protection des données et à la loi
              Informatique et Libertés du 6 janvier 1978, vous disposez d&apos;un droit
              d&apos;accès, de rectification, d&apos;effacement, de limitation et
              d&apos;opposition sur vos données. Pour l&apos;exercer, écrivez à{' '}
              {org.privacyEmail}, ou par courrier à {org.legalName},{' '}
              {org.addressAsPublished}.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-sand">
        <div className="mx-auto max-w-[1200px] px-[clamp(20px,4vw,32px)] py-[clamp(56px,8vw,96px)]">
          <Reveal className="flex max-w-[640px] flex-col gap-3 rounded-card bg-night p-8 text-cream">
            <CameraIcon size={36} className="text-sage-300" aria-hidden />
            <h2 className="m-0 font-serif text-[24px] font-medium leading-[1.2]">Images des enfants</h2>
            <p className="m-0 text-[16px] leading-[1.65] text-on-dark-1">
              L&apos;association accompagne des mineurs. Les photographies publiées sur ce
              site sont sélectionnées avec une attention particulière, et toute demande de
              retrait adressée à {org.privacyEmail} est traitée sans délai.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
