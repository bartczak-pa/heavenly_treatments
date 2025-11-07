# A/B Test Fresha Integration - Complete Implementation Guide

## Overview
Implement a 50/50 A/B test to compare Fresha booking system vs. current contact form. Users will be assigned to either:
- **Form Variant (Control):** Directs to `/contact` form
- **Fresha Variant (Test):** Directs to dedicated Fresha booking links

### Key Information
- **General Fresha URL:** `https://www.fresha.com/book-now/heavenly-treatments-with-hayleybell-wvoyw0pw/all-offer?share=true&pId=2525483`
- **Dedicated URL Format:** `https://www.fresha.com/book-now/heavenly-treatments-with-hayleybell-wvoyw0pw/services?lid=2607755&eid=4594462&oiid=sv%3A25270525&share=true&pId=2525483`
- **Duration:** Long-term test with `NEXT_PUBLIC_AB_TEST_ENABLED` env variable to disable when needed
- **Analytics:** Google Analytics 4 tracking
- **Fallback:** Missing Fresha URLs fall back to general URL, then contact form

---

## PHASE 1: Sanity Schema Updates

### Step 1.1: Update Treatment Schema
**File:** `sanity/schemas/treatment.ts`

After the `image` field definition (before the closing bracket of `fields` array), add:

```typescript
defineField({
  name: 'freshaUrl',
  title: 'Fresha Booking URL (Dedicated)',
  type: 'url',
  description: 'Direct Fresha booking link for this specific treatment. Optional - will fallback to general Fresha URL if empty.',
  validation: (Rule) => Rule.uri({
    scheme: ['http', 'https'],
  }),
}),
```

**Location in file:** After line containing `image` field definition

**Result:** Creates optional URL field in Sanity for each treatment

---

### Step 1.2: Create Site Settings Schema
**File:** `sanity/schemas/siteSettings.ts` (CREATE NEW FILE)

```typescript
import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'freshaGeneralUrl',
      title: 'Fresha General Booking URL',
      type: 'url',
      description: 'General Fresha URL used as fallback when dedicated treatment URLs are not set',
      validation: (Rule) => Rule.required().uri({
        scheme: ['http', 'https'],
      }),
    }),
    defineField({
      name: 'title',
      title: 'Site Title',
      type: 'string',
    }),
  ],
});
```

---

### Step 1.3: Register New Schema in Sanity Config
**File:** `sanity.config.ts`

Find the schema array/list and add `siteSettings` import and to the schema:

```typescript
// Add import at top with other schema imports
import siteSettings from './sanity/schemas/siteSettings';

// In the schema array/list, add:
schema.types.push(siteSettings);
```

---

## PHASE 2: Environment Configuration

### Step 2.1: Add Environment Variables
**File:** `.env.local` (UPDATE)

Add these lines:

```env
# Fresha Integration
NEXT_PUBLIC_FRESHA_GENERAL_URL=https://www.fresha.com/book-now/heavenly-treatments-with-hayleybell-wvoyw0pw/all-offer?share=true&pId=2525483
NEXT_PUBLIC_AB_TEST_ENABLED=true
```

---

### Step 2.2: Update Environment Types
**File:** `lib/env.ts` or `env.d.ts`

Ensure this interface includes the new variables:

```typescript
declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_FRESHA_GENERAL_URL: string;
    NEXT_PUBLIC_AB_TEST_ENABLED: string; // 'true' or 'false'
  }
}
```

---

## PHASE 3: Create A/B Test Utilities

### Step 3.1: Create Variant Assignment Utility
**File:** `lib/abTesting/variantAssignment.ts` (CREATE NEW FILE)

