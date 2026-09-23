import type { Metadata } from 'next';
import Image from 'next/image';
import { PageHero } from '@/components/PageHero';
import { Reveal } from '@/components/Reveal';
import { publishableGallery } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Galerie',
  description: 'Images du programme RÊVES 2, au centre One Love à Kinshasa.'
};

export default function GaleriePage() {
  return (
    <>
      <PageHero
        eyebrow="En images"
        title="Galerie"
        intro="Quelques images de nos programmes de terrain à Kinshasa."
      />

      <section className="bg-ol-white">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {publishableGallery.map((photo, index) => (
              <Reveal key={photo.src} delay={(index % 3) * 90}>
                <figure className="space-y-3">
                  <div className="relative aspect-4/5 overflow-hidden rounded-xl">
                    <Image
                      src={photo.src}
                      alt={photo.caption}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                  <figcaption className="text-sm leading-relaxed text-ol-muted">
                    {photo.caption}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <p className="mt-12 max-w-measure text-sm leading-relaxed text-ol-muted">
              Par respect pour les enfants que nous accompagnons, nous ne publions que des
              images pour lesquelles la diffusion a été validée.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
