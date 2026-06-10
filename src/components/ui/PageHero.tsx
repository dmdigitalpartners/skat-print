interface PageHeroProps {
  eyebrow: string
  heading: string
  intro?: string
  hasBorder?: boolean
}

export default function PageHero({ eyebrow, heading, intro, hasBorder = true }: PageHeroProps) {
  return (
    <div
      className={`pt-16 md:pt-20${hasBorder ? ' border-b border-[var(--color-border-dark)]' : ''}`}
      style={{ backgroundColor: 'var(--color-primary)' }}
    >
      <div className="container-site pt-16 pb-14 md:pt-24 md:pb-20 max-w-3xl">
        <span className="inline-flex items-center gap-2 text-xs font-condensed font-semibold uppercase tracking-widest text-[var(--color-accent)] mb-5">
          <span className="block w-5 h-px bg-[var(--color-accent)]" />
          {eyebrow}
        </span>
        <h1 className="font-display font-bold text-4xl md:text-6xl lg:text-7xl leading-snug md:leading-[0.95] tracking-tight text-[var(--color-text-dark)] mb-5">
          {heading}
        </h1>
        {intro && (
          <p className="text-lg md:text-xl text-[var(--color-text-muted-dark)] leading-relaxed max-w-xl">{intro}</p>
        )}
      </div>
    </div>
  )
}
