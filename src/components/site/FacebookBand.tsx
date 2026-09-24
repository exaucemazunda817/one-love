import { FacebookLogoIcon, VideoCameraIcon } from '@phosphor-icons/react/ssr';
import { Reveal } from '@/components/Reveal';
import { FACEBOOK_URL, FACEBOOK_REELS_URL, type Locale } from '@/lib/i18n';

const text = {
  fr: {
    title: "Le quotidien des enfants, en photos et en vidéos",
    body: "L'équipe publie régulièrement des nouvelles du terrain sur sa page Facebook, suivie par plus de 2 000 personnes.",
    page: 'Voir la page Facebook',
    reels: 'Voir les vidéos'
  },
  en: {
    title: "The children's daily life, in photos and videos",
    body: "The team regularly shares news from the field on its Facebook page, followed by more than 2,000 people.",
    page: 'Visit our Facebook page',
    reels: 'Watch the videos'
  }
};

// Bandeau d'invitation vers la page Facebook de l'association.
export function FacebookBand({ locale }: { locale: Locale }) {
  const t = text[locale];
  return (
    <section className="mx-auto max-w-[1200px] px-[clamp(12px,3vw,32px)] pb-[clamp(56px,8vw,104px)]">
      <Reveal className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] items-center gap-7 rounded-card bg-night p-[clamp(28px,5vw,56px)] text-cream">
        <div className="flex flex-col gap-3">
          <FacebookLogoIcon size={40} className="text-gold-hover" aria-hidden />
          <h2 className="m-0 text-balance font-serif text-[clamp(26px,3vw,38px)] font-medium leading-[1.2]">{t.title}</h2>
          <p className="m-0 max-w-[520px] text-[16px] leading-[1.6] text-on-dark-1">{t.body}</p>
        </div>
        <div className="flex flex-wrap gap-3 dk:justify-end">
          <a
            href={FACEBOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[48px] items-center justify-center gap-2 whitespace-nowrap rounded-full bg-gradient-to-br from-gold-hover to-gold px-7 text-[13px] font-bold uppercase tracking-wide text-night no-underline transition-opacity hover:text-night hover:opacity-90"
          >
            <FacebookLogoIcon size="1.2em" aria-hidden />
            {t.page}
          </a>
          <a
            href={FACEBOOK_REELS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[48px] items-center justify-center gap-2 whitespace-nowrap rounded-full border border-cream/35 px-[26px] text-[13px] font-semibold uppercase tracking-wide text-cream no-underline transition-colors hover:border-gold hover:text-gold-hover"
          >
            <VideoCameraIcon size="1.2em" aria-hidden />
            {t.reels}
          </a>
        </div>
      </Reveal>
    </section>
  );
}
