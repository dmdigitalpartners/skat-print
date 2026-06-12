import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// In-memory sliding window rate limiter — 5 requests per minute per IP
const rateLimitMap = new Map<string, number[]>()
const RATE_LIMIT = 5
const WINDOW_MS = 60_000

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const timestamps = (rateLimitMap.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  if (timestamps.length >= RATE_LIMIT) return true
  timestamps.push(now)
  rateLimitMap.set(ip, timestamps)
  return false
}

const ALLOWED_ORIGINS = [
  'https://skatprint.bg',
  'https://skat-print.vercel.app',
  'http://localhost:3000',
]

export async function POST(request: NextRequest) {
  // CSRF: reject requests from unknown origins
  const origin = request.headers.get('origin') ?? ''
  if (!ALLOWED_ORIGINS.includes(origin)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Rate limiting by IP
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown'
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait a minute before trying again.' },
      { status: 429 }
    )
  }

  const body = await request.json()
  const { name, company, product_type, quantity, message, contact, type } = body

  // Validate required fields (sample-request and mobile-quick have different required sets)
  const isSampleRequest = type === 'sample-request'
  const isMobileQuick = type === 'mobile-quick'
  const isChatbotLead = type === 'chatbot-lead'

  if (!isSampleRequest && !isMobileQuick && !isChatbotLead) {
    if (!name || !company || !product_type || !quantity || !contact) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
  }

  const subjectPrefix = isSampleRequest
    ? 'Sample Request'
    : isMobileQuick
      ? 'Quick Mobile Enquiry'
      : isChatbotLead
        ? 'Chatbot Lead'
        : 'New Quote Request'

  const emailBody = `
${subjectPrefix} from Skat Print website

Name: ${name || '—'}
Company: ${company || '—'}
Product Type: ${product_type || '—'}
Quantity: ${quantity || '—'}
Contact: ${contact || '—'}
Message: ${message || '—'}
Form Type: ${type || 'contact'}
`.trim()

  // Try Resend first
  const resendKey = process.env.RESEND_API_KEY
  if (!process.env.RESEND_TO_EMAIL) {
    console.warn('[contact] RESEND_TO_EMAIL is not set — falling back to office@skatoil.com (parent company)')
  }
  if (resendKey) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${resendKey}`,
        },
        body: JSON.stringify({
          from: 'Skat Print Website <onboarding@resend.dev>',
          // intentional fallback — office@skatoil.com is the parent company (Skat Oil)
          to: process.env.RESEND_TO_EMAIL ?? 'office@skatoil.com',
          subject: `${subjectPrefix} — ${company || contact || 'Unknown'}`,
          text: emailBody,
        }),
      })
      if (res.ok) return NextResponse.json({ ok: true })
      console.error('[contact] Resend failed:', res.status, await res.text())
    } catch (err) {
      console.error('[contact] Resend threw:', err)
    }
  }

  // Formspree fallback
  const formspreeUrl = process.env.FORMSPREE_URL
  if (formspreeUrl) {
    try {
      const res = await fetch(formspreeUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name, company, product_type, quantity, contact, message, type }),
      })
      if (res.ok) return NextResponse.json({ ok: true })
      console.error('[contact] Formspree failed:', res.status)
    } catch (err) {
      console.error('[contact] Formspree threw:', err)
    }
  }

  return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
}
