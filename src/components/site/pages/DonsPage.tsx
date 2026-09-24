import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { Suspense } from 'react';
import Link from 'next/link';
import { Reveal } from '@/components/Reveal';
import { HeroBackground } from '@/components/site/HeroBackground';
import { BrushWord, Eyebrow } from '@/components/site/ui';
import { DonationFlow } from '@/components/site/DonationFlow';
import { CancelNotice } from '@/app/(site)/dons/CancelNotice';
import { localeHref, type Locale } from '@/lib/i18n';

export const text = {
  fr: {
    metaDescription:
      'Soutenir les programmes de One Love à Kinshasa : alphabétisation, suivi médical et psychosocial, (ré)insertion professionnelle.',
    eyebrow: 'Nous soutenir',
    titlePre: 'Faire un ',
    titleWord: 'don',
    intro:
      'Votre don finance directement les programmes de terrain : ateliers, matériel pédagogique, suivi médical et psychosocial des enfants.',
    fundsTitle: "L'emploi de vos dons",
    fundsIntro:
      "Sauf mention spéciale, l'affectation de vos dons se fait en fonction des besoins des programmes de terrain. Si vous souhaitez soutenir un programme en particulier, précisez-le lors de votre virement.",
    privacyTitle: 'Respect de votre vie privée',
    privacyText: "One Love ne commercialise pas ses fichiers de donateurs, de clients ni d'abonnés. Voir notre",
    privacyLink: 'politique de confidentialité',
    sponsorTitle: 'Parrainer plutôt ?',
    sponsorText: "Un engagement mensuel qui assure la continuité de l'accompagnement d'un enfant.",
    sponsorCta: 'Découvrir le parrainage',
    otherTitle: "Autrement qu'un don",
    otherText: "Vous pouvez aussi rejoindre l'équipe comme bénévole ou construire un partenariat avec l'association.",
    otherCta: 'Prendre contact',
    cancelled: 'Le paiement a été annulé. Aucun montant n’a été prélevé.'
  },
  en: {
    metaDescription:
      'Support One Love’s programmes in Kinshasa: literacy, medical and psychosocial care, (re)integration into work.',
    eyebrow: 'Support us',
    titlePre: '',
    titleWord: 'Donate',
    intro:
      'Your gift directly funds our field programmes: workshops, teaching materials, and the children’s medical and psychosocial care.',
    fundsTitle: 'How your gifts are used',
    fundsIntro:
      'Unless otherwise specified, your gift is allocated according to the needs of our field programmes. If you would like to support a specific programme, please mention it in your transfer.',
    privacyTitle: 'Respecting your privacy',
    privacyText: 'One Love does not sell its donor, customer or subscriber lists. See our',
    privacyLink: 'privacy policy',
    sponsorTitle: 'Sponsor instead?',
    sponsorText: 'A monthly commitment that ensures continuous support for a child.',
    sponsorCta: 'Discover sponsorship',
    otherTitle: 'Other ways to help',
    otherText: 'You can also join the team as a volunteer or build a partnership with the association.',
    otherCta: 'Get in touch',
    cancelled: 'The payment was cancelled. No amount was charged.'
  }
};

export function donsMetadata(locale: Locale): Metadata {
  return pageMetadata({
    locale,
    path: '/dons',
    title: locale === 'en' ? 'Donate' : 'Faire un don',
    description: text[locale].metaDescription
  });
}

export function DonsPage({ locale }: { locale: Locale }) {
  const t = text[locale];
  const href = (p: string) => localeHref(p, locale);

  return (
    <>
      <section className="relative overflow-hidden bg-night text-cream">
        <HeroBackground src="/photos/photo-ecriture.jpg" alt="" position="70% 30%" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,10,10,.94)_0%,rgba(10,10,10,.82)_45%,rgba(10,10,10,.35)_100%)]" />
        <div className="relative mx-auto max-w-[1200px] px-[clamp(20px,4vw,32px)] pb-[clamp(48px,7vw,88px)] pt-[clamp(120px,12vw,148px)]">
          <Reveal className="mx-auto flex max-w-[620px] flex-col items-center gap-[18px] text-center dk:mx-0 dk:max-w-none dk:items-start dk:text-left">
          <Eyebrow dark>{t.eyebrow}</Eyebrow>
          <h1 className="m-0 text-balance font-serif text-[clamp(38px,5vw,64px)] font-medium leading-[1.06]">
            {t.titlePre}
            <BrushWord>{t.titleWord}</BrushWord>
          </h1>
          <p className="-mt-1.5 m-0 max-w-[560px] text-pretty text-[15px] leading-[1.5] text-on-dark-1 dk:mt-0 dk:text-[clamp(17px,1.6vw,20px)] dk:leading-[1.6]">{t.intro}</p>
          </Reveal>
        </div>
      </section>

      <Suspense fallback={null}>
        <CancelBanner locale={locale} />
      </Suspense>

      <DonationFlow locale={locale} />

      <section className="bg-sand">
        <Reveal className="mx-auto flex max-w-[1200px] flex-col gap-3 px-[clamp(20px,4vw,32px)] py-[clamp(56px,8vw,96px)]">
          <h2 className="m-0 font-serif text-[clamp(30px,3.6vw,46px)] font-medium leading-[1.15]">{t.fundsTitle}</h2>
          <p className="m-0 max-w-measure text-[16px] leading-[1.6] text-ink-body">{t.fundsIntro}</p>
        </Reveal>
      </section>

      <section className="mx-auto grid max-w-[1200px] grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-5 px-[clamp(20px,4vw,32px)] py-[clamp(56px,8vw,96px)]">
        <Reveal className="rounded-xl border border-card-line p-6">
          <h2 className="m-0 text-[18px] font-black">{t.privacyTitle}</h2>
          <p className="mt-2.5 text-[15px] leading-[1.6] text-ink-soft">
            {t.privacyText}{' '}
            <Link href="/confidentialite" className="font-bold text-copper-700 underline underline-offset-2">
              {t.privacyLink}
            </Link>
            .
          </p>
        </Reveal>
        <Reveal delay={90} className="rounded-xl border border-card-line p-6">
          <h2 className="m-0 text-[18px] font-black">{t.sponsorTitle}</h2>
          <p className="mt-2.5 text-[15px] leading-[1.6] text-ink-body">{t.sponsorText}</p>
          <Link href={href('/parrainer')} className="mt-4 inline-flex min-h-11 items-center gap-1.5 font-bold text-copper-700 no-underline">
            {t.sponsorCta}
          </Link>
        </Reveal>
        <Reveal delay={180} className="rounded-xl bg-sand p-6">
          <h2 className="m-0 text-[18px] font-black">{t.otherTitle}</h2>
          <p className="mt-2.5 text-[15px] leading-[1.6] text-ink-body">{t.otherText}</p>
          <Link
            href={href('/contact')}
            className="mt-5 inline-flex min-h-11 items-center rounded-full bg-copper-600 px-5 text-[14px] font-bold text-white no-underline hover:bg-copper-700 hover:text-white"
          >
            {t.otherCta}
          </Link>
        </Reveal>
      </section>
    </>
  );
}

function CancelBanner({ locale }: { locale: Locale }) {
  return <CancelNotice locale={locale} />;
}
