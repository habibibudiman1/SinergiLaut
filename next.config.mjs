/** @type {import('next').NextConfig} */

const securityHeaders = [
  // Prevent DNS prefetch leaking visited subpages
  { key: 'X-DNS-Prefetch-Control', value: 'on' },

  // Force HTTPS for 2 years, include subdomains
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },

  // Block clickjacking — only allow framing from same origin
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },

  // Prevent MIME-type sniffing
  { key: 'X-Content-Type-Options', value: 'nosniff' },

  // Only send origin on cross-origin requests
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },

  // Restrict browser feature access
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(self), payment=(self)' },

  // Content-Security-Policy
  // Covers: Supabase, Midtrans Snap.js, Leaflet/MapTiler, Google Fonts, Google Analytics
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      // Midtrans Snap.js + Next.js inline scripts
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://app.sandbox.midtrans.com https://app.midtrans.com https://unpkg.com https://cdn.jsdelivr.net https://www.googletagmanager.com https://www.google-analytics.com",
      // Tailwind/ShadcnUI requires unsafe-inline for styles; Google Fonts
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://unpkg.com https://cdn.jsdelivr.net",
      // Google Fonts
      "font-src 'self' https://fonts.gstatic.com",
      // Images: Supabase storage, placeholders, unsplash, data URIs, blob for previews
      "img-src 'self' data: blob: https://*.supabase.co https://placehold.co https://images.unsplash.com https://*.tile.openstreetmap.org https://api.maptiler.com",
      // API calls: Supabase REST + Realtime WS, Midtrans API, Analytics
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.midtrans.com https://api.sandbox.midtrans.com https://www.google-analytics.com https://api.maptiler.com",
      // Midtrans payment iframe
      "frame-src https://app.sandbox.midtrans.com https://app.midtrans.com",
      // Block plugin embeds
      "object-src 'none'",
      // Restrict base tag
      "base-uri 'self'",
      // Upgrade HTTP sub-resources
      "upgrade-insecure-requests",
    ].join('; ')
  },
]

const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
}

export default nextConfig
