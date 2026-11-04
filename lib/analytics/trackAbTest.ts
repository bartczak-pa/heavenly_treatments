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

/** Experiment label for a visitor who is not a Participant */
export const NON_PARTICIPANT_LABEL = 'non_participant';

export type ExperimentGroupLabel = ABTestVariant | typeof NON_PARTICIPANT_LABEL;

/**
 * The experiment parameter for booking events: a Participant's Assigned
 * Group, or `non_participant` otherwise.
 *
 * GA4 only loads after consent, so in practice `non_participant` means
 * "consented, but the experiment flag is off". It is sent explicitly so
 * it can't be confused with a broken tag ("(not set)" in GA4).
 */
export function experimentParams(): { ab_test_variant: ExperimentGroupLabel } {
  const { variant, isParticipant } = getVariantAssignment();
  return { ab_test_variant: isParticipant ? variant : NON_PARTICIPANT_LABEL };
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
 * Track a Booking Request: the server accepted a contact form submission.
 *
 * This is the experiment's Form Route conversion event. Only the site
 * sends it (unlike `purchase`, which Fresha also sends), and it is
 * credited to the visitor's Assigned Group however they reached the form.
 *
 * Call it from the form's success path, not the booking confirmation page.
 */
export function trackFormSubmission(treatmentName?: string) {
  if (typeof window === 'undefined' || !window.gtag) {
    return;
  }

  window.gtag('event', 'booking_form_submitted', {
    ...experimentParams(),
    treatment_name: treatmentName || 'none',
  });
}
