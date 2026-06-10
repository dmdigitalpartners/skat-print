import type { CSSProperties } from 'react'
import SectionWrapper from '@/components/ui/SectionWrapper'
import ScrollReveal from '@/components/ui/ScrollReveal'
import type { Translation } from '@/lib/useTranslation'

const PrintIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <polyline points="6 9 6 2 18 2 18 9" />
    <path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" />
    <rect x="6" y="14" width="12" height="8" />
  </svg>
)

const LayersIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </svg>
)

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
)

const LeafIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M11 20A7 7 0 014 13c0-6 7-11 7-11s7 5 7 11a7 7 0 01-7 7z" />
    <line x1="11" y1="20" x2="11" y2="12" />
  </svg>
)

const iconMap: Record<string, React.ReactNode> = {
  print: <PrintIcon />,
  layers: <LayersIcon />,
  shield: <ShieldIcon />,
  leaf: <LeafIcon />,
}

export default function Differentiators({ t, sectionStyle }: { t: Translation; sectionStyle?: CSSProperties }) {
  return (
    <SectionWrapper surface style={sectionStyle}>
      <ScrollReveal>
        <h2 className="font-display font-bold text-4xl md:text-5xl text-[var(--color-text)] mb-14 md:mb-20">
          {t.differentiators.title}
        </h2>
      </ScrollReveal>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12">
        {t.differentiators.items.map((item, i) => (
          <ScrollReveal key={i} delay={i * 0.12}>
            <div className="group">
              {/* Icon container */}
              <div
                className="w-11 h-11 flex items-center justify-center rounded-[var(--radius-md)] mb-6 transition-colors duration-300"
                style={{
                  backgroundColor: 'var(--color-accent-subtle)',
                  color: 'var(--color-accent)',
                }}
              >
                <div className="w-5 h-5">
                  {iconMap[item.icon] ?? iconMap['print']}
                </div>
              </div>

              <h3 className="font-display font-bold text-lg text-[var(--color-text)] mb-3 relative inline-block">
                {item.heading}
                <span className="absolute bottom-0 left-0 h-px w-0 bg-[var(--color-accent)] transition-[width] duration-300 group-hover:w-full" />
              </h3>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">{item.copy}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </SectionWrapper>
  )
}