```typescript
/**
 * A/B Test Variant Assignment
 *
 * Handles 50/50 traffic split using consistent hashing.
 * User assignment is persisted via cookie to ensure consistent variant across sessions.
 */

type ABTestVariant = 'fresha' | 'form';

const VARIANT_COOKIE_NAME = 'ab_test_variant';
const VARIANT_COOKIE_MAX_AGE = 365 * 24 * 60 * 60; // 1 year in seconds

/**
 * Simple hash function for consistent assignment
 */
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Get user identifier (from cookie or generate new one)
 */
function getUserId(): string {
  if (typeof window === 'undefined') {
    return '';
  }

  // Try to get from existing cookie
  const cookies = document.cookie.split(';').map(c => c.trim());
  const variantCookie = cookies.find(c => c.startsWith(VARIANT_COOKIE_NAME + '='));

  if (variantCookie) {
    const value = variantCookie.split('=')[1];
    if (value.startsWith('user_')) {
      return value;
    }
  }

  // Generate new user ID
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Assign variant based on user ID
 */
function assignVariantFromId(userId: string): ABTestVariant {
  const hash = simpleHash(userId);
  return hash % 2 === 0 ? 'form' : 'fresha';
}

/**
 * Get or create variant assignment
 */
export function getVariantAssignment(): {
  variant: ABTestVariant;
  userId: string;
  cohort: 'control' | 'test';
} {
  if (typeof window === 'undefined') {
    return { variant: 'form', userId: '', cohort: 'control' };
  }

  const userId = getUserId();
  const variant = assignVariantFromId(userId);

  // Set cookie if not already set
  if (!document.cookie.includes(VARIANT_COOKIE_NAME + '=')) {
    const expires = new Date();
    expires.setSeconds(expires.getSeconds() + VARIANT_COOKIE_MAX_AGE);
    document.cookie = `${VARIANT_COOKIE_NAME}=${userId}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;
  }

  return {
    variant,
    userId,
    cohort: variant === 'form' ? 'control' : 'test',
  };
}

/**
 * Check if A/B test is enabled via environment variable
 */
export function isABTestEnabled(): boolean {
  return process.env.NEXT_PUBLIC_AB_TEST_ENABLED === 'true';
}
```

---

### Step 3.2: Create Booking URL Resolver
**File:** `lib/abTesting/getBookingUrl.ts` (CREATE NEW FILE)

```typescript
/**
 * Booking URL Resolution based on A/B test variant
 */

import { getVariantAssignment, isABTestEnabled } from './variantAssignment';

export type BookingContext =
  | 'navbar'
  | 'treatment-card'
  | 'treatment-detail'
  | 'location-section';

/**
 * Get the appropriate booking URL based on variant and context
 *
 * @param context - Where the booking button is located
 * @param treatmentTitle - Name of the treatment (optional, used for form variant)
 * @param freshaUrl - Dedicated Fresha URL for this treatment (optional)
 * @returns The booking URL to navigate to
 */
export function getBookingUrl(
  context: BookingContext,
  treatmentTitle?: string,
  freshaUrl?: string
): string {
  // If A/B test is disabled, always use form
  if (!isABTestEnabled()) {
    if (treatmentTitle) {
      return `/contact?treatment=${encodeURIComponent(treatmentTitle)}`;
    }
    return '/contact';
  }

  const { variant } = getVariantAssignment();
  const freshaGeneralUrl = process.env.NEXT_PUBLIC_FRESHA_GENERAL_URL;

  // FRESHA VARIANT
  if (variant === 'fresha') {
    // Prefer dedicated URL, fallback to general
    if (freshaUrl) {
      return freshaUrl;
    }
    return freshaGeneralUrl || '/contact'; // Ultimate fallback to form
  }

  // FORM VARIANT
  if (treatmentTitle) {
    return `/contact?treatment=${encodeURIComponent(treatmentTitle)}`;
  }
  return '/contact';
}

/**
 * Get variant assignment for use in client components
 */
export function useVariantForUrl() {
  return getVariantAssignment();
}
```

---

### Step 3.3: Create Analytics Tracking Utility
**File:** `lib/analytics/trackAbTest.ts` (CREATE NEW FILE)

```typescript
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
  if (typeof window === 'undefined' || !window.gtag) return;

  const { variant, userId, cohort } = getVariantAssignment();

  // Log variant assignment event
  window.gtag('event', 'ab_test_variant_assigned', {
    variant,
    cohort,
    user_id: userId,
  });

  // Set custom dimension for all subsequent events
  window.gtag('config', {
    'custom_map': {
      'dimension1': 'ab_test_variant',
      'dimension2': 'ab_test_cohort',
    }
  });

  window.gtag('event', 'page_view', {
    'ab_test_variant': variant,
    'ab_test_cohort': cohort,
  });
}

/**
 * Track when a Book Now button is clicked
 */
export function trackBookingButtonClick(
  context: BookingContext,
  treatmentName?: string
) {
  if (typeof window === 'undefined' || !window.gtag) return;

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
  if (typeof window === 'undefined' || !window.gtag) return;

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
  if (typeof window === 'undefined' || !window.gtag) return;

  const { variant } = getVariantAssignment();

  window.gtag('event', 'booking_form_submitted', {
    variant,
  });
}
```

---

## PHASE 4: Create Custom Hooks

### Step 4.1: Create A/B Test Variant Hook
**File:** `hooks/useAbTestVariant.ts` (CREATE NEW FILE)

```typescript
'use client';

