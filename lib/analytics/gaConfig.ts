/**
 * Google Analytics 4 Configuration
 *
 * Sets up custom dimensions and events for A/B test tracking
 */

/**
 * Initialize custom dimensions and metrics in GA4
 *
 * This function should be called once during app initialization
 * or after GA script loads
 */
export function initializeGACustomProperties() {
  if (typeof window === 'undefined' || !window.gtag) return;

  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (!measurementId) {
    console.warn(
      'GA4 Measurement ID not configured. ' +
      'Set NEXT_PUBLIC_GA_MEASUREMENT_ID in environment variables.'
    );
    return;
  }

  // Register custom dimension for A/B test variant
  // (Custom dimensions must be set up in GA4 dashboard first)
  window.gtag('config', measurementId, {
    custom_map: {
      dimension1: 'ab_test_variant',
      dimension2: 'ab_test_cohort',
      dimension3: 'booking_context',
    },
  });
}

/**
 * GA4 Event Names
 */
export const GA_EVENTS = {
  VARIANT_ASSIGNED: 'ab_test_variant_assigned',
  BUTTON_CLICKED: 'booking_button_clicked',
  REDIRECT: 'booking_redirect',
  FORM_SUBMITTED: 'booking_form_submitted',
  PAGE_VIEW: 'page_view',
} as const;
