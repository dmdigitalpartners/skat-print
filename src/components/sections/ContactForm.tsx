'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, useReducedMotion } from 'framer-motion'
import type { Translation } from '@/lib/useTranslation'
import { trackEvent } from '@/lib/analytics'

function buildSchema(f: Translation['contact_page']['form']) {
  return z.object({
    name: z.string().min(2, f.error_name),
    company: z.string().min(1, f.error_company),
    product_type: z.string().min(1, f.error_product_type),
    quantity: z.string().min(1, f.error_quantity),
    message: z.string().optional(),
    contact: z.string().min(5, f.error_contact),
  })
}

type FormData = z.infer<ReturnType<typeof buildSchema>>

export default function ContactForm({ t }: { t: Translation }) {
  const reduced = useReducedMotion()
  const f = t.contact_page.form
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({ resolver: zodResolver(buildSchema(f)) })

  const onSubmit = async (data: FormData) => {
    setStatus('submitting')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        setStatus('success')
        reset()
        trackEvent({ name: 'form_submitted', form_type: 'contact' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="p-8 border border-[var(--color-success)] rounded-[var(--radius-lg)] bg-[var(--color-bg-surface)] text-center">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[var(--color-success)]/10 mx-auto mb-4">
          <svg className="w-6 h-6 text-[var(--color-success)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-display font-bold text-xl text-[var(--color-text)] mb-2">{f.success_heading}</h3>
        <p className="text-[var(--color-text-muted)]">{f.success_body}</p>
      </div>
    )
  }

  const inputCls = `w-full px-4 py-3 rounded-[var(--radius-md)] bg-[var(--color-bg-surface)] border text-[var(--color-text)] text-sm placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition-[border-color,box-shadow]`
  const labelCls = 'block text-sm font-medium text-[var(--color-text)] mb-1.5'
  const errorCls = 'text-sm text-[var(--color-error)] mt-1'

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-5"
      initial={reduced ? false : { opacity: 0, y: 20 }}
      whileInView={reduced ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <h3 className="font-display font-bold text-2xl text-[var(--color-text)] mb-6">{f.heading}</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className={labelCls}>{f.label_name}<span className="text-[var(--color-error)] ml-0.5" aria-hidden>*</span></label>
          <input
            id="name"
            type="text"
            placeholder={f.placeholder_name}
            aria-invalid={errors.name ? 'true' : undefined}
            aria-describedby={errors.name ? 'name-error' : undefined}
            className={`${inputCls} ${errors.name ? 'border-[var(--color-error)]' : 'border-[var(--color-border)]'}`}
            {...register('name')}
          />
          {errors.name && <p id="name-error" className={errorCls}>{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="company" className={labelCls}>{f.label_company}<span className="text-[var(--color-error)] ml-0.5" aria-hidden>*</span></label>
          <input
            id="company"
            type="text"
            placeholder={f.placeholder_company}
            aria-invalid={errors.company ? 'true' : undefined}
            aria-describedby={errors.company ? 'company-error' : undefined}
            className={`${inputCls} ${errors.company ? 'border-[var(--color-error)]' : 'border-[var(--color-border)]'}`}
            {...register('company')}
          />
          {errors.company && <p id="company-error" className={errorCls}>{errors.company.message}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="product_type" className={labelCls}>{f.label_product_type}<span className="text-[var(--color-error)] ml-0.5" aria-hidden>*</span></label>
        <select
          id="product_type"
          aria-invalid={errors.product_type ? 'true' : undefined}
          aria-describedby={errors.product_type ? 'product_type-error' : undefined}
          className={`${inputCls} ${errors.product_type ? 'border-[var(--color-error)]' : 'border-[var(--color-border)]'}`}
          {...register('product_type')}
          defaultValue=""
        >
          <option value="" disabled>{f.label_product_type}</option>
          {f.product_options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {errors.product_type && <p id="product_type-error" className={errorCls}>{errors.product_type.message}</p>}
      </div>

      <div>
        <label htmlFor="quantity" className={labelCls}>{f.label_quantity}<span className="text-[var(--color-error)] ml-0.5" aria-hidden>*</span></label>
        <input
          id="quantity"
          type="text"
          placeholder={f.placeholder_quantity}
          aria-invalid={errors.quantity ? 'true' : undefined}
          aria-describedby={errors.quantity ? 'quantity-error' : undefined}
          className={`${inputCls} ${errors.quantity ? 'border-[var(--color-error)]' : 'border-[var(--color-border)]'}`}
          {...register('quantity')}
        />
        {errors.quantity && <p id="quantity-error" className={errorCls}>{errors.quantity.message}</p>}
      </div>

      <div>
        <label htmlFor="contact" className={labelCls}>{f.label_contact}<span className="text-[var(--color-error)] ml-0.5" aria-hidden>*</span></label>
        <input
          id="contact"
          type="text"
          placeholder={f.placeholder_contact}
          aria-invalid={errors.contact ? 'true' : undefined}
          aria-describedby={errors.contact ? 'contact-error' : undefined}
          className={`${inputCls} ${errors.contact ? 'border-[var(--color-error)]' : 'border-[var(--color-border)]'}`}
          {...register('contact')}
        />
        {errors.contact && <p id="contact-error" className={errorCls}>{errors.contact.message}</p>}
      </div>

      <div>
        <label htmlFor="message" className={labelCls}>{f.label_message}</label>
        <textarea
          id="message"
          rows={4}
          placeholder={f.placeholder_message}
          className={`${inputCls} border-[var(--color-border)] resize-none`}
          {...register('message')}
        />
      </div>

      {status === 'error' && (
        <p className="text-sm text-[var(--color-error)] p-3 rounded-[var(--radius-md)] border border-[var(--color-error)]/30 bg-[var(--color-error)]/5">
          {f.error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full min-h-[44px] px-6 py-3 rounded-[var(--radius-md)] bg-[var(--color-accent-text)] text-white font-medium text-sm hover:bg-[var(--color-accent-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[var(--shadow-accent)]"
      >
        {status === 'submitting' ? f.submitting : f.submit}
      </button>
    </motion.form>
  )
}
