'use client'

import { usePathname } from 'next/navigation'
import NotFoundContent from '@/components/sections/NotFoundContent'

// Fallback for any 404 that occurs outside the /[lang] segment (e.g. a
// request that never matched the locale-prefixed route tree at all). In
// normal operation, notFound() calls inside /[lang]/** are caught by
// src/app/[lang]/not-found.tsx instead, which renders inside the full
// site layout (Navbar/Footer/Chatbot). This one can't rely on route
// params, so it guesses the language from the URL.
export default function NotFound() {
  const pathname = usePathname() ?? ''
  const lang = pathname.startsWith('/en') ? 'en' : 'bg'

  return <NotFoundContent lang={lang} />
}
