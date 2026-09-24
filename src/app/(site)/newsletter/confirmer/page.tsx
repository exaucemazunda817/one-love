import type { Metadata } from 'next';
import { Suspense } from 'react';
import { TextHero } from '@/components/site/ui';
import { ConfirmClient } from './ConfirmClient';

export const metadata: Metadata = {
  title: 'Confirmation d’inscription',
  description: "Confirmez votre inscription à la lettre d'information de l'association One Love.",
  robots: { index: false }
};

export default function ConfirmPage() {
  return (
    <>
      <TextHero title="Lettre d'information" />
      <section className="bg-cream">
        <div className="mx-auto max-w-2xl px-[clamp(20px,4vw,32px)] py-[clamp(48px,7vw,88px)]">
          {/* useSearchParams exige un Suspense : sans lui, Next refuse de
              produire la page statique au build. */}
          <Suspense fallback={<p className="text-ink-soft">Chargement…</p>}>
            <ConfirmClient />
          </Suspense>
        </div>
      </section>
    </>
  );
}
