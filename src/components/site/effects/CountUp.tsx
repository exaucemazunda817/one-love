'use client';

import { useEffect, useRef, useState } from 'react';
import { useSeen } from '@/lib/use-seen';

// Chiffre qui monte de 0 à sa valeur quand il arrive à l'écran (effet repris
// du témoignage du template « Site Immersif »). Rendu serveur et « Réduire les
// animations » : la valeur finale, directement.
export function CountUp({
  value,
  prefix = '',
  suffix = '',
  duration = 1400,
  className
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useSeen(ref);
  const [shown, setShown] = useState(value);

  useEffect(() => {
    if (seen === false) setShown(0);
    if (seen !== true) return;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setShown(Math.round(value * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [seen, value, duration]);

  return (
    <span ref={ref} className={className} aria-label={`${prefix}${value}${suffix}`}>
      <span aria-hidden className="tabular-nums">
        {prefix}
        {shown}
        {suffix}
      </span>
    </span>
  );
}
