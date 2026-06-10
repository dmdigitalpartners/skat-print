'use client'

import { useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import type { Translation } from '@/lib/useTranslation'

export default function VideoPlayer({ t }: { t: Translation }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [played, setPlayed] = useState(false)
  const reduced = useReducedMotion()

  const handlePlay = () => {
    videoRef.current?.play()
    setPlayed(true)
  }

  return (
    <motion.div
      className="relative rounded-[var(--radius-lg)] overflow-hidden bg-[var(--color-bg)] aspect-video"
      animate={reduced ? {} : {
        boxShadow: [
          '0 0 0 2px rgba(0,152,212,0.25), 0 8px 32px rgba(0,0,0,0.16)',
          '0 0 0 2px rgba(0,152,212,0.65), 0 8px 32px rgba(0,0,0,0.16)',
          '0 0 0 2px rgba(0,152,212,0.25), 0 8px 32px rgba(0,0,0,0.16)',
        ],
      }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
    >
      <video
        ref={videoRef}
        src="/assets/video/company-intro.mp4"
        poster="/assets/about/production-2020.jpg"
        controls={played}
        preload="metadata"
        className="w-full h-full object-cover"
        aria-label="Skat Print company introduction video"
      >
        Your browser does not support the video element.
      </video>

      {!played && (
        <button
          onClick={handlePlay}
          className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 cursor-pointer group"
          aria-label={t.video_section.watch_label}
        >
          <div className="w-20 h-20 rounded-full border-2 border-white/80 flex items-center justify-center group-hover:border-white group-hover:bg-white/10 transition-colors duration-200 mb-3">
            <svg
              className="w-8 h-8 text-white translate-x-0.5"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <span className="text-white text-sm font-medium tracking-wide">{t.video_section.watch_label}</span>
        </button>
      )}
    </motion.div>
  )
}
