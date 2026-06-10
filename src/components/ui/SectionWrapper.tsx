import type { CSSProperties } from 'react'

interface SectionWrapperProps {
  children: React.ReactNode
  className?: string
  style?: CSSProperties
  light?: boolean
  surface?: boolean
  id?: string
}

export default function SectionWrapper({ children, className = '', style, light = false, surface = false, id }: SectionWrapperProps) {
  const bg = surface
    ? 'bg-[var(--color-bg-surface)]'
    : light
    ? 'bg-[var(--color-bg-light)]'
    : 'bg-[var(--color-bg)]'

  return (
    <section
      id={id}
      className={`section-padding ${bg} ${className}`}
      style={style}
    >
      <div className="container-site">{children}</div>
    </section>
  )
}
