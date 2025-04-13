// eslint-disable-next-line 
interface ProcessEnv {
  NODE_ENV: 'development' | 'production' | 'test';
  RESEND_API_KEY: string;
  EMAIL_FROM_ADDRESS: string;
  CONTACT_EMAIL: string;
  TURNSTILE_SECRET_KEY: string;
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: string;
  NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL: string;
  NEXT_PUBLIC_BASE_URL: string;
  CALENDLY_API_KEY?: string;
  NEXT_PUBLIC_CALENDLY_USERNAME?: string;
}

