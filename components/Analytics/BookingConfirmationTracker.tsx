'use client';

/**
 * Booking Confirmation Tracker Component
 *
 * Client component that tracks purchase/conversion events on the
 * booking confirmation page. Reads treatment data from URL parameters.
 *
 * @module components/Analytics/BookingConfirmationTracker
 */

import { useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  trackPurchase,
  generateTransactionId,
  parsePrice,
} from '@/lib/analytics/ga4';

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
  const hasTracked = useRef(false);

  useEffect(() => {
    // Prevent duplicate tracking on re-renders
    if (hasTracked.current) {
      return;
    }

    // Mark as tracked immediately
    hasTracked.current = true;

    // Extract treatment data from URL params
    const treatmentName = searchParams.get('treatment');
    const priceParam = searchParams.get('price');
    const category = searchParams.get('category');
    const source = searchParams.get('source') || 'form';

    // Parse price from URL param
    const price = parsePrice(priceParam ?? undefined) ?? 0;

    // Generate unique transaction ID
    const transactionId = generateTransactionId();

    // Build treatment data if we have a name
    const treatmentData = treatmentName
      ? {
          id: `treatment_${treatmentName.toLowerCase().replace(/\s+/g, '_')}`,
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
