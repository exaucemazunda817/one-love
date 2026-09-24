'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { HeartIcon, ListIcon, XIcon, CaretRightIcon, WhatsappLogoIcon } from '@phosphor-icons/react';
import { chrome, localeHref, alternateHref, type Locale } from '@/lib/i18n';
import { cx } from '@/components/site/ui';

const LOGO = '/brand/logo-one-love-rond.png';

/** Sur l'accueil, « Faire un don » mène au module de don de la page (#don) ;
 * ailleurs, à la page Faire un don. */
function donateHref(pathname: string, locale: Locale) {
  const home = locale === 'fr' ? '/' : '/en';
  return pathname === home ? '#don' : localeHref('/dons', locale);
}

export function Header({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const t = chrome[locale];
  const other = alternateHref(pathname);
  const otherLabel = locale === 'fr' ? 'EN' : 'FR';

  // Referme le menu quand on change de page.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Bloque le défilement de la page derrière le menu plein écran.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const donate = donateHref(pathname, locale);
  const isActive = (href: string) => {
    const full = localeHref(href, locale);
    return pathname === full || pathname.startsWith(`${full}/`);
  };

  return (
    <>
      {/* Desktop (≥ 1200 px) */}
      <header className="sticky top-0 z-20 hidden bg-[rgba(10,10,10,.94)] backdrop-blur-[8px] dk:block">
        <div className="mx-auto flex max-w-[1280px] items-center gap-4 px-8 py-3">
          <Link href={localeHref('/', locale)} aria-label={t.home} className="flex flex-none">
            <Image src={LOGO} alt="One Love" width={56} height={56} priority className="h-14 w-14" />
          </Link>
          <nav className="flex min-w-0 flex-1 justify-center" aria-label={locale === 'fr' ? 'Navigation principale' : 'Main navigation'}>
            {t.nav.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={localeHref(item.href, locale)}
                  aria-current={active ? 'page' : undefined}
                  className={cx(
                    'inline-flex min-h-11 items-center whitespace-nowrap px-2 text-[14px] no-underline hover:text-gold-hover',
                    active ? 'font-extrabold text-gold-hover' : 'font-semibold text-on-dark-1'
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex flex-none items-center gap-2.5">
            <div className="flex text-[13px] font-extrabold">
              {locale === 'fr' ? (
                <>
                  <span className="rounded-md bg-cream px-2 py-[5px] text-night">FR</span>
                  <Link href={other.href} hrefLang="en" className="px-2 py-[5px] text-on-dark-2 no-underline hover:text-gold-hover">
                    EN
                  </Link>
                </>
              ) : (
                <>
                  <Link href={other.href} hrefLang="fr" className="px-2 py-[5px] text-on-dark-2 no-underline hover:text-gold-hover">
                    FR
                  </Link>
                  <span className="rounded-md bg-cream px-2 py-[5px] text-night">EN</span>
                </>
              )}
            </div>
            <a
              href={donate}
              className="inline-flex min-h-12 items-center gap-2 whitespace-nowrap rounded-full bg-gold px-[22px] text-[16px] font-extrabold text-night no-underline hover:bg-gold-hover hover:text-night"
            >
              <HeartIcon size="1em" aria-hidden />
              {t.donate}
            </a>
          </div>
        </div>
      </header>

      {/* Mobile (< 1200 px) */}
      <header className="sticky top-0 z-20 flex items-center justify-between bg-[rgba(10,10,10,.96)] px-4 py-2 dk:hidden">
        <Link href={localeHref('/', locale)} aria-label={t.home} className="flex">
          <Image src={LOGO} alt="One Love" width={44} height={44} priority className="h-11 w-11" />
        </Link>
        <div className="flex items-center gap-1">
          <Link
            href={other.href}
            hrefLang={locale === 'fr' ? 'en' : 'fr'}
            className="inline-flex min-h-11 items-center px-2.5 text-[14px] font-extrabold text-cream no-underline hover:text-gold-hover"
          >
            {otherLabel}
          </Link>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label={t.openMenu}
            aria-expanded={open}
            aria-controls="menu-mobile"
            className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border-0 bg-dark-surface"
          >
            <ListIcon size={24} color="#FBF7F1" aria-hidden />
          </button>
        </div>
      </header>

      {open && (
        <div
          id="menu-mobile"
          role="dialog"
          aria-modal="true"
          aria-label={locale === 'fr' ? 'Menu' : 'Menu'}
          className="fixed inset-0 z-40 flex flex-col overflow-auto bg-night text-cream dk:hidden"
        >
          <div className="flex items-center justify-between px-4 py-2">
            <Image src={LOGO} alt="One Love" width={44} height={44} className="h-11 w-11" />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t.closeMenu}
              className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border-0 bg-dark-surface"
            >
              <XIcon size={24} color="#FBF7F1" aria-hidden />
            </button>
          </div>
          <nav className="flex flex-1 flex-col px-5 py-2">
            {t.nav.map((item) => (
              <Link
                key={item.href}
                href={localeHref(item.href, locale)}
                aria-current={isActive(item.href) ? 'page' : undefined}
                className="flex min-h-14 items-center justify-between border-b border-dark-line font-serif text-[22px] text-cream no-underline hover:text-gold-hover"
              >
                {item.label}
                <CaretRightIcon size={18} color="#8C8177" aria-hidden />
              </Link>
            ))}
          </nav>
          <div className="flex flex-col gap-3 px-5 pb-7 pt-4">
            <div className="flex gap-2 text-[14px] font-extrabold">
              {locale === 'fr' ? (
                <>
                  <span className="rounded-full bg-cream px-4 py-2.5 text-night">Français</span>
                  <Link href={other.href} hrefLang="en" className="rounded-full border-[1.5px] border-dark-border px-4 py-2.5 text-cream no-underline">
                    English
                  </Link>
                </>
              ) : (
                <>
                  <Link href={other.href} hrefLang="fr" className="rounded-full border-[1.5px] border-dark-border px-4 py-2.5 text-cream no-underline">
                    Français
                  </Link>
                  <span className="rounded-full bg-cream px-4 py-2.5 text-night">English</span>
                </>
              )}
            </div>
            <a
              href={donate}
              onClick={() => setOpen(false)}
              className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-gold text-[17px] font-extrabold text-night no-underline hover:bg-gold-hover hover:text-night"
            >
              <HeartIcon size="1em" aria-hidden />
              {t.donate}
            </a>
          </div>
        </div>
      )}
    </>
  );
}

/** Barre flottante mobile : « Faire un don » + WhatsApp. */
export function MobileDonateBar({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const t = chrome[locale];
  return (
    <div className="fixed inset-x-3 bottom-3 z-30 flex gap-2 rounded-full bg-night p-2 shadow-[0_8px_24px_rgba(10,10,10,.3)] dk:hidden">
      <a
        href={donateHref(pathname, locale)}
        className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-gold text-[16px] font-extrabold text-night no-underline hover:text-night"
      >
        <HeartIcon size="1em" aria-hidden />
        {t.donate}
      </a>
      {/* Le numéro WhatsApp de la maquette est fictif : le bouton mène à la
          page Contact tant que le vrai numéro n'est pas fourni. */}
      <Link
        href={localeHref('/contact', locale)}
        aria-label={t.whatsapp}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-cream"
      >
        <WhatsappLogoIcon size={24} color="#3F5A47" aria-hidden />
      </Link>
    </div>
  );
}
