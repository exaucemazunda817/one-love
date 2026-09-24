import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRightIcon } from '@phosphor-icons/react/ssr';
import { pageMetadata } from '@/lib/seo';
import { Reveal } from '@/components/Reveal';
import { InnerHero } from '@/components/site/InnerHero';
import { InvolvedInteractive } from '@/components/site/pages/InvolvedInteractive';
import { localeHref, type Locale } from '@/lib/i18n';

const text = {
  fr: {
    title: "S'impliquer",
    desc: 'Bénévolat, dons en nature, collectes et partenariats pour soutenir les programmes de terrain de One Love à Kinshasa.',
    eyebrow: "S'impliquer",
    titlePre: 'Donner de son ',
    titleWord: 'temps',
    titlePost: ', de ses talents',
    intro: "Vous pouvez soutenir nos programmes de terrain, rejoindre l'équipe comme bénévole, ou construire un partenariat avec l'association.",
    heroAlt: 'Deux garçons dessinent à une table en plein air.',
    waysTitle: "Quatre façons de s'impliquer",
    ways: [
      { k: 'benevolat' as const, t: 'Bénévolat', d: 'À Kinshasa pour les ateliers, ou à distance : communication, traduction, recherche de fonds.', cta: 'Proposer mon aide' },
      { k: 'nature' as const, t: 'Dons en nature', d: 'Fournitures scolaires, livres, matériel sportif ou informatique.', cta: 'Voir les besoins' },
      { k: 'collecte' as const, t: 'Collectes', d: "Anniversaire, course solidaire, événement d'église ou d'école : collectez pour RÊVES 2.", cta: 'Organiser une collecte' },
      { k: 'partenariat' as const, t: 'Partenariats', d: 'Entreprises, églises, fondations : construisons un projet ensemble, comme avec Angel Foundation.', cta: 'Devenir partenaire' }
    ],
    needsTitle: 'Nos besoins en nature',
    needsIntro: 'Du matériel en bon état, collecté en France ou à Kinshasa. Nos besoins changent selon les ateliers : écrivez-nous pour connaître ceux du moment, avant tout envoi.',
    needsCta: 'Nous écrire',
    formTitlePre: 'Parlons de votre ',
    formTitleWord: 'engagement',
    formIntro: 'Dites-nous ce qui vous intéresse, nous revenons vers vous rapidement.',
    whatsapp: 'Ou écrivez-nous depuis la page Contact',
    interestLabel: 'Je souhaite',
    interests: {
      benevolat: 'Devenir bénévole',
      nature: 'Faire un don en nature',
      collecte: 'Organiser une collecte',
      partenariat: 'Proposer un partenariat'
    },
    name: 'Prénom et nom',
    email: 'E-mail',
    org: 'Organisation',
    orgPlaceholder: 'Entreprise, église, fondation…',
    message: 'Votre message',
    send: 'Envoyer',
    sending: 'Envoi…',
    thanksTitle: 'Merci, message bien reçu.',
    thanksText: 'Nous vous répondons sous quelques jours.',
    sendAnother: 'Envoyer un autre message',
    error: 'Une erreur est survenue. Merci de réessayer.'
  },
  en: {
    title: 'Get involved',
    desc: 'Volunteering, in-kind gifts, fundraising and partnerships to support One Love’s field programmes in Kinshasa.',
    eyebrow: 'Get involved',
    titlePre: 'Give your ',
    titleWord: 'time',
    titlePost: ' and your talents',
    intro: 'You can support our field programmes, join the team as a volunteer, or build a partnership with the association.',
    heroAlt: 'Two boys drawing at an outdoor table.',
    waysTitle: 'Four ways to get involved',
    ways: [
      { k: 'benevolat' as const, t: 'Volunteering', d: 'In Kinshasa for workshops, or remotely: communication, translation, fundraising.', cta: 'Offer my help' },
      { k: 'nature' as const, t: 'In-kind gifts', d: 'School supplies, books, sports or computer equipment.', cta: 'See what we need' },
      { k: 'collecte' as const, t: 'Fundraisers', d: 'A birthday, charity run, church or school event: raise funds for RÊVES 2.', cta: 'Organise a fundraiser' },
      { k: 'partenariat' as const, t: 'Partnerships', d: 'Companies, churches, foundations: let’s build a project together, as with Angel Foundation.', cta: 'Become a partner' }
    ],
    needsTitle: 'What we need',
    needsIntro: 'Equipment in good condition, collected in France or Kinshasa. Our needs change with the workshops: write to us to find out what is needed now, before sending anything.',
    needsCta: 'Write to us',
    formTitlePre: "Let's talk about your ",
    formTitleWord: 'involvement',
    formIntro: "Tell us what interests you and we'll get back to you quickly.",
    whatsapp: 'Or write to us from the Contact page',
    interestLabel: 'I would like to',
    interests: {
      benevolat: 'Volunteer',
      nature: 'Give in kind',
      collecte: 'Organise a fundraiser',
      partenariat: 'Propose a partnership'
    },
    name: 'Full name',
    email: 'Email',
    org: 'Organisation',
    orgPlaceholder: 'Company, church, foundation…',
    message: 'Your message',
    send: 'Send',
    sending: 'Sending…',
    thanksTitle: 'Thank you, message received.',
    thanksText: "We'll reply within a few days.",
    sendAnother: 'Send another message',
    error: 'Something went wrong. Please try again.'
  }
};

export function involvedMetadata(locale: Locale): Metadata {
  const t = text[locale];
  return pageMetadata({ locale, path: '/s-impliquer', title: t.title, description: t.desc });
}

export function InvolvedPage({ locale }: { locale: Locale }) {
  const t = text[locale];

  return (
    <>
      <InnerHero
        locale={locale}
        eyebrow={t.eyebrow}
        titlePre={t.titlePre}
        titleWord={t.titleWord}
        titlePost={t.titlePost}
        intro={t.intro}
        image="/photos/photo-dessin.jpg"
        imageAlt={t.heroAlt}
      />

      <InvolvedInteractive
        locale={locale}
        t={t}
        between={
          <section className="bg-sand">
            <div className="mx-auto max-w-[1200px] px-[clamp(20px,4vw,32px)] py-[clamp(56px,8vw,104px)]">
              <Reveal className="flex max-w-[640px] flex-col gap-3">
                <h2 className="m-0 font-serif text-[clamp(28px,3vw,38px)] font-medium leading-[1.2]">{t.needsTitle}</h2>
                <p className="m-0 text-[17px] leading-[1.6] text-ink-body">{t.needsIntro}</p>
              </Reveal>
              <Reveal delay={90} className="mt-5">
                <Link href={localeHref('/contact', locale)} className="inline-flex min-h-11 items-center gap-1.5 font-bold no-underline">
                  {t.needsCta}
                  <ArrowRightIcon aria-hidden />
                </Link>
              </Reveal>
            </div>
          </section>
        }
      />
    </>
  );
}
