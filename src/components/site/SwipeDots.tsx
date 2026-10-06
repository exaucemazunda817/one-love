'use client';

import { useEffect, useRef, useState } from 'react';

// Points de repère sous une liste .ol-swipe (téléphone seulement) : ils
// suivent la carte visible et permettent d'y aller d'un toucher. La liste est
// l'élément placé juste avant ces points.
export function SwipeDots({ count, label }: { count: number; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const list = () => ref.current?.previousElementSibling as HTMLElement | null;

  useEffect(() => {
    const el = list();
    if (!el) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const items = Array.from(el.children) as HTMLElement[];
        const left = el.getBoundingClientRect().left + 20;
        let best = 0;
        let dist = Infinity;
        items.forEach((it, i) => {
          const d = Math.abs(it.getBoundingClientRect().left - left);
          if (d < dist) {
            dist = d;
            best = i;
          }
        });
        setActive(best);
      });
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      el.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  const go = (i: number) => {
    const el = list();
    const item = el?.children[i] as HTMLElement | undefined;
    if (!el || !item) return;
    el.scrollTo({ left: item.getBoundingClientRect().left - el.getBoundingClientRect().left + el.scrollLeft - 20, behavior: 'smooth' });
  };

  return (
    <div ref={ref} className="-mt-2 flex justify-center gap-1 md:hidden" role="group" aria-label={label}>
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => go(i)}
          aria-label={`${i + 1} / ${count}`}
          aria-current={i === active ? 'true' : undefined}
          className="flex h-8 w-6 cursor-pointer items-center justify-center border-0 bg-transparent p-0"
        >
          <span className={`block h-2 rounded-full transition-all duration-300 ${i === active ? 'w-5 bg-copper-600' : 'w-2 bg-copper-600/30'}`} />
        </button>
      ))}
    </div>
  );
}
