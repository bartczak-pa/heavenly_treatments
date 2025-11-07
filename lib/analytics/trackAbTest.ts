/**
 * A/B Test Analytics Tracking
 *
 * Tracks experiment events in Google Analytics
 */

import { getVariantAssignment } from '@/lib/abTesting/variantAssignment';
import type { BookingContext } from '@/lib/abTesting/getBookingUrl';

/**
 * Track when variant is assigned (fires once per unique user)
 */
export function trackVariantAssignment() {
  if (typeof window === 'undefined') {
    return;
  }
  if (!window.gtag) {
    return;
  }

  const { variant, userId, cohort } = getVariantAssignment();

  window.gtag('event', 'ab_test_variant_assigned', {
    ab_test_variant: variant,
    ab_test_cohort: cohort,
    user_id: userId,
  });

  window.gtag('event', 'page_view', {
    ab_test_variant: variant,
    ab_test_cohort: cohort,
  });
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

  const { variant } = getVariantAssignment();

  window.gtag('event', 'booking_button_clicked', {
    variant,
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

  const { variant } = getVariantAssignment();

  window.gtag('event', 'booking_redirect', {
    variant,
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

  const { variant } = getVariantAssignment();

  window.gtag('event', 'booking_form_submitted', {
    variant,
  });
}
