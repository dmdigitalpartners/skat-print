'use client'

import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import Link from 'next/link'
import { VALID_CATEGORIES } from '@/config/routes'
import type { Translation, Lang } from '@/lib/useTranslation'
import { trackEvent } from '@/lib/analytics'

interface Props {
  t: Translation
  lang: Lang
}

export default function SamplesForm({ t, lang }: Props) {
  const reduced = useReducedMotion()
  const s = t.samples

  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [direction, setDirection] = useState<1 | -1>(1)

  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [validationError, setValidationError] = useState(false)

  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [country, setCountry] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function toggleCategory(slug: string) {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(slug) ? next.delete(slug) : next.add(slug)
      return next
    })
    setValidationError(false)
  }

  function goToStep2() {
    if (selected.size === 0) {
      setValidationError(true)
      return
    }
    setDirection(1)
    setStep(2)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (submitting) return
    setSubmitting(true)
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'sample-request',
          name,
          company,
          contact: email,
          product_type: [...selected]
            .map(slug => s.category_labels[slug as keyof typeof s.category_labels])
            .join(', '),
          message: [address, country, notes].filter(Boolean).join(' | '),
        }),
      })
    } catch {}
    trackEvent({ name: 'form_submitted', form_type: 'sample_request' })
    setDirection(1)
    setStep(3)
    setSubmitting(false)
  }

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 32 : -32,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({
      x: dir > 0 ? -32 : 32,
      opacity: 0,
    }),
  }

  const transition = { duration: 0.28, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }

  const inputCls =
    'w-full text-sm px-3.5 py-2.5 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)] transition-[border-color]'

  return (
    <div className="w-full">
      {/* Progress indicator */}
      {step < 3 && (
        <div className="flex items-center gap-2 mb-8">
          {([1, 2] as const).map(n => (
            <div key={n} className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-[background-color,color] duration-200 ${
                  step === n
                    ? 'bg-[var(--color-accent)] text-white'
                    : step > n
                    ? 'bg-[var(--color-accent)] text-white opacity-60'
                    : 'bg-[var(--color-bg-surface)] border border-[var(--color-border)] text-[var(--color-text-muted)]'
                }`}
              >
                {n}
              </div>
              {n < 2 && (
                <div className={`h-px w-8 transition-colors duration-200 ${step > n ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-border)]'}`} />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Step panels */}
      <div className="relative overflow-hidden">
        <AnimatePresence custom={direction} mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              custom={direction}
              variants={reduced ? undefined : slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={transition}
            >
              <h2 className="font-display font-bold text-xl text-[var(--color-text)] mb-6">
                {s.step1_heading}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                {VALID_CATEGORIES.map(slug => {
                  const label = s.category_labels[slug as keyof typeof s.category_labels]
                  const checked = selected.has(slug)
                  return (
                    <button
                      key={slug}
                      type="button"
                      onClick={() => toggleCategory(slug)}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-[var(--radius-sm)] border text-left transition-all duration-150 ${
                        checked
                          ? 'border-[var(--color-accent)] bg-[var(--color-accent-subtle)] text-[var(--color-accent)]'
                          : 'border-[var(--color-border)] bg-[var(--color-bg-surface)] text-[var(--color-text)] hover:border-[var(--color-accent)]'
                      }`}
                    >
                      <span
                        className={`w-4 h-4 flex-none rounded border transition-colors duration-150 flex items-center justify-center ${
                          checked ? 'bg-[var(--color-accent)] border-[var(--color-accent)]' : 'border-[var(--color-border)]'
                        }`}
                      >
                        {checked && (
                          <svg viewBox="0 0 10 8" className="w-2.5 h-2 fill-none stroke-white" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="1,4 4,7 9,1" />
                          </svg>
                        )}
                      </span>
                      <span className="text-sm font-medium">{label}</span>
                    </button>
                  )
                })}
              </div>

              {validationError && (
                <p className="text-sm text-red-600 mb-4">{s.select_at_least_one}</p>
              )}

              <button
                type="button"
                onClick={goToStep2}
                className="mt-4 w-full sm:w-auto inline-flex items-center justify-center min-h-[48px] px-8 py-3 rounded-[var(--radius-md)] bg-[var(--color-accent)] text-white font-semibold text-sm hover:bg-[var(--color-accent-hover)] transition-[background-color] shadow-[var(--shadow-accent)]"
              >
                {s.continue} →
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              custom={direction}
              variants={reduced ? undefined : slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={transition}
            >
              <h2 className="font-display font-bold text-xl text-[var(--color-text)] mb-6">
                {s.step2_heading}
              </h2>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5">
                      {s.field_name} <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder={s.field_name}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5">
                      {s.field_company} <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      value={company}
                      onChange={e => setCompany(e.target.value)}
                      placeholder={s.field_company}
                      className={inputCls}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5">
                    {s.field_email} <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder={s.field_email}
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5">
                    {s.field_address} <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder={s.field_address}
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5">
                    {s.field_country} <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    value={country}
                    onChange={e => setCountry(e.target.value)}
                    placeholder={s.field_country}
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5">
                    {s.field_notes}
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder={s.field_notes}
                    className={`${inputCls} resize-none`}
                  />
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => { setDirection(-1); setStep(1) }}
                    className="inline-flex items-center justify-center min-h-[48px] px-6 py-3 rounded-[var(--radius-md)] border border-[var(--color-border)] text-[var(--color-text)] text-sm font-medium hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-[border-color,color]"
                  >
                    ← {s.back}
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center min-h-[48px] px-8 py-3 rounded-[var(--radius-md)] bg-[var(--color-accent)] text-white font-semibold text-sm hover:bg-[var(--color-accent-hover)] transition-[background-color] shadow-[var(--shadow-accent)] disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {submitting ? s.submitting : s.submit}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              custom={direction}
              variants={reduced ? undefined : slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={transition}
              className="text-center py-8"
            >
              {/* Success icon */}
              <div className="w-16 h-16 rounded-full bg-[var(--color-accent-subtle)] flex items-center justify-center mx-auto mb-6">
                <svg viewBox="0 0 24 24" className="w-8 h-8 text-[var(--color-accent)]" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>

              <h2 className="font-display font-bold text-2xl text-[var(--color-text)] mb-3">
                {s.step3_heading}
              </h2>
              <p className="text-[var(--color-text-muted)] mb-8 max-w-sm mx-auto">
                {s.step3_subheading}
              </p>

              <Link
                href={`/${lang}/products`}
                className="inline-flex items-center justify-center min-h-[48px] px-8 py-3 rounded-[var(--radius-md)] border border-[var(--color-border)] text-[var(--color-text)] text-sm font-medium hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-[border-color,color]"
              >
                {s.cta_browse} →
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
