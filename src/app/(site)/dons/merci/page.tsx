import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { PageHero } from '@/components/PageHero';

export const metadata: Metadata = {
  title: 'Merci pour votre don',
  robots: { index: false }
};

// Cette page ne confirme RIEN par elle-même : Stripe y redirige tout visiteur
// qui termine le paiement, y compris dans de rares cas où le paiement finit
// par échouer après coup. La seule source de vérité est le webhook vérifié
// (src/app/api/webhooks/stripe), qui seul écrit le don en base comme confirmé.
export default function MerciPage() {
  return (
    <>
      <PageHero eyebrow="Don" title="Merci pour votre soutien" />
      <section className="bg-ol-white">
        <div className="mx-auto max-w-2xl px-5 py-16 sm:px-8 sm:py-20">
          <div className="flex items-start gap-3 rounded-xl border border-ol-line bg-ol-cream p-6">
            <CheckCircle2 size={24} className="mt-0.5 shrink-0 text-ol-ember-ink" aria-hidden />
            <p className="leading-relaxed text-ol-ink">
              Votre paiement a été transmis. Vous recevrez une confirmation par e-mail si vous
              en avez fait la demande. Si vous avez choisi un don mensuel, il se renouvellera
              automatiquement chaque mois jusqu&apos;à ce que vous nous demandiez de l&apos;arrêter
              — écrivez-nous à tout moment pour le modifier ou l&apos;interrompre. Merci de faire
              vivre nos programmes de terrain.
            </p>
          </div>
          <Link
            href="/"
            className="mt-8 inline-flex rounded-full border border-ol-line-strong px-6 py-3.5 text-sm font-bold text-ol-charcoal transition-colors hover:border-ol-ember-ink hover:text-ol-ember-ink"
          >
            Retour à l&apos;accueil
          </Link>
        </div>
      </section>
    </>
  );
}
