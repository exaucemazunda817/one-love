import Image from 'next/image';
import Link from 'next/link';
import {
  EnvelopeSimpleIcon,
  WhatsappLogoIcon,
  FacebookLogoIcon
} from '@phosphor-icons/react/ssr';
import { NewsletterForm } from '@/components/forms/NewsletterForm';
import {
  chrome,
  localeHref,
  CONTACT_EMAIL,
  FACEBOOK_URL,
  WHATSAPP_PLACEHOLDER,
  type Locale
} from '@/lib/i18n';

const linkClass =
  'flex min-h-10 items-center text-[15px] text-on-dark-1 no-underline hover:text-gold-hover';

export function Footer({ locale }: { locale: Locale }) {
  const t = chrome[locale].footer;
  return (
    // 88 px de marge basse sous 1200 px : la barre de don flottante ne doit
    // jamais masquer la dernière ligne du pied de page.
    <footer className="bg-night pb-[88px] text-on-dark-1 dk:pb-0">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-10 px-[clamp(20px,4vw,32px)] pb-8 pt-[clamp(48px,7vw,80px)]">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,210px),1fr))] gap-8">
          <div className="flex flex-col gap-3.5">
            <Image src="/brand/logo-one-love-rond.png" alt="One Love" width={88} height={88} className="h-[88px] w-[88px]" />
            <p className="m-0 font-serif text-[18px] italic leading-[1.4] text-cream">{t.motto}</p>
          </div>

          <div className="flex flex-col gap-1">
            <span className="mb-1.5 text-[13px] font-extrabold tracking-[0.08em] text-gold">{t.explore}</span>
            {t.links.map((l) => (
              <Link key={l.href} href={localeHref(l.href, locale)} className={linkClass}>
                {l.label}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-1">
            <span className="mb-1.5 text-[13px] font-extrabold tracking-[0.08em] text-gold">{t.reach}</span>
            <a href={`mailto:${CONTACT_EMAIL}`} className={`${linkClass} gap-2`}>
              <EnvelopeSimpleIcon size={20} aria-hidden />
              {CONTACT_EMAIL}
            </a>
            {/* Numéro fictif de la maquette : affiché, jamais cliquable. */}
            <span className="flex min-h-10 flex-wrap items-center gap-2 text-[15px] text-on-dark-1">
              <WhatsappLogoIcon size={20} aria-hidden />
              {WHATSAPP_PLACEHOLDER}
              <span className="rounded-full border-[1.5px] border-dashed border-gold px-1.5 text-[12px] font-bold text-gold-hover">
                {t.placeholder}
              </span>
            </span>
            <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className={`${linkClass} gap-2`}>
              <FacebookLogoIcon size={20} aria-hidden />
              Facebook
            </a>
          </div>

          <div className="flex flex-col gap-2.5">
            <span className="text-[13px] font-extrabold tracking-[0.08em] text-gold">{t.newsletter}</span>
            <span className="text-[15px] leading-[1.5]">{t.newsletterText}</span>
            <NewsletterForm locale={locale} />
          </div>
        </div>

        <div className="flex flex-wrap justify-between gap-3 border-t border-dark-line pt-5 text-[13px] text-on-dark-3">
          <span>{t.legalLine}</span>
          <div className="flex flex-wrap gap-5">
            {t.legal.map((l) => (
              <Link
                key={l.href}
                href={'frOnly' in l ? l.href : localeHref(l.href, locale)}
                className="text-on-dark-3 underline hover:text-gold-hover"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
