import type { Metadata } from 'next';
import { HeartIcon } from '@phosphor-icons/react/ssr';
import { Eyebrow, BrushWord } from '@/components/site/ui';
import { Reveal } from '@/components/Reveal';
import { HeroBackground } from '@/components/site/HeroBackground';
import { SponsorInteractive, type SponsorText } from '@/components/site/pages/SponsorInteractive';
import type { Locale } from '@/lib/i18n';

const text: Record<Locale, SponsorText & { title: string; desc: string; eyebrow: string; heroPre: string; heroWord: string; heroPost: string; heroIntro: string; heroAlt: string; heroCta: string; heroScroll: string }> = {
  fr: {
    title: 'Parrainer un enfant',
    desc: "Parrainage mensuel à One Love : accompagner un enfant ou soutenir un programme, avec des nouvelles régulières et le respect de sa vie privée.",
    eyebrow: 'Parrainage',
    heroPre: 'Accompagner un enfant, ',
    heroWord: 'mois après mois',
    heroPost: '.',
    heroIntro: "Le parrainage assure la continuité : l'école, le suivi médical, l'écoute. Vous recevez des nouvelles régulières, dans le respect de la vie privée de l'enfant.",
    heroAlt: 'Un garçon rit et fait le signe de la paix, assis sur un muret du jardin.',
    heroCta: 'Devenir parrain',
    heroScroll: 'Comment ça marche',
    howTitle: 'Comment ça marche',
    how: [
      { n: '1', t: 'Vous choisissez un engagement', d: 'Une formule mensuelle, pour un enfant ou pour un programme comme RÊVES 2.' },
      { n: '2', t: "Nous vous présentons l'enfant", d: "Son prénom, son âge et ses envies, sans information qui permettrait de l'identifier en ligne." },
      { n: '3', t: 'Vous suivez son chemin', d: 'Des nouvelles chaque trimestre, un bilan annuel, et la possibilité de lui écrire.' }
    ],
    formulesTitle: 'Choisir votre engagement',
    formulesSubtitle: 'Mensuel, modifiable ou résiliable à tout moment.',
    modes: { child: 'Parrainer un enfant', prog: 'Soutenir un programme' },
    plansChild: [
      { name: 'Éducation', price: 20, tag: '', items: ['Scolarité et fournitures', "Ateliers d'alphabétisation et de français", 'Nouvelles chaque trimestre'] },
      { name: 'Éducation et santé', price: 35, tag: 'Le plus choisi', items: ['Tout le parrainage Éducation', 'Suivi médical régulier', 'Accompagnement psychosocial'] },
      { name: 'Accompagnement complet', price: 50, tag: '', items: ['Éducation, santé et écoute', 'Activités culturelles et sportives', 'Préparation à la (ré)insertion'] }
    ],
    plansProg: [
      { name: 'RÊVES 2', price: 25, tag: 'En cours', items: ['Ateliers et matériel pédagogique', 'Formation des animateurs', 'Bilan à la fin du programme'] },
      { name: 'Santé et écoute', price: 30, tag: '', items: ['Suivi médical des enfants', 'Accompagnement psychosocial', 'Rapport semestriel'] },
      { name: "Là où c'est utile", price: 20, tag: '', items: ['Affectation selon les besoins', "Souplesse pour l'équipe", 'Rapport annuel'] }
    ],
    perMonth: 'par mois',
    monthUnit: 'mois',
    plansConfirm: 'Montants et contenus des formules à confirmer par l’association.',
    receiveTitle: 'Ce que vous recevez',
    receiveAlt: "Des mains d'enfants colorient des lettres.",
    receive: [
      { t: 'Des nouvelles chaque trimestre', d: "Un message de l'équipe sur les progrès, à l'école et au quotidien." },
      { t: 'Des photos respectueuses', d: "Des images d'activités, jamais d'information permettant d'identifier l'enfant ou son lieu de vie." },
      { t: 'Un dessin ou une lettre', d: "Une fois par an, un mot ou un dessin de l'enfant, s'il le souhaite." },
      { t: 'Un bilan annuel', d: "L'essentiel de l'année et l'emploi des fonds du programme." }
    ],
    charterTitle: "Notre charte de protection de l'enfant",
    charterIntro: "Le lien avec votre filleul passe toujours par l'équipe de One Love. C'est ce qui protège l'enfant et le sens de votre engagement.",
    charter: [
      "Aucune coordonnée personnelle n'est échangée entre parrain et enfant.",
      "Les photos que vous recevez ne doivent pas être publiées en ligne.",
      "Les cadeaux passent par l'équipe, pour rester équitables entre les enfants.",
      "Les visites se font sur rendez-vous, accompagnées d'un membre de One Love."
    ],
    quote: "« Chaque trimestre, je reçois quelques lignes et un dessin. Je vois les progrès en lecture, et je sais que je fais partie de son chemin. »",
    quoteName: 'Pascal D.',
    quoteRole: 'parrain depuis 2023',
    quoteFictional: 'témoignage fictif, à remplacer',
    faqTitle: 'Questions fréquentes',
    faq: [
      { q: 'Puis-je arrêter ou modifier mon parrainage ?', a: 'Oui, à tout moment, par simple e-mail. Aucun engagement de durée.' },
      { q: 'Mon don va-t-il à un seul enfant ?', a: "Votre parrainage est lié à un enfant que nous vous présentons. Les moyens sont mutualisés au sein du programme pour qu'aucun enfant ne soit laissé de côté." },
      { q: 'Puis-je écrire à mon filleul ou lui rendre visite ?', a: "Oui, par l'intermédiaire de l'équipe. Les visites se font sur rendez-vous, accompagnées d'un membre de One Love." },
      { q: 'Quelles nouvelles vais-je recevoir ?', a: "Un message chaque trimestre avec une photo respectueuse ou un dessin, et un bilan annuel. Réponses à confirmer par l'association." }
    ],
    inscriptionTitlePre: 'Devenir ',
    inscriptionTitleWord: 'parrain',
    inscriptionTitlePost: ' ou marraine',
    inscriptionIntro: "Nous revenons vers vous sous 7 jours pour vous présenter l'enfant ou le programme que vous accompagnerez, avant tout premier prélèvement.",
    yourChoice: 'Votre choix',
    change: 'Modifier',
    firstName: 'Prénom',
    lastName: 'Nom',
    email: 'E-mail',
    phone: 'Téléphone ou WhatsApp',
    optional: '(facultatif)',
    charterAgreePre: "J'ai lu la ",
    charterAgreeLink: "charte de protection de l'enfant",
    charterAgreePost: ' et je m’engage à la respecter.',
    submitLabelPrefix: 'Je deviens parrain',
    noCharge: 'Aucun prélèvement à cette étape.',
    thanksTitle: 'Merci, votre demande est bien reçue.',
    thanksText: 'Nous vous écrivons sous 7 jours pour la suite. En attendant, vous pouvez suivre nos nouvelles du terrain.',
    backToForm: 'Revenir au formulaire',
    error: 'Une erreur est survenue. Merci de réessayer.'
  },
  en: {
    title: 'Sponsor a child',
    desc: 'Monthly sponsorship at One Love: support a child or a programme, with regular updates and full respect for their privacy.',
    eyebrow: 'Sponsorship',
    heroPre: 'Stand by a child, ',
    heroWord: 'month after month',
    heroPost: '.',
    heroIntro: "Sponsorship provides continuity: school, medical care, someone to listen. You receive regular updates, always respecting the child's privacy.",
    heroAlt: 'A boy laughs and makes a peace sign, sitting on a garden wall.',
    heroCta: 'Become a sponsor',
    heroScroll: 'How it works',
    howTitle: 'How it works',
    how: [
      { n: '1', t: 'You choose a commitment', d: 'A monthly plan, for a child or for a programme such as RÊVES 2.' },
      { n: '2', t: 'We introduce the child', d: 'Their first name, age and interests, with nothing that could identify them online.' },
      { n: '3', t: 'You follow their journey', d: 'Updates every quarter, a yearly review, and the chance to write to them.' }
    ],
    formulesTitle: 'Choose your commitment',
    formulesSubtitle: 'Monthly, and can be changed or cancelled at any time.',
    modes: { child: 'Sponsor a child', prog: 'Support a programme' },
    plansChild: [
      { name: 'Education', price: 20, tag: '', items: ['Schooling and supplies', 'Literacy and French workshops', 'Updates every quarter'] },
      { name: 'Education and health', price: 35, tag: 'Most popular', items: ['Everything in Education', 'Regular medical care', 'Psychosocial support'] },
      { name: 'Full support', price: 50, tag: '', items: ['Education, health and listening', 'Cultural and sports activities', 'Preparation for (re)integration'] }
    ],
    plansProg: [
      { name: 'RÊVES 2', price: 25, tag: 'Ongoing', items: ['Workshops and teaching materials', 'Facilitator training', 'Report at the end of the programme'] },
      { name: 'Health and listening', price: 30, tag: '', items: ['Medical care for children', 'Psychosocial support', 'Six-monthly report'] },
      { name: 'Where it helps most', price: 20, tag: '', items: ['Allocated by need', 'Flexibility for the team', 'Annual report'] }
    ],
    perMonth: 'per month',
    monthUnit: 'month',
    plansConfirm: 'Plan amounts and contents to be confirmed by the association.',
    receiveTitle: 'What you receive',
    receiveAlt: "Children's hands colouring in letters.",
    receive: [
      { t: 'Updates every quarter', d: 'A message from the team about progress, at school and day to day.' },
      { t: 'Respectful photos', d: 'Photos of activities, never anything that could identify the child or where they live.' },
      { t: 'A drawing or a letter', d: 'Once a year, a note or drawing from the child, if they wish.' },
      { t: 'A yearly review', d: "The year's highlights and how the programme's funds were used." }
    ],
    charterTitle: 'Our child protection charter',
    charterIntro: "Contact with your sponsored child always goes through the One Love team. This protects the child and the meaning of your commitment.",
    charter: [
      'No personal contact details are exchanged between sponsor and child.',
      'Photos you receive must not be posted online.',
      'Gifts go through the team, to stay fair between children.',
      'Visits are by appointment, accompanied by a One Love team member.'
    ],
    quote: "“Every quarter I get a few lines and a drawing. I can see the progress in reading, and I know I'm part of his journey.”",
    quoteName: 'Pascal D.',
    quoteRole: 'sponsor since 2023',
    quoteFictional: 'sample testimonial, to be replaced',
    faqTitle: 'Frequently asked questions',
    faq: [
      { q: 'Can I stop or change my sponsorship?', a: 'Yes, at any time, with a simple email. No minimum term.' },
      { q: 'Does my gift go to one child only?', a: 'Your sponsorship is linked to a child we introduce to you. Funds are pooled within the programme so that no child is left out.' },
      { q: 'Can I write to or visit my sponsored child?', a: 'Yes, through the team. Visits are by appointment, accompanied by a One Love team member.' },
      { q: 'What updates will I receive?', a: 'A message every quarter with a respectful photo or a drawing, and a yearly review. Answers to be confirmed by the association.' }
    ],
    inscriptionTitlePre: 'Become a ',
    inscriptionTitleWord: 'sponsor',
    inscriptionTitlePost: '',
    inscriptionIntro: "We'll get back to you within 7 days to introduce the child or programme you'll support, before any payment is taken.",
    yourChoice: 'Your choice',
    change: 'Change',
    firstName: 'First name',
    lastName: 'Last name',
    email: 'Email',
    phone: 'Phone or WhatsApp',
    optional: '(optional)',
    charterAgreePre: 'I have read the ',
    charterAgreeLink: 'child protection charter',
    charterAgreePost: ' and agree to follow it.',
    submitLabelPrefix: 'Become a sponsor',
    noCharge: 'No payment is taken at this stage.',
    thanksTitle: 'Thank you, we have received your request.',
    thanksText: "We'll write to you within 7 days about next steps. Meanwhile, you can follow our news from the field.",
    backToForm: 'Back to the form',
    error: 'Something went wrong. Please try again.'
  }
};

