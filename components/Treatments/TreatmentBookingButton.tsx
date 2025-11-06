/**
 * @fileoverview Treatment booking button with A/B test support
 *
 * Client component that handles A/B testing logic for treatment booking CTAs.
 * Determines whether to direct users to the contact form (variant A) or
 * Fresha booking page (variant B) based on their assigned test variant.
 *
 * @author Claude Code
 * @version 1.0.0
 */

'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getClientBookingVariant, getBookingUrl, trackBookingClick, type BookingVariant } from '@/lib/ab-test';
import { SanityTreatment } from '@/lib/sanity/types';

interface TreatmentBookingButtonProps {
  /** Treatment data for booking */
  treatment: Pick<SanityTreatment, 'title' | 'freshaUrl'>;
  /** Button size variant */
  size?: 'default' | 'sm' | 'lg' | 'icon';
  /** Custom class name */
  className?: string;
  /** Button text */
  children?: React.ReactNode;
}

/**
 * Treatment booking button component with A/B test support
 *
 * This client component manages the A/B test logic for treatment bookings,
 * directing users to either the contact form or Fresha based on their variant.
 * It also tracks CTA clicks for analytics.
 *
 * @param props - Component props
 * @returns JSX element representing a booking button
 *
 * @example
 * ```typescript
 * <TreatmentBookingButton
 *   treatment={treatment}
 *   size="lg"
 *   className="w-full"
 * >
 *   Book This Treatment
 * </TreatmentBookingButton>
 * ```
 */
export default function TreatmentBookingButton({
  treatment,
  size = 'lg',
  className = 'w-full sm:w-auto bg-primary hover:bg-primary/90',
  children = 'Book This Treatment',
}: TreatmentBookingButtonProps) {
  const [bookingVariant, setBookingVariant] = useState<BookingVariant | null>(null);

  // Get A/B test variant on mount
  useEffect(() => {
    const variant = getClientBookingVariant();
    setBookingVariant(variant);
  }, []);

  // Get booking URL based on variant and treatment
  const bookingUrl = useMemo(
    () => getBookingUrl(treatment, bookingVariant),
    [treatment, bookingVariant]
  );

  // Handle booking CTA click with tracking
  const handleBookingClick = () => {
    if (bookingVariant) {
      trackBookingClick(bookingVariant, treatment.title, undefined, 'treatment_detail_page');
    }
  };

  return (
    <Button size={size} className={className} asChild>
      <Link href={bookingUrl} onClick={handleBookingClick}>
        {children}
      </Link>
    </Button>
  );
}
