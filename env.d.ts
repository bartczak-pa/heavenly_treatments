interface ProcessEnv {
  NODE_ENV: 'development' | 'production' | 'test';
  RESEND_API_KEY: string;
  EMAIL_FROM_ADDRESS: string;
  EMAIL_TO_ADDRESS: string;
  NEXT_PUBLIC_BASE_URL: string;
  CALENDLY_API_KEY?: string;
  NEXT_PUBLIC_CALENDLY_USERNAME?: string;
}

