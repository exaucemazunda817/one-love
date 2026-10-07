import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { EnvelopeSimpleIcon, FacebookLogoIcon, InstagramLogoIcon, YoutubeLogoIcon } from '@phosphor-icons/react/ssr';
import { BrushLast, Eyebrow } from '@/components/site/ui';
import Image from 'next/image';
import { Reveal } from '@/components/Reveal';
import { InnerHero } from '@/components/site/InnerHero';
import { ContactFormCard } from '@/components/site/pages/ContactFormCard';
import { CONTACT_EMAIL, FACEBOOK_URL, INSTAGRAM_URL, YOUTUBE_URL, type Locale } from '@/lib/i18n';

// Bandeau de « Contact » : choix de Mazunda sur planches numérotées
// (07/10/2026), propre à cette page (les autres pages gardent la liste
// commune). `desktop: false` / `mobile: false` : retirée sur ce format seulement.
const HERO_POOL = [
  { src: '/hero-desktop/centre-aere-2024-07-ol-photo-006.webp', position: '50% 50%' },
  { src: '/hero-desktop/centre-aere-2024-07-ol-photo-009.webp', position: '50% 50%' },
  { src: '/hero-desktop/centre-aere-2023-02-tim-pt-015.webp', position: '50% 50%' }
];

const text = {
  fr: {
    title: 'Contact : écrire à l’association',
    desc: "Écrivez à l’association One Love : dons, parrainages, visites du centre, bénévolat ou partenariats.",
    eyebrow: 'Contact',
    titlePre: 'Écrivez-nous, nous ',
    titleWord: 'répondons',
    intro: 'Une question sur un don, un parrainage, une visite ou un partenariat : écrivez-nous par le formulaire, par e-mail ou sur nos réseaux sociaux.',
    heroAlt: "Un garçon du centre aéré sourit, un pistolet à eau à la main.",
    email: 'E-mail',
    networksTitle: 'Nous suivre, nous écrire',
    facebook: 'Facebook',
    instagram: 'Instagram',
    youtube: 'YouTube',
    youtubeName: '@AssociationOneLove',
    formTitle: 'Formulaire de contact',
    name: 'Prénom et nom',
    subject: 'Sujet',
    subjects: ['Un don', 'Un parrainage', 'Une visite du centre', 'Du bénévolat', 'Un partenariat', 'Autre'],
    message: 'Votre message',
    send: 'Envoyer',
    sending: 'Envoi…',
    note: 'Vos coordonnées servent uniquement à vous répondre.',
    thanksTitle: 'Merci, message bien reçu.',
    thanksText: 'Nous vous répondons sous quelques jours.',
    sendAnother: 'Envoyer un autre message',
    error: 'Une erreur est survenue. Merci de réessayer.',
    visitTitle: 'Visiter le centre',
    visitText: "Les visites se font sur rendez-vous, accompagnées d’un membre de notre équipe, pour respecter le rythme des enfants.",
  },
  en: {
    title: 'Contact: write to the association',
    desc: 'Write to the One Love association: gifts, sponsorships, centre visits, volunteering or partnerships.',
    eyebrow: 'Contact',
    titlePre: 'Write to us, we ',
    titleWord: 'reply',
    intro: 'A question about a gift, sponsorship, a visit or a partnership? Write to us using the form, by email or on our social networks.',
    heroAlt: "A boy from the day centre smiling, holding a water pistol.",
    email: 'Email',
    networksTitle: 'Follow us, write to us',
    facebook: 'Facebook',
    instagram: 'Instagram',
    youtube: 'YouTube',
    youtubeName: '@AssociationOneLove',
    formTitle: 'Contact form',
    name: 'Full name',
    subject: 'Subject',
    subjects: ['A gift', 'Sponsorship', 'A visit to the centre', 'Volunteering', 'A partnership', 'Other'],
    message: 'Your message',
    send: 'Send',
    sending: 'Sending…',
    note: 'Your details are only used to reply to you.',
    thanksTitle: 'Thank you, message received.',
    thanksText: "We’ll reply within a few days.",
    sendAnother: 'Send another message',
    error: 'Something went wrong. Please try again.',
    visitTitle: 'Visit the centre',
    visitText: "Visits are by appointment, accompanied by a team member, to respect the children’s routine.",
  }
};

