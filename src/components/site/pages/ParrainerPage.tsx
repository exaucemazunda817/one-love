import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { HeartIcon } from '@phosphor-icons/react/ssr';
import { Eyebrow, BrushWord } from '@/components/site/ui';
import { Reveal } from '@/components/Reveal';
import { HeroBackground } from '@/components/site/HeroBackground';
import { SponsorInteractive, type SponsorText } from '@/components/site/pages/SponsorInteractive';
import type { Locale } from '@/lib/i18n';
import { SPONSOR_PLANS } from '@/lib/sponsorship';

// Bandeau du parrainage : uniquement les visages des One Love Boys (05/10/2026).
// Photos de la rentrée 2023 retirées par Mazunda (planches numérotées, 07/10/2026).
const BOYS_POOL = [
  { src: '/hero-desktop/boys-2022-noel-tim-pt-001.webp', position: '50% 50%' },
  { src: '/hero-desktop/boys-2022-noel-tim-pt-004.webp', position: '50% 50%' },
  { src: '/hero-desktop/boys-2022-noel-tim-pt-012.webp', position: '50% 50%' },
  { src: '/hero-accueil/bonnets-1.webp', position: '50% 40%' },
  { src: '/hero-accueil/bonnets-2.webp', position: '50% 40%' }
];

