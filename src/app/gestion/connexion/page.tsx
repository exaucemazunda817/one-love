import type { Metadata } from 'next';
import Image from 'next/image';
import { LoginForm } from './LoginForm';
import { org } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Connexion — Gestion',
  robots: { index: false, follow: false }
};

export default function ConnexionPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-ol-cream px-5 py-16">
      <div className="w-full max-w-sm">
        <Image
          src="/brand/logo-one-love.png"
          alt={org.name}
          width={185}
          height={55}
          priority
          className="mx-auto mb-8 h-10 w-auto"
        />
        <div className="rounded-2xl border border-ol-line bg-ol-white p-7 shadow-sm">
          <h1 className="text-xl font-black text-ol-charcoal">Logiciel de gestion</h1>
          <p className="mt-1 text-sm text-ol-muted">Réservé à l&apos;équipe One Love.</p>
          <div className="mt-6">
            <LoginForm />
          </div>
        </div>
      </div>
    </main>
  );
}