export function contactMetadata(locale: Locale): Metadata {
  const t = text[locale];
  return pageMetadata({ locale, path: '/contact', title: t.title, description: t.desc });
}

const NETWORK_PHOTO = '/hero-desktop/centre-aere-2024-03-ol-photo-003.webp';

export function ContactPage({ locale }: { locale: Locale }) {
  const t = text[locale];
  const networks = [
    { href: `mailto:${CONTACT_EMAIL}`, label: `${t.email} : ${CONTACT_EMAIL}`, Icon: EnvelopeSimpleIcon, external: false },
    { href: FACEBOOK_URL, label: t.facebook, Icon: FacebookLogoIcon, external: true },
    { href: INSTAGRAM_URL, label: t.instagram, Icon: InstagramLogoIcon, external: true },
    { href: YOUTUBE_URL, label: t.youtube, Icon: YoutubeLogoIcon, external: true }
  ];

  return (
    <>
      <InnerHero
        locale={locale}
        eyebrow={t.eyebrow}
        titlePre={t.titlePre}
        titleWord={t.titleWord}
        intro={t.intro}
        image="/hero-desktop/centre-aere-2023-02-tim-pt-015.webp"
        imageAlt={t.heroAlt}
        objectPosition="50% 50%"
        photoPool={HERO_POOL}
      />

      {/* Réseaux et e-mail (07/10/2026, option B validée par Mazunda) : quatre
          pastilles cliquables sur une photo des enfants, à la place des quatre
          grandes cartes ; l'adresse reste écrite en clair pour la recopier. */}
      <section className="mx-auto max-w-[1200px] px-[clamp(20px,4vw,32px)] pt-[clamp(40px,6vw,72px)]">
        <Reveal className="relative flex min-h-[260px] flex-col justify-end gap-4 overflow-hidden rounded-card bg-night p-[clamp(24px,4vw,48px)] text-cream dk:min-h-[300px]">
          <Image src={NETWORK_PHOTO} alt="" fill sizes="(max-width: 1200px) 100vw, 1200px" className="photo-tone object-cover object-[50%_35%]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,var(--scrim-2)_0%,var(--scrim-5)_100%)] dk:bg-[linear-gradient(90deg,var(--scrim-5)_0%,var(--scrim-2)_45%,var(--scrim-0)_100%)]" />
          <div className="relative flex flex-col gap-4">
            <Eyebrow dark>{t.networksTitle}</Eyebrow>
            <ul className="m-0 flex list-none flex-wrap gap-3 p-0">
              {networks.map(({ href, label, Icon, external }) => (
                <li key={label}>
                  <a
                    href={href}
                    aria-label={label}
                    title={label}
                    {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="flex h-14 w-14 items-center justify-center rounded-full border border-cream/35 bg-cream/15 text-cream no-underline backdrop-blur-sm transition-colors hover:border-gold hover:bg-gold hover:text-night"
                  >
                    <Icon size={26} aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
            <a href={`mailto:${CONTACT_EMAIL}`} className="w-fit break-all text-[16px] font-bold text-gold-hover no-underline hover:underline hover:underline-offset-4">
              {CONTACT_EMAIL}
            </a>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto grid max-w-[1200px] grid-cols-[repeat(auto-fit,minmax(min(100%,380px),1fr))] items-start gap-[clamp(32px,5vw,64px)] px-[clamp(20px,4vw,32px)] py-[clamp(56px,8vw,104px)]">
        <Reveal>
          <ContactFormCard t={t} locale={locale} />
        </Reveal>

        <Reveal delay={90} className="flex flex-col gap-5">
          <h2 className="m-0 text-balance font-serif text-[clamp(30px,3.6vw,46px)] font-medium leading-[1.15]"><BrushLast text={t.visitTitle} /></h2>
          <p className="m-0 text-pretty text-[17px] leading-[1.65] text-ink-body">{t.visitText}</p>
        </Reveal>
      </section>
    </>
  );
}
