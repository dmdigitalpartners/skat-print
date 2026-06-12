'use client'

import { useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import type { Translation } from '@/lib/useTranslation'

export default function VideoPlayer({ t }: { t: Translation }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [played, setPlayed] = useState(false)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const reduced = useReducedMotion()

  const handlePlay = () => {
    setLoading(true)
    videoRef.current?.play().then(() => {
      setPlayed(true)
      setLoading(false)
    }).catch(() => {
      setPlayed(true)
      setLoading(false)
    })
  }

  return (
    <motion.div
      className="relative rounded-[var(--radius-lg)] overflow-hidden bg-[var(--color-bg)] aspect-video"
      animate={reduced || played ? {} : {
        boxShadow: [
          '0 0 0 2px rgba(0,152,212,0.25), 0 8px 32px rgba(0,0,0,0.16)',
          '0 0 0 2px rgba(0,152,212,0.65), 0 8px 32px rgba(0,0,0,0.16)',
          '0 0 0 2px rgba(0,152,212,0.25), 0 8px 32px rgba(0,0,0,0.16)',
        ],
      }}
      style={{ willChange: played ? 'auto' : 'box-shadow' }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
    >
      {error ? (
        /* Graceful fallback: poster image with no broken video state */
        <div
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: 'url(/assets/about/production-2020.jpg)' }}
          role="img"
          aria-label="Skat Print production facility"
        />
      ) : (
        <video
          ref={videoRef}
          src="/assets/video/company-intro.mp4"
          poster="/assets/about/production-2020.jpg"
          controls={played}
          preload="metadata"
          className="w-full h-full object-cover"
          aria-label="Skat Print company introduction video"
          onError={() => setError(true)}
        >
          Your browser does not support the video element.
        </video>
      )}

      {/* Overlay: shown until video is confirmed playing, hidden during load to avoid flash */}
      {!played && !error && (
        <button
          onClick={handlePlay}
          disabled={loading}
          className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 cursor-pointer group disabled:cursor-wait"
          aria-label={t.video_section.watch_label}
        >
          <div className="w-20 h-20 rounded-full border-2 border-white/80 flex items-center justify-center group-hover:border-white group-hover:bg-white/10 transition-colors duration-200 mb-3">
            {loading ? (
              <svg className="w-6 h-6 text-white animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden>
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            ) : (
              <svg className="w-8 h-8 text-white translate-x-0.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </div>
          {!loading && (
            <span className="text-white text-sm font-medium tracking-wide">{t.video_section.watch_label}</span>
          )}
        </button>
      )}
    </motion.div>
  )
}
