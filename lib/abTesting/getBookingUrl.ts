/**
 * Booking URL Resolution based on A/B test variant
 */

import { getVariantAssignment, type ABTestVariant } from './variantAssignment';

export type BookingContext =
  | 'navbar'
  | 'hero'
  | 'treatment-card'
  | 'treatment-detail'
  | 'location-section';

/**
 * Get the booking URL for the visitor's Assigned Group.
 *
 * Pure: takes the group already resolved by `useAbTestVariant` (always
 * 'form' for non-Participants), so it reads and writes no cookies.
 *
 * @param context - Where the booking button is located
 * @param variant - The visitor's Assigned Group
 * @param treatmentTitle - Name of the treatment (optional, used
 * for form variant)
 * @param freshaUrl - Dedicated Fresha URL for this treatment
 * (optional)
 * @returns The booking URL to navigate to
 */
export function getBookingUrl(
  context: BookingContext,
  variant: ABTestVariant,
  treatmentTitle?: string,
  freshaUrl?: string
): string {
  // FRESHA VARIANT
  if (variant === 'fresha') {
    // Prefer dedicated URL, fallback to general
    if (freshaUrl) {
      return freshaUrl;
    }
    return process.env.NEXT_PUBLIC_FRESHA_GENERAL_URL || '/contact'; // Ultimate fallback to form
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
