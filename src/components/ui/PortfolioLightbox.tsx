'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { AnimatePresence, motion, useReducedMotion, type PanInfo } from 'framer-motion'
import { IconArrow, IconX } from '@/components/icons/ChatbotIcons'
import type { Translation, Lang } from '@/lib/useTranslation'
import type { PortfolioItem } from '@/lib/portfolio-data'

interface Props {
  // The already category-filtered, render-ordered list. Confining prev/next to
  // one catalogue category needs no logic here — the caller only ever hands us
  // the tiles it rendered, so a POS display can never step into Food Packaging.
  items: PortfolioItem[]
  index: number | null
  t: Translation
  lang: Lang
  onIndexChange: (index: number) => void
  onClose: () => void
}

// Completed-swipe thresholds. Either one is enough: a long slow drag or a
// short flick both count.
const SWIPE_DISTANCE = 64
const SWIPE_VELOCITY = 420
// A flick can clear SWIPE_VELOCITY on almost no travel, and a tap that ends
// with a few pixels of finger jitter reports exactly that. Velocity alone must
// therefore never navigate — it needs this much deliberate travel behind it.
const SWIPE_MIN_DISTANCE = 24
// Pointer travel beyond this means the gesture was a drag, not a click, so it
// must not be treated as a "tap outside the image".
const CLICK_SLOP = 10

const CONTROL_BASE =
  'z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-[var(--color-text-dark)] transition-[background-color,border-color,opacity] duration-200 hover:border-white/30 hover:bg-white/20 md:h-12 md:w-12'