import { useEffect, useState } from 'react';
import { getVariantAssignment, isABTestEnabled } from '@/lib/abTesting/variantAssignment';
import { trackVariantAssignment } from '@/lib/analytics/trackAbTest';

type Variant = 'fresha' | 'form';

interface VariantAssignment {
  variant: Variant;
  cohort: 'control' | 'test';
  isLoading: boolean;
}

/**
 * Hook for accessing the user's A/B test variant assignment
 *
 * Returns the variant assignment and tracks the assignment in analytics
 * Handles hydration safely
 */
export function useAbTestVariant(): VariantAssignment {
  const [assignment, setAssignment] = useState<VariantAssignment>({
    variant: 'form',
    cohort: 'control',
    isLoading: true,
  });

  useEffect(() => {
    if (!isABTestEnabled()) {
      setAssignment({
        variant: 'form',
        cohort: 'control',
        isLoading: false,
      });
      return;
    }

    const { variant, cohort } = getVariantAssignment();

    setAssignment({
      variant,
      cohort,
      isLoading: false,
    });

    // Track variant assignment once
    trackVariantAssignment();
  }, []);

  return assignment;
}
```

---

## PHASE 5: Create Booking Button Component

### Step 5.1: Create Reusable BookingButton Component
**File:** `components/BookingButton.tsx` (CREATE NEW FILE)

```typescript
'use client';

import React from 'react';
import Link from 'next/link';
import { Button, type ButtonProps } from '@/components/ui/button';
import { useAbTestVariant } from '@/hooks/useAbTestVariant';
import { getBookingUrl } from '@/lib/abTesting/getBookingUrl';
import { trackBookingButtonClick, trackBookingRedirect } from '@/lib/analytics/trackAbTest';
import type { BookingContext } from '@/lib/abTesting/getBookingUrl';

