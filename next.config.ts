import type { NextConfig } from 'next';
import withBundleAnalyzer from '@next/bundle-analyzer';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-icons',
      '@radix-ui/react-dialog',
      '@radix-ui/react-navigation-menu',
      '@radix-ui/react-select',
      '@radix-ui/react-toast',
      'class-variance-authority',
      'clsx',
    ],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [320, 640, 1024, 1280, 1536, 1920],
    imageSizes: [320, 640, 1024],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      {
        protocol: 'https',
        hostname: 'www.heavenly-treatments.co.uk',
      },
    ],
  },
  // Security & page-experience headers. Applied to every response.
  // HSTS is not automatic on Vercel, so it is set explicitly here.
  headers: async () => [
    {
      // Baseline security headers safe for all routes.
      source: '/:path*',
      headers: [
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=63072000; includeSubDomains; preload',
        },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        {
          key: 'Permissions-Policy',
          value: 'camera=(), microphone=(), geolocation=()',
        },
      ],
    },
    {
      // Clickjacking protection everywhere EXCEPT /studio, which Sanity
      // renders (and previews) inside same-origin iframes. Scoping the frame
      // header out of /studio avoids breaking the embedded Studio UI.
      source: '/((?!studio).*)',
      headers: [{ key: 'X-Frame-Options', value: 'SAMEORIGIN' }],
    },
  ],
  redirects: async () => [
    // ===========================================
    // SPECIFIC QUERY PARAM REDIRECTS (must be first)
    // ===========================================
    {
      source: '/treatments',
      has: [{ type: 'query', key: 'category', value: 'massage' }],
      destination: '/treatments/massages',
      permanent: true,
    },
    {
      source: '/treatments',
      has: [{ type: 'query', key: 'category', value: 'holistic-treatments' }],
      destination: '/treatments/seasonal-treatments',
      permanent: true,
    },
    {
      source: '/treatments',
      has: [{ type: 'query', key: 'category', value: '(?<cat>.*)' }],
      destination: '/treatments/:cat',
      permanent: true,
    },

    // ===========================================
    // SLUG MISMATCH REDIRECTS
    // ===========================================
    {
      source: '/treatments/massage',
      destination: '/treatments/massages',
      permanent: true,
    },
    {
      source: '/treatments/holistic-treatments',
      destination: '/treatments/seasonal-treatments',
      permanent: true,
    },
    {
      source: '/treatments/hollistic-treatments',
      destination: '/treatments/seasonal-treatments',
      permanent: true,
    },

    // ===========================================
    // TREATMENT SLUG REDIRECTS — menu overhaul 2026
    // Activate together when the new menu goes live (new docs un-hidden,
    // stale docs retired). Each preserves link equity for a renamed treatment.
    // ===========================================
    {
      // P4: Botanical Dry Head Spa → Sensory Dry Head Spa (Mini Facial variant)
      source: '/treatments/body-treatments/botanical-dry-head-spa-with-mini-facial',
      destination: '/treatments/body-treatments/sensory-dry-head-spa-mini-facial',
      permanent: true,
    },
    // Renamed treatments (slug changes) — preserve link equity
    {
      source: '/treatments/body-treatments/back-cleanse',
      destination: '/treatments/body-treatments/fruity-bacial',
      permanent: true,
    },
    {
      source: '/treatments/body-treatments/fruity-bacial-express-calming-facial',
      destination: '/treatments/body-treatments/fruity-bacial-express-facial',
      permanent: true,
    },
    {
      source: '/treatments/facials/golden-glow-facial',
      destination: '/treatments/facials/up-in-the-clouds-facial',
      permanent: true,
    },
    {
      source: '/treatments/facials/hydrating-jelly-mask-facial',
      destination: '/treatments/facials/celestial-facial',
      permanent: true,
    },
    {
      source: '/treatments/facials/signature-facial',
      destination: '/treatments/facials/signature-heavenly-facial',
      permanent: true,
    },
    {
      source: '/treatments/facials/signature-facial-back-massage',
      destination: '/treatments/facials/signature-heavenly-facial-back-neck-shoulders',
      permanent: true,
    },
    {
      source: '/treatments/massages/swedish-back-neck-shoulders',
      destination: '/treatments/massages/back-neck-shoulders-massage',
      permanent: true,
    },
    {
      source: '/treatments/massages/swedish-full-body-massage',
      destination: '/treatments/massages/full-body-massage-relax-restore',
      permanent: true,
    },
    {
      source: '/treatments/massages/swedish-full-body-express-facial',
      destination: '/treatments/massages/full-body-massage-express-facial',
      permanent: true,
    },
    {
      source: '/treatments/reflexology/reflexology',
      destination: '/treatments/reflexology/reflexology-foot-massage',
      permanent: true,
    },
    {
      source: '/treatments/seasonal-treatments/valentines-sweet-treat-scrub-and-massage',
      destination: '/treatments/seasonal-treatments/sweet-treat-scrub-full-body-massage',
      permanent: true,
    },
    // Discontinued treatments → send to their category page
    {
      source: '/treatments/facials/express-facial',
      destination: '/treatments/facials',
      permanent: true,
    },
    {
      source: '/treatments/facials/seilich-meadowsweet-facial',
      destination: '/treatments/facials',
      permanent: true,
    },
    {
      source: '/treatments/facials/seilich-facial-back-massage',
      destination: '/treatments/facials',
      permanent: true,
    },

    // ===========================================
    // LEGACY ROOT-LEVEL URL REDIRECTS
    // ===========================================
    {
      source: '/homepage',
      destination: '/',
      permanent: true,
    },
    {
      source: '/facials',
      destination: '/treatments/facials',
      permanent: true,
    },
    {
      source: '/seasonal-treatments',
      destination: '/treatments/seasonal-treatments',
      permanent: true,
    },
    {
      source: '/reflexology',
      destination: '/treatments/reflexology',
      permanent: true,
    },
    {
      source: '/massage-kelso-scottish-borders',
      destination: '/treatments/massages',
      permanent: true,
    },
    {
      source: '/body-treatments',
      destination: '/treatments/body-treatments',
      permanent: true,
    },
    {
      source: '/book-treatments',
      destination: '/treatments',
      permanent: true,
    },
  ],
};

// Only wrap with bundle analyzer when explicitly analyzing — avoids injecting
// a webpack() callback during normal Turbopack dev runs.
export default process.env.ANALYZE === 'true'
  ? withBundleAnalyzer({ enabled: true, openAnalyzer: false })(nextConfig)
  : nextConfig;
