import { NextRequest, NextResponse } from 'next/server'
import { SITE_HOST } from '@/config/site'

const VALID_LANGS = ['bg', 'en'] as const
type Lang = (typeof VALID_LANGS)[number]

function isValidLang(lang: string): lang is Lang {
  return VALID_LANGS.includes(lang as Lang)
}

// Keep any host other than the production domain out of search results —
// e.g. the temporary *.vercel.app URL while the real domain isn't connected
// yet, or preview deployments. Flips to indexable automatically once
// requests start arriving on SITE_HOST, with no manual step at cutover.
// Accepts both the apex and `www` in case DNS ever points `www` straight at
// Vercel instead of redirecting it to the apex first.
function isCanonicalHost(host: string): boolean {
  return host === SITE_HOST || host === `www.${SITE_HOST}`
}

function withNoIndexIfNotCanonicalHost(request: NextRequest, response: NextResponse): NextResponse {
  const host = request.headers.get('host') ?? ''
  if (!isCanonicalHost(host)) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow')
  }
  return response
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip Next.js internals and static files — still host-gated so assets
  // (e.g. product photography) can't get indexed under a non-canonical host.
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/assets') ||
    pathname.includes('.') // static files (favicon, images, etc.)
  ) {
    return withNoIndexIfNotCanonicalHost(request, NextResponse.next())
  }

  // Root → /bg/
  if (pathname === '/') {
    return withNoIndexIfNotCanonicalHost(request, NextResponse.redirect(new URL('/bg', request.url)))
  }

  // Extract first path segment
  const segments = pathname.split('/').filter(Boolean)
  const firstSegment = segments[0]

  // If first segment is not a valid lang, redirect to /bg/[rest]
  if (!isValidLang(firstSegment)) {
    const rest = segments.join('/')
    return withNoIndexIfNotCanonicalHost(request, NextResponse.redirect(new URL(`/bg/${rest}`, request.url)))
  }

  return withNoIndexIfNotCanonicalHost(request, NextResponse.next())
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
