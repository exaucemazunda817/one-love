import { getImageProps } from 'next/image';
import { HERO_MOBILE } from '@/lib/hero-mobile';

// Une couche photo. Sous 1200 px (téléphone et tablette, où le bandeau est en
// hauteur) le navigateur prend la version verticale de la photo, découpée sur
// les visages depuis l'original ; au-dessus, la version paysage. Une seule des
// deux est téléchargée (balise <picture>, rendue côté serveur : pas de saut).
export function HeroLayer({ photo, alt, priority, onLoad, className, style }: { photo: { src: string }; alt: string; priority: boolean; onLoad?: () => void; className: string; style?: React.CSSProperties }) {
  const common = { alt, fill: true as const, sizes: '100vw', priority, quality: 85, className, style };
  const { props: desk } = getImageProps({ ...common, src: photo.src });
  const mobileSrc = HERO_MOBILE[photo.src];
  // eslint-disable-next-line @next/next/no-img-element
  const img = <img {...desk} alt={alt} onLoad={onLoad} />;
  if (!mobileSrc) return img;
  const { props: mob } = getImageProps({ ...common, src: mobileSrc });
  return (
    <picture>
      <source media="(max-width: 1199px)" srcSet={mob.srcSet} sizes="100vw" />
      {img}
    </picture>
  );
}

