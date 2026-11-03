/**
 * Booking URL Resolution based on A/B test variant
 */

import { getVariantAssignment, type ABTestVariant } from './variantAssignment';

export type BookingContext =
  | 'navbar'
  | 'hero'
  | 'treatment-card'
  | 'treatment-detail'
  | 'location-section'
  | 'cta-band';

/**
 * Fixed campaign tags added to every Fresha URL a Booking Button sends a
 * visitor to, so Fresha Bookings can be credited to the Fresha Group.
 */
const CAMPAIGN_TAGS = {
  utm_source: 'website',
  utm_medium: 'booking_button',
  utm_campaign: 'booking_route_test',
} as const;

/**
 * Add the campaign tags (and the button context as `utm_content`) to a
 * Fresha URL, keeping any existing query parameters and hash.
 * A malformed or relative URL (e.g. a bad CMS value) is returned untagged
 * rather than throwing during render.
 */
function withCampaignTags(url: string, context: BookingContext): string {
  let tagged: URL;
  try {
    tagged = new URL(url);
  } catch {
    return url;
  }
  for (const [key, value] of Object.entries(CAMPAIGN_TAGS)) {
    tagged.searchParams.set(key, value);
  }
  tagged.searchParams.set('utm_content', context);
  return tagged.toString();
}

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
    const url = freshaUrl || process.env.NEXT_PUBLIC_FRESHA_GENERAL_URL;
    if (url) {
      return withCampaignTags(url, context);
    }
    return '/contact'; // Ultimate fallback to form, left untagged
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
