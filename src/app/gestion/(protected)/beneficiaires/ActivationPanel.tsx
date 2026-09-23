'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle } from 'lucide-react';

const CONFIRM_PHRASE = 'J’ACTIVE LE SUIVI DES BÉNÉFICIAIRES';

export function ActivationPanel() {
  const router = useRouter();
  const [typed, setTyped] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleActivate() {
    setPending(true);
    setError(null);
    try {
      const response = await fetch('/api/gestion/parametres/beneficiaires', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirm: typed })
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(data.error || 'Une erreur est survenue.');
        return;
      }
      router.refresh();
    } catch {
      setError('Une erreur est survenue.');
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="rounded-xl border border-ol-ember bg-ol-cream p-6">
      <div className="flex items-start gap-3">
        <AlertTriangle size={22} className="mt-0.5 shrink-0 text-ol-ember-ink" aria-hidden />
        <div className="space-y-3">
          <h2 className="text-lg font-black text-ol-charcoal">Module inactif</h2>
          <p className="text-sm leading-relaxed text-ol-ink">
            Avant d&apos;activer le suivi des enfants, assurez-vous que l&apos;association a
            désigné un référent RGPD, validé la base légale de ce suivi, fixé des durées de
            conservation et adopté une politique de protection de l&apos;enfance. Cette
            activation ne peut pas être annulée depuis cet écran.
          </p>
          <div>
            <label htmlFor="confirm-activation" className="mb-1.5 block text-sm font-bold text-ol-charcoal">
              Tapez exactement : {CONFIRM_PHRASE}
            </label>
            <input
              id="confirm-activation"
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              className="w-full max-w-md rounded-lg border border-ol-line-strong bg-ol-white px-4 py-2.5 text-[0.95rem] focus:border-ol-ember focus:outline-none focus:ring-2 focus:ring-ol-ember/30"
            />
          </div>
          {error && (
            <p role="alert" className="text-sm font-bold text-ol-ember-ink">
              {error}
            </p>
          )}
          <button
            type="button"
            disabled={typed !== CONFIRM_PHRASE || pending}
            onClick={handleActivate}
            className="rounded-full bg-ol-ember-ink px-6 py-3 text-sm font-bold text-ol-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {pending ? 'Activation…' : 'Activer le module'}
          </button>
        </div>
      </div>
    </div>
  );
}
