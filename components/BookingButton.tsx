'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import type { VariantProps } from 'class-variance-authority';
import { buttonVariants } from '@/components/ui/button';
import { useAbTestVariant } from '@/hooks/useAbTestVariant';
import { getBookingUrl } from '@/lib/abTesting/getBookingUrl';
import {
  trackBookingButtonClick,
  trackBookingRedirect,
} from '@/lib/analytics/trackAbTest';
import { trackBeginCheckout, parsePrice } from '@/lib/analytics/ga4';
import type { BookingContext } from '@/lib/abTesting/getBookingUrl';

interface BookingButtonProps
  extends VariantProps<typeof buttonVariants> {
  /** Context where the booking button is used */
  context: BookingContext;
  /** Treatment name for analytics and form prefill */
  treatmentTitle?: string;
  /** Dedicated Fresha URL for this treatment */
  freshaUrl?: string;
  /** Treatment ID for e-commerce tracking (optional) */
  treatmentId?: string;
  /** Treatment category for e-commerce tracking (optional) */
  treatmentCategory?: string;
  /** Treatment price for e-commerce tracking (optional, string format like "£40") */
  treatmentPrice?: string;
  /** Custom onClick handler (optional, runs after tracking) */
  onClick?: () => void;
  /** Button text/children */
  children?: React.ReactNode;
  /** CSS class name */
  className?: string;
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
      treatmentId,
      treatmentCategory,
      treatmentPrice,
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
      // Track button click (existing A/B test tracking)
      trackBookingButtonClick(context, treatmentTitle);

      // Track redirect destination (existing A/B test tracking)
      trackBookingRedirect(
        isFresha ? 'fresha' : 'form',
        context,
        treatmentTitle
      );

      // Track begin_checkout for e-commerce (new GA4 tracking)
      if (treatmentTitle) {
        trackBeginCheckout(
          {
            id: treatmentId || `treatment_${treatmentTitle.toLowerCase().replace(/\s+/g, '_')}`,
            name: treatmentTitle,
            category: treatmentCategory,
            price: parsePrice(treatmentPrice),
          },
          `${isFresha ? 'fresha' : 'form'}_${context}`
        );
      }

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
