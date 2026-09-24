import type { Metadata } from 'next';
import { WhatsappLogoIcon, EnvelopeSimpleIcon, FacebookLogoIcon } from '@phosphor-icons/react/ssr';
import { Reveal } from '@/components/Reveal';
import { InnerHero } from '@/components/site/InnerHero';
import { PlaceholderPhoto, ToConfirm } from '@/components/site/ui';
import { ContactFormCard } from '@/components/site/pages/ContactFormCard';
import { CONTACT_EMAIL, WHATSAPP_PLACEHOLDER, FACEBOOK_URL, type Locale } from '@/lib/i18n';

const text = {
  fr: {
    title: 'Contact',
    desc: "Écrivez à l'association One Love : dons, parrainages, visites du centre, bénévolat ou partenariats.",
    eyebrow: 'Contact',
    titlePre: 'Écrivez-nous, nous ',
    titleWord: 'répondons',
    intro: 'Une question sur un don, un parrainage, une visite ou un partenariat : le plus rapide reste WhatsApp.',
    heroAlt: "Des mains d'enfants colorient des lettres.",
    whatsapp: 'WhatsApp',
    toReplace: 'à remplacer',
    email: 'E-mail',
    facebook: 'Facebook',
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
    visitText: "Les visites se font sur rendez-vous, accompagnées d'un membre de l'équipe, pour respecter le rythme des enfants.",
    fields: [
      ['Lieu', 'Kinshasa, RDC'],
      ['Adresse', 'À compléter'],
      ['Visites', 'Samedi, 10 h à 12 h']
    ],
    visitConfirm: 'Adresse et horaires à confirmer',
    mapLabel: 'Carte · Kinshasa',
    mapSub: "à intégrer une fois l'adresse confirmée"
  },
  en: {
    title: 'Contact',
    desc: 'Write to the One Love association: gifts, sponsorships, centre visits, volunteering or partnerships.',
    eyebrow: 'Contact',
    titlePre: 'Write to us, we ',
    titleWord: 'reply',
    intro: 'A question about a gift, sponsorship, a visit or a partnership? WhatsApp is the quickest.',
    heroAlt: "Children's hands colouring in letters.",
    whatsapp: 'WhatsApp',
    toReplace: 'placeholder',
    email: 'Email',
    facebook: 'Facebook',
    formTitle: 'Contact form',
    name: 'Full name',
    subject: 'Subject',
    subjects: ['A gift', 'Sponsorship', 'A visit to the centre', 'Volunteering', 'A partnership', 'Other'],
    message: 'Your message',
    send: 'Send',
    sending: 'Sending…',
    note: 'Your details are only used to reply to you.',
    thanksTitle: 'Thank you, message received.',
    thanksText: "We'll reply within a few days.",
    sendAnother: 'Send another message',
    error: 'Something went wrong. Please try again.',
    visitTitle: 'Visit the centre',
    visitText: "Visits are by appointment, accompanied by a team member, to respect the children's routine.",
    fields: [
      ['Location', 'Kinshasa, DRC'],
      ['Address', 'To be added'],
      ['Visits', 'Saturday, 10 am to 12 pm']
    ],
    visitConfirm: 'Address and hours to be confirmed',
    mapLabel: 'Map · Kinshasa',
    mapSub: 'to be added once the address is confirmed'
  }
};

export function contactMetadata(locale: Locale): Metadata {
  const t = text[locale];
  return { title: t.title, description: t.desc };
}

export function ContactPage({ locale }: { locale: Locale }) {
  const t = text[locale];

  return (
    <>
      <InnerHero
        locale={locale}
        eyebrow={t.eyebrow}
        titlePre={t.titlePre}
        titleWord={t.titleWord}
        intro={t.intro}
        image="/photos/photo-mains.jpg"
        imageAlt={t.heroAlt}
      />

      <section className="mx-auto grid max-w-[1200px] grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-4 px-[clamp(20px,4vw,32px)] pt-[clamp(56px,8vw,104px)]">
        <Reveal className="flex flex-col gap-3 rounded-[20px] bg-night p-7 text-cream">
          <WhatsappLogoIcon size={36} color="#9DB5A2" aria-hidden />
          <b className="font-serif text-[24px] font-medium">{t.whatsapp}</b>
          <span className="text-[16px] text-on-dark-1">{WHATSAPP_PLACEHOLDER}</span>
          <ToConfirm dark className="self-start">
            {t.toReplace}
          </ToConfirm>
        </Reveal>
        <Reveal delay={90}>
          <a href={`mailto:${CONTACT_EMAIL}`} className="flex flex-col gap-3 rounded-[20px] bg-white p-7 text-ink no-underline shadow-ol-sm hover:text-ink">
            <EnvelopeSimpleIcon size={36} className="text-copper-600" aria-hidden />
            <b className="font-serif text-[24px] font-medium">{t.email}</b>
            <span className="break-all text-[16px] text-ink-body">{CONTACT_EMAIL}</span>
          </a>
        </Reveal>
        <Reveal delay={180}>
          <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className="flex flex-col gap-3 rounded-[20px] bg-white p-7 text-ink no-underline shadow-ol-sm hover:text-ink">
            <FacebookLogoIcon size={36} className="text-copper-600" aria-hidden />
            <b className="font-serif text-[24px] font-medium">{t.facebook}</b>
            <span className="text-[16px] text-ink-body">associationonelove</span>
          </a>
        </Reveal>
      </section>

      <section className="mx-auto grid max-w-[1200px] grid-cols-[repeat(auto-fit,minmax(min(100%,380px),1fr))] items-start gap-[clamp(32px,5vw,64px)] px-[clamp(20px,4vw,32px)] py-[clamp(56px,8vw,104px)]">
        <Reveal>
          <ContactFormCard t={t} />
        </Reveal>

        <Reveal delay={90} className="flex flex-col gap-5">
          <h2 className="m-0 text-balance font-serif text-[clamp(30px,3.6vw,46px)] font-medium leading-[1.15]">{t.visitTitle}</h2>
          <p className="m-0 text-pretty text-[17px] leading-[1.65] text-ink-body">{t.visitText}</p>
          <dl className="m-0 grid grid-cols-[minmax(0,140px)_minmax(0,1fr)] gap-x-4 gap-y-2.5 text-[16px]">
            {t.fields.map(([label, value], i) => (
              <div key={label} className="contents">
                <dt className="text-ink-soft">{label}</dt>
                <dd className={`m-0 font-bold ${i === 1 ? 'text-copper-700' : 'text-ink'}`}>{value}</dd>
              </div>
            ))}
          </dl>
          <ToConfirm className="self-start">{t.visitConfirm}</ToConfirm>
          <PlaceholderPhoto
            ratio="16/10"
            label={
              <>
                {t.mapLabel}
                <br />
                {t.mapSub}
              </>
            }
          />
        </Reveal>
      </section>
    </>
  );
}
