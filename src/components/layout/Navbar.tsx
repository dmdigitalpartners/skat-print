'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import LanguageToggle from './LanguageToggle'
import type { Translation, Lang } from '@/lib/useTranslation'

interface Props {
  t: Translation
  lang: Lang
}

export default function Navbar({ t, lang }: Props) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [productsOpen, setProductsOpen] = useState(false)
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false)
  const pathname = usePathname()
  const productsRef = useRef<HTMLDivElement>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close all menus on route change. Adjusted during render (rather than in
  // an effect) so the closed state is reflected in the very first render for
  // the new route instead of flashing the old open state for a frame.
  const [prevPathname, setPrevPathname] = useState(pathname)
  if (pathname !== prevPathname) {
    setPrevPathname(pathname)
    setMobileOpen(false)
    setProductsOpen(false)
    setMobileProductsOpen(false)
  }

  useEffect(() => {
    if (!productsOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setProductsOpen(false) }
    const onClick = (e: MouseEvent) => {
      if (productsRef.current && !productsRef.current.contains(e.target as Node)) {
        setProductsOpen(false)
      }
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onClick)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onClick)
    }
  }, [productsOpen])

  const base = `/${lang}`

  const navItems = [
    { href: `${base}/services`, label: t.nav.services },
    { href: `${base}/about`, label: t.nav.about },
    { href: `${base}/faq`, label: t.nav.faq },
    { href: `${base}/contact`, label: t.nav.contact },
  ]

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')
  const isProductActive = () => pathname.includes('/products/')

  const linkCls = (href: string) =>
    `text-sm font-medium transition-colors duration-200 ${
      isActive(href) ? 'text-[var(--color-text)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
    }`

  const mobileLinkCls = (href: string, isLast: boolean) =>
    `text-base font-medium py-3 transition-colors duration-200 ${!isLast ? 'border-b border-[var(--color-border)]' : ''} ${
      isActive(href) ? 'text-[var(--color-text)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
    }`

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-white border-b border-[var(--color-border)] transition-shadow duration-300 ${
        scrolled ? 'shadow-sm' : ''
      }`}
    >
      <div className="container-site">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Logo — sits directly on white header */}
          <Link href={base} className="flex-shrink-0">
            <Image
              src={lang === 'bg' ? '/assets/logos/logo-bg-new.png' : '/assets/logos/logo-en-new.png'}
              alt="Skat Print"
              width={130}
              height={62}
              className="object-contain h-11 w-auto"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">

            {/* Products dropdown */}
            <div
              ref={productsRef}
              className="relative"
              onMouseEnter={() => {
                if (closeTimer.current) clearTimeout(closeTimer.current)
                setProductsOpen(true)
              }}
              onMouseLeave={() => {
                closeTimer.current = setTimeout(() => setProductsOpen(false), 200)
              }}
            >
              <button
                aria-haspopup="true"
                aria-expanded={productsOpen}
                className={`flex items-center gap-1 text-sm font-medium transition-colors duration-200 ${
                  isProductActive() ? 'text-[var(--color-text)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                }`}
              >
                {t.nav.products}
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${productsOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  aria-hidden
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown panel */}
              {productsOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-56 bg-white border border-[var(--color-border)] rounded-[var(--radius-md)] shadow-md overflow-hidden">
                  {t.products_section.items.map((item) => (
                    <Link
                      key={item.slug}
                      href={`${base}/products/${item.slug}`}
                      className="block px-4 py-2.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg-surface)] transition-colors duration-150"
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className={linkCls(item.href)}>
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop right side */}
          <div className="hidden md:flex items-center gap-4">
            <LanguageToggle lang={lang} variant="light" />
            <Link
              href={`${base}/contact`}
              className="px-5 py-2 rounded-[var(--radius-md)] bg-[var(--color-accent-text)] text-white font-semibold text-sm hover:bg-[var(--color-accent-hover)] transition-colors duration-200"
            >
              {t.nav.get_quote}
            </Link>
          </div>

          {/* Mobile: language toggle + hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <LanguageToggle lang={lang} variant="light" />
            <button
              className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors duration-200"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-[max-height,opacity] duration-300 bg-white border-t border-[var(--color-border)] ${
          mobileOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="container-site py-4 flex flex-col" aria-label="Mobile navigation">

          {/* Products accordion */}
          <div className="border-b border-[var(--color-border)]">
            <button
              onClick={() => setMobileProductsOpen((v) => !v)}
              className={`w-full flex items-center justify-between py-3 text-base font-medium transition-colors duration-200 ${
                isProductActive() ? 'text-[var(--color-text)]' : 'text-[var(--color-text-muted)]'
              }`}
            >
              {t.nav.products}
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${mobileProductsOpen ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
                aria-hidden
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {mobileProductsOpen && (
              <div className="pb-2 pl-3 flex flex-col gap-0.5 border-l-2 border-[var(--color-accent)] ml-1 mb-2">
                {t.products_section.items.map((item) => (
                  <Link
                    key={item.slug}
                    href={`${base}/products/${item.slug}`}
                    className="py-2 px-3 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors duration-150"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {navItems.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              className={mobileLinkCls(item.href, i === navItems.length - 1)}
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </Link>
          ))}

          <div className="pt-4 mt-2 flex items-center justify-end border-t border-[var(--color-border)]">
            <Link
              href={`${base}/contact`}
              className="px-5 py-2.5 rounded-[var(--radius-md)] bg-[var(--color-accent-text)] text-white font-semibold text-sm hover:bg-[var(--color-accent-hover)] transition-colors duration-200"
              onClick={() => setMobileOpen(false)}
            >
              {t.nav.get_quote}
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}