const text: Record<Locale, SponsorText & { title: string; desc: string; eyebrow: string; heroPre: string; heroWord: string; heroPost: string; heroIntro: string; heroAlt: string; heroCta: string; heroScroll: string }> = {
  fr: {
    title: 'Parrainer un enfant à Kinshasa, chaque mois',
    desc: "Parrainage mensuel à One Love : accompagner un enfant, avec des nouvelles régulières et le respect de sa vie privée.",
    eyebrow: 'Parrainage',
    heroPre: 'Accompagner un enfant, ',
    heroWord: 'mois après mois',
    heroPost: '.',
    heroIntro: "Le parrainage assure la continuité : l’école, le suivi médical, l’écoute. Vous recevez des nouvelles régulières, dans le respect de la vie privée de l’enfant.",
    heroAlt: 'Un One Love Boy en bonnet de Noël, grand sourire.',
    heroCta: 'Devenir parrain',
    heroScroll: 'Comment ça marche',
    howTitle: 'Comment ça marche',
    how: [
      { n: '1', t: 'Vous choisissez un engagement', d: 'Une formule mensuelle, pour accompagner un enfant.' },
      { n: '2', t: 'Vous payez et devenez parrain', d: 'Dès que votre paiement est confirmé, vous êtes parrain ou marraine et vous recevez toutes les informations pour votre parrainage.' },
      { n: '3', t: 'Vous suivez son chemin', d: 'Des nouvelles chaque trimestre, un bilan annuel, et la possibilité de lui écrire.' }
    ],
    formulesTitle: 'Choisir votre engagement',
    formulesSubtitle: 'Mensuel, modifiable ou résiliable à tout moment.',
    modes: { child: 'Parrainer un enfant', prog: 'Soutenir un programme' },
    plansChild: [
      { name: 'Éducation', prices: SPONSOR_PLANS.child[0].prices, tag: '', items: ['Scolarité et fournitures', "Ateliers d’alphabétisation et de français", 'Nouvelles chaque trimestre'] },
      { name: 'Éducation et santé', prices: SPONSOR_PLANS.child[1].prices, tag: '', items: ['Tout le parrainage Éducation', 'Suivi médical régulier', 'Accompagnement psychosocial'] },
      { name: 'Accompagnement complet', prices: SPONSOR_PLANS.child[2].prices, tag: '', items: ['Éducation, santé et écoute', 'Activités culturelles et sportives', 'Préparation à la (ré)insertion'] }
    ],
    plansProg: [
      { name: 'RÊVES 2', prices: SPONSOR_PLANS.prog[0].prices, tag: 'En cours', items: ['Ateliers et matériel pédagogique', 'Formation des animateurs', 'Bilan à la fin du programme'] },
      { name: 'Santé et écoute', prices: SPONSOR_PLANS.prog[1].prices, tag: '', items: ['Suivi médical des enfants', 'Accompagnement psychosocial', 'Rapport semestriel'] },
      { name: "Là où c’est utile", prices: SPONSOR_PLANS.prog[2].prices, tag: '', items: ['Affectation selon les besoins', "Souplesse pour notre équipe", 'Rapport annuel'] }
    ],
    perMonth: 'par mois',
    monthUnit: 'mois',
    receiveTitle: 'Ce que vous recevez',
    receiveAlt: "Des mains d’enfants colorient des lettres.",
    receive: [
      { t: 'Des nouvelles chaque trimestre', d: "Un message de notre équipe sur les progrès, à l’école et au quotidien." },
      { t: 'Des photos respectueuses', d: "Des images d’activités, jamais d’information permettant d’identifier l’enfant ou son lieu de vie." },
      { t: 'Un dessin ou une lettre', d: "Une fois par an, un mot ou un dessin de l’enfant, s’il le souhaite." },
      { t: 'Un bilan annuel', d: "L’essentiel de l’année et l’emploi des fonds du parrainage." }
    ],
    charterTitle: "Notre charte de protection de l’enfant",
    charterIntro: "Le lien avec votre filleul passe toujours par notre équipe. C’est ce qui protège l’enfant et le sens de votre engagement.",
    charter: [
      "Aucune coordonnée personnelle n’est échangée entre parrain et enfant.",
      "Les photos que vous recevez ne doivent pas être publiées en ligne.",
      "Les cadeaux passent par notre équipe, pour rester équitables entre les enfants.",
      "Les visites se font sur rendez-vous, accompagnées d’un membre de notre équipe."
    ],
    faqTitle: 'Questions fréquentes',
    faq: [
      { q: 'Puis-je arrêter ou modifier mon parrainage ?', a: 'Oui, à tout moment, par simple e-mail. Aucun engagement de durée.' },
      { q: 'Mon don va-t-il à un seul enfant ?', a: 'Il est lié à un enfant : après votre paiement, vous recevez son prénom, son âge et ses envies, sans rien qui permette de l’identifier en ligne. Une partie des moyens est mise en commun au centre, pour qu’aucun enfant ne soit laissé de côté.' },
      { q: 'Puis-je écrire à mon filleul ou lui rendre visite ?', a: "Oui, par l’intermédiaire de notre équipe. Les visites se font sur rendez-vous, accompagnées d’un membre de notre équipe." },
      { q: 'Quelles nouvelles vais-je recevoir ?', a: "Un message chaque trimestre avec une photo respectueuse ou un dessin, et un bilan annuel." }
    ],
    inscriptionTitlePre: 'Devenir ',
    inscriptionTitleWord: 'parrain',
    inscriptionTitlePost: ' ou marraine',
    inscriptionIntro: 'Dès que votre paiement est confirmé, vous devenez parrain ou marraine et vous recevez toutes les informations nécessaires pour votre parrainage.',
    firstName: 'Prénom',
    lastName: 'Nom',
    email: 'E-mail',
    phone: 'Téléphone ou WhatsApp',
    optional: '(facultatif)',
    charterAgreePre: "J’ai lu la ",
    charterAgreeLink: "charte de protection de l’enfant",
    charterAgreePost: ' et je m’engage à la respecter.',
    submitLabelPrefix: 'Payer et devenir parrain',
    continueLabel: 'Continuer : coordonnées et paiement',
    continueNote: 'Vous arrivez sur notre formulaire de don, « Parrainer un enfant » déjà coché. Vous y indiquez vos coordonnées, et un autre montant si vous le souhaitez, puis vous payez par carte ou prélèvement SEPA.',
    payNote: 'Paiement sécurisé par carte (ou par prélèvement SEPA en euros). Vous pouvez arrêter à tout moment. Dès la confirmation, nous vous écrivons avec toutes les informations.',
    customLabel: 'Ou choisissez votre montant mensuel',
    customHint: 'Laissez vide pour garder la formule choisie.',
    fromNote: 'Ces formules sont des repères, pas un minimum : vous pouvez parrainer un enfant dès {montant} par mois. Indiquez simplement votre montant dans le formulaire.',
    currencyLabel: 'Devise',
    currencyHint: 'Vous payez dans la devise choisie, sans conversion.',
    error: 'Une erreur est survenue. Merci de réessayer.'
  },
  en: {
    title: 'Sponsor a child in Kinshasa, every month',
    desc: 'Monthly sponsorship at One Love: support a child, with regular updates and full respect for their privacy.',
    eyebrow: 'Sponsorship',
    heroPre: 'Stand by a child, ',
    heroWord: 'month after month',
    heroPost: '.',
    heroIntro: "Sponsorship provides continuity: school, medical care, someone to listen. You receive regular updates, always respecting the child’s privacy.",
    heroAlt: 'A One Love Boy in a Christmas hat, grinning.',
    heroCta: 'Become a sponsor',
    heroScroll: 'How it works',
    howTitle: 'How it works',
    how: [
      { n: '1', t: 'You choose a commitment', d: 'A monthly plan to support one child.' },
      { n: '2', t: 'You pay and become a sponsor', d: 'As soon as your payment is confirmed, you are a sponsor and you receive all the information you need for your sponsorship.' },
      { n: '3', t: 'You follow their journey', d: 'Updates every quarter, a yearly review, and the chance to write to them.' }
    ],
    formulesTitle: 'Choose your commitment',
    formulesSubtitle: 'Monthly, and can be changed or cancelled at any time.',
    modes: { child: 'Sponsor a child', prog: 'Support a programme' },
    plansChild: [
      { name: 'Education', prices: SPONSOR_PLANS.child[0].prices, tag: '', items: ['Schooling and supplies', 'Literacy and French workshops', 'Updates every quarter'] },
      { name: 'Education and health', prices: SPONSOR_PLANS.child[1].prices, tag: '', items: ['Everything in Education', 'Regular medical care', 'Psychosocial support'] },
      { name: 'Full support', prices: SPONSOR_PLANS.child[2].prices, tag: '', items: ['Education, health and listening', 'Cultural and sports activities', 'Preparation for (re)integration'] }
    ],
    plansProg: [
      { name: 'RÊVES 2', prices: SPONSOR_PLANS.prog[0].prices, tag: 'Ongoing', items: ['Workshops and teaching materials', 'Facilitator training', 'Report at the end of the programme'] },
      { name: 'Health and listening', prices: SPONSOR_PLANS.prog[1].prices, tag: '', items: ['Medical care for children', 'Psychosocial support', 'Six-monthly report'] },
      { name: 'Where it helps most', prices: SPONSOR_PLANS.prog[2].prices, tag: '', items: ['Allocated by need', 'Flexibility for our team', 'Annual report'] }
    ],
    perMonth: 'per month',
    monthUnit: 'month',
    receiveTitle: 'What you receive',
    receiveAlt: "Children’s hands colouring in letters.",
    receive: [
      { t: 'Updates every quarter', d: 'A message from our team about progress, at school and day to day.' },
      { t: 'Respectful photos', d: 'Photos of activities, never anything that could identify the child or where they live.' },
      { t: 'A drawing or a letter', d: 'Once a year, a note or drawing from the child, if they wish.' },
      { t: 'A yearly review', d: "The year’s highlights and how the sponsorship funds were used." }
    ],
    charterTitle: 'Our child protection charter',
    charterIntro: "Contact with your sponsored child always goes through our team. This protects the child and the meaning of your commitment.",
    charter: [
      'No personal contact details are exchanged between sponsor and child.',
      'Photos you receive must not be posted online.',
      'Gifts go through our team, to stay fair between children.',
      'Visits are by appointment, accompanied by a member of our team.'
    ],
    faqTitle: 'Frequently asked questions',
    faq: [
      { q: 'Can I stop or change my sponsorship?', a: 'Yes, at any time, with a simple email. No minimum term.' },
      { q: 'Does my gift go to one child only?', a: 'It is linked to one child: after your payment you receive their first name, age and interests, with nothing that could identify them online. Part of the funds is pooled at the centre so that no child is left out.' },
      { q: 'Can I write to or visit my sponsored child?', a: 'Yes, through our team. Visits are by appointment, accompanied by a member of our team.' },
      { q: 'What updates will I receive?', a: 'A message every quarter with a respectful photo or a drawing, and a yearly review.' }
    ],
    inscriptionTitlePre: 'Become a ',
    inscriptionTitleWord: 'sponsor',
    inscriptionTitlePost: '',
    inscriptionIntro: 'As soon as your payment is confirmed, you become a sponsor and receive all the information you need for your sponsorship.',
    firstName: 'First name',
    lastName: 'Last name',
    email: 'Email',
    phone: 'Phone or WhatsApp',
    optional: '(optional)',
    charterAgreePre: 'I have read the ',
    charterAgreeLink: 'child protection charter',
    charterAgreePost: ' and agree to follow it.',
    submitLabelPrefix: 'Pay and become a sponsor',
    continueLabel: 'Continue: your details and payment',
    continueNote: 'You land on our donation form with “Sponsor a child” already selected. Enter your details, and another amount if you wish, then pay by card or SEPA direct debit.',
    payNote: 'Secure payment by card (or SEPA direct debit in euros). You can stop at any time. As soon as your payment is confirmed, we write to you with all the information.',
    customLabel: 'Or choose your monthly amount',
    customHint: 'Leave empty to keep the chosen plan.',
    fromNote: 'These plans are a guide, not a minimum: you can sponsor a child from {montant} a month. Just enter your amount in the form.',
    currencyLabel: 'Currency',
    currencyHint: 'You pay in the currency you choose, with no conversion.',
    error: 'Something went wrong. Please try again.'
  }
};

