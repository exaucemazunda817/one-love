import type { Metadata } from 'next';
import { Suspense } from 'react';
import { PageHero } from '@/components/PageHero';
import { ConfirmClient } from './ConfirmClient';

export const metadata: Metadata = {
  title: 'Confirmation d’inscription',
  robots: { index: false }
};

export default function ConfirmPage() {
  return (
    <>
      <PageHero title="Lettre d'information" />
      <section className="bg-ol-white">
        <div className="mx-auto max-w-2xl px-5 py-16 sm:px-8 sm:py-20">
          {/* useSearchParams exige un Suspense : sans lui, Next refuse de
              produire la page statique au build. */}
          <Suspense fallback={<p className="text-ol-muted">Chargement…</p>}>
            <ConfirmClient />
          </Suspense>
        </div>
      </section>
    </>
  );
}
