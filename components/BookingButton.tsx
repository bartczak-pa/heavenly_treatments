'use client';

import React from 'react';
import Link from 'next/link';
import { Button, type ButtonProps } from '@/components/ui/button';
import { useAbTestVariant } from '@/hooks/useAbTestVariant';
import { getBookingUrl } from '@/lib/abTesting/getBookingUrl';
import {
  trackBookingButtonClick,
  trackBookingRedirect,
} from '@/lib/analytics/trackAbTest';
import type { BookingContext } from '@/lib/abTesting/getBookingUrl';

interface BookingButtonProps
  extends Omit<ButtonProps, 'asChild' | 'onClick'> {
  /** Context where the booking button is used */
  context: BookingContext;
  /** Treatment name for analytics and form prefill */
  treatmentTitle?: string;
  /** Dedicated Fresha URL for this treatment */
  freshaUrl?: string;
  /** Custom onClick handler (optional, runs after tracking) */
  onClick?: () => void;
  /** Button text/children */
  children?: React.ReactNode;
}

/**
 * Booking Button Component
 *
 * Intelligently routes users to either Fresha or contact form based on
 * A/B test variant. Automatically tracks all booking interactions.
 *
 * @example
 * ```tsx
 * <BookingButton
 *   context="treatment-card"
 *   treatmentTitle="Swedish Massage"
 *   freshaUrl="https://..."
 * >
 *   Book Now
 * </BookingButton>
 * ```
 */
export const BookingButton = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  BookingButtonProps
>(
  (
    {
      context,
      treatmentTitle,
      freshaUrl,
      onClick,
      children = 'Book Now',
      variant = 'default',
      size = 'sm',
      ...props
    },
    ref
  ) => {
    const { variant: testVariant, isLoading } = useAbTestVariant();
    const bookingUrl = getBookingUrl(context, treatmentTitle, freshaUrl);

    // Determine if this is Fresha variant based on URL
    const isFresha = bookingUrl.includes('fresha.com');

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      // Track button click
      trackBookingButtonClick(context, treatmentTitle);

      // Track redirect destination
      trackBookingRedirect(
        isFresha ? 'fresha' : 'form',
        context,
        treatmentTitle
      );

      // Call custom onClick if provided
      if (onClick) {
        onClick();
      }
    };

    // Show placeholder while hydrating (avoid hydration mismatch)
    if (isLoading) {
      return (
        <Button variant={variant} size={size} disabled {...props}>
          {children}
        </Button>
      );
    }

    return (
      <Button asChild variant={variant} size={size} {...props}>
        <Link href={bookingUrl} onClick={handleClick}>
          {children}
        </Link>
      </Button>
    );
  }
);

BookingButton.displayName = 'BookingButton';
