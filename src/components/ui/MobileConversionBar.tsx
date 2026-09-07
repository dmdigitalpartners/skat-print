'use client'

import { CONTACT } from '@/config/contact'
import { trackEvent } from '@/lib/analytics'
import type { Translation } from '@/lib/useTranslation'

/**
 * The single mobile contact action: call the Trud production office.
 *
 * This replaced a three-up Call / WhatsApp / Quick Form bar. Three competing
 * actions in a 64px strip meant three small targets and no clear next step;
 * one full-width call target is unambiguous and matches how buyers in this
 * industry actually get in touch.
 *
 * The bar's rendered height must stay 64px — --mobile-bar-height in tokens.css
 * is the single source of truth for the clearance reserved by the [lang] layout,
 * html scroll-padding, and the Hero's own height calculation.
 */
export default function MobileConversionBar({ t }: { t: Translation }) {
  return (
    <div
      className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-[var(--color-primary-dark)] border-t border-white/10 shadow-[0_-8px_20px_rgba(0,0,0,0.18)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <a
        href={`tel:${CONTACT.phone_primary}`}
        onClick={() => trackEvent({ name: 'cta_click', section: 'mobile_bar', label: 'call' })}
        aria-label={`${t.nav.call_us} ${CONTACT.phone_primary_display}`}
        className="flex items-center justify-center gap-2.5 min-h-16 px-4 text-white font-semibold text-[15px] transition-colors duration-200 hover:bg-white/5 active:bg-white/10 focus-visible:outline-2 focus-visible:outline-white focus-visible:-outline-offset-2"
      >
        <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden className="w-[18px] h-[18px] shrink-0">
          <path d="M2.5 4.5c0-.83.67-1.5 1.5-1.5h2.1c.65 0 1.22.42 1.42 1.04l.79 2.43c.17.53-.01 1.11-.46 1.45l-1.2.9a11.4 11.4 0 0 0 4.53 4.53l.9-1.2c.34-.45.92-.63 1.45-.46l2.43.79c.62.2 1.04.77 1.04 1.42V16c0 .83-.67 1.5-1.5 1.5h-.5C8.6 17.5 2.5 11.4 2.5 4.5Z" />
        </svg>
        <span>{t.nav.call_us}</span>
        <span className="font-normal text-white/60 text-[13px] tracking-tight">
          {CONTACT.phone_primary_display}
        </span>
      </a>
    </div>
  )
}
