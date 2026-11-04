/**
 * Booking Route Experiment analytics tracking
 *
 * Tracks experiment events in Google Analytics
 */

import {
  experimentParams,
  type ABTestVariant,
} from '@/lib/abTesting/variantAssignment';
import { hasConsent } from '@/lib/cookieUtils';
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

/** `treatment_name` value when no treatment was chosen */
const NO_TREATMENT_LABEL = 'none';

/**
 * GA4's gtag, when a booking event may be sent: GA4 is loaded and the
 * visitor still consents (consent can be withdrawn mid-visit while GA4
 * stays loaded). Null otherwise.
 */
function bookingEventGtag(): NonNullable<Window['gtag']> | null {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
    return null;
  }
  return hasConsent() ? window.gtag : null;
}

function markGroupRecordedThisVisit(variant: ABTestVariant): void {
  try {
    sessionStorage.setItem(GROUP_RECORDED_KEY, variant);
  } catch {
    groupRecordedThisPageLoad = true;
  }
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
  const gtag = bookingEventGtag();
  if (!gtag) {
    return;
  }

  gtag('event', 'booking_button_clicked', {
    ...experimentParams(),
    context,
    treatment_name: treatmentName || NO_TREATMENT_LABEL,
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
  const gtag = bookingEventGtag();
  if (!gtag) {
    return;
  }

  gtag('event', 'booking_redirect', {
    ...experimentParams(),
    destination,
    context,
    treatment_name: treatmentName || NO_TREATMENT_LABEL,
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
export function trackBookingRequest(treatmentName?: string) {
  const gtag = bookingEventGtag();
  if (!gtag) {
    return;
  }

  gtag('event', 'booking_form_submitted', {
    ...experimentParams(),
    treatment_name: treatmentName || NO_TREATMENT_LABEL,
  });
}
