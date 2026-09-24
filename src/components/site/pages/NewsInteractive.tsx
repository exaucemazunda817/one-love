'use client';

import { useState } from 'react';
import Image from 'next/image';
import { XIcon } from '@phosphor-icons/react';
import { Reveal } from '@/components/Reveal';
import { ToConfirm } from '@/components/site/ui';
import { MobilePhotoCard } from '@/components/site/MobilePhotoCard';
import { publishableGallery } from '@/lib/content';

export interface NewsText {
  categories: string[];
  posts: { tag: string; date: string; t: string; d: string; img: string; alt: string }[];
  articlesConfirm: string;
  galleryTitle: string;
  galleryIntro: string;
  galleryEmpty: string;
  lightboxClose: string;
  lightboxOpenPrefix: string;
}

export function NewsInteractive({ t }: { t: NewsText }) {
  const [cat, setCat] = useState(t.categories[0]);
  const [lb, setLb] = useState<number | null>(null);

  const posts = cat === t.categories[0] ? t.posts : t.posts.filter((p) => p.tag === cat);
  const photo = lb !== null ? publishableGallery[lb] : null;

  return (
    <>
      <section className="mx-auto flex max-w-[1200px] flex-col gap-8 px-[clamp(20px,4vw,32px)] py-[clamp(56px,8vw,104px)]">
        <div role="group" aria-label="Catégories" className="flex flex-wrap gap-2">
          {t.categories.map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={cat === c}
              onClick={() => setCat(c)}
              className={`min-h-11 cursor-pointer rounded-full border-[1.5px] px-4 text-[14px] font-bold ${
                cat === c ? 'border-ink bg-ink text-cream' : 'border-field-line bg-transparent text-ink'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-6">
          {posts.map((p, i) => (
            <div key={`${p.tag}-${p.t}`}>
            <div className="md:hidden">
              <MobilePhotoCard
                src={p.img}
                alt={p.alt}
                heightClass="h-[440px]"
                badge={
                  <span className="rounded-full bg-cream px-3 py-1.5 text-[12px] font-extrabold uppercase tracking-[0.08em] text-copper-700">
                    {p.tag} · {p.date}
                  </span>
                }
                title={p.t}
                text={p.d}
              />
            </div>
            <Reveal delay={(i % 3) * 90} className="hidden h-full md:block">
              <article className="flex h-full flex-col gap-3 overflow-hidden rounded-[20px] bg-white shadow-ol-sm">
                <div className="relative aspect-[4/3]">
                  <Image src={p.img} alt={p.alt} fill sizes="(max-width: 1200px) 100vw, 380px" className="photo-tone object-cover" />
                </div>
                <div className="flex flex-1 flex-col gap-2 px-5 pb-5">
                  <span className="flex items-center gap-2 text-[13px] font-extrabold uppercase tracking-[0.08em] text-copper-700">
                    {p.tag}
                    <span className="text-ink-soft">· {p.date}</span>
                  </span>
                  <h3 className="m-0 font-serif text-[21px] font-semibold leading-[1.25]">{p.t}</h3>
                  <p className="m-0 text-[15px] leading-[1.55] text-ink-body">{p.d}</p>
                </div>
              </article>
            </Reveal>
            </div>
          ))}
        </div>

        <ToConfirm className="self-start">{t.articlesConfirm}</ToConfirm>
      </section>

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
                    className="block aspect-[4/5] w-full cursor-pointer overflow-hidden rounded-[16px] border-0 p-0"
                  >
                    <Image
                      src={photoItem.src}
                      alt={photoItem.caption}
                      width={400}
                      height={500}
                      sizes="(max-width: 1200px) 50vw, 25vw"
                      className="photo-tone h-full w-full object-cover"
                    />
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
