export const config = {
  ui: {
    INITIAL_VISIBLE_TREATMENTS: 3,
    TREATMENTS_PER_PAGE: 9,
  },
  api: {
    CONTACT_ENDPOINT: '/api/contact',
    TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
  },
} as const;