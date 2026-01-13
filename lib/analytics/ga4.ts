/**
 * GA4 Analytics Tracking Utility
 *
 * Provides type-safe, consent-aware Google Analytics 4 tracking
 * with error handling and debug mode support.
 *
 * @module lib/analytics/ga4
 */

import { hasConsent } from '@/lib/cookieUtils';

// ============================================================================
// Types
// ============================================================================

/**
 * GA4 E-commerce item structure
 * @see https://developers.google.com/analytics/devguides/collection/ga4/ecommerce
 */
export interface GA4Item {
  item_id: string;
  item_name: string;
  item_category?: string;
  item_category2?: string;
  price?: number;
  quantity?: number;
  item_variant?: string;
}

/**
 * Treatment data for analytics tracking
 */
export interface TreatmentTrackingData {
  id: string;
  name: string;
  category?: string;
  price?: number;
}

/**
 * Scroll depth event data
 */
export interface ScrollEventData {
  percent_scrolled: number;
  page_path: string;
  page_title?: string;
}

/**
 * Outbound click event data
 */
export interface OutboundClickData {
  link_url: string;
  link_text?: string;
  link_domain: string;
}

/**
 * Form interaction event data
 */
export interface FormInteractionData {
  form_name: string;
  field_name?: string;
  interaction_type: 'focus' | 'blur' | 'error' | 'submit' | 'start';
  error_message?: string;
}

// ============================================================================
// Constants
// ============================================================================

/** Maximum length for link text in outbound click tracking */
const MAX_LINK_TEXT_LENGTH = 100;

// ============================================================================
// Configuration
// ============================================================================

/**
 * Check if debug mode is enabled via environment variable
 */
function isDebugMode(): boolean {
  return process.env.NEXT_PUBLIC_GA4_DEBUG === 'true';
}

/**
 * Check if running on server (SSR guard)
 */
function isServer(): boolean {
  return typeof window === 'undefined';
}

/**
 * Check if gtag is available
 */
function hasGtag(): boolean {
  return typeof window !== 'undefined' && typeof window.gtag === 'function';
}

// ============================================================================
// Core Tracking Function
// ============================================================================

/**
 * Core event tracking function with consent, error handling, and debug support
 *
 * @param eventName - GA4 event name
 * @param params - Event parameters
 */
export function trackEvent(
  eventName: string,
  params?: Record<string, unknown>
): void {
  // SSR guard
  if (isServer()) {
    return;
  }

  // Consent check
  if (!hasConsent()) {
    if (isDebugMode()) {
      console.log(`[GA4] Event blocked (no consent): ${eventName}`, params);
    }
    return;
  }

  // gtag availability check
  if (!hasGtag()) {
    if (isDebugMode()) {
      console.warn(`[GA4] gtag not available for event: ${eventName}`);
    }
    return;
  }

  // Track event with error handling
  try {
    window.gtag?.('event', eventName, params);
    if (isDebugMode()) {
      console.log(`[GA4] Event tracked: ${eventName}`, params);
    }
  } catch (error) {
    console.error(`[GA4] Error tracking event "${eventName}":`, error);
  }
}

// ============================================================================
// E-commerce Events
// ============================================================================

/**
 * Track when a user views a treatment detail page (view_item)
 *
 * @param treatment - Treatment data to track
 */
export function trackViewItem(treatment: TreatmentTrackingData): void {
  const item: GA4Item = {
    item_id: treatment.id,
    item_name: treatment.name,
    item_category: treatment.category,
    price: treatment.price,
    quantity: 1,
  };

  trackEvent('view_item', {
    currency: 'GBP',
    value: treatment.price ?? 0,
    items: [item],
  });
}

/**
 * Track when a user initiates the booking process (begin_checkout)
 *
 * @param treatment - Treatment being booked (optional)
 * @param context - Where the checkout was initiated from
 */
export function trackBeginCheckout(
  treatment?: TreatmentTrackingData,
  context?: string
): void {
  const items: GA4Item[] = treatment
    ? [
        {
          item_id: treatment.id,
          item_name: treatment.name,
          item_category: treatment.category,
          price: treatment.price,
          quantity: 1,
        },
      ]
    : [];

  trackEvent('begin_checkout', {
    currency: 'GBP',
    value: treatment?.price ?? 0,
    items,
    checkout_option: context,
  });
}

/**
 * Track when a booking is completed (purchase)
 *
 * @param transactionId - Unique transaction identifier
 * @param value - Total transaction value
 * @param treatment - Treatment that was booked (optional)
 * @param source - Booking source (form, fresha)
 */
