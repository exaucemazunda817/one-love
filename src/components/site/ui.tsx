import type { ReactNode } from 'react';
import { Reveal } from '@/components/Reveal';

// Primitives visuelles du design system 2026. Les valeurs (tailles,
// espacements, couleurs) sont celles de la maquette, au pixel près.

export function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(' ');
}

const BRUSH_PATH =
  'M3 13 C45 5 120 3 197 7 C199 8 198 10 196 10 C130 9 60 12 6 17 C2 17 1 14 3 13 Z';

/** Dégradé « cœur » du pinceau — à inclure une fois par page (dans le layout). */
export function BrushDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <defs>
        <linearGradient id="ol-brush" x1="0" x2="1">
          <stop offset="0" stopColor="#C2651A" />
          <stop offset="1" stopColor="#E89A2C" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/** Trait de pinceau autonome (sous un chiffre, puce, séparateur de frise). */
export function Brush({
  className,
  style,
  fill = 'url(#ol-brush)',
  stretch = false
}: {
  className?: string;
  style?: React.CSSProperties;
  fill?: string;
  stretch?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 200 20"
      aria-hidden="true"
      preserveAspectRatio={stretch ? 'none' : undefined}
      className={className}
      style={style}
    >
      <path d={BRUSH_PATH} fill={fill} />
    </svg>
  );
}

/** Mot-clé souligné au pinceau dans un titre. */
export function BrushWord({ children }: { children: ReactNode }) {
  return (
    <span className="relative inline-block">
      {children}
      <svg
        viewBox="0 0 200 20"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="absolute bottom-[-0.12em] left-[-3%] h-[0.22em] w-[106%]"
      >
        <path d={BRUSH_PATH} fill="url(#ol-brush)" />
      </svg>
    </span>
  );
}

/** Surtitre : Nunito 800, 13 px, capitales espacées. */
export function Eyebrow({
  children,
  dark = false,
  className
}: {
  children: ReactNode;
  dark?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cx(
        'text-[13px] font-extrabold uppercase tracking-[0.12em]',
        dark ? 'text-gold' : 'text-copper-700',
        className
      )}
    >
      {children}
    </span>
  );
}

/** Étiquette « à confirmer » : contenu fictif ou provisoire de la maquette,
 * à retirer dès que l'association aura validé la donnée réelle. */
export function ToConfirm({
  children,
  dark = false,
  className
}: {
  children: ReactNode;
  dark?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cx(
        'self-start rounded-full border-[1.5px] border-dashed px-2 py-px text-[12px] font-bold',
        dark ? 'border-gold text-gold-hover' : 'border-copper-600 text-copper-700',
        className
      )}
    >
      {children}
    </span>
  );
}

/** En-tête sobre des pages utilitaires et légales (sans photo). */
export function TextHero({ eyebrow, title, intro }: { eyebrow?: string; title: string; intro?: string }) {
  return (
    <section className="bg-night text-cream">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-4 px-[clamp(20px,4vw,32px)] pb-[clamp(40px,6vw,72px)] pt-[clamp(48px,7vw,88px)]">
        {eyebrow && <Eyebrow dark>{eyebrow}</Eyebrow>}
        <h1 className="m-0 max-w-[820px] text-balance font-serif text-[clamp(34px,5vw,56px)] font-medium leading-[1.1] tracking-[-0.01em]">
          {title}
        </h1>
        {intro && <p className="m-0 max-w-[620px] text-pretty text-[17px] leading-[1.6] text-on-dark-1">{intro}</p>}
      </div>
    </section>
  );
}

export const h2Class =
  'm-0 font-serif text-[clamp(30px,3.6vw,46px)] font-medium leading-[1.15] text-balance';

// Boutons (pilule, nowrap). Les tailles varient d'un bloc à l'autre dans la
// maquette : seule la « peau » est factorisée ici, la hauteur reste au site
// d'appel.
/** Rectangle décoratif (chevrons répétés) tenant lieu de photo tant que
 * l'association n'a pas fourni le vrai visuel — jamais une photo inventée. */
export function PlaceholderPhoto({
  label,
  ratio = '4/5',
  className
}: {
  label: ReactNode;
  ratio?: string;
  className?: string;
}) {
  return (
    <div
      className={cx('flex items-center justify-center rounded-[20px] p-5 text-center', className)}
      style={{
        aspectRatio: ratio,
        background: 'repeating-linear-gradient(135deg,#F1E7D8 0 10px,#EDE1CF 10px 20px)'
      }}
    >
      <span className="text-[14px] font-bold text-ink-soft">{label}</span>
    </div>
  );
}

/** Bandeau d'appel noir de fin de page (Qui sommes-nous, Notre action). */
export function CallBanner({
  title,
  text,
  donateLabel,
  sponsorLabel,
  donateHref,
  sponsorHref,
  Icon
}: {
  title: ReactNode;
  text: ReactNode;
  donateLabel: string;
  sponsorLabel: string;
  donateHref: string;
  sponsorHref: string;
  Icon: React.ComponentType<{ size?: number | string; 'aria-hidden'?: boolean }>;
}) {
  return (
    <section className="mx-auto max-w-[1200px] px-[clamp(12px,3vw,32px)] pb-[clamp(56px,8vw,104px)]">
      <Reveal className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] items-center gap-7 rounded-[20px] bg-night p-[clamp(28px,5vw,56px)] text-cream">
        <div className="flex flex-col gap-3">
          <h2 className="m-0 text-balance font-serif text-[clamp(28px,3.2vw,40px)] font-medium leading-[1.2]">{title}</h2>
          <p className="m-0 text-[17px] leading-[1.6] text-on-dark-1">{text}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href={donateHref}
            className="inline-flex min-h-[52px] items-center gap-2 whitespace-nowrap rounded-full bg-gold px-7 text-[17px] font-extrabold text-night no-underline hover:bg-gold-hover hover:text-night"
          >
            <Icon size="1em" aria-hidden />
            {donateLabel}
          </a>
          <a
            href={sponsorHref}
            className="inline-flex min-h-[52px] items-center whitespace-nowrap rounded-full border-2 border-gold px-[26px] text-[17px] font-bold text-gold-hover no-underline hover:bg-[rgba(232,154,44,.14)] hover:text-gold-hover"
          >
            {sponsorLabel}
          </a>
        </div>
      </Reveal>
    </section>
  );
}

export const btn = {
  primary:
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-copper-600 font-bold text-white no-underline hover:bg-copper-700 hover:text-white',
  outlineLight:
    'inline-flex items-center justify-center whitespace-nowrap rounded-full border-2 border-cream font-bold text-cream no-underline hover:bg-[rgba(251,247,241,.12)] hover:text-cream',
  outlineCopper:
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border-2 border-copper-600 font-bold text-copper-600 no-underline hover:bg-copper-tint hover:text-copper-700',
  gold: 'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-gold font-extrabold text-night no-underline hover:bg-gold-hover hover:text-night',
  outlineGold:
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border-2 border-gold font-bold text-gold-hover no-underline hover:bg-[rgba(232,154,44,.12)] hover:text-gold-hover'
};
