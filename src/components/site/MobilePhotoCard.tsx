import Image from 'next/image';
import { Reveal } from '@/components/Reveal';

// Carte photo plein cadre pour le mobile : le texte est posé sur l'image, sur un
// dégradé sombre qui garantit la lisibilité, et chaque élément (pastille, titre,
// texte, lien) apparaît l'un après l'autre. À n'afficher que sous 768 px
// (`md:hidden`) ; les écrans plus larges gardent la mise en page d'origine.
export function MobilePhotoCard({
  src,
  alt,
  badge,
  title,
  text,
  action,
  heightClass = 'h-[440px]',
  imagePosition = '50% 35%'
}: {
  src: string;
  alt: string;
  badge: React.ReactNode;
  title: string;
  text: string;
  action?: React.ReactNode;
  heightClass?: string;
  imagePosition?: string;
}) {
  return (
    <Reveal className={`relative w-full overflow-hidden rounded-[20px] bg-night shadow-[0_8px_24px_rgba(60,35,15,.18)] ${heightClass}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 92vw, 400px"
        loading="lazy"
        className="photo-tone object-cover"
        style={{ objectPosition: imagePosition }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0)_18%,rgba(10,10,10,.6)_52%,rgba(10,10,10,.94)_100%)]" />
      <div className="absolute inset-0 flex flex-col justify-end gap-2.5 p-5 text-cream">
        <Reveal delay={120} className="flex">
          {badge}
        </Reveal>
        <Reveal delay={240}>
          <h3 className="m-0 text-balance font-serif text-[24px] font-semibold leading-[1.2] text-cream">{title}</h3>
        </Reveal>
        <Reveal delay={360}>
          <p className="m-0 text-pretty text-[15px] leading-[1.5] text-on-dark-1">{text}</p>
        </Reveal>
        {action && <Reveal delay={480}>{action}</Reveal>}
      </div>
    </Reveal>
  );
}
