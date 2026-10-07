import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { BuildingsIcon, HardDrivesIcon, CopyrightIcon, CameraIcon } from '@phosphor-icons/react/ssr';
import { BrushLast, TextHero } from '@/components/site/ui';
import { Reveal } from '@/components/Reveal';
import { org } from '@/lib/content';

export const metadata: Metadata = pageMetadata({
  locale: 'fr',
  path: '/mentions-legales',
  title: 'Mentions légales',
  description: 'Éditeur, hébergeur et informations légales du site de l’association One Love.',
  noindex: true,
  frOnly: true
});

// À FAIRE CONFIRMER AVANT MISE EN LIGNE :
//   1. (Réglé le 03/10/2026 : siège social confirmé au 44 rue de la Roquette,
//      75011 Paris.)
//   2. Le nom du directeur de la publication (président de l'association).
//   3. L'hébergeur définitif, si le site n'est pas déployé sur Vercel.
const cards = [
  {
    icon: BuildingsIcon,
    title: 'Éditeur du site',
    body: (
      <>
        {org.legalName}, association régie par la loi du 1<sup>er</sup> juillet 1901,
        déclarée sous le numéro RNA {org.rna}.
        <br />
        Siège social : {org.addressAsPublished}.
        <br />
        Courriel : {org.contactEmail}
      </>
    )
  },
  {
    icon: HardDrivesIcon,
    title: 'Hébergement',
    body: (
      <>
        Le site est hébergé par Vercel Inc., 440 N Barranca Ave #4133, Covina,
        CA 91723, États-Unis. Les données de l&apos;association sont stockées dans
        l&apos;Union européenne.
      </>
    )
  },
  {
    icon: CopyrightIcon,
    title: 'Propriété intellectuelle',
    body: (
      <>
        Les textes, photographies et éléments graphiques de ce site sont la
        propriété de {org.legalName}, sauf mention contraire. Toute reproduction
        sans autorisation est interdite.
      </>
    )
  },
  {
    icon: CameraIcon,
    title: 'Droit à l’image',
    body: (
      <>
        Les personnes figurant sur les photographies publiées sur ce site ont été
        photographiées dans le cadre des activités de l&apos;association. Toute
        demande de retrait peut être adressée à {org.privacyEmail} et sera traitée
        sans délai.
      </>
    )
  }
] as const;

export default function MentionsLegalesPage() {
  return (
    <>
      <TextHero
        back={{ href: '/', locale: 'fr' }}
        image="/hero-desktop/centre-aere-2023-02-tim-pt-009.webp"
        imagePosition="50% 50%"
        eyebrow="Informations légales"
        title="Mentions légales"
        intro="Éditeur, hébergeur, propriété des contenus et droit à l’image du site de l’association One Love."
      />

      <section className="bg-cream">
        <div className="mx-auto grid max-w-[1200px] grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-5 px-[clamp(20px,4vw,32px)] py-[clamp(56px,8vw,96px)] max-md:gap-9 max-md:py-10">
          {cards.slice(0, 2).map((c, i) => (
            <Reveal key={c.title} delay={i * 90} className="flex flex-col gap-3 rounded-card bg-white p-8 shadow-ol-sm max-md:gap-2.5 max-md:rounded-none max-md:bg-transparent max-md:p-0 max-md:shadow-none">
              <c.icon size={36} className="text-copper-600 max-md:hidden" aria-hidden />
              <h2 className="m-0 text-balance font-serif text-[24px] font-medium leading-[1.25] max-md:text-[26px]"><BrushLast text={c.title} /></h2>
              <p className="m-0 text-[16px] leading-[1.65] text-ink-body">{c.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-sand">
        <div className="mx-auto grid max-w-[1200px] grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-5 px-[clamp(20px,4vw,32px)] py-[clamp(56px,8vw,96px)] max-md:gap-9 max-md:py-10">
          {cards.slice(2, 4).map((c, i) => (
            <Reveal key={c.title} delay={i * 90} className="flex flex-col gap-3 rounded-card bg-white p-8 shadow-ol-sm max-md:gap-2.5 max-md:rounded-none max-md:bg-transparent max-md:p-0 max-md:shadow-none">
              <c.icon size={36} className="text-copper-600 max-md:hidden" aria-hidden />
              <h2 className="m-0 text-balance font-serif text-[24px] font-medium leading-[1.25] max-md:text-[26px]"><BrushLast text={c.title} /></h2>
              <p className="m-0 text-[16px] leading-[1.65] text-ink-body">{c.body}</p>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
