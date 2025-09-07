export const config = {
  ui: {
    INITIAL_VISIBLE_TREATMENTS: 3,
    TREATMENTS_PER_PAGE: 9,
    RESPONSIVE_INCREMENTS: {
      SMALL: 3,    // < 1024px
      LARGE: 4,    // 1024px - 1279px  
      EXTRA_LARGE: 6,  // >= 1280px
    },
    BREAKPOINTS: {
      LARGE: 1024,
      EXTRA_LARGE: 1280,
    },
  },
  api: {
    CONTACT_ENDPOINT: '/api/contact',
    TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
  },
  seo: {
    DEFAULT_IMAGE: {
      WIDTH: 1200,
      HEIGHT: 630,
    },
    MAX_DESCRIPTION_LENGTH: 160,
    MAX_STRUCTURED_DATA_DESCRIPTION: 5000,
  },
  location: {
    COORDINATES: {
      LATITUDE: '55.584',
      LONGITUDE: '-2.385',
    },
  },
} as const;