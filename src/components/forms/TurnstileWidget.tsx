'use client';

import { useEffect, useRef } from 'react';

// Captcha Cloudflare Turnstile. Sans NEXT_PUBLIC_TURNSTILE_SITE_KEY, le
// composant n'affiche rien et le formulaire fonctionne comme avant. La clé
// publique est lue à la construction du site : après l'avoir ajoutée sur
// Vercel, il faut redéployer.
export const TURNSTILE_SITE_KEY = (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '').trim();

type TurnstileApi = {
  render: (element: HTMLElement, options: Record<string, unknown>) => string;
  reset: (widgetId?: string) => void;
  remove: (widgetId?: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SCRIPT_ID = 'cf-turnstile-script';
const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

function loadScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.turnstile) {
      resolve();
      return;
    }
    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    const script =
      existing ?? Object.assign(document.createElement('script'), { id: SCRIPT_ID, src: SCRIPT_SRC, async: true, defer: true });
    script.addEventListener('load', () => resolve(), { once: true });
    script.addEventListener('error', () => reject(new Error('Turnstile non chargé')), { once: true });
    if (!existing) document.head.appendChild(script);
  });
}

/**
 * `onToken` reçoit le jeton une fois la vérification réussie, ou `null` quand
 * il expire, échoue ou ne peut pas se charger. Un jeton ne sert qu'une fois :
 * le parent incrémente `resetKey` après chaque envoi pour en demander un neuf.
 */
export function TurnstileWidget({
  locale,
  onToken,
  resetKey
}: {
  locale: 'fr' | 'en';
  onToken: (token: string | null) => void;
  resetKey: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const onTokenRef = useRef(onToken);

  useEffect(() => {
    onTokenRef.current = onToken;
  }, [onToken]);

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY) return;
    let cancelled = false;
    loadScript()
      .then(() => {
        if (cancelled || !containerRef.current || !window.turnstile) return;
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: TURNSTILE_SITE_KEY,
          language: locale,
          theme: 'light',
          callback: (token: string) => onTokenRef.current(token),
          'expired-callback': () => onTokenRef.current(null),
          'error-callback': () => onTokenRef.current(null)
        });
      })
      .catch(() => onTokenRef.current(null));
    return () => {
      cancelled = true;
      if (widgetIdRef.current && window.turnstile) window.turnstile.remove(widgetIdRef.current);
      widgetIdRef.current = null;
    };
  }, [locale]);

  useEffect(() => {
    if (resetKey > 0 && widgetIdRef.current && window.turnstile) window.turnstile.reset(widgetIdRef.current);
  }, [resetKey]);

  if (!TURNSTILE_SITE_KEY) return null;
  return <div ref={containerRef} className="min-h-[65px]" />;
}
