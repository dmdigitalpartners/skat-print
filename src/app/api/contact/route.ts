import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json()
  const { name, company, product_type, quantity, message, contact } = body

  // Validate required fields
  if (!name || !company || !product_type || !quantity || !contact) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const emailBody = `
New quote request from Skat Print website

Name: ${name}
Company: ${company}
Product Type: ${product_type}
Quantity: ${quantity}
Contact: ${contact}
Message: ${message || '—'}
`.trim()

  // Try Resend first
  const resendKey = process.env.RESEND_API_KEY
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
          to: process.env.RESEND_TO_EMAIL ?? 'office@skatoil.com',
          subject: `New Quote Request — ${company}`,
          text: emailBody,
        }),
      })
      if (res.ok) return NextResponse.json({ ok: true })
    } catch {
      // Fall through to Formspree
    }
  }

  // Formspree fallback
  const formspreeUrl = process.env.FORMSPREE_URL
  if (formspreeUrl) {
    try {
      const res = await fetch(formspreeUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name, company, product_type, quantity, contact, message }),
      })
      if (res.ok) return NextResponse.json({ ok: true })
    } catch {
      // Both failed
    }
  }

  return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
}