interface BookingButtonProps extends Omit<ButtonProps, 'asChild' | 'onClick'> {
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
 * Intelligently routes users to either Fresha or contact form based on A/B test variant.
 * Automatically tracks all booking interactions.
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
      trackBookingRedirect(isFresha ? 'fresha' : 'form', context, treatmentTitle);

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
```

---

## PHASE 6: Update Components

### Step 6.1: Update Navbar Component
**File:** `components/Layout/Navbar.tsx`

#### Step 6.1.1: Add Import
At the top of the file with other component imports, add:

```typescript
import { BookingButton } from '@/components/BookingButton';
```

#### Step 6.1.2: Update Desktop "Book Now" Button
Find the section around line 237 (in right navigation, fixed width container):

```typescript
// BEFORE:
<Button variant="default" size="lg" asChild>
  <Link href="/treatments">
    Book Now
  </Link>
</Button>

// AFTER:
<BookingButton context="navbar" variant="default" size="lg">
  Book Now
</BookingButton>
```

#### Step 6.1.3: Update Mobile "Book Now" Button
Find the MobileNavigationMenu component section around line 298:

```typescript
// BEFORE:
<Button variant="default" className="w-full" asChild>
  <Link href="/treatments">
    Book Now
  </Link>
</Button>

// AFTER:
<BookingButton context="navbar" variant="default" className="w-full">
  Book Now
</BookingButton>
```

---

### Step 6.2: Update TreatmentCard Component
**File:** `components/Treatments/TreatmentCard.tsx`

#### Step 6.2.1: Add Import
At the top with other imports:

```typescript
import { BookingButton } from '@/components/BookingButton';
```

#### Step 6.2.2: Update Treatment Type
The Treatment interface needs to include freshaUrl. If fetching from Sanity, ensure the query includes this field. If using local data, update `lib/data/treatments.ts` Treatment interface:

```typescript
export interface Treatment {
    id: string;
    title: string;
    slug: string;
    description: string;
    image: string;
    imageWidth?: number;
    imageHeight?: number;
    duration: string;
    price: string;
    keyFeatures?: string[];
    category: TreatmentCategorySlug;
    freshaUrl?: string; // ADD THIS LINE
}
```

#### Step 6.2.3: Remove Old contactHref
Find and remove this line (around line 50):

```typescript
// DELETE THIS LINE:
const contactHref: string = `/contact?treatment=${encodeURIComponent(treatment.title)}`;
```

#### Step 6.2.4: Update Book Now Button
Find the CardFooter section with the Button (around line 79):

```typescript
// BEFORE:
<Button asChild variant="secondary" size="sm">
  <Link href={contactHref}>Book Now</Link>
</Button>

// AFTER:
<BookingButton
  context="treatment-card"
  treatmentTitle={treatment.title}
  freshaUrl={treatment.freshaUrl}
  variant="secondary"
  size="sm"
>
  Book Now
</BookingButton>
```

---

### Step 6.3: Update Treatment Detail Page
**File:** `app/treatments/[categorySlug]/[treatmentSlug]/page.tsx`

#### Step 6.3.1: Add Import
Add near the top with other imports:

```typescript
import { BookingButton } from '@/components/BookingButton';
```

#### Step 6.3.2: Remove Old contactHref
Find and remove this line (around line 33):

```typescript
// DELETE THIS LINE:
const contactHref = `/contact?treatment=${encodeURIComponent(treatment.title)}`;
```

#### Step 6.3.3: Update Book Button
Find the button in the treatment details section (around line 100):

```typescript
// BEFORE:
<Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90" asChild>
  <Link href={contactHref}>
    Book This Treatment
  </Link>
</Button>

// AFTER:
<BookingButton
  context="treatment-detail"
  treatmentTitle={treatment.title}
  freshaUrl={treatment.freshaUrl}
  size="lg"
  className="w-full sm:w-auto bg-primary hover:bg-primary/90"
>
  Book This Treatment
</BookingButton>
```

---

### Step 6.4: Update LocationAndBooking Section
**File:** `components/Sections/LocationAndBooking.tsx`

#### Step 6.4.1: Add Import
Add with other imports:

```typescript
import { BookingButton } from '@/components/BookingButton';
```

#### Step 6.4.2: Update Button
Find the button in the section (around line 70):

```typescript
// BEFORE:
<Button asChild variant="default" size="lg">
  <Link href={CONTENT.buttonHref}>{CONTENT.buttonText}</Link>
</Button>

// AFTER:
<BookingButton
  context="location-section"
  variant="default"
  size="lg"
>
  {CONTENT.buttonText}
</BookingButton>
```

---

## PHASE 7: Google Analytics Setup

### Step 7.1: Create GA4 Custom Event Configuration
**File:** `lib/analytics/gaConfig.ts` (CREATE NEW FILE)

```typescript
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

