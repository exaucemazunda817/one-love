export function PageHero({
  eyebrow,
  title,
  intro
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
}) {
  return (
    <section className="bg-ol-night text-ol-cream">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        {eyebrow && (
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-ol-amber">
            {eyebrow}
          </p>
        )}
        <h1 className="text-hero font-black leading-tight sm:text-display">{title}</h1>
        {intro && (
          <p className="mt-5 max-w-measure text-lg leading-relaxed text-ol-sand">{intro}</p>
        )}
      </div>
    </section>
  );
}
