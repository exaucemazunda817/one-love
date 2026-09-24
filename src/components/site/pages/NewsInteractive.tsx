'use client';

import { useState } from 'react';
import Image from 'next/image';
import { XIcon } from '@phosphor-icons/react';
import { Reveal } from '@/components/Reveal';
import { publishableGallery } from '@/lib/content';

export interface NewsText {
  galleryTitle: string;
  galleryIntro: string;
  galleryEmpty: string;
  lightboxClose: string;
  lightboxOpenPrefix: string;
}

export function NewsInteractive({ t }: { t: NewsText }) {
  const [lb, setLb] = useState<number | null>(null);

  const photo = lb !== null ? publishableGallery[lb] : null;

  return (
    <>
      <section className="bg-sand">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-8 px-[clamp(20px,4vw,32px)] py-[clamp(56px,8vw,104px)]">
          <Reveal className="flex max-w-[640px] flex-col gap-3">
            <h2 className="m-0 font-serif text-[clamp(30px,3.6vw,46px)] font-medium leading-[1.15]">{t.galleryTitle}</h2>
            <p className="m-0 text-[17px] leading-[1.6] text-ink-body">{t.galleryIntro}</p>
          </Reveal>

          {publishableGallery.length === 0 ? (
            <p className="m-0 text-[15px] text-ink-soft">{t.galleryEmpty}</p>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-4">
              {publishableGallery.map((photoItem, i) => (
                <Reveal key={photoItem.src} delay={(i % 3) * 90}>
                  <button
                    type="button"
                    aria-label={`${t.lightboxOpenPrefix} ${photoItem.caption}`}
                    onClick={() => setLb(i)}
                    className="block aspect-[4/5] w-full cursor-pointer overflow-hidden rounded-2xl border-0 p-0"
                  >
                    <Reveal variant="zoom" className="h-full w-full">
                      <Image
                        src={photoItem.src}
                        alt={photoItem.caption}
                        width={400}
                        height={500}
                        sizes="(max-width: 1200px) 50vw, 25vw"
                        className="photo-tone h-full w-full object-cover"
                      />
                    </Reveal>
                  </button>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {photo && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[70] flex items-center justify-center bg-[rgba(10,10,10,.92)] p-5"
          onClick={() => setLb(null)}
        >
          <button
            type="button"
            aria-label={t.lightboxClose}
            onClick={() => setLb(null)}
            className="absolute right-5 top-5 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border-0 bg-white/10 text-cream"
          >
            <XIcon size={22} aria-hidden />
          </button>
          <img
            src={photo.src}
            alt={photo.caption}
            className="max-h-[85vh] max-w-[92vw] rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