export default function PortfolioLightbox({
  items,
  index,
  t,
  lang,
  onIndexChange,
  onClose,
}: Props) {
  const reduced = useReducedMotion() ?? false

  const [portalHost, setPortalHost] = useState<HTMLElement | null>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const prevRef = useRef<HTMLButtonElement>(null)
  const nextRef = useRef<HTMLButtonElement>(null)
  const pointerDownRef = useRef<{ x: number; y: number } | null>(null)

  const isOpen = index !== null
  const current = index === null ? null : items[index] ?? null
  const canPrev = index !== null && index > 0
  const canNext = index !== null && index < items.length - 1

  const goPrev = useCallback(() => {
    if (index === null || index <= 0) return
    onIndexChange(index - 1)
  }, [index, onIndexChange])

  const goNext = useCallback(() => {
    if (index === null || index >= items.length - 1) return
    onIndexChange(index + 1)
  }, [index, items.length, onIndexChange])

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    // document only exists after mount. Reading it here rather than during
    // render keeps the server output identical to the client's first render,
    // so there is nothing to mismatch during hydration.
    setPortalHost(document.body)
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [])

  // ── Scroll lock
  useEffect(() => {
    if (!isOpen) return

    const doc = document.documentElement
    const body = document.body
    // Measured rather than hardcoded: 0 on overlay-scrollbar platforms (macOS,
    // iOS, touch Windows), ~6px where the ::-webkit-scrollbar rule in
    // globals.css paints a real one. Compensating stops the page behind the
    // overlay shifting sideways as the scrollbar disappears.
    const scrollbarWidth = window.innerWidth - doc.clientWidth
    const previous = {
      html: doc.style.overflow,
      body: body.style.overflow,
      padding: body.style.paddingRight,
    }

    // Both elements: <html> is what makes this hold on iOS 16+. Deliberately
    // not the `position: fixed; top: -scrollY` technique — that forces a
    // scrollTo on restore, which fights html{scroll-behavior:smooth} and
    // breaks position:fixed descendants. Toggling overflow never moves the
    // scroll offset, so there is nothing for smooth-scroll to animate.
    doc.style.overflow = 'hidden'
    body.style.overflow = 'hidden'
    if (scrollbarWidth > 0) {
      const base = parseFloat(window.getComputedStyle(body).paddingRight) || 0
      body.style.paddingRight = `${base + scrollbarWidth}px`
    }

    return () => {
      doc.style.overflow = previous.html
      body.style.overflow = previous.body
      body.style.paddingRight = previous.padding
    }
  }, [isOpen])

  // ── Keyboard: escape, arrows, and a total focus trap
  useEffect(() => {
    if (!isOpen) return

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); return }
      if (e.key === 'ArrowLeft') { e.preventDefault(); goPrev(); return }
      if (e.key === 'ArrowRight') { e.preventDefault(); goNext(); return }
      if (e.key !== 'Tab') return

      // Only actionable controls take part in the cycle, so at a boundary the
      // disabled chevron is skipped entirely: Close -> Next -> Close at the
      // first image, Close -> Prev -> Close at the last.
      const order = [closeRef.current, prevRef.current, nextRef.current]
        .filter((el): el is HTMLButtonElement => el !== null && !el.disabled)
      if (order.length === 0) return

      // Swallowing every Tab is what makes the trap total: the browser never
      // gets a chance to move focus into the obscured page behind.
      e.preventDefault()
      const pos = order.findIndex((el) => el === document.activeElement)
      const target = e.shiftKey
        ? (pos <= 0 ? order.length - 1 : pos - 1)
        : (pos === -1 || pos === order.length - 1 ? 0 : pos + 1)
      order[target].focus()
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isOpen, onClose, goPrev, goNext])

  // Keyed on isOpen, not index: navigating between images must not yank focus
  // off the chevron the user is repeatedly pressing.
  useEffect(() => {
    if (!isOpen) return
    closeRef.current?.focus({ preventScroll: true })
  }, [isOpen])

  // Reaching a boundary disables the very control the user was operating, and
  // the browser then drops focus to <body> — behind the overlay. Park focus on
  // the dialog instead; Tab from there re-enters the cycle above. Testing a
  // disabled control explicitly matters: it is still a descendant of the
  // dialog, so a containment check alone passes here and the blur lands
  // afterwards, stranding focus on <body>. Declared after the initial-focus
  // effect, so on open it is a no-op.
  useEffect(() => {
    if (!isOpen) return
    const root = dialogRef.current
    if (!root) return
    const active = document.activeElement
    const activeIsDisabled = active instanceof HTMLButtonElement && active.disabled
    if (!root.contains(active) || activeIsDisabled) {
      root.focus({ preventScroll: true })
    }
  }, [isOpen, index])

  const handleDragEnd = useCallback(
    (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const distance = Math.abs(info.offset.x)
      const passed =
        distance > SWIPE_DISTANCE ||
        (Math.abs(info.velocity.x) > SWIPE_VELOCITY && distance > SWIPE_MIN_DISTANCE)
      if (!passed) return // too short — dragConstraints springs the stage back to x: 0
      // goPrev/goNext are boundary-guarded, so a completed swipe at either end
      // is a silent no-op and the stage simply springs back.
      if (info.offset.x < 0) goNext()
      else goPrev()
    },
    [goNext, goPrev],
  )

  const handleStagePointerDown = useCallback((e: React.PointerEvent) => {
    pointerDownRef.current = { x: e.clientX, y: e.clientY }
  }, [])

  const handleStageClick = useCallback(
    (e: React.MouseEvent) => {
      // Landed on the image itself, so not "outside".
      if (e.target !== e.currentTarget) return
      const down = pointerDownRef.current
      pointerDownRef.current = null
      // framer uses pointer capture, so a drag beginning on the image and
      // ending over the stage dispatches its click on the stage — the close
      // target. Distance tells a real tap from the tail of a swipe, and also
      // stops a sloppy click-drag on the backdrop closing the viewer.
      if (down && Math.hypot(e.clientX - down.x, e.clientY - down.y) > CLICK_SLOP) return
      onClose()
    },
    [onClose],
  )

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      // During the stage's subtle opening scale, a few pixels at the viewport
      // edge belong to the overlay itself. Treat those pixels as backdrop too.
      if (e.target === e.currentTarget) onClose()
    },
    [onClose],
  )

  const overlayMotion = reduced
    ? {}
    : {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.18, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
      }

  const stageMotion = reduced
    ? {}
    : {
        initial: { scale: 0.985 },
        animate: { scale: 1 },
        exit: { scale: 0.985 },
        transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
      }

  if (!portalHost) return null

  const groupLabel = current ? (lang === 'bg' ? current.groupBg : current.group) : undefined

  return createPortal(
    <AnimatePresence>
      {isOpen && current && (
        <motion.div
          {...overlayMotion}
          ref={dialogRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-label={t.lightbox.aria_dialog}
          onClick={handleOverlayClick}
          className="lightbox-root fixed inset-0 z-[100] overflow-hidden overscroll-contain bg-[var(--color-bg-dark)]/95"
        >
          {/* The stage covers the whole overlay, so it doubles as the backdrop:
              anything that isn't the image, a control or the caption falls
              through to its click handler and closes. */}
          <motion.div
            {...stageMotion}
            drag={reduced ? false : 'x'}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={{ left: canNext ? 0.2 : 0.04, right: canPrev ? 0.2 : 0.04 }}
            dragMomentum={false}
            onDragEnd={handleDragEnd}
            onPointerDown={handleStagePointerDown}
            onClick={handleStageClick}
            className="absolute inset-0 flex items-center justify-center px-[var(--lb-chrome-x)] pt-[var(--lb-chrome-top)] pb-[var(--lb-chrome-bottom)]"
          >
            <Image
              src={current.src}
              alt={lang === 'bg' ? current.altBg : current.alt}
              width={current.width}
              height={current.height}
              sizes="(max-width: 767px) 100vw, (max-width: 1279px) 85vw, 1100px"
              loading="eager"
              fetchPriority="high"
              // framer sets draggable={false} on the drag element only; without
              // this the child image's native HTML5 drag ghost fights the
              // pointer drag on desktop.
              draggable={false}
              className="block h-auto w-auto min-h-0 min-w-0 max-h-full max-w-full select-none object-contain"
            />
          </motion.div>

          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label={t.lightbox.aria_close}
            className={`absolute right-[var(--lb-inset-x)] top-[var(--lb-inset-top)] ${CONTROL_BASE}`}
          >
            <IconX cls="h-5 w-5 md:h-6 md:w-6" />
          </button>

          {/* One pair of chevrons at every breakpoint, repositioned rather than
              duplicated — a `hidden md:flex` twin would put two copies of each
              control in the DOM and the trap would visit the hidden one. */}
          <button
            ref={prevRef}
            type="button"
            onClick={goPrev}
            disabled={!canPrev}
            aria-label={t.lightbox.aria_prev}
            className={`absolute bottom-[var(--lb-inset-bottom)] left-[var(--lb-inset-x)] md:bottom-auto md:top-1/2 md:-translate-y-1/2 disabled:pointer-events-none disabled:opacity-30 ${CONTROL_BASE}`}
          >
            <IconArrow cls="h-5 w-5 rotate-180 md:h-6 md:w-6" />
          </button>

          <button
            ref={nextRef}
            type="button"
            onClick={goNext}
            disabled={!canNext}
            aria-label={t.lightbox.aria_next}
            className={`absolute bottom-[var(--lb-inset-bottom)] right-[var(--lb-inset-x)] md:bottom-auto md:top-1/2 md:-translate-y-1/2 disabled:pointer-events-none disabled:opacity-30 ${CONTROL_BASE}`}
          >
            <IconArrow cls="h-5 w-5 md:h-6 md:w-6" />
          </button>

          {/* Caption line — the site's accent hairline motif, same as the
              gallery's own subgroup headings, so this reads as a catalogue
              spec line rather than generic viewer furniture.
              pointer-events-none so clicks here still reach the stage. */}
          <div className="pointer-events-none absolute inset-x-0 bottom-[var(--lb-inset-bottom)] z-10 flex min-h-11 flex-col items-center justify-center gap-1.5 px-[calc(var(--lb-inset-x)+3.5rem)] md:px-[var(--lb-inset-x)]">
            {groupLabel && (
              <span className="inline-flex items-center gap-2 rounded-[var(--radius-sm)] border border-white/15 bg-white/5 px-2.5 py-1 font-condensed text-[11px] font-semibold uppercase tracking-widest text-[var(--color-text-dark)]">
                <span className="block h-px w-4 shrink-0 bg-[var(--color-accent)]" />
                {groupLabel}
              </span>
            )}
            <span
              aria-hidden="true"
              className="font-condensed text-xs font-semibold uppercase tracking-[0.2em] tabular-nums text-[var(--color-text-muted-dark)]"
            >
              {index + 1} / {items.length}
            </span>
          </div>

          {/* Spoken position + description. The visible counter is a bare
              slash form, which screen readers would read as a fraction. */}
          <p aria-live="polite" className="sr-only">
            {`${index + 1} ${t.lightbox.counter_of} ${items.length}. ${lang === 'bg' ? current.altBg : current.alt}`}
          </p>
        </motion.div>
      )}
    </AnimatePresence>,
    portalHost,
  )
}
