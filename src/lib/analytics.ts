/**
 * Typed analytics event wrapper.
 * Currently stubs to GA4 gtag — expand when GA4 is fully configured.
 * Server-side safe: no-ops if window is not defined.
 */

export type AnalyticsEvent =
  | { name: 'cta_click'; section: string; label: string }
  | { name: 'form_submitted'; form_type: string }
  | { name: 'chatbot_opened' }
  | { name: 'chatbot_lead_qualified' }

export function trackEvent(event: AnalyticsEvent): void {
  if (typeof window === 'undefined') return

  const { name, ...props } = event

  // GA4 via gtag
  if (typeof window.gtag === 'function') {
    window.gtag('event', name, props as Record<string, string | number | boolean>)
  }

  // Development logging — remove before production
  if (process.env.NODE_ENV === 'development') {
    console.debug('[analytics]', name, props)
  }
}
