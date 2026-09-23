'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { org } from '@/lib/content';

const links = [
  { href: '/association', label: "L'association" },
  { href: '/actions', label: 'Nos actions' },
  { href: '/projets/reves-2', label: 'RÊVES 2' },
  { href: '/galerie', label: 'Galerie' },
  { href: '/contact', label: 'Contact' }
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Referme le menu quand on change de page : sans ça, le tiroir reste ouvert
  // par-dessus la nouvelle page sur mobile.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-ol-line bg-ol-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
        <Link href="/" aria-label={`${org.name} — accueil`} className="shrink-0">
          <Image
            src="/brand/logo-one-love.png"
            alt={org.name}
            width={185}
            height={55}
            priority
            className="h-10 w-auto"
          />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Navigation principale">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? 'page' : undefined}
                className={`text-sm font-bold transition-colors hover:text-ol-ember-ink ${
                  active ? 'text-ol-ember-ink' : 'text-ol-charcoal'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/dons"
            className="rounded-full bg-ol-ember-ink px-5 py-2.5 text-sm font-bold text-ol-white transition-opacity hover:opacity-90"
          >
            Faire un don
          </Link>
        </nav>

        <div className="flex items-center gap-2 lg:hidden">
          <Link
            href="/dons"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-ol-ember-ink px-4 text-sm font-bold text-ol-white"
          >
            Faire un don
          </Link>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
            className="grid h-11 w-11 place-items-center rounded-full border border-ol-line text-ol-charcoal"
          >
            {open ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
          </button>
        </div>
      </div>

      {open && (
        // max-h + overflow-auto : sur un écran bas, un menu plus haut que la
        // fenêtre devient inatteignable s'il ne défile pas.
        <nav
          id="menu-mobile"
          aria-label="Navigation principale"
          className="max-h-[calc(100vh-4.5rem)] overflow-y-auto border-t border-ol-line bg-ol-white px-5 pb-6 lg:hidden"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center border-b border-ol-line py-3.5 text-base font-bold text-ol-charcoal"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
