import { FacebookLogoIcon, InstagramLogoIcon, YoutubeLogoIcon } from '@phosphor-icons/react/ssr';
import { Reveal } from '@/components/Reveal';
import { FACEBOOK_URL, INSTAGRAM_URL, YOUTUBE_URL, type Locale } from '@/lib/i18n';

const text = {
  fr: {
    title: 'Le quotidien de One Love',
    body: 'Chaque semaine, des enfants viennent au centre One Love pour apprendre, jouer et reprendre confiance. Ateliers, repas partagés, sorties, fêtes : nous racontons ces moments, petits et grands, sur nos réseaux. Suivez-nous pour voir leurs progrès, leurs sourires et la vie de l’association au jour le jour.',
    facebook: 'Facebook',
    instagram: 'Instagram',
    youtube: 'YouTube'
  },
  en: {
    title: 'Everyday life at One Love',
    body: 'Every week, children come to the One Love centre to learn, play and regain confidence. Workshops, shared meals, outings, celebrations: we share these moments, big and small, on our social media. Follow us to see their progress, their smiles and the life of the association day by day.',
    facebook: 'Facebook',
    instagram: 'Instagram',
    youtube: 'YouTube'
  }
};

// Bandeau d'invitation vers les réseaux sociaux de l'association (le nom du
// composant date de l'époque où il ne renvoyait que vers Facebook).
export function FacebookBand({ locale }: { locale: Locale }) {
  const t = text[locale];
  const primary =
    'inline-flex min-h-[48px] items-center justify-center gap-2 whitespace-nowrap rounded-full bg-gradient-to-br from-gold-hover to-gold px-7 text-[13px] font-bold uppercase tracking-wide text-night no-underline transition-opacity hover:text-night hover:opacity-90';
  const links = [
    { href: FACEBOOK_URL, label: t.facebook, Icon: FacebookLogoIcon },
    { href: INSTAGRAM_URL, label: t.instagram, Icon: InstagramLogoIcon },
    { href: YOUTUBE_URL, label: t.youtube, Icon: YoutubeLogoIcon }
  ];
  return (
    <section className="mx-auto max-w-[1200px] px-[clamp(12px,3vw,32px)] pb-[clamp(32px,5vw,56px)]">
      <Reveal className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] items-center gap-7 rounded-card bg-night p-[clamp(28px,5vw,56px)] text-cream">
        <div className="flex flex-col gap-3">
          <h2 className="m-0 text-balance font-serif text-[clamp(26px,3vw,38px)] font-medium leading-[1.2]">{t.title}</h2>
          <p className="m-0 max-w-[560px] text-[16px] leading-[1.6] text-on-dark-1">{t.body}</p>
        </div>
        <div className="flex flex-wrap gap-3 dk:justify-end">
          {links.map(({ href, label, Icon }) => (
            <a key={href} href={href} target="_blank" rel="noopener noreferrer" className={primary}>
              <Icon size="1.2em" aria-hidden />
              {label}
            </a>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
