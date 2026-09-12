import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },

  images: {
    formats: ['image/avif', 'image/webp'],
    // 2560 and 3840 let full-bleed images (the desktop hero) stay sharp on
    // retina laptops and large monitors instead of being capped at 1920.
    deviceSizes: [640, 750, 828, 1080, 1280, 1440, 1920, 2560, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // 75 is the default for everything; 90 is reserved for the hero photo,
    // where AVIF at 75 visibly smeared the product print.
    qualities: [75, 90],
  },

  async headers() {
    return [
      // Long-lived cache for static assets (content-hashed filenames)
      {
        source: '/assets/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      // Security headers on all routes
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Content-Security-Policy',
            // 'unsafe-inline' on script/style is the pragmatic choice for a
            // non-nonce Next.js setup (Next's own bootstrap + Tailwind/Framer
            // Motion inline styles need it). frame-src allows the Google Maps
            // embeds on /contact; everything else is same-origin only.
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data:",
              "font-src 'self' data:",
              "connect-src 'self' https://va.vercel-scripts.com https://vitals.vercel-insights.com",
              "frame-src https://www.google.com",
              "frame-ancestors 'none'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
    ]
  },
}

export default nextConfig
