import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircleIcon } from '@phosphor-icons/react/ssr';
import { TextHero, btn } from '@/components/site/ui';

export const metadata: Metadata = {
  title: 'Merci pour votre don',
  description:
    "Votre don a bien été transmis à l'association One Love. Merci de soutenir nos programmes de terrain à Kinshasa.",
  robots: { index: false }
};

// Cette page ne confirme RIEN par elle-même : Stripe y redirige tout visiteur
// qui termine le paiement, y compris dans de rares cas où le paiement finit
// par échouer après coup. La seule source de vérité est le webhook vérifié
// (src/app/api/webhooks/stripe), qui seul écrit le don en base comme confirmé.
export default function MerciPage() {
  return (
    <>
      <TextHero eyebrow="Don" title="Merci pour votre soutien" />
      <section className="bg-cream">
        <div className="mx-auto flex max-w-2xl flex-col gap-8 px-[clamp(20px,4vw,32px)] py-[clamp(48px,7vw,88px)]">
          <div className="flex items-start gap-3.5 rounded-[20px] bg-white p-6 shadow-ol-sm">
            <CheckCircleIcon size={28} weight="fill" className="mt-0.5 shrink-0 text-sage-700" aria-hidden />
            <p className="m-0 text-pretty text-[17px] leading-[1.65] text-ink-body">
              Votre paiement a été transmis. Vous recevrez une confirmation par e-mail si vous en avez fait la demande.
              Si vous avez choisi un don mensuel, il se renouvellera automatiquement chaque mois jusqu&apos;à ce que
              vous nous demandiez de l&apos;arrêter : écrivez-nous à tout moment pour le modifier ou l&apos;interrompre.
              Merci de faire vivre nos programmes de terrain.
            </p>
          </div>
          <Link href="/" className={`${btn.outlineCopper} min-h-[52px] self-start px-7 text-[17px]`}>
            Retour à l&apos;accueil
          </Link>
        </div>
      </section>
    </>
  );
}
