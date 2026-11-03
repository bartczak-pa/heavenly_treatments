/**
 * Booking Route Experiment analytics tracking
 *
 * Tracks experiment events in Google Analytics
 */

import {
  getVariantAssignment,
  type ABTestVariant,
} from '@/lib/abTesting/variantAssignment';
import type { BookingContext } from '@/lib/abTesting/getBookingUrl';

/** sessionStorage key marking the group as already recorded this visit */
const GROUP_RECORDED_KEY = 'ab_test_variant_recorded';

/** Fallback when sessionStorage is blocked: once per page load instead */
let groupRecordedThisPageLoad = false;

function isGroupRecordedThisVisit(): boolean {
  if (groupRecordedThisPageLoad) {
    return true;
  }
  try {
    return sessionStorage.getItem(GROUP_RECORDED_KEY) !== null;
  } catch {
    return false;
  }
}

function markGroupRecordedThisVisit(variant: ABTestVariant): void {
  try {
    sessionStorage.setItem(GROUP_RECORDED_KEY, variant);
  } catch {
    groupRecordedThisPageLoad = true;
  }
}

/**
 * The experiment parameter for booking events: a Participant's Assigned
 * Group, or nothing when the visitor is not a Participant (no consent,
 * or the experiment flag off).
 */
function experimentParams(): { ab_test_variant?: ABTestVariant } {
  const { variant, isParticipant } = getVariantAssignment();
  return isParticipant ? { ab_test_variant: variant } : {};
}

/**
 * Record a Participant's Assigned Group in GA4, at most once per visit.
 *
 * Sends a single `ab_test_variant` parameter (the GA4 custom dimension)
 * and no page_view.
 *
 * @returns true when the group is recorded (now or earlier this visit);
 * false when GA4 is not loaded yet, so the caller can retry.
 */
export function tryRecordParticipantGroup(variant: ABTestVariant): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  if (isGroupRecordedThisVisit()) {
    return true;
  }
  if (typeof window.gtag !== 'function') {
    return false;
  }

  window.gtag('event', 'ab_test_variant_assigned', {
    ab_test_variant: variant,
  });
  markGroupRecordedThisVisit(variant);
  return true;
}

/**
 * Track when a Book Now button is clicked
 */
export function trackBookingButtonClick(
  context: BookingContext,
  treatmentName?: string
) {
  if (typeof window === 'undefined' || !window.gtag) {
    return;
  }

  window.gtag('event', 'booking_button_clicked', {
    ...experimentParams(),
    context,
    treatment_name: treatmentName || 'none',
  });
}

/**
 * Track when user is redirected to booking destination
 */
export function trackBookingRedirect(
  destination: 'fresha' | 'form',
  context: BookingContext,
  treatmentName?: string
) {
  if (typeof window === 'undefined' || !window.gtag) {
    return;
  }

  window.gtag('event', 'booking_redirect', {
    ...experimentParams(),
    destination,
    context,
    treatment_name: treatmentName || 'none',
  });
}

/**
 * Track form submission (Fresha variant won't track this)
 */
export function trackFormSubmission() {
  if (typeof window === 'undefined' || !window.gtag) {
    return;
  }

  window.gtag('event', 'booking_form_submitted', experimentParams());
}
