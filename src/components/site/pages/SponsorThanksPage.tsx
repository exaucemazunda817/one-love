import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircleIcon } from '@phosphor-icons/react/ssr';
import { TextHero, btn } from '@/components/site/ui';
import { Reveal } from '@/components/Reveal';
import { localeHref, type Locale } from '@/lib/i18n';

// Comme /dons/merci : cette page ne confirme RIEN par elle-même. Stripe y
// redirige tout visiteur qui termine le paiement ; la seule source de vérité
// est le webhook vérifié, qui seul inscrit la personne parmi les parrains.
const text = {
  fr: {
    title: 'Merci, vous êtes parrain ou marraine',
    desc: 'Votre parrainage One Love : ce qui se passe maintenant.',
    eyebrow: 'Parrainage',
    lead: 'Votre paiement a été transmis. Dès qu’il est confirmé, ce qui prend quelques instants, vous êtes enregistré comme parrain ou marraine et vous recevez par e-mail toutes les informations pour votre parrainage.',
    listTitle: 'Ce que vous allez recevoir',
    list: [
      'Un message de notre équipe chaque trimestre, avec une photo respectueuse ou un dessin.',
      'Un bilan annuel de l’année et de l’emploi des fonds.',
      'La possibilité d’écrire à votre filleul par l’intermédiaire de notre équipe, et de lui rendre visite sur rendez-vous.'
    ],
    mail: 'Si vous ne voyez rien dans votre boîte de réception d’ici quelques minutes, regardez vos courriers indésirables ou écrivez-nous.',
    home: 'Retour à l’accueil'
  },
  en: {
    title: 'Thank you, you are a sponsor',
    desc: 'Your One Love sponsorship: what happens now.',
    eyebrow: 'Sponsorship',
    lead: 'Your payment has been sent. As soon as it is confirmed, which takes a few moments, you are registered as a sponsor and you receive all the information for your sponsorship by e-mail.',
    listTitle: 'What you will receive',
    list: [
      'A message from our team every quarter, with a respectful photo or a drawing.',
      'A yearly review of the year and how the funds were used.',
      'The possibility of writing to your sponsored child through our team, and of visiting by appointment.'
    ],
    mail: 'If you see nothing in your inbox within a few minutes, check your spam folder or write to us.',
    home: 'Back to the home page'
  }
} as const;

export function sponsorThanksMetadata(locale: Locale): Metadata {
  const t = text[locale];
  return { title: t.title, description: t.desc, robots: { index: false } };
}

export function SponsorThanksPage({ locale }: { locale: Locale }) {
  const t = text[locale];
  return (
    <>
      <TextHero eyebrow={t.eyebrow} title={t.title} />
      <section className="bg-cream">
        <div className="mx-auto flex max-w-2xl flex-col gap-8 px-[clamp(20px,4vw,32px)] py-[clamp(48px,7vw,88px)]">
          <Reveal className="flex items-start gap-3.5 ol-spot rounded-card bg-white p-6 shadow-ol-sm">
            <CheckCircleIcon size={28} weight="fill" className="mt-0.5 shrink-0 text-sage-700" aria-hidden />
            <p className="m-0 text-pretty text-[17px] leading-[1.65] text-ink-body">{t.lead}</p>
          </Reveal>
          <Reveal delay={90} className="flex flex-col gap-3 ol-spot rounded-card bg-white p-6 shadow-ol-sm">
            <h2 className="m-0 font-serif text-[24px] font-medium leading-[1.2]">{t.listTitle}</h2>
            <ul className="m-0 flex list-disc flex-col gap-2 pl-5 text-[17px] leading-[1.6] text-ink-body">
              {t.list.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="m-0 pt-1 text-[15px] leading-[1.6] text-ink-soft">{t.mail}</p>
          </Reveal>
          <Link href={localeHref('/', locale)} className={`${btn.outlineCopper} min-h-[52px] self-start px-7 text-[17px]`}>
            {t.home}
          </Link>
        </div>
      </section>
    </>
  );
}
