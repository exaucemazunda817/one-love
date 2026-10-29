import Image from 'next/image';
import { Reveal } from '@/components/Reveal';
import { HoverVideo } from '@/components/site/HoverVideo';

// Carte photo plein cadre pour le mobile : le texte est posé sur l'image, sur un
// dégradé sombre qui garantit la lisibilité, et chaque élément (pastille, titre,
// texte, lien) apparaît l'un après l'autre. À n'afficher que sous 768 px
// (`md:hidden`) ; les écrans plus larges gardent la mise en page d'origine.
export function MobilePhotoCard({
  src,
  alt,
  video,
  badge,
  title,
  text,
  action,
  heightClass = 'h-[440px]',
  imagePosition = '50% 35%',
  headingLevel = 3
}: {
  src: string;
  alt: string;
  // Vidéo d'aperçu facultative : démarre sans le son quand la carte est bien à l'écran.
  video?: string;
  badge?: React.ReactNode;
  title: string;
  text: string;
  action?: React.ReactNode;
  heightClass?: string;
  imagePosition?: string;
  // Niveau du titre : 2 quand la carte suit directement le titre de la page (pas de
  // saut h1 → h3 pour les lecteurs d'écran).
  headingLevel?: 2 | 3;
}) {
  const Heading = headingLevel === 2 ? 'h2' : 'h3';
  return (
    <Reveal className={`relative w-full overflow-hidden rounded-card bg-night shadow-ol-photo ${heightClass}`}>
      <Reveal variant="zoom" className="absolute inset-0">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 92vw, 400px"
          loading="lazy"
          className="photo-tone object-cover"
          style={{ objectPosition: imagePosition }}
        />
      </Reveal>
      {video && <HoverVideo variant="card" src={video} label={alt} />}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,var(--scrim-0)_18%,var(--scrim-3)_52%,var(--scrim-5)_100%)]" />
      <div className="absolute inset-0 flex flex-col justify-end gap-2.5 p-5 text-cream">
        {badge && (
          <Reveal delay={120} className="flex">
            {badge}
          </Reveal>
        )}
        <Reveal delay={240}>
          <Heading className="m-0 text-balance font-serif text-[24px] font-semibold leading-[1.2] text-cream">{title}</Heading>
        </Reveal>
        <Reveal delay={360}>
          <p className="m-0 text-pretty text-[15px] leading-[1.5] text-on-dark-1">{text}</p>
        </Reveal>
        {action && <Reveal delay={480}>{action}</Reveal>}
      </div>
    </Reveal>
  );
}
