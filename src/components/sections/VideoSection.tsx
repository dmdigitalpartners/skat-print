import type { Translation, Lang } from '@/lib/useTranslation'
import VideoPlayer from '@/components/ui/VideoPlayer'

export default function VideoSection({ t, lang }: { t: Translation; lang: Lang }) {
  return (
    <section
      className="section-padding"
      style={{ background: 'linear-gradient(180deg, var(--color-bg-dark) 0%, var(--color-primary-dark) 100%)' }}
    >
      <div className="container-site">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-condensed font-semibold uppercase tracking-widest text-[var(--color-accent)] mb-5">
              <span className="block w-5 h-px bg-[var(--color-accent)]" />
              {t.video_section.watch_label}
            </span>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-white leading-[1.05] mb-5">
              {t.video_section.heading}
            </h2>
            <p className="text-[var(--color-text-muted-dark)] text-base md:text-lg leading-relaxed max-w-md">
              {t.video_section.subheading}
            </p>
          </div>
          <VideoPlayer t={t} lang={lang} />
        </div>
      </div>
    </section>
  )
}
