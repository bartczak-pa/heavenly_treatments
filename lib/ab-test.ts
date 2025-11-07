import { Treatment } from './data/treatments';

/**
 * A/B Test Utilities for Booking Flow Optimization
 *
 * This module provides utilities for managing an A/B test comparing:
 * - Variant A (Control): Contact form booking flow
 * - Variant B (Test): Direct Fresha booking links
 *
 * The test tracks which booking method results in higher conversion rates.
 */

export type BookingVariant = 'A' | 'B';

const AB_TEST_COOKIE_NAME = 'ab_booking_variant';

/**
 * Get the user's assigned booking variant from cookies (client-side)
 *
 * @returns The assigned variant ('A' or 'B') or null if not assigned yet
 */
export function getClientBookingVariant(): BookingVariant | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const cookies = document.cookie.split(';');
  const variantCookie = cookies.find((cookie) =>
    cookie.trim().startsWith(`${AB_TEST_COOKIE_NAME}=`)
  );

  if (!variantCookie) {
    return null;
  }

  const variant = variantCookie.split('=')[1].trim() as BookingVariant;
  return variant === 'A' || variant === 'B' ? variant : null;
}

/**
 * Get the booking URL based on the user's variant
 *
 * @param treatment - Optional treatment object with freshaUrl
 * @param variant - The user's assigned variant
 * @returns The appropriate booking URL for the variant
 */
export function getBookingUrl(
  treatment?: Pick<Treatment, 'title' | 'freshaUrl'> | null,
  variant?: BookingVariant | null
): string {
  // Default to variant A (contact form) if no variant assigned
  const effectiveVariant = variant || 'A';

  // Variant A: Always use contact form
  if (effectiveVariant === 'A') {
    if (treatment?.title) {
      return `/contact?treatment=${encodeURIComponent(treatment.title)}`;
    }
    return '/contact';
  }

  // Variant B: Use Fresha links
  // Priority: treatment-specific Fresha URL > fallback Fresha URL
  const defaultFreshaUrl =
    process.env.NEXT_PUBLIC_DEFAULT_FRESHA_URL ||
    'https://www.fresha.com/book-now/heavenly-treatments-with-hayleybell-wvoyw0pw/all-offer?share=true&pId=2525483';

  return treatment?.freshaUrl || defaultFreshaUrl;
}

/**
 * Track a booking CTA click event in Google Analytics
 *
 * @param variant - The user's assigned variant
 * @param treatment - Optional treatment name
 * @param destination - Where the CTA leads ('form' or 'fresha')
 * @param ctaLocation - Where on the page the CTA was clicked
 */
export function trackBookingClick(
  variant: BookingVariant,
  treatment?: string,
  destination?: 'form' | 'fresha',
  ctaLocation?: string
): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
    return;
  }

  // Determine destination based on variant if not explicitly provided
  const effectiveDestination = destination || (variant === 'A' ? 'form' : 'fresha');

  window.gtag('event', 'booking_cta_click', {
    variant,
    treatment_name: treatment || 'general',
    destination: effectiveDestination,
    cta_location: ctaLocation || 'unknown',
    experiment_name: 'booking_flow',
  });
}

/**
 * Track variant assignment in Google Analytics
 * This should be called once when the user is first assigned a variant
 *
 * @param variant - The assigned variant
 */
export function trackVariantAssignment(variant: BookingVariant): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
    return;
  }

  window.gtag('event', 'ab_test_assigned', {
    variant,
    experiment_name: 'booking_flow',
  });
}

/**
 * Check if the A/B test is currently enabled
 *
 * @returns true if A/B test is enabled, false otherwise
 */
export function isAbTestEnabled(): boolean {
  return process.env.NEXT_PUBLIC_AB_TEST_ENABLED === 'true';
}

/**
 * Get descriptive text for each variant (useful for debugging/admin panels)
 *
 * @param variant - The variant to describe
 * @returns Human-readable description of the variant
 */
export function getVariantDescription(variant: BookingVariant): string {
  switch (variant) {
    case 'A':
      return 'Control - Contact Form';
    case 'B':
      return 'Test - Direct Fresha Booking';
    default:
      return 'Unknown Variant';
  }
}
