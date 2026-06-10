'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import SectionWrapper from '@/components/ui/SectionWrapper'
import type { Translation } from '@/lib/useTranslation'

interface FAQSectionProps {
  t: Translation
  layout?: 'full' | 'sidebar'
}

export default function FAQSection({ t, layout = 'full' }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const accordion = (
    <div className="divide-y divide-[var(--color-border-light)]">
      {t.faq.items.map((faqItem, idx) => (
        <div key={idx}>
          <button
            className="w-full flex items-center justify-between py-5 text-left gap-3 md:gap-4"
            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
            aria-expanded={openIndex === idx}
          >
            <span className="font-medium text-[var(--color-text)] leading-relaxed hyphens-auto">{faqItem.question}</span>
            <svg
              className={`flex-none w-5 h-5 text-[var(--color-accent)] transition-transform ${openIndex === idx ? 'rotate-180' : ''}`}
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
            {openIndex === idx && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <p className="pb-5 text-base text-[var(--color-text-muted)] leading-relaxed">
                  {faqItem.answer}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )

  if (layout === 'sidebar') {
    return accordion
  }

  return (
    <SectionWrapper light>
      <div className="max-w-3xl">
        {accordion}
      </div>
    </SectionWrapper>
  )
}
