'use client';

/**
 * Booking Confirmation Tracker Component
 *
 * Client component that tracks purchase/conversion events on the
 * booking confirmation page. Reads treatment data from URL parameters.
 *
 * Uses sessionStorage for deduplication to handle React 18 Strict Mode
 * (where effects run twice in development).
 *
 * @module components/Analytics/BookingConfirmationTracker
 */

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  trackPurchase,
  generateTransactionId,
  parsePrice,
} from '@/lib/analytics/ga4';

/** Session storage key for tracking deduplication */
const TRACKING_KEY_PREFIX = 'booking_tracked_';

/**
 * Client component for tracking booking confirmations as purchases.
 *
 * Reads URL parameters to get treatment information:
 * - ?treatment=Treatment+Name
 * - ?price=40
 * - ?category=massages
 * - ?source=form
 *
 * @example
 * ```tsx
 * // In app/booking-confirmation/page.tsx
 * import { Suspense } from 'react';
 * import { BookingConfirmationTracker } from '@/components/Analytics/BookingConfirmationTracker';
 *
 * export default function BookingConfirmationPage() {
 *   return (
 *     <>
 *       <Suspense fallback={null}>
 *         <BookingConfirmationTracker />
 *       </Suspense>
 *       {/* Rest of page content *\/}
 *     </>
 *   );
 * }
 * ```
 */
export function BookingConfirmationTracker() {
  const searchParams = useSearchParams();

  useEffect(() => {
    // Create a unique key based on URL params to prevent duplicate tracking
    // This handles React 18 Strict Mode where effects run twice in dev
    const paramsKey = searchParams.toString();
    const trackingKey = `${TRACKING_KEY_PREFIX}${paramsKey}`;

    // Check if we've already tracked this specific booking
    try {
      if (sessionStorage.getItem(trackingKey)) {
        return;
      }
      // Mark as tracked immediately
      sessionStorage.setItem(trackingKey, 'true');
    } catch {
      // sessionStorage not available (SSR or private browsing)
      // Fall through to track anyway - better to double-track than not track
    }

    // Extract treatment data from URL params
    const treatmentName = searchParams.get('treatment');
    const treatmentId = searchParams.get('treatmentId');
    const priceParam = searchParams.get('price');
    const category = searchParams.get('category');
    const source = searchParams.get('source') || 'form';

    // Parse price from URL param
    const price = parsePrice(priceParam ?? undefined) ?? 0;

    // Generate unique transaction ID
    const transactionId = generateTransactionId();

    // Build treatment data if we have a name
    // Use actual treatmentId if available, fallback to name-based ID for backwards compatibility
    const treatmentData = treatmentName
      ? {
          id: treatmentId || `treatment_${treatmentName.toLowerCase().replace(/\s+/g, '_')}`,
          name: treatmentName,
          category: category ?? undefined,
          price,
        }
      : undefined;

    // Track the purchase event
    trackPurchase(transactionId, price, treatmentData, source);
  }, [searchParams]);

  // This component renders nothing - it only provides tracking functionality
  return null;
}
