// Content Security Policy configuration
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' *.google.com *.googleapis.com *.gstatic.com *.google-analytics.com *.googletagmanager.com https://js.stripe.com https://checkout.stripe.com;
  style-src 'self' 'unsafe-inline' *.googleapis.com;
  img-src 'self' data: https: blob: *.google.com *.googleapis.com *.gstatic.com *.googleusercontent.com *.stripe.com;
  font-src 'self' data: *.gstatic.com *.googleapis.com;
  frame-src 'self' *.stripe.com *.google.com;
  connect-src 'self' *.supabase.co wss://*.supabase.co *.google.com *.googleapis.com *.google-analytics.com *.googletagmanager.com https://api.stripe.com https://checkout.stripe.com wss://kylo.video ws://localhost:*;
  media-src 'self' blob: data: https:;
  object-src 'none';
  base-uri 'self';
  form-action 'self' *.stripe.com;
  frame-ancestors 'none';
  block-all-mixed-content;
  upgrade-insecure-requests;
`

// Security headers configuration for Next.js
export const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  },
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim()
  }
]