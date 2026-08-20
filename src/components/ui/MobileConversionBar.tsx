'use client'

import { useState, FormEvent } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { CONTACT } from '@/config/contact'
import { trackEvent } from '@/lib/analytics'

export default function MobileConversionBar({ lang }: { lang: string }) {
  const reduced = useReducedMotion()
  const [formOpen, setFormOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'sent'>('idle')

  const isBg = lang === 'bg'

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!email.trim() || status !== 'idle') return
    setStatus('submitting')
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'mobile-quick',
          contact: email.trim(),
          message: message.trim(),
        }),
      })
    } catch {}
    setStatus('sent')
    trackEvent({ name: 'form_submitted', form_type: 'mobile_quick' })
  }

  const labelCall = isBg ? 'Обади се' : 'Call'
  const labelWhatsApp = 'WhatsApp'
  const labelForm = isBg ? 'Напишете ни' : 'Quick Form'

  return (
    <>
      {/* Sticky bar */}
      <div
        className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-[var(--color-primary-dark)] border-t border-white/10 shadow-[0_-8px_20px_rgba(0,0,0,0.18)]"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="grid grid-cols-3 divide-x divide-white/10">
          <a
            href={`tel:${CONTACT.phone_primary}`}
            className="flex flex-col items-center justify-center gap-1 py-3 text-white/80 hover:text-white hover:bg-white/5 transition-colors active:bg-white/10"
            onClick={() => trackEvent({ name: 'cta_click', section: 'mobile_bar', label: 'call' })}
            aria-label={`${labelCall} ${CONTACT.phone_primary_display}`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span className="text-[10px] font-medium">{labelCall}</span>
          </a>

          <a
            href={`https://wa.me/${CONTACT.whatsapp.replace('+', '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center gap-1 py-3 text-white/80 hover:text-white hover:bg-white/5 transition-colors active:bg-white/10"
            onClick={() => trackEvent({ name: 'cta_click', section: 'mobile_bar', label: 'whatsapp' })}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            <span className="text-[10px] font-medium">{labelWhatsApp}</span>
          </a>

          <button
            onClick={() => {
              setFormOpen(v => !v)
              trackEvent({ name: 'cta_click', section: 'mobile_bar', label: 'quick_form' })
            }}
            className="flex flex-col items-center justify-center gap-1 py-3 text-white/80 hover:text-white hover:bg-white/5 transition-colors active:bg-white/10 w-full"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="text-[10px] font-medium">{labelForm}</span>
          </button>
        </div>
      </div>

      {/* Quick form drawer */}
      <AnimatePresence>
        {formOpen && (
          <>
            <motion.div
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduced ? {} : { opacity: 0 }}
              className="fixed inset-0 z-[48] bg-black/50 md:hidden"
              onClick={() => setFormOpen(false)}
            />
            <motion.div
              initial={reduced ? false : { y: '100%' }}
              animate={{ y: 0 }}
              exit={reduced ? {} : { y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed inset-x-0 bottom-[calc(var(--mobile-bar-height)+env(safe-area-inset-bottom))] z-[49] bg-white rounded-t-2xl shadow-2xl md:hidden"
            >
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <p className="font-semibold text-[var(--color-text)]">
                    {isBg ? 'Бързо запитване' : 'Quick enquiry'}
                  </p>
                  <button
                    onClick={() => setFormOpen(false)}
                    className="p-1 text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                    aria-label="Close"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {status === 'sent' ? (
                  <div className="flex flex-col items-center py-6 gap-3">
                    <div className="w-10 h-10 rounded-full bg-[var(--color-success)]/10 flex items-center justify-center">
                      <svg className="w-5 h-5 text-[var(--color-success)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-sm text-[var(--color-text-muted)] text-center">
                      {isBg ? 'Получихме вашето запитване. Ще се свържем скоро.' : "We got your message. We'll be in touch shortly."}
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder={isBg ? 'Имейл адрес' : 'Your email'}
                      className="w-full px-4 py-3 rounded-[var(--radius-md)] bg-[var(--color-bg-surface)] border border-[var(--color-border)] text-[var(--color-text)] text-sm placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                    />
                    <textarea
                      rows={3}
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      placeholder={isBg ? 'Вашето съобщение (по желание)' : 'Your message (optional)'}
                      className="w-full px-4 py-3 rounded-[var(--radius-md)] bg-[var(--color-bg-surface)] border border-[var(--color-border)] text-[var(--color-text)] text-sm placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] resize-none"
                    />
                    <button
                      type="submit"
                      disabled={status === 'submitting'}
                      className="w-full py-3 rounded-[var(--radius-md)] bg-[var(--color-accent-text)] text-white font-semibold text-sm hover:bg-[var(--color-accent-hover)] transition-colors disabled:opacity-50"
                    >
                      {status === 'submitting'
                        ? (isBg ? 'Изпращане…' : 'Sending…')
                        : (isBg ? 'Изпрати' : 'Send')}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
