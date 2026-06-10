import { NextRequest, NextResponse } from 'next/server'

const VALID_LANGS = ['bg', 'en'] as const
type Lang = (typeof VALID_LANGS)[number]

function isValidLang(lang: string): lang is Lang {
  return VALID_LANGS.includes(lang as Lang)
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip Next.js internals and static files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/assets') ||
    pathname.includes('.') // static files (favicon, images, etc.)
  ) {
    return NextResponse.next()
  }

  // Root → /bg/
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/bg', request.url))
  }

  // Extract first path segment
  const segments = pathname.split('/').filter(Boolean)
  const firstSegment = segments[0]

  // If first segment is not a valid lang, redirect to /bg/[rest]
  if (!isValidLang(firstSegment)) {
    const rest = segments.join('/')
    return NextResponse.redirect(new URL(`/bg/${rest}`, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
