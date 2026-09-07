import type { Translation, Lang } from '@/lib/useTranslation'
import VideoPlayer from '@/components/ui/VideoPlayer'
import SectionHeader from '@/components/ui/SectionHeader'

export default function VideoSection({ t, lang }: { t: Translation; lang: Lang }) {
  return (
    <section
      className="section-padding"
      style={{ background: 'linear-gradient(180deg, var(--color-bg-dark) 0%, var(--color-primary-dark) 100%)' }}
    >
      <div className="container-site">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
          <SectionHeader
            eyebrow={t.video_section.watch_label}
            heading={t.video_section.heading}
            description={t.video_section.subheading}
            descriptionShort={t.video_section.subheading_short}
            tone="dark"
            className=""
          />
          <VideoPlayer t={t} lang={lang} />
        </div>
      </div>
    </section>
  )
}
