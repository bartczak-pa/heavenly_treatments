/**
 * Booking URL Resolution based on A/B test variant
 */

import {
  getVariantAssignment,
  isABTestEnabled,
} from './variantAssignment';

export type BookingContext =
  | 'navbar'
  | 'treatment-card'
  | 'treatment-detail'
  | 'location-section';

/**
 * Get the appropriate booking URL based on variant and context
 *
 * @param context - Where the booking button is located
 * @param treatmentTitle - Name of the treatment (optional, used
 * for form variant)
 * @param freshaUrl - Dedicated Fresha URL for this treatment
 * (optional)
 * @returns The booking URL to navigate to
 */
export function getBookingUrl(
  context: BookingContext,
  treatmentTitle?: string,
  freshaUrl?: string
): string {
  // If A/B test is disabled, always use form
  if (!isABTestEnabled()) {
    if (treatmentTitle) {
      return `/contact?treatment=${encodeURIComponent(treatmentTitle)}`;
    }
    return '/contact';
  }

  const { variant } = getVariantAssignment();
  const freshaGeneralUrl = process.env.NEXT_PUBLIC_FRESHA_GENERAL_URL;

  // FRESHA VARIANT
  if (variant === 'fresha') {
    // Prefer dedicated URL, fallback to general
    if (freshaUrl) {
      return freshaUrl;
    }
    return freshaGeneralUrl || '/contact'; // Ultimate fallback to form
  }

  // FORM VARIANT
  if (treatmentTitle) {
    return `/contact?treatment=${encodeURIComponent(treatmentTitle)}`;
  }
  return '/contact';
}

/**
 * Get variant assignment for use in client components
 */
export function useVariantForUrl() {
  return getVariantAssignment();
}