  // Register custom dimension for A/B test variant
  // (You'll need to set up these custom dimensions in GA4 dashboard first)
  window.gtag('config', 'G_YOUR_MEASUREMENT_ID', {
    'custom_map': {
      'dimension1': 'ab_test_variant',
      'dimension2': 'ab_test_cohort',
      'dimension3': 'booking_context',
    }
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
```

---

### Step 7.2: Setup Google Analytics Dashboard Configuration

#### Manual Steps in GA4 Dashboard:

**1. Create Custom Dimensions:**
- Go to: Admin → Custom definitions → Custom dimensions
- Click "Create custom dimension"
- Create these 3 dimensions:
  - **Dimension 1:**
    - Name: `ab_test_variant`
    - Description: `A/B test variant (fresha or form)`
    - Scope: Event
  - **Dimension 2:**
    - Name: `ab_test_cohort`
    - Description: `A/B test cohort (control or test)`
    - Scope: Event
  - **Dimension 3:**
    - Name: `booking_context`
    - Description: `Context where booking was initiated`
    - Scope: Event

**2. Create Conversion Goals:**
- Go to: Admin → Conversions
- Click "New conversion event"
- Create these conversion events:
  - **Event name:** `booking_button_clicked`
  - **Event name:** `booking_redirect`
  - **Event name:** `booking_form_submitted`

**3. Create Custom Report for A/B Testing:**
- Go to: Explore → Blank Exploration
- Set up dimensions and metrics:
  - **Dimensions:** `ab_test_variant`, `booking_context`, `Event name`
  - **Metrics:** `Event count`, `Conversion rate`, `Session duration`
- Save as report: "A/B Test: Fresha vs Form"

---

## PHASE 8: Fetch Fresha URLs from Sanity

### Step 8.1: Create CMS Query for Treatment with Fresha URL
**File:** `lib/cms/treatments.ts` (UPDATE - add these functions at the end)

```typescript
/**
 * Fetch single treatment with Fresha URL
 */
export async function getTreatmentWithFreshaUrl(slug: string) {
  const query = `
    *[_type == "treatment" && slug.current == $slug][0] {
      ...,
      "freshaUrl": freshaUrl,
    }
  `;

  const treatment = await client.fetch(query, { slug });
  return treatment;
}

/**
 * Fetch general Fresha URL from site settings
 */
export async function getGeneralFreshaUrl() {
  const query = `*[_type == "siteSettings"][0].freshaGeneralUrl`;
  const url = await client.fetch(query);
  return url;
}
```

---

### Step 8.2: Update Treatment Detail Page to Fetch Fresha URL
**File:** `app/treatments/[categorySlug]/[treatmentSlug]/page.tsx`

If pulling from Sanity CMS, update the import:

```typescript
// UPDATE import from:
import { getTreatmentBySlug, ... } from '@/lib/cms/treatments';

// TO:
import { getTreatmentWithFreshaUrl, ... } from '@/lib/cms/treatments';
```

Then update the fetch call in the component:

```typescript
// BEFORE:
const treatment = await getTreatmentBySlug(treatmentSlug);

// AFTER:
const treatment = await getTreatmentWithFreshaUrl(treatmentSlug);
```

---

## PHASE 9: Testing Checklist

### Step 9.1: Local Testing

**Variant Assignment Testing:**
- [ ] Clear all cookies in browser
- [ ] Refresh page
- [ ] Open DevTools → Application → Cookies → localhost
- [ ] Check that `ab_test_variant` cookie is set
- [ ] Reload page multiple times
- [ ] Verify cookie value stays the same (persists)
- [ ] Create new private/incognito window
- [ ] Verify different variant is assigned (50/50 split across windows)

**Button Functionality Testing:**
- [ ] Test navbar desktop "Book Now" button → should redirect correctly
- [ ] Test navbar mobile "Book Now" button → should redirect correctly
- [ ] Test treatment card "Book Now" button → should redirect correctly
- [ ] Test treatment detail page "Book This Treatment" button → should redirect correctly
- [ ] Test LocationAndBooking section "Contact Me & Book" button → should redirect correctly

**Analytics Testing:**
- [ ] Open DevTools → Console
- [ ] Click any "Book Now" button
- [ ] Check console for GA events (look for `gtag` calls)
- [ ] Expected events: `ab_test_variant_assigned`, `booking_button_clicked`, `booking_redirect`

### Step 9.2: Environment Variable Testing

```bash
# Test with A/B test ENABLED
NEXT_PUBLIC_AB_TEST_ENABLED=true npm run dev

# Navigate to site
# Click buttons - should split 50/50 between Fresha and form

# Test with A/B test DISABLED
NEXT_PUBLIC_AB_TEST_ENABLED=false npm run dev

# Navigate to site
# Click buttons - all should go to /contact form (or treatment-specific contact)
```

### Step 9.3: Build & Production Testing

```bash
# Build production version
npm run build

# Run production server
npm run start

# Navigate to http://localhost:3000
# Run through all button functionality tests above
# Verify no console errors
```

### Step 9.4: Sanity Data Testing

- [ ] Go to Sanity Studio at `/studio`
- [ ] Edit a treatment document
- [ ] Scroll to "Fresha Booking URL (Dedicated)" field
- [ ] Paste a dedicated Fresha URL
- [ ] Save the treatment
- [ ] Go to treatment detail page on website
- [ ] If assigned to Fresha variant, should use dedicated URL
- [ ] If assigned to Form variant, should use contact form

---

## PHASE 10: Sanity Deployment

### Step 10.1: Deploy Schema Changes
After completing schema updates in steps 1.1-1.3, deploy to Sanity:

```bash
npm run sanity:deploy
```

This syncs your schema changes to Sanity production.

---

## PHASE 11: Analytics Monitoring

### Step 11.1: First 24 Hours
- [ ] Check GA4 Real-time report
  - Go to: Reports → Realtime
  - Look for incoming events
  - Verify minimum 50+ events
- [ ] Verify variant distribution
  - Check that roughly 50% of users are in each variant
  - Look at `ab_test_variant` dimension values
- [ ] Check for JavaScript errors
  - Open DevTools → Console on live site
  - No red errors should appear
- [ ] Verify Fresha URLs are working
  - Click a button assigned to Fresha variant
  - Should redirect to Fresha booking page without errors

### Step 11.2: First Week
- [ ] Daily check of variant distribution (should maintain ~50/50)
- [ ] Monitor form submission rate (Contact page)
- [ ] Check for unusual traffic patterns
- [ ] Verify clicks are being recorded for both variants
- [ ] Create spreadsheet to track metrics:
  ```
  Day | Fresha Clicks | Form Clicks | Form Submissions | Notes
  ----|---------------|-------------|------------------|------
  ```

### Step 11.3: Weekly Analysis (Weeks 2-4)
Create a comparison analysis with:

```
Metric                | Form Variant  | Fresha Variant | Difference
----------------------|---------------|----------------|----------
Total Clicks          | X             | Y              | Y-X
Form Submissions      | Z             | 0              | -Z
Submission Rate       | Z/X %         | 0%             | -Z/X %
Bounce Rate           | %             | %              | Diff %
Avg Session Duration  | sec           | sec            | Diff sec
```

### Step 11.4: Decision & Next Steps
After 2-4 weeks:

**If Fresha is winning:**
- Keep `NEXT_PUBLIC_AB_TEST_ENABLED=true` in production
- Remove form variant (disable test)
- Document findings

**If Form is winning:**
- Set `NEXT_PUBLIC_AB_TEST_ENABLED=false` in Vercel environment variables
- Keep implementation for future testing
- Document findings

**If results are tied:**
- Run for additional 2 weeks
- Analyze by device type, traffic source, time of day
- Consider hypothesis adjustment

---

## Quick Reference: Files Summary

### New Files to Create
| File | Description |
|------|------------|
| `lib/abTesting/variantAssignment.ts` | Handles variant assignment & persistence |
| `lib/abTesting/getBookingUrl.ts` | Resolves booking URLs based on variant |
| `lib/analytics/trackAbTest.ts` | GA4 event tracking |
| `lib/analytics/gaConfig.ts` | GA4 custom properties setup |
| `hooks/useAbTestVariant.ts` | React hook for variant access |
| `components/BookingButton.tsx` | Reusable booking button component |
| `sanity/schemas/siteSettings.ts` | Sanity site settings schema |

### Files to Modify
| File | Changes |
|------|---------|
| `sanity/schemas/treatment.ts` | Add freshaUrl field |
| `sanity.config.ts` | Register siteSettings schema |
| `.env.local` | Add Fresha URLs & test flag |
| `lib/env.ts` or `env.d.ts` | Add env variable types |
| `components/Layout/Navbar.tsx` | Replace buttons with BookingButton |
| `components/Treatments/TreatmentCard.tsx` | Replace buttons with BookingButton |
| `app/treatments/[...]/page.tsx` | Replace buttons with BookingButton |
| `components/Sections/LocationAndBooking.tsx` | Replace buttons with BookingButton |
| `lib/cms/treatments.ts` | Add Fresha URL fetch queries |

---

## Important Notes

1. **Sanity Deployment Required:** Run `npm run sanity:deploy` after schema updates
2. **Cookie Persistence:** Variant assignment persists for 1 year (365 days)
3. **Fallback Logic:** Missing Fresha URLs fall back to general URL → contact form
4. **Disable Test Anytime:** Set `NEXT_PUBLIC_AB_TEST_ENABLED=false` to disable
5. **GA4 Configuration:** Custom dimensions must be set up in GA4 dashboard manually
6. **Hydration Safety:** BookingButton prevents hydration mismatch with loading state
7. **Performance:** A/B test adds ~1KB gzipped overhead

---

## Support & Troubleshooting

### Common Issues

**Q: Users seeing different variants on page reload**
- A: Ensure VARIANT_COOKIE_NAME constant matches (line in variantAssignment.ts)
- Check browser cookie settings allow SameSite=Lax

**Q: Analytics events not appearing**
- A: Verify GA4 measurement ID is set correctly
- Check GA4 DebugView is enabled for testing
- Ensure gtag script is loaded before custom events

**Q: Fresha URLs not being used**
- A: Verify freshaUrl field exists in Sanity treatment document
- Check that NEXT_PUBLIC_FRESHA_GENERAL_URL is set in env
- Ensure BookingButton component is used (not old Link components)

**Q: How to run the test longer or shorter**
- A: Test duration is controlled by when you set `NEXT_PUBLIC_AB_TEST_ENABLED=false`
- No code changes needed - just environment variable change

---

End of Implementation Guide
