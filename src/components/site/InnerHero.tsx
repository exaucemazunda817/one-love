import Image from 'next/image';
import Link from 'next/link';
import { HeartIcon } from '@phosphor-icons/react/ssr';
import { Eyebrow, BrushWord } from '@/components/site/ui';
import { Reveal } from '@/components/Reveal';
import { localeHref, type Locale } from '@/lib/i18n';

// Hero des pages secondaires — README : « min(64vh,580px) / mobile
// min(82svh,640px) », même dégradé horizontal/vertical que l'accueil.
export function InnerHero({
  locale,
  eyebrow,
  titlePre = '',
  titleWord,
  titlePost = '',
  intro,
  image,
  imageAlt,
  objectPosition = '50% 35%',
  cta
}: {
  locale: Locale;
  eyebrow: string;
  titlePre?: string;
  titleWord?: string;
  titlePost?: string;
  intro?: string;
  image: string;
  imageAlt: string;
  objectPosition?: string;
  cta?: { donate: string; sponsor: string };
}) {
  const href = (p: string) => localeHref(p, locale);
  return (
    <section className="relative flex min-h-[min(82svh,640px)] items-end overflow-hidden bg-night text-cream dk:min-h-[min(64vh,580px)] dk:items-center">
      <Image src={image} alt={imageAlt} fill priority sizes="100vw" className="photo-tone object-cover" style={{ objectPosition }} />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,.1)_0%,rgba(10,10,10,.35)_30%,rgba(10,10,10,.88)_58%,rgba(10,10,10,.95)_100%)] dk:bg-[linear-gradient(90deg,rgba(10,10,10,.92)_0%,rgba(10,10,10,.78)_34%,rgba(10,10,10,.1)_64%,rgba(10,10,10,0)_100%)]" />
      <div className="relative mx-auto w-full max-w-[1280px] px-5 py-10 dk:px-12 dk:pb-[88px] dk:pt-[128px]">
        <Reveal className="flex max-w-[620px] flex-col gap-4 mx-auto items-center text-center dk:mx-0 dk:items-start dk:text-left dk:gap-6">
          <Eyebrow dark>{eyebrow}</Eyebrow>
          <h1 className="m-0 text-balance font-serif text-[38px] font-medium leading-[1.06] tracking-[-0.01em] dk:text-[clamp(38px,5vw,64px)]">
            {titlePre}
            {titleWord && <BrushWord>{titleWord}</BrushWord>}
            {titlePost}
          </h1>
          {intro && (
            <p className="-mt-1.5 m-0 max-w-[540px] text-pretty text-[15px] leading-[1.5] text-on-dark-1 dk:mt-0 dk:text-[20px] dk:leading-[1.6]">{intro}</p>
          )}
          {cta && (
            <div className="flex flex-wrap justify-center gap-3 dk:justify-start">
              <Link
                href={href('/dons')}
                className="inline-flex min-h-[48px] items-center justify-center gap-2 whitespace-nowrap rounded-full bg-gradient-to-br from-gold-hover to-gold px-7 text-[13px] font-bold uppercase tracking-wide text-night no-underline transition-opacity hover:text-night hover:opacity-90"
              >
                <HeartIcon size="1em" aria-hidden />
                {cta.donate}
              </Link>
              <Link
                href={href('/parrainer')}
                className="inline-flex min-h-[48px] items-center justify-center whitespace-nowrap rounded-full border border-cream/35 px-[26px] text-[13px] font-semibold uppercase tracking-wide text-cream no-underline transition-colors hover:border-gold hover:text-gold-hover"
              >
                {cta.sponsor}
              </Link>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
