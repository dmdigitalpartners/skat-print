'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import type { Translation, Lang } from '@/lib/useTranslation'

/**
 * Mounts the Chatbot on desktop only.
 *
 * The chatbot is a ~740-line client component plus a 22KB intents file, and on
 * mobile it competed for the same bottom-right corner as the call bar. Gating it
 * here rather than hiding it with CSS means mobile visitors never download or
 * mount it at all.
 *
 * ssr: false is what keeps this clean — nothing renders on the server, so there
 * is no hydration mismatch between a server pass that cannot know the viewport
 * and a client pass that can. The desktop cost is the FAB appearing a moment
 * after hydration instead of in the first paint.
 */
const Chatbot = dynamic(() => import('@/components/ui/Chatbot'), { ssr: false })

// Tailwind's md breakpoint — kept in sync with the md:hidden bar it replaces.
const DESKTOP_QUERY = '(min-width: 768px)'

export default function DesktopChatbot({ t, lang }: { t: Translation; lang: Lang }) {
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia(DESKTOP_QUERY)
    const update = () => setIsDesktop(mql.matches)
    update()
    mql.addEventListener('change', update)
    return () => mql.removeEventListener('change', update)
  }, [])

  if (!isDesktop) return null

  return <Chatbot t={t} lang={lang} />
}