export function parrainerMetadata(locale: Locale): Metadata {
  const t = text[locale];
  return { title: t.title, description: t.desc };
}

export function ParrainerPage({ locale }: { locale: Locale }) {
  const t = text[locale];

  return (
    <>
      <section
        className="relative flex overflow-hidden bg-night text-cream"
        style={{ minHeight: 'min(80vh,720px)' }}
      >
        <div className="relative flex min-h-svh w-full items-end dk:min-h-0 dk:items-center">
          <HeroBackground src="/photos/photo-joie.jpg" alt={t.heroAlt} position="45% 30%" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,.1)_0%,rgba(10,10,10,.35)_30%,rgba(10,10,10,.88)_58%,rgba(10,10,10,.95)_100%)] dk:bg-[linear-gradient(90deg,rgba(10,10,10,.92)_0%,rgba(10,10,10,.78)_34%,rgba(10,10,10,.1)_64%,rgba(10,10,10,0)_100%)]" />
          <div className="relative mx-auto w-full max-w-[1280px] px-5 py-10 dk:px-12 dk:pb-[88px] dk:pt-[128px]">
            <Reveal className="flex max-w-[620px] flex-col gap-4 mx-auto items-center text-center dk:mx-0 dk:items-start dk:text-left dk:gap-6">
              <Eyebrow dark>{t.eyebrow}</Eyebrow>
              <h1 className="m-0 text-balance font-serif text-[38px] font-medium leading-[1.06] tracking-[-0.01em] dk:text-[clamp(38px,5vw,64px)]">
                {t.heroPre}
                <BrushWord>{t.heroWord}</BrushWord>
                {t.heroPost}
              </h1>
              <p className="-mt-1.5 m-0 max-w-[540px] text-pretty text-[15px] leading-[1.5] text-on-dark-1 dk:mt-0 dk:text-[20px] dk:leading-[1.6]">{t.heroIntro}</p>
              <div className="flex flex-wrap items-center justify-center gap-5 dk:justify-start">
                <a
                  href="#inscription"
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 whitespace-nowrap rounded-full bg-gradient-to-br from-gold-hover to-gold px-7 text-[13px] font-bold uppercase tracking-wide text-night no-underline transition-opacity hover:text-night hover:opacity-90"
                >
                  <HeartIcon size="1em" aria-hidden />
                  {t.heroCta}
                </a>
                <a href="#comment" className="text-[15px] font-bold text-cream underline underline-offset-4">
                  {t.heroScroll}
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <SponsorInteractive locale={locale} t={t} />
    </>
  );
}
