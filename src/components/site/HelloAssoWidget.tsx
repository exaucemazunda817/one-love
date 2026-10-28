'use client';

import { useEffect, useRef } from 'react';
import { HELLOASSO_ORIGIN } from '@/lib/helloasso';

export type HelloAssoPrefill = {
  amount?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  /** Code pays ISO alpha-3 (FRA, COD, BEL…). */
  country?: string;
};

export type HelloAssoPurchase = {
  transactionId: string;
  value: number;
  frequency: string;
};

/**
 * Formulaire de don HelloAsso intégré dans la page (iframe), selon la
 * documentation officielle (dev.helloasso.com/docs/les-widgets, 27/10/2026) :
 * l'iframe annonce sa hauteur et ses changements d'étape, accepte un
 * préremplissage (montant, nom, e-mail, pays) jusqu'à sa première étape, et
 * signale la fin d'un paiement (message « purchase »). Seuls les messages de
 * cette iframe, venant de www.helloasso.com, sont pris en compte.
 */
export function HelloAssoWidget({
  src,
  title,
  prefill,
  onPurchase
}: {
  src: string;
  title: string;
  prefill: HelloAssoPrefill;
  onPurchase: (purchase: HelloAssoPurchase) => void;
}) {
  const frame = useRef<HTMLIFrameElement>(null);
  const onPurchaseRef = useRef(onPurchase);
  useEffect(() => {
    onPurchaseRef.current = onPurchase;
  }, [onPurchase]);

  // Préremplissage : envoyé au chargement de l'iframe, puis à chaque
  // changement. Jamais avant le chargement (la fenêtre n'est pas encore celle
  // de HelloAsso). HelloAsso ignore les messages une fois la première étape passée.
  const payload = JSON.stringify(cleanPrefill(prefill));
  const loaded = useRef(false);
  useEffect(() => {
    const iframe = frame.current;
    if (!iframe) return;
    const send = () => iframe.contentWindow?.postMessage(JSON.parse(payload), HELLOASSO_ORIGIN);
    const onLoad = () => {
      loaded.current = true;
      send();
    };
    if (loaded.current) send();
    iframe.addEventListener('load', onLoad);
    return () => iframe.removeEventListener('load', onLoad);
  }, [payload]);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      const iframe = frame.current;
      if (!iframe || event.source !== iframe.contentWindow || event.origin !== HELLOASSO_ORIGIN) return;
      const data = event.data as Record<string, unknown> | null;
      if (!data || typeof data !== 'object') return;
      if (typeof data.height === 'number' && Number.isFinite(data.height)) {
        iframe.style.height = `${Math.min(Math.max(Math.round(data.height), 400), 6000)}px`;
      }
      if (data.scrollToTop === true && iframe.getBoundingClientRect().top < 0) {
        iframe.scrollIntoView({ behavior: 'smooth' });
      }
      if (data.event === 'purchase' && data.ecommerce && typeof data.ecommerce === 'object') {
        const e = data.ecommerce as Record<string, unknown>;
        onPurchaseRef.current({
          transactionId: String(e.transaction_id ?? '').slice(0, 40),
          value: typeof e.value === 'number' && Number.isFinite(e.value) ? e.value : 0,
          frequency: typeof e.payment_frequency === 'string' ? e.payment_frequency.slice(0, 20) : ''
        });
      }
    }
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  return (
    <iframe
      ref={frame}
      src={src}
      title={title}
      // Hauteur de départ ; ajustée ensuite par les messages de HelloAsso.
      style={{ height: 900 }}
      className="block w-full rounded-xl border-0 bg-white"
      allow="payment"
    />
  );
}

function cleanPrefill(prefill: HelloAssoPrefill): HelloAssoPrefill {
  const out: HelloAssoPrefill = {};
  if (prefill.amount && prefill.amount > 0) out.amount = Math.round(prefill.amount * 100) / 100;
  if (prefill.firstName?.trim()) out.firstName = prefill.firstName.trim();
  if (prefill.lastName?.trim()) out.lastName = prefill.lastName.trim();
  if (prefill.email?.trim()) out.email = prefill.email.trim();
  if (prefill.country) out.country = prefill.country;
  return out;
}
