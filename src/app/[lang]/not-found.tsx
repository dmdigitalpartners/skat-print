'use client'

import { usePathname } from 'next/navigation'
import NotFoundContent from '@/components/sections/NotFoundContent'

// Catches notFound() calls raised anywhere inside /[lang]/** (invalid
// product/service/industry/blog slugs, etc.). Because this file lives
// inside the [lang] segment, it renders nested in src/app/[lang]/layout.tsx
// — so the Navbar, Footer, Chatbot, and MobileConversionBar all still
// appear, unlike the root src/app/not-found.tsx fallback.
//
// Per Next.js docs, not-found.js files never receive params as props —
// language has to be read from the URL client-side (usePathname), same
// approach as the root fallback.
export default function LangNotFound() {
  const pathname = usePathname() ?? ''
  const lang = pathname.startsWith('/en') ? 'en' : 'bg'

  return <NotFoundContent lang={lang} />
}
