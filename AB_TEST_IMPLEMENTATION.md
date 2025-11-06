# A/B Testing Implementation - Booking Flow Optimization

## Overview
This document describes the A/B testing system implemented to test conversion rates between the contact form (Variant A) and direct Fresha booking (Variant B).

## What Was Implemented

### 1. Sanity CMS Schema Update
- **File**: `sanity/schemas/treatment.ts`
- **Change**: Added `freshaUrl` field (optional URL) to treatment schema
- **Purpose**: Allows you to set treatment-specific Fresha booking URLs in Sanity Studio

### 2. TypeScript Types & Queries
- **Files**:
  - `lib/sanity/types.ts` - Updated `SanityTreatment` interface
  - `lib/sanity/queries.ts` - Updated all GROQ queries to fetch `freshaUrl`
- **Purpose**: Ensures type safety and data fetching includes the new field

### 3. Server-Side Middleware
- **File**: `middleware.ts` (new)
- **Purpose**: Assigns visitors to variant A or B on first visit
- **Features**:
  - 50/50 random split
  - Stores variant in cookie for 30 days
  - Can be enabled/disabled via environment variable
  - Fast, server-side execution (no client-side flicker)

### 4. A/B Test Utilities
- **File**: `lib/ab-test.ts` (new)
- **Functions**:
  - `getClientBookingVariant()` - Get user's assigned variant
  - `getBookingUrl()` - Determine correct URL based on variant
  - `trackBookingClick()` - Send GA4 events for analytics
  - `trackVariantAssignment()` - Track when variant is assigned

### 5. Updated Components
All booking CTAs now use A/B test logic:

#### a. Navbar Component (`components/Layout/Navbar.tsx`)
- Desktop & mobile "Book Now" buttons
- Links to contact form (variant A) or Fresha (variant B)
- Tracks clicks with location: `navbar`

#### b. Location & Booking Section (`components/Sections/LocationAndBooking.tsx`)
- "Contact Me & Book" button
- Tracks clicks with location: `location_booking_section`

#### c. Treatment Card (`components/Treatments/TreatmentCard.tsx`)
- "Book Now" button on each treatment card
- Uses treatment-specific Fresha URL if available
- Falls back to default Fresha URL
- Tracks clicks with location: `treatment_card`

#### d. Treatment Detail Page (`app/treatments/[categorySlug]/[treatmentSlug]/page.tsx`)
- Created new `TreatmentBookingButton` component
- "Book This Treatment" button
- Tracks clicks with location: `treatment_detail_page`

### 6. Environment Variables
- **File**: `.env.example`
- **New Variables**:
  ```bash
  # Enable/disable A/B testing (set to false to send all users to contact form)
  NEXT_PUBLIC_AB_TEST_ENABLED=true

  # Default Fresha URL (used when treatment doesn't have specific URL)
  NEXT_PUBLIC_DEFAULT_FRESHA_URL=https://www.fresha.com/book-now/heavenly-treatments-with-hayleybell-wvoyw0pw/all-offer?share=true&pId=2525483

  # Optional: Google Ads conversion tracking
  NEXT_PUBLIC_GOOGLE_ADS_ID=AW-XXXXXXXXX
  ```

## How It Works

### For Visitors:
1. **First Visit**: Middleware assigns them to variant A or B (50/50 split)
2. **Cookie Set**: `ab_booking_variant` cookie stored for 30 days
3. **Consistent Experience**: Same variant shown on all pages for 30 days
4. **Booking Click**: Redirected to contact form (A) or Fresha (B)

### For You (Analytics):
The system tracks these GA4 events:

1. **Variant Assignment** (`ab_test_assigned`)
   - Parameters: `variant`, `experiment_name`
   - Fired when user first assigned to A or B

2. **CTA Clicks** (`booking_cta_click`)
   - Parameters: `variant`, `treatment_name`, `destination`, `cta_location`
   - Fired on every booking button click
   - Location values: `navbar`, `location_booking_section`, `treatment_card`, `treatment_detail_page`

