import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Skat Print — Custom Packaging & POS Displays'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// TODO: replace with a professionally designed asset when available
export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#141C27',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          gap: 24,
        }}
      >
        {/* Accent rule */}
        <div style={{ width: 80, height: 3, background: '#0098D4', borderRadius: 2 }} />

        {/* Company name */}
        <div
          style={{
            color: '#FFFFFF',
            fontSize: 72,
            fontWeight: 800,
            letterSpacing: '-2px',
            lineHeight: 1,
          }}
        >
          SKAT PRINT
        </div>

        {/* Tagline */}
        <div
          style={{
            color: 'rgba(255,255,255,0.6)',
            fontSize: 24,
            fontWeight: 400,
            letterSpacing: '2px',
            textTransform: 'uppercase',
          }}
        >
          Custom Packaging &amp; POS Displays · Since 1995
        </div>

        {/* Accent rule */}
        <div style={{ width: 80, height: 3, background: '#0098D4', borderRadius: 2 }} />
      </div>
    ),
    { ...size }
  )
}
