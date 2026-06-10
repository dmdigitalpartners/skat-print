'use client'

import type { CSSProperties } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

interface Milestone {
  year: string
  label: string
  desc: string
}

interface TimelineProps {
  milestones: Milestone[]
  eyebrow?: string
  heading?: string
  sectionStyle?: CSSProperties
}

export default function Timeline({ milestones, eyebrow, heading, sectionStyle }: TimelineProps) {
  const reduced = useReducedMotion()

  return (
    <section className="section-padding bg-[var(--color-bg-elevated)] overflow-hidden" style={sectionStyle}>
      <div className="container-site">
        {(eyebrow || heading) && (
          <div className="mb-14 md:mb-16">
            {eyebrow && (
              <span className="inline-flex items-center gap-2 text-xs font-condensed font-semibold uppercase tracking-widest text-[var(--color-accent)] mb-4">
                <span className="block w-5 h-px bg-[var(--color-accent)]" />
                {eyebrow}
              </span>
            )}
            {heading && (
              <h2 className="font-display font-bold text-4xl md:text-5xl text-[var(--color-text)] leading-tight">
                {heading}
              </h2>
            )}
          </div>
        )}

        {/* Desktop: horizontal with connecting line */}
        <div className="hidden md:block relative">
          {/* Connecting line — centered on h-4 (16px) dots, runs first-to-last dot center */}
          <div
            className="absolute top-2 left-2 h-px"
            style={{
              right: 'calc(20% - 1.75rem)',
              backgroundColor: 'var(--color-border)',
            }}
            aria-hidden
          />

          <div className="grid grid-cols-5 gap-6 relative">
            {milestones.map((m, i) => (
              <motion.div
                key={m.year}
                initial={reduced ? false : { opacity: 0, y: 16 }}
                whileInView={reduced ? {} : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, ease: 'easeOut', delay: i * 0.1 }}
              >
                {/* Dot */}
                <div className="relative mb-6 flex justify-start">
                  <div
                    className="w-4 h-4 rounded-full border-2 flex-none"
                    style={{
                      backgroundColor: 'var(--color-bg-elevated)',
                      borderColor: 'var(--color-accent)',
                    }}
                  />
                </div>

                <p
                  className="font-display font-bold text-2xl leading-none mb-1.5"
                  style={{ color: 'var(--color-accent)' }}
                >
                  {m.year}
                </p>
                <p className="font-display font-semibold text-sm text-[var(--color-text)] mb-1">
                  {m.label}
                </p>
                <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                  {m.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile: vertical stack */}
        <div className="md:hidden space-y-0">
          {milestones.map((m, i) => (
            <motion.div
              key={m.year}
              className="flex gap-5"
              initial={reduced ? false : { opacity: 0, x: -16 }}
              whileInView={reduced ? {} : { opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.4, ease: 'easeOut', delay: i * 0.08 }}
            >
              {/* Left: dot + line */}
              <div className="flex flex-col items-center">
                <div
                  className="w-3.5 h-3.5 rounded-full border-2 flex-none mt-1"
                  style={{
                    backgroundColor: 'var(--color-bg-elevated)',
                    borderColor: 'var(--color-accent)',
                  }}
                />
                {i < milestones.length - 1 && (
                  <div
                    className="flex-1 w-px mt-1"
                    style={{ backgroundColor: 'var(--color-border)', minHeight: '2.5rem' }}
                  />
                )}
              </div>

              {/* Right: content */}
              <div className="pb-8">
                <p
                  className="font-display font-bold text-xl leading-none mb-1"
                  style={{ color: 'var(--color-accent)' }}
                >
                  {m.year}
                </p>
                <p className="font-display font-semibold text-sm text-[var(--color-text)] mb-0.5">
                  {m.label}
                </p>
                <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                  {m.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
