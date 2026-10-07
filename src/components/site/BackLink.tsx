'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@phosphor-icons/react';

// Bouton « Retour » des pages absentes du menu (demande de Mazunda du
// 07/10/2026) : il ramène à la page précédente du site. Si le visiteur est
// arrivé directement (Google, lien partagé, favori), il n'y a pas de page
// précédente sur le site : le lien mène alors à `fallbackHref`.

const KEY = 'ol-nav';

function readTrail(): string[] {
  try {
    const raw = window.sessionStorage.getItem(KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list.filter((x) => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

/** Retient les pages vues dans cet onglet (posé une fois dans les layouts du site). */
export function NavTracker() {
  const pathname = usePathname();
  useEffect(() => {
    try {
      const trail = readTrail();
      if (trail[trail.length - 1] !== pathname) trail.push(pathname);
      window.sessionStorage.setItem(KEY, JSON.stringify(trail.slice(-30)));
    } catch {
      // Stockage indisponible (navigation privée stricte) : le bouton Retour
      // mènera simplement à sa page de repli.
    }
  }, [pathname]);
  return null;
}

/** Bouton « Retour » posé au début du corps de page, juste sous le bandeau
 * (demande de Mazunda du 07/10/2026 : pas sur la photo du bandeau). */
export function BackStrip({ href, locale }: { href: string; locale: 'fr' | 'en' }) {
  return (
    <div className="mx-auto max-w-[1200px] px-[clamp(20px,4vw,32px)] pt-6 dk:pt-8">
      <BackLink fallbackHref={href} locale={locale} tone="light" />
    </div>
  );
}

export function BackLink({
  fallbackHref,
  locale,
  tone = 'dark'
}: {
  fallbackHref: string;
  locale: 'fr' | 'en';
  /** `dark` : sur une photo ou un fond sombre ; `light` : sur fond clair. */
  tone?: 'dark' | 'light';
}) {
  const router = useRouter();
  const label = locale === 'en' ? 'Back' : 'Retour';

  function onClick(event: React.MouseEvent<HTMLAnchorElement>) {
    // Clic avec Cmd/Ctrl (nouvel onglet) : comportement normal du lien.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
    // Une page du site a été vue avant celle-ci dans cet onglet : on y revient
    // (avec sa position de défilement). Sinon, lien de repli.
    const trail = readTrail();
    if (trail.length >= 2 && window.history.length > 1) {
      event.preventDefault();
      router.back();
    }
  }

  const cls =
    tone === 'dark'
      ? 'border-cream/35 bg-night/45 text-cream hover:border-gold hover:text-gold-hover'
      : 'border-field-line bg-white text-ink hover:border-copper-600 hover:text-copper-700';

  return (
    <Link
      href={fallbackHref}
      onClick={onClick}
      className={`inline-flex min-h-11 w-fit items-center gap-2 rounded-full border px-4 text-[15px] font-bold no-underline backdrop-blur-sm transition-colors ${cls}`}
    >
      <ArrowLeftIcon size={18} aria-hidden />
      {label}
    </Link>
  );
}