export function parrainerMetadata(locale: Locale): Metadata {
  const t = text[locale];
  return pageMetadata({ locale, path: '/parrainer', title: t.title, description: t.desc });
}

export function ParrainerPage({ locale }: { locale: Locale }) {
  const t = text[locale];

  return (
    <>
      <section
        className="relative flex overflow-hidden bg-night text-cream"
        style={{ minHeight: 'min(80svh,720px)' }}
      >
        <div className="relative flex min-h-svh w-full items-end dk:min-h-0 dk:items-center">
          <HeroBackground src="/hero-desktop/boys-2022-noel-tim-pt-001.webp" alt={t.heroAlt} position="50% 50%" pool={BOYS_POOL} />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,var(--scrim-1)_0%,var(--scrim-2)_30%,var(--scrim-5)_58%,var(--scrim-5)_100%)] dk:bg-[linear-gradient(90deg,var(--scrim-5)_0%,var(--scrim-4)_34%,var(--scrim-1)_64%,var(--scrim-0)_100%)]" />
          <div className="relative mx-auto w-full max-w-[1280px] px-5 py-10 dk:px-12 dk:pb-[88px] dk:pt-[128px]">
            <Reveal eager className="flex max-w-[620px] flex-col gap-4 mx-auto items-center text-center dk:mx-0 dk:items-start dk:text-left dk:gap-6">
              <Eyebrow dark>{t.eyebrow}</Eyebrow>
              <h1 className="m-0 text-balance font-serif text-[32px] font-medium leading-[1.08] tracking-[-0.01em] dk:text-[clamp(38px,5vw,64px)]">
                {t.heroPre}
                <BrushWord>{t.heroWord}</BrushWord>
                {t.heroPost}
              </h1>
              <p className="-mt-1.5 m-0 max-w-[540px] text-pretty text-[15px] leading-[1.5] text-on-dark-1 dk:mt-0 dk:text-[20px] dk:leading-[1.6]">{t.heroIntro}</p>
              <div className="flex flex-wrap items-center justify-center gap-3 dk:justify-start">
                <a
                  href="#inscription"
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 whitespace-nowrap rounded-full bg-gradient-to-br from-gold-hover to-gold px-7 text-[13px] font-bold uppercase tracking-wide text-night no-underline transition-opacity hover:text-night hover:opacity-90"
                >
                  <HeartIcon size="1em" aria-hidden />
                  {t.heroCta}
                </a>
                <a href="#comment" className="inline-flex min-h-[48px] items-center justify-center whitespace-nowrap rounded-full border border-cream/35 px-[26px] text-[13px] font-semibold uppercase tracking-wide text-cream no-underline transition-colors hover:border-gold hover:text-gold-hover">
                  {t.heroScroll}
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Données structurées de la FAQ visible : générées depuis le même texte,
          donc toujours identiques à ce que voit le visiteur. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            inLanguage: locale,
            mainEntity: t.faq.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a }
            }))
          }).replace(/</g, '\\u003c')
        }}
      />
      <SponsorInteractive locale={locale} t={t} />
    </>
  );
}