### GA4 Dashboard Views:
You can analyze:
- Traffic split between variants
- Click-through rate by variant
- Conversion rate by variant
- Which treatments perform better on each platform
- Which page locations drive most bookings

## Setup Instructions

### 1. Update Environment Variables
Create or update `.env.local`:
```bash
cp .env.example .env.local
# Edit .env.local and set:
NEXT_PUBLIC_AB_TEST_ENABLED=true
NEXT_PUBLIC_DEFAULT_FRESHA_URL=https://www.fresha.com/book-now/heavenly-treatments-with-hayleybell-wvoyw0pw/all-offer?share=true&pId=2525483
```

### 2. Update Sanity Studio
1. Push the schema changes to Sanity:
   ```bash
   npm run deploy
   ```
2. Open Sanity Studio: `https://yoursite.com/studio`
3. (Optional) Edit treatments to add specific Fresha booking URLs

### 3. Deploy to Production
The A/B test will automatically start working once deployed with the environment variables set.

### 4. Monitor in GA4
1. Go to Google Analytics 4
2. Navigate to Events
3. Look for:
   - `ab_test_assigned` - See variant distribution
   - `booking_cta_click` - See click patterns
4. Create custom reports comparing variants

## Testing the Implementation

### Test Variant Assignment:
1. Open site in incognito/private mode
2. Open browser dev tools → Application → Cookies
3. Look for `ab_booking_variant` cookie (value will be 'A' or 'B')
4. Click any booking button - verify it goes to correct destination:
   - Variant A → `/contact` page
   - Variant B → Fresha booking page

### Test Different Variants:
1. Open in one incognito window (might get variant A)
2. Open in another incognito window (might get variant B)
3. Verify different destinations

### Test Consistency:
1. Get assigned a variant
2. Navigate between pages
3. Verify all booking CTAs go to same destination

### Test Tracking:
1. Open browser dev tools → Network tab
2. Filter by "collect" (GA4 endpoint)
3. Click booking button
4. See `booking_cta_click` event in network requests

## Managing the A/B Test

### To Disable Test (Everyone Gets Contact Form):
```bash
NEXT_PUBLIC_AB_TEST_ENABLED=false
```

### To Change Split Ratio:
Edit `middleware.ts` line 38:
```typescript
// 50/50 split (default)
const variant = Math.random() < 0.5 ? 'A' : 'B';

// 80/20 split (80% form, 20% Fresha)
const variant = Math.random() < 0.8 ? 'A' : 'B';
```

### To Add Treatment-Specific Fresha URLs:
1. Go to Sanity Studio
2. Edit a treatment
3. Scroll to "Fresha Booking URL" field
4. Paste treatment-specific Fresha link
5. Save & publish

### To End Test & Choose Winner:
1. Analyze results in GA4
2. Update all components to remove A/B logic, hardcode winning variant
3. Or simply disable test and choose form or Fresha as default

## Files Modified/Created

### New Files (3):
- `middleware.ts`
- `lib/ab-test.ts`
- `components/Treatments/TreatmentBookingButton.tsx`

### Modified Files (9):
- `sanity/schemas/treatment.ts`
- `lib/sanity/types.ts`
- `lib/sanity/queries.ts`
- `components/Layout/Navbar.tsx`
- `components/Sections/LocationAndBooking.tsx`
- `components/Treatments/TreatmentCard.tsx`
- `app/treatments/[categorySlug]/[treatmentSlug]/page.tsx`
- `.env.example`

## Support & Questions

If you need to:
- Change tracking parameters
- Add more variants
- Track additional events
- Modify split ratios
- Add exclusions (e.g., don't test on certain pages)

Just let me know and I can help adjust the implementation!

## Next Steps

1. ✅ Set environment variables
2. ✅ Deploy to production
3. ✅ Verify tracking in GA4
4. ✅ Let test run for statistically significant sample size
5. ✅ Analyze results
6. ✅ Choose winner & implement permanently
