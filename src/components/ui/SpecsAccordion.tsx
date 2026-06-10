'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

interface SpecsAccordionProps {
  heading: string
  specs: string[]
}

export default function SpecsAccordion({ heading, specs }: SpecsAccordionProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-t border-[var(--color-border)]">
      <button
        className="w-full flex items-center justify-between py-5 text-left gap-4"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="font-display font-semibold text-lg text-[var(--color-text)]">{heading}</span>
        <svg
          className={`flex-none w-5 h-5 text-[var(--color-accent)] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <ul className="space-y-3 pb-6">
              {specs.map((spec, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-[var(--color-text-muted)]">
                  <span className="mt-1 flex-none w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" aria-hidden />
                  {spec}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
