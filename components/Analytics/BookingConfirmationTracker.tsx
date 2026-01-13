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

import { useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  trackPurchase,
  generateTransactionId,
  parsePrice,
  generateTreatmentId,
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
  // In-memory guard for React 18 Strict Mode race condition
  // This ref persists across the double-render but resets on actual re-mounts
  const hasTrackedRef = useRef(false);

  useEffect(() => {
    // First check: in-memory guard (prevents race condition in Strict Mode)
    if (hasTrackedRef.current) {
      return;
    }

    // Create a unique key based on URL params to prevent duplicate tracking
    const paramsKey = searchParams.toString();
    const trackingKey = `${TRACKING_KEY_PREFIX}${paramsKey}`;

    // Second check: sessionStorage (prevents duplicates across page refreshes)
    try {
      if (sessionStorage.getItem(trackingKey)) {
        hasTrackedRef.current = true;
        return;
      }
    } catch {
      // sessionStorage not available (SSR or private browsing)
      // Continue to track - in-memory guard still protects against double-render
    }

    // Mark as tracked in both guards
    hasTrackedRef.current = true;
    try {
      sessionStorage.setItem(trackingKey, 'true');
    } catch {
      // Ignore sessionStorage errors - in-memory guard is sufficient for this session
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
          id: treatmentId || generateTreatmentId(treatmentName),
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
