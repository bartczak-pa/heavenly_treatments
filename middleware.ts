import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware for A/B testing variant assignment
 *
 * Assigns visitors to either variant A (contact form) or variant B (Fresha booking)
 * on their first visit. The variant is stored in a cookie that persists for 30 days.
 *
 * This ensures consistent user experience - once assigned to a variant, users will
 * always see the same booking flow until the cookie expires.
 */

const AB_TEST_COOKIE_NAME = 'ab_booking_variant';
const AB_TEST_COOKIE_MAX_AGE = 30 * 24 * 60 * 60; // 30 days in seconds

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Check if user already has a variant assigned
  const existingVariant = request.cookies.get(AB_TEST_COOKIE_NAME);

  if (existingVariant) {
    // User already has a variant, pass it along in the response
    return response;
  }

  // Check if A/B test is enabled via environment variable
  const isAbTestEnabled = process.env.NEXT_PUBLIC_AB_TEST_ENABLED === 'true';

  if (!isAbTestEnabled) {
    // A/B test is disabled, assign everyone to variant A (control - contact form)
    response.cookies.set(AB_TEST_COOKIE_NAME, 'A', {
      maxAge: AB_TEST_COOKIE_MAX_AGE,
      path: '/',
      sameSite: 'lax',
    });
    return response;
  }

  // New user - assign a variant randomly (50/50 split)
  const variant = Math.random() < 0.5 ? 'A' : 'B';

  // Set the cookie
  response.cookies.set(AB_TEST_COOKIE_NAME, variant, {
    maxAge: AB_TEST_COOKIE_MAX_AGE,
    path: '/',
    sameSite: 'lax',
  });

  return response;
}

/**
 * Configure which routes should trigger the middleware
 * We only need to run this on page routes where booking CTAs appear
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     * - studio (Sanity Studio)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images|studio).*)',
  ],
};