export function trackPurchase(
  transactionId: string,
  value: number,
  treatment?: TreatmentTrackingData,
  source?: string
): void {
  const items: GA4Item[] = treatment
    ? [
        {
          item_id: treatment.id,
          item_name: treatment.name,
          item_category: treatment.category,
          price: treatment.price,
          quantity: 1,
        },
      ]
    : [];

  trackEvent('purchase', {
    currency: 'GBP',
    transaction_id: transactionId,
    value,
    items,
    booking_source: source,
  });
}

// ============================================================================
// Engagement Events
// ============================================================================

/**
 * Track scroll depth milestones
 *
 * @param data - Scroll event data
 */
export function trackScrollDepth(data: ScrollEventData): void {
  trackEvent('scroll_depth', {
    percent_scrolled: data.percent_scrolled,
    page_path: data.page_path,
    page_title: data.page_title,
  });
}

/**
 * Track clicks on outbound (external) links
 *
 * @param data - Outbound click data
 */
export function trackOutboundClick(data: OutboundClickData): void {
  trackEvent('outbound_click', {
    link_url: data.link_url,
    link_text: data.link_text?.slice(0, MAX_LINK_TEXT_LENGTH),
    link_domain: data.link_domain,
    outbound: true,
  });
}

/**
 * Track form field interactions
 *
 * @param data - Form interaction data
 */
export function trackFormInteraction(data: FormInteractionData): void {
  trackEvent('form_interaction', {
    form_name: data.form_name,
    field_name: data.field_name,
    interaction_type: data.interaction_type,
    error_message: data.error_message,
  });
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Generate a unique transaction ID for booking confirmations
 *
 * Uses crypto.randomUUID() for cryptographically secure random IDs.
 * Falls back to timestamp + crypto.getRandomValues for older environments.
 *
 * **Uniqueness guarantee**: IDs are probabilistically unique (collision probability
 * is astronomically low ~1 in 2^122 for UUID v4). For analytics purposes, this is
 * effectively guaranteed unique. Not suitable for database primary keys without
 * additional collision handling.
 *
 * @returns Transaction ID in format "booking_{uuid}" or "booking_{timestamp}_{hex}"
 *
 * @example
 * generateTransactionId() // => "booking_550e8400-e29b-41d4-a716-446655440000"
 */
export function generateTransactionId(): string {
  // Use crypto.randomUUID() if available (browser/Node 19+)
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `booking_${crypto.randomUUID()}`;
  }

  // Fallback: timestamp + crypto.getRandomValues for older environments
  // Provides ~64 bits of randomness + timestamp for uniqueness
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const timestamp = Date.now();
    const randomBytes = new Uint8Array(8);
    crypto.getRandomValues(randomBytes);
    const random = Array.from(randomBytes)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
    return `booking_${timestamp}_${random}`;
  }

  // Ultimate fallback for very old browsers or non-secure contexts
  // Uses Math.random() which is NOT cryptographically secure but sufficient for analytics
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `booking_${timestamp}_${random}`;
}

/**
 * Parse price string to number
 *
 * Validates decimal format to prevent edge cases like "£40.50.25"
 * from being parsed incorrectly.
 *
 * Supported formats:
 * - "£40" → 40
 * - "40" → 40
 * - "£40.50" → 40.5
 * - "40.50" → 40.5
 *
 * Invalid formats (returns undefined):
 * - "£40.50.25" (multiple decimals)
 * - "abc" (non-numeric)
 * - "" or undefined
 *
 * @param priceString - Price string in format "£XX", "£XX.XX", "XX", or "XX.XX"
 * @returns Numeric price value or undefined if invalid format
 *
 * @example
 * parsePrice("£40")      // => 40
 * parsePrice("40.50")    // => 40.5
 * parsePrice("£40.50.25") // => undefined (invalid)
 */
export function parsePrice(priceString?: string): number | undefined {
  if (!priceString) return undefined;

  // Remove currency symbols and whitespace
  const cleaned = priceString.replace(/[^0-9.]/g, '');

  // Validate format: must match valid decimal number (max one decimal point)
  // This prevents "40.50.25" from becoming "40.5025"
  if (!/^\d+(\.\d+)?$/.test(cleaned)) {
    return undefined;
  }

  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? undefined : parsed;
}

/**
 * Generate a consistent treatment ID from a treatment name
 *
 * Used as a fallback when actual treatment IDs are not available.
 * This centralizes the ID generation logic to ensure consistency
 * across BookingButton and BookingConfirmationTracker.
 *
 * @param treatmentName - The treatment name to convert to an ID
 * @returns A lowercase, underscore-separated ID prefixed with "treatment_"
 *
 * @example
 * generateTreatmentId("Deep Tissue Massage") // => "treatment_deep_tissue_massage"
 */
export function generateTreatmentId(treatmentName: string): string {
  return `treatment_${treatmentName.toLowerCase().replace(/\s+/g, '_')}`;
}
