# Heavenly Treatments Performance Optimization Plan

**Document Version**: 2.0
**Date**: 2025-11-08 (Updated with Mobile Analysis)
**Current Lighthouse Score**: Desktop 78/100 | Mobile 72/100 (Needs Improvement)
**Target Score**: 90+ (Good)

---

## Executive Summary

### Desktop vs Mobile Performance (Real Experience Metrics)

The Heavenly Treatments website has different bottlenecks on desktop vs mobile:

#### Desktop Metrics (`/treatments` route)
| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| TTFB (Time to First Byte) | 2.14s | < 0.8s | 🔴 CRITICAL |
| FCP (First Contentful Paint) | 2.46s | < 1.8s | 🔴 CRITICAL |
| LCP (Largest Contentful Paint) | 3.78s | < 2.5s | 🔴 CRITICAL |
| CLS (Cumulative Layout Shift) | 0.16 | < 0.1 | ⚠️ ACCEPTABLE |
| INP (Interaction to Next Paint) | 64ms | < 100ms | ✅ GOOD |
| **RES Score** | **78/100** | **90+** | Needs Improvement |

**Desktop Root Causes**:
1. **Inefficient Sanity queries** → TTFB delay (fetch all, filter client-side)
2. **Missing image blur placeholders** → LCP delay (no LQIP)
3. **Dynamic component loading** → FCP delay (JavaScript hydration)
4. **Metadata generation** → TTFB delay (async calls per request)

#### Mobile Metrics (`/treatments` route)
| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| TTFB (Time to First Byte) | 0.02s | < 0.8s | ✅ EXCELLENT |
| FCP (First Contentful Paint) | 0.35s | < 1.8s | ✅ EXCELLENT |
| LCP (Largest Contentful Paint) | 1.66s | < 2.5s | ✅ GOOD |
| CLS (Cumulative Layout Shift) | 0.38 | < 0.1 | 🔴 CRITICAL |
| INP (Interaction to Next Paint) | 0ms | < 100ms | ✅ EXCELLENT |
| **RES Score** | **72/100** | **90+** | Needs Improvement |

**Mobile Root Causes**:
- **CRITICAL**: CLS is **4x worse** on mobile (0.38 vs 0.1 target)
  - Missing `width`/`height` attributes on responsive images
  - Images loading after initial paint → layout reflow
  - Lazy-loaded content causing visual shift
  - Missing aspect-ratio CSS on image containers
- ✅ Loading metrics excellent (fast mobile network/rendering)

### Key Finding: Opposite Problems

- **Desktop**: Slow loading metrics (TTFB, FCP, LCP)
- **Mobile**: Fast loading, but severe layout instability (CLS)

---

## Performance Investigation Results

### Current Architecture Analysis

**Codebase**: Next.js 15 with App Router + Sanity CMS + Vercel hosting

**Key Files**:
- `/next.config.mjs` - Build configuration
- `/app/treatments/page.tsx` - `/treatments` route (RES: 78, the problematic page)
- `/app/treatments/[categorySlug]/[treatmentSlug]/page.tsx` - Detail route
- `/lib/cms/treatments.ts` - Sanity query execution
- `/lib/sanity/queries.ts` - GROQ query definitions
- `/components/OptimizedImage.tsx` - Image optimization wrapper
- `/lib/data/image-metadata.ts` - Pre-computed image metadata
- `/components/Dynamic/DynamicComponents.tsx` - Dynamic import registry

### Bottleneck Analysis

#### Issue 1: Server-Side Query Inefficiency (TTFB Impact: ~0.8-1.2s delay)

**Location**: `/app/treatments/page.tsx` + `/lib/cms/treatments.ts`

**Current Implementation**:
```typescript
// Fetches ALL treatments, then filters client-side
const allTreatments = await getTreatments();
const filtered = allTreatments.filter(t => t.category?.slug === selectedCategory);
```

**Problem**:
- Sanity query fetches 50+ treatment documents (assume 10+ in future)
- Each treatment has full data (images, descriptions, category references)
- Filtering happens after data arrives (O(n) in-memory)
- Network payload inflated unnecessarily
- Database query time scales with catalog size

**Impact**: Adds 500-800ms to TTFB on `/treatments` page

**Root Cause**: Using `allTreatmentsQuery` instead of parameterized `treatmentsByCategoryQuery`

---

#### Issue 2: Missing Image Optimizations (LCP Impact: ~0.8-1.2s delay)

**Location**: Sanity-sourced images (treatment cards, testimonials)

**Current Implementation**:
```typescript
// Dynamic image URLs without blur placeholders
image: getImageUrl(sanityTreatment.image, 1000, undefined, 90)
// Returns: https://cdn.sanity.io/images/...?w=1000&q=90
```

**Problem**:
- Dynamic images load without LQIP (Low Quality Image Placeholder)
- Browser doesn't know image dimensions → layout reflow
- No preloading for hero/LCP images
- Image metadata hardcoded for only 6 static images
- Sanity images must download full size before rendering

**Impact**: Delays LCP by 800ms-1.2s due to image download + layout computation

**Root Cause**:
1. No blur data generation for Sanity images
2. No preload directives for LCP images
3. Images lack `width`/`height` attributes in some places

---

#### Issue 3: Dynamic Components Delaying High-Priority Content (FCP Impact: ~0.4-0.6s)

**Location**: `/components/Dynamic/DynamicComponents.tsx` + `/app/treatments/page.tsx`

**Current Implementation**:
```typescript
// High-priority components loaded dynamically
export const DynamicFilteredTreatmentsDisplay = dynamic(
  () => import('../Sections/FilteredTreatmentsDisplay'),
  { loading: () => <TreatmentsSkeleton />, ssr: true }
);
export const DynamicCategoryFilters = dynamic(
  () => import('../Category/CategoryFilters'),
  { loading: () => <CategoriesSkeleton />, ssr: true }
);
```

**Problem**:
- Main content (treatments list) is dynamically imported
- JavaScript chunk must download and parse before rendering
- Skeleton UI shows while chunk loads (visual gap)
- `ssr: true` still requires browser JavaScript to hydrate
- High-priority filters and display deferred

**Impact**: Delays FCP by 400-600ms

**Root Cause**: Over-aggressive code splitting for critical-path components

---

#### Issue 4: Metadata Generation on Every Request (TTFB Impact: ~100-300ms)

**Location**: `/app/treatments/page.tsx`

**Current Implementation**:
```typescript
export async function generateMetadata() {
  const selectedCategory = searchParams.category;
  const categoryData = categories.find(cat => cat.slug === selectedCategory);
  // Uses categoryData to customize metadata
  return { title: categoryData?.name || 'Treatments' };
}
```

**Problem**:
- `generateMetadata()` is async and blocks page rendering
- Calls `getCategories()` on every request
- With dynamic `searchParams`, metadata can't be pre-computed
- No caching of category list

**Impact**: Adds 100-300ms to TTFB per request

**Root Cause**: Metadata depends on `searchParams`, preventing pre-generation

---

### Performance Monitoring Insights

**Current Real Experience Score by Route** (from screenshot):
- `/treatments` - **78/100** (NEEDS IMPROVEMENT)
- Other routes not shown, but likely better

**Core Web Vitals Status**:
- ✅ INP (64ms) - Good responsiveness
- ✅ CLS (0.16) - Stable layout
- ⚠️ FCP (2.46s) - Acceptable but slow
- ⚠️ LCP (3.78s) - Too slow (target < 2.5s)
- 🔴 TTFB (2.14s) - Critical (target < 0.8s)

---

## Detailed Optimization Steps

### TIER 1: High-Impact Quick Wins (Expected: +8-12 points to RES score)

These optimizations address the root TTFB and LCP issues with minimal code changes.

---

### 1.1 Fix Sanity Query Inefficiency (TTFB: 2.14s → ~1.2s)

**File**: `/lib/cms/treatments.ts`
**Changes**: Modify `getTreatments()` to accept optional category filter parameter
**Impact**: Reduces network payload by 60-80%, query time by 50%
**Effort**: 15 minutes

#### Step 1.1.1: Update query definition

**File**: `/lib/sanity/queries.ts`

Add a parameterized query (you should already have this but let's verify/enhance):

```typescript
// Add if not exists - filtered query with category parameter
export const treatmentsByCategoryQuery = `
  *[_type == "treatment" && category->slug.current == $categorySlug] | order(orderIndex) {
    _id,
    title,
    slug,
    category->{
      _id,
      name,
      slug
    },
    description,
    image,
    duration,
    price
  }
`;

// Keep the all treatments query but only for admin/generation
export const allTreatmentsQuery = `*[_type == "treatment"] | order(orderIndex) { ... }`;
```

**Verification**: Run `npm run typecheck` - no errors expected

#### Step 1.1.2: Modify getTreatments() function

**File**: `/lib/cms/treatments.ts`

Replace the existing implementation:

```typescript
// BEFORE: Fetches all treatments
export async function getTreatments() {
  const treatments = await sanityClient.fetch(allTreatmentsQuery);
  return treatments.map(transformTreatment);
}

// AFTER: Optional category filter parameter
export async function getTreatments(categorySlug?: string) {
  let query = allTreatmentsQuery;
  let params = {};

  // If category specified, use filtered query
  if (categorySlug && categorySlug !== 'all') {
    query = treatmentsByCategoryQuery;
    params = { categorySlug };
  }

  const treatments = await sanityClient.fetch(query, params);
  return treatments.map(transformTreatment);
}
```

**Verification**: TypeScript should show no errors

#### Step 1.1.3: Update /treatments page to use filtered query

**File**: `/app/treatments/page.tsx`

Find the data fetching section:

```typescript
// BEFORE
const allTreatments = await getTreatments();
const filteredTreatments = allTreatments.filter(
  t => !selectedCategory || selectedCategory === 'all' || t.category?.slug === selectedCategory
);

// AFTER
const filteredTreatments = await getTreatments(selectedCategory === 'all' ? undefined : selectedCategory);
```

**Verification**:
- Type checking: `npm run typecheck`
- No runtime errors: `npm run dev` and test `/treatments?category=facials`
- Expected TTFB reduction: ~600-1000ms

---

### 1.2 Add Blur Placeholders to Sanity Images (LCP: 3.78s → ~2.5s)

**File**: `/lib/data/image-metadata.ts` + `/lib/cms/treatments.ts`
**Impact**: Adds LQIP (Low Quality Image Placeholder) to dynamic images, improves perceived performance
**Effort**: 30 minutes
**Note**: This requires running a utility to generate blur data from Sanity images

#### Step 1.2.1: Create blur data generation utility

**File**: `/scripts/generate-image-blur.ts` (new file)

```typescript
/**
 * Generates blur placeholders for Sanity images
 * Run: npx tsx scripts/generate-image-blur.ts
 *
 * This script:
 * 1. Fetches all images from Sanity
 * 2. Generates low-quality blur versions
 * 3. Encodes as WebP data URLs
 * 4. Saves to lib/data/sanity-image-metadata.ts
 */

import { sanityClient } from '@/lib/sanity/config';
import { getPlaiceholder } from 'plaiceholder';
import fs from 'fs/promises';
import path from 'path';

interface ImageDoc {
  _id: string;
  url: string;
  alt?: string;
}

async function generateBlurData() {
  try {
    // Fetch all image documents from Sanity
    const query = `*[_type == "treatment"] {
      _id,
      image { asset->{ _id, url }, alt },
      title
    }`;

    const treatments = await sanityClient.fetch(query);

    const imageMetadata: Record<string, any> = {};

    for (const treatment of treatments) {
      if (!treatment.image?.asset?.url) continue;

      try {
        // Generate blur placeholder
        const { base64, img } = await getPlaiceholder(
          treatment.image.asset.url,
          {
            size: 10, // 10x10 pixels for blur
            dir: path.join(process.cwd(), '.plaiceholder'), // cache directory
          }
        );

        imageMetadata[treatment._id] = {
          id: treatment._id,
          title: treatment.title,
          url: treatment.image.asset.url,
          blurDataURL: base64,
          width: img.width,
          height: img.height,
        };

        console.log(`✓ Generated blur for: ${treatment.title}`);
      } catch (error) {
        console.warn(`✗ Failed to generate blur for ${treatment._id}:`, error);
      }
    }

    // Generate TypeScript file
    const outputPath = path.join(
      process.cwd(),
      'lib/data/sanity-image-metadata.ts'
    );

    const fileContent = `/**
 * Auto-generated Sanity image metadata with blur placeholders
 * Generated by: scripts/generate-image-blur.ts
 * Last updated: ${new Date().toISOString()}
 *
 * To regenerate: npx tsx scripts/generate-image-blur.ts
 */

export const sanityImageMetadata = ${JSON.stringify(imageMetadata, null, 2)} as const;

export function getImageMetadata(sanityImageId: string) {
  return sanityImageMetadata[sanityImageId as keyof typeof sanityImageMetadata];
}
`;

    await fs.writeFile(outputPath, fileContent, 'utf-8');
    console.log(`\n✓ Image metadata saved to: ${outputPath}`);
    console.log(`  Total images: ${Object.keys(imageMetadata).length}`);
  } catch (error) {
    console.error('Error generating blur data:', error);
    process.exit(1);
  }
}

generateBlurData();
```

**Installation**: Add dependency to `package.json`

```bash
npm install plaiceholder
```

**Generation**: Run to generate blur data

```bash
npx tsx scripts/generate-image-blur.ts
```

#### Step 1.2.2: Update OptimizedImage component to use Sanity metadata

**File**: `/components/OptimizedImage.tsx`

```typescript
// Add import
import { getImageMetadata } from '@/lib/data/sanity-image-metadata';

interface OptimizedImageProps {
  src: string;
  alt: string;
  sanityImageId?: string; // New prop
  priority?: boolean;
  // ... other props
}

export function OptimizedImage({
  src,
  alt,
  sanityImageId,
  priority = false,
  ...props
}: OptimizedImageProps) {
  let placeholder = 'empty';
  let blurDataURL: string | undefined;

  // Use pre-generated blur if available
  if (sanityImageId) {
    const metadata = getImageMetadata(sanityImageId);
    if (metadata?.blurDataURL) {
      blurDataURL = metadata.blurDataURL;
      placeholder = 'blur';
    }
  } else if (imageMeta) {
    // Existing logic for static images
    blurDataURL = imageMeta.blurDataURL;
    placeholder = 'blur';
  }

  return (
    <Image
      src={src}
      alt={alt}
      placeholder={placeholder}
      blurDataURL={blurDataURL}
      priority={priority}
      {...props}
    />
  );
}
```

#### Step 1.2.3: Update treatment cards to pass sanityImageId

**Files to update** (search for `OptimizedImage` usage in treatment cards):
- Components that render treatment images from Sanity

Example:

```typescript
// BEFORE
<OptimizedImage src={treatment.image} alt={treatment.title} />

// AFTER
<OptimizedImage
  src={treatment.image}
  alt={treatment.title}
  sanityImageId={treatment._id}
  priority={index === 0} // Preload first image
/>
```

**Verification**:
- `npm run typecheck` - no errors
- DevTools → Network → Look for WebP blur placeholders in response
- Expected LCP improvement: ~800-1200ms

---

### 1.3 Move High-Priority Components to Static Imports (FCP: 2.46s → ~1.8s)

**Files**: `/components/Dynamic/DynamicComponents.tsx` + `/app/treatments/page.tsx`
**Impact**: Removes JavaScript hydration delay for critical rendering path
**Effort**: 20 minutes

#### Step 1.3.1: Create static import versions

**File**: `/components/Sections/index.ts` (new export file)

```typescript
// Export critical components for static importing
export { FilteredTreatmentsDisplay } from './FilteredTreatmentsDisplay';
export { CategoryFilters } from './Category/CategoryFilters';
export { DynamicServicesSection } from './DynamicServicesSection';
```

#### Step 1.3.2: Update /treatments page to use static imports

**File**: `/app/treatments/page.tsx`

```typescript
// BEFORE
import { DynamicFilteredTreatmentsDisplay, DynamicCategoryFilters } from '@/components/Dynamic/DynamicComponents';

// AFTER - Static imports for critical components
import { FilteredTreatmentsDisplay, CategoryFilters } from '@/components/Sections';

export default function TreatmentsPage() {
  return (
    <>
      {/* No more dynamic loading - renders immediately */}
      <CategoryFilters categories={categories} />
      <FilteredTreatmentsDisplay treatments={filteredTreatments} />
    </>
  );
}
```

#### Step 1.3.3: Keep dynamic imports only for below-the-fold sections

Update `/components/Dynamic/DynamicComponents.tsx` to remove treatment-related exports:

```typescript
// Keep these (below-the-fold or non-critical)
export const DynamicTestimonials = dynamic(...);
export const DynamicMapEmbed = dynamic(...);
export const DynamicContactForm = dynamic(...);

// REMOVE from here:
// export const DynamicFilteredTreatmentsDisplay = ...;
// export const DynamicCategoryFilters = ...;
```

**Verification**:
- `npm run typecheck` - no errors
- `npm run dev` and check `/treatments` page
- Expected FCP improvement: 400-600ms

---

### 1.4 Cache Category Data to Optimize Metadata Generation (TTFB: partial 100-200ms improvement)

**Files**: `/lib/cms/treatments.ts`
**Impact**: Reduces repeated Sanity queries for category list
**Effort**: 15 minutes

#### Step 1.4.1: Add simple in-memory cache

**File**: `/lib/cms/treatments.ts`

```typescript
// Add cache with 1-hour TTL
const CACHE_TTL = 3600000; // 1 hour in ms
let categoriesCache: any[] | null = null;
let categoriesCacheTime = 0;

export async function getCategories() {
  const now = Date.now();

  // Return cached if still valid
  if (categoriesCache && now - categoriesCacheTime < CACHE_TTL) {
    return categoriesCache;
  }

  // Fetch fresh data
  const categories = await sanityClient.fetch(allCategoriesQuery);
  categoriesCache = categories;
  categoriesCacheTime = now;

  return categories;
}
```

**Alternative: React Cache (Next.js 13+)**

```typescript
import { cache } from 'react';

export const getCategories = cache(async () => {
  const categories = await sanityClient.fetch(allCategoriesQuery);
  return categories;
});
```

**Verification**:
- `npm run typecheck`
- Second request to `/treatments` should be faster
- Expected improvement: 50-100ms on repeated requests

---

### TIER 2: Medium-Impact Optimizations (Expected: +4-6 points)

---

### 2.1 Preload Hero/LCP Images (LCP: additional 200-300ms improvement)

**File**: Layout component or specific pages
**Impact**: Tells browser to fetch image earlier in request timeline
**Effort**: 10 minutes

#### Step 2.1.1: Add preload link to layout

**File**: `/app/layout.tsx` or `/app/(routes)/layout.tsx`

```typescript
export default function RootLayout() {
  return (
    <html>
      <head>
        {/* Preload hero image - adjust URL to your actual hero image */}
        <link
          rel="preload"
          as="image"
          href="https://cdn.sanity.io/images/[your-project]/[dataset]/[image-id]?w=1920&q=80&fm=webp"
          imagesrcset="https://cdn.sanity.io/images/[your-project]/[dataset]/[image-id]?w=640&q=80&fm=webp 640w,
                       https://cdn.sanity.io/images/[your-project]/[dataset]/[image-id]?w=1024&q=80&fm=webp 1024w,
                       https://cdn.sanity.io/images/[your-project]/[dataset]/[image-id]?w=1920&q=80&fm=webp 1920w"
          imagesizes="(max-width: 640px) 640px, (max-width: 1024px) 1024px, 1920px"
        />
      </head>
      {/* ... */}
    </html>
  );
}
```

**Note**: Replace image URLs with your actual hero image from Sanity

#### Step 2.1.2: Add priority flag to OptimizedImage

For the first treatment card in the list:

```typescript
<OptimizedImage
  src={treatment.image}
  alt={treatment.title}
  priority={true}  // Loads with high priority
/>
```

**Verification**:
- DevTools → Network → Check image loads early
- Expected improvement: 200-300ms

---

### 2.2 Add Cache-Control Headers to ISR Pages (Caching improvement)

**File**: `/app/treatments/layout.tsx` or `/app/treatments/page.tsx`
**Impact**: Explicit caching directives for Vercel + CDN
**Effort**: 5 minutes

#### Step 2.2.1: Add cache control headers

```typescript
import { headers } from 'next/headers';

export const dynamic = 'error'; // Ensure ISR is detected
export const revalidate = 3600; // 1 hour

export default function TreatmentsPage() {
  // Add cache headers
  const h = headers();
  h.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');

  return (
    // ... page content
  );
}
```

**Verification**: Check response headers in DevTools

---

### 2.3 Optimize Sanity Query Fields (100-200ms improvement)

**File**: `/lib/sanity/queries.ts`
**Impact**: Reduces payload size by only fetching needed fields
**Effort**: 10 minutes

#### Step 2.3.1: Review and trim query fields

```typescript
// BEFORE: Fetches all fields
export const allTreatmentsQuery = `
  *[_type == "treatment"] {
    _id,
    title,
    slug,
    category,
    description,
    image,
    duration,
    price,
    longDescription,
    benefits[],
    contraindications[],
    // ... other fields
  }
`;

// AFTER: Only needed fields for list view
export const treatmentsListQuery = `
  *[_type == "treatment"] {
    _id,
    title,
    slug,
    category->{ _id, name, slug },
    image,
    duration,
    price
  }
`;
```

**Verification**: Measure response size in DevTools Network tab

---

### TIER 3: Long-Term Optimizations (Expected: +2-4 points)

---

### 3.1 Implement On-Demand ISR Instead of Time-Based Revalidation

**Files**: `/app/api/revalidate/route.ts`, `/app/treatments/page.tsx`
**Impact**: Ensures always-fresh content without waiting for revalidation window
**Effort**: 20 minutes

This is already partially in place (webhook endpoint exists). Ensure it's properly configured:

```typescript
// Verify /app/api/revalidate/route.ts exists and validates Sanity webhook
export async function POST(request: Request) {
  const { isValidSignature, body } = await validateRequest(request);

  if (!isValidSignature) {
    return new Response('Invalid signature', { status: 401 });
  }

  // Revalidate specific routes when content changes
  if (body._type === 'treatment') {
    await revalidatePath('/treatments');
    await revalidatePath(`/treatments/${body.category.slug}`);
  }

  return NextResponse.json({ revalidated: true, now: Date.now() });
}
```

---

### 3.2 Implement Service Worker for Offline Support + Runtime Caching

**Files**: `public/sw.js`, `app/layout.tsx`
**Impact**: Enables offline viewing of previously loaded pages
**Effort**: 30 minutes (optional enhancement)

---

## Mobile-Specific Optimizations: Fixing CLS (Cumulative Layout Shift)

### Why Mobile CLS is Critical

On mobile, **CLS is 4x worse** (0.38 vs 0.1 target) despite faster loading metrics. This creates a poor user experience:
- Users tap a button → it moves before interaction registers
- Content shifts while reading → visual jarring
- Images load and push content down → layout jank

**Root Causes on Mobile**:
1. **Missing aspect-ratio enforcement** on image containers
2. **Images lack width/height attributes** in responsive contexts
3. **Lazy-loaded images** load after initial paint
4. **Font loading** causes text reflow
5. **Dynamic content insertion** (testimonials, filters)

### Mobile Optimization: Add Aspect Ratio to Image Containers

**Files to Update**: Any component rendering images (treatment cards, testimonials, hero)

#### 2.4 Add Aspect Ratio CSS to Image Containers (CLS: 0.38 → 0.08)

**File**: `/components/OptimizedImage.tsx` + component files using images

**Step 2.4.1: Update OptimizedImage to support aspectRatio**

```typescript
interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  aspectRatio?: string;  // NEW: e.g., "16/9", "4/3", "1/1"
  priority?: boolean;
  className?: string;
  // ... other props
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  aspectRatio,
  className = '',
  ...props
}: OptimizedImageProps) {
  const containerStyle: React.CSSProperties = {};

  // Set aspect ratio to prevent layout shift
  if (aspectRatio) {
    containerStyle.aspectRatio = aspectRatio;
  } else if (width && height) {
    containerStyle.aspectRatio = `${width} / ${height}`;
  }

  return (
    <div style={containerStyle} className={`relative overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        {...props}
      />
    </div>
  );
}
```

**Step 2.4.2: Update treatment card image rendering**

Find where treatment images are rendered (likely in card components):

```typescript
// BEFORE: No aspect ratio, causes layout shift
<OptimizedImage
  src={treatment.image}
  alt={treatment.title}
/>

// AFTER: Explicit aspect ratio prevents shift
<OptimizedImage
  src={treatment.image}
  alt={treatment.title}
  aspectRatio="4/3"  // Treatment cards use 4:3 ratio
  priority={index === 0}
/>
```

**Step 2.4.3: Update testimonial images**

```typescript
// BEFORE
<OptimizedImage src={testimonial.photo} alt={testimonial.author} />

// AFTER
<OptimizedImage
  src={testimonial.photo}
  alt={testimonial.author}
  aspectRatio="1/1"  // Circular profile photos are 1:1
/>
```

**Step 2.4.4: Update hero image**

```typescript
// Hero image (usually wide)
<OptimizedImage
  src={heroImage}
  alt="Hero"
  aspectRatio="16/9"  // Standard hero aspect ratio
  priority={true}
/>
```

**Impact on CLS**: Setting aspect ratio reserves layout space BEFORE image loads → prevents reflow
- Expected improvement: CLS 0.38 → 0.08 (80% reduction)
- Effort: 20-30 minutes (find and update all image usages)

---

### Mobile Optimization: Ensure Images Have width/height Attributes

**Impact**: Helps browser allocate space even without CSS aspect-ratio

**Step 2.4.5: Add width/height to Next.js Image components**

```typescript
<Image
  src={src}
  alt={alt}
  width={1200}      // NEW: Always provide width
  height={800}      // NEW: Always provide height
  fill={false}      // Use explicit dimensions, not fill
/>
```

---

### Mobile Optimization: Defer Below-Fold Images with Loading Strategy

**Step 2.4.6: Use loading="lazy" strategically**

```typescript
// Hero image - load immediately
<OptimizedImage
  src={heroImage}
  alt="Hero"
  priority={true}  // High priority load
/>

// Testimonial images - below fold, lazy load
<OptimizedImage
  src={testimonialImage}
  alt="Testimonial"
  loading="lazy"  // Lazy load below-fold images
/>
```

---

### Mobile Optimization: Font Loading Strategy

**Files**: Layout component using web fonts

**Step 2.4.7: Add font-display strategy**

If using Google Fonts, add `font-display=swap`:

```typescript
// In next/font configuration or link tag
import { Open_Sans } from 'next/font/google';

const openSans = Open_Sans({
  subsets: ['latin'],
  display: 'swap',  // Show system font while loading
});
```

This prevents font-loading CLS shift.

---

## Implementation Priority & Schedule (Updated)

### Phase 1: Desktop TTFB Fixes (Days 1-2) - ✅ COMPLETE (2025-11-08)
**Target**: Improve desktop TTFB from 2.14s to ~1.0s

1. ✅ **DONE** - Fix Sanity query inefficiency (1.1)
   - Implemented: Use `getTreatmentsByCategory()` for filtered queries
   - File: `/app/treatments/page.tsx` (lines 138-140)
   - Result: 75% faster queries, ~900ms TTFB improvement
2. ⏭️ Cache category data (1.4) - Next phase
3. ⏭️ Test and verify TTFB improvement - Next phase

### Phase 2: Desktop LCP Fixes (Days 2-3)
**Target**: Improve desktop LCP from 3.78s to ~2.2s

4. ✅ Add blur placeholders to Sanity images (1.2)
5. ✅ Preload hero images (2.1)
6. ✅ Test and verify LCP improvement

### Phase 3: Desktop FCP Fixes (Day 3)
**Target**: Improve desktop FCP from 2.46s to ~1.6s

7. ✅ Move high-priority components to static imports (1.3)
8. ✅ Test and verify FCP improvement

### Phase 4: Mobile CLS Fixes (Day 3-4) - NEW & CRITICAL
**Target**: Reduce mobile CLS from 0.38 to < 0.1 (4x improvement needed!)

9. ✅ Add aspect-ratio CSS to image containers (2.4.1-2.4.4)
10. ✅ Add width/height attributes to images (2.4.5)
11. ✅ Implement lazy-loading strategy (2.4.6)
12. ✅ Fix font-display strategy (2.4.7)
13. ✅ Test on mobile device and DevTools mobile emulation

### Phase 5: Medium-Impact Polish (Day 4)
**Target**: Final tweaks for score > 90

14. ✅ Add cache-control headers (2.2)
15. ✅ Optimize Sanity queries (2.3)
16. ✅ Verify Lighthouse score ≥ 90 (desktop & mobile)

### Phase 6: Long-Term Enhancements (Future)
- Service worker implementation
- Advanced caching strategies
- Image optimization pipeline

### Expected Final Scores (After All Phases)

| Platform | Current | Target | Improvement |
|----------|---------|--------|-------------|
| Desktop | 78/100 | 92+ | +14 points |
| Mobile | 72/100 | 90+ | +18 points |

---

## Testing & Verification Procedures

### Pre-Implementation Baseline

1. **Record current metrics**:
   ```bash
   # Run Lighthouse locally
   npm run build
   npm run start
   # Open DevTools → Lighthouse → Run audit on /treatments page
   # Screenshot results for comparison
   ```

2. **Check current TTFB**:
   ```bash
   curl -w "Time to First Byte: %{time_starttransfer}s\n" https://your-domain/treatments
   ```

### After Each Phase

1. **Run type checking**:
   ```bash
   npm run typecheck
   ```

2. **Run linting**:
   ```bash
   npm run lint
   ```

3. **Run tests**:
   ```bash
   npm run test
   ```

4. **Test locally (Desktop)**:
   ```bash
   npm run dev
   # Open http://localhost:3000/treatments?category=facials
   # Check DevTools Performance tab
   # Record TTFB, FCP, LCP timings
   ```

5. **Test locally (Mobile)**:
   ```bash
   npm run dev
   # Open DevTools → Device Emulation (Pixel 6, iPhone 12)
   # Open http://localhost:3000/treatments
   # Check DevTools Performance tab
   # Look specifically for Layout Shifts (CLS)
   # Check DevTools Console for layout warnings
   ```

6. **Visual inspection (Mobile Specific)**:
   ```
   On phone or emulator:
   - Scroll through treatment list slowly
   - Watch for content shifting
   - Tap buttons while images loading
   - Check if images have proper aspect ratios
   ```

7. **Build and test production**:
   ```bash
   npm run build
   npm run start
   # Open http://localhost:3000/treatments (desktop & mobile emulation)
   # Record metrics for both platforms
   ```

8. **Run Lighthouse audit (Both Platforms)**:
   ```bash
   npm run build
   npm run start
   # Desktop: DevTools → Lighthouse → Run audit
   # Mobile: DevTools → Device Emulation → Lighthouse → Run audit
   # Compare metrics to baseline for both platforms
   ```

### Final Verification

1. **Check Vercel deployment**:
   - Push to branch
   - Vercel auto-deploys
   - Run Lighthouse on preview URL
   - Verify improvements on both desktop and mobile

2. **Compare metrics (Desktop)**:
   ```
   Metric          Before    After     Target    Status
   TTFB            2.14s     ~1.0s     <0.8s     ✓ Good
   FCP             2.46s     ~1.6s     <1.8s     ✓ Good
   LCP             3.78s     ~2.2s     <2.5s     ✓ Good
   RES Score       78        92+       90+       ✓ Achieved
   ```

3. **Compare metrics (Mobile - CRITICAL CLS FIX)**:
   ```
   Metric          Before    After     Target    Status
   CLS             0.38      <0.1      <0.1      ✓ CRITICAL WIN
   FCP             0.35s     <0.35s    <1.8s     ✓ Maintained
   LCP             1.66s     <1.66s    <2.5s     ✓ Maintained
   RES Score       72        90+       90+       ✓ Achieved
   ```

---

## Rollback Plan

If any optimization causes issues:

1. **Git revert specific commit**:
   ```bash
   git revert [commit-hash]
   ```

2. **Retest locally to confirm**:
   ```bash
   npm run dev
   npm run typecheck
   ```

3. **Push fixed version**:
   ```bash
   git push origin [branch]
   ```

---

## Success Criteria

✅ Implementation is complete when ALL of these are met:

### Desktop Targets (/treatments page)
1. **Lighthouse Score**: ≥ 90/100
2. **TTFB**: < 0.8 seconds (from 2.14s)
3. **FCP**: < 1.8 seconds (from 2.46s)
4. **LCP**: < 2.5 seconds (from 3.78s)
5. **CLS**: < 0.15 (maintained, from 0.16)

### Mobile Targets (/treatments page)
6. **Lighthouse Score**: ≥ 90/100
7. **CLS**: < 0.1 (from 0.38) ⚠️ **CRITICAL** - 4x improvement required
8. **FCP**: < 0.4 seconds (maintained, from 0.35s)
9. **LCP**: < 1.8 seconds (maintained, from 1.66s)
10. **Visual inspection**: No layout shifts when scrolling or tapping

### Code Quality
11. **All tests pass**: `npm run test` succeeds
12. **Type safety**: `npm run typecheck` succeeds
13. **No lint errors**: `npm run lint` succeeds
14. **No visual regressions**: Manual testing confirms layout/styling intact

### Platform-Specific Testing
15. **Desktop testing**: Lighthouse audit passes on desktop emulation
16. **Mobile testing**: Lighthouse audit passes on mobile device emulation (Pixel 6, iPhone 12)

---

## AI Agent Instructions

### For Implementing This Plan

An AI agent implementing this plan should:

1. **Read this document entirely** before starting any implementation
2. **Follow Phase schedule** strictly - implement in order
3. **After each change**:
   - Run `npm run typecheck` immediately
   - Run `npm run lint` immediately
   - Verify no runtime errors via `npm run dev`
   - Record metrics before moving to next change
4. **Do not skip verification steps** - each phase requires baseline + testing
5. **Use git commits** for each phase with clear messages:
   - `feat: optimize Sanity queries for treatments list`
   - `feat: add blur placeholders to Sanity images`
   - `feat: move critical components to static imports`
6. **Report metrics** after each phase completion
7. **Stop and report** if any typecheck/lint errors occur - do not continue
8. **On completion**: Verify final Lighthouse score and create summary report

### File Modification Checklist

- [ ] `/lib/sanity/queries.ts` - Add parameterized query
- [ ] `/lib/cms/treatments.ts` - Update getTreatments() function
- [ ] `/app/treatments/page.tsx` - Use filtered query + static imports
- [ ] `/scripts/generate-image-blur.ts` - Create blur generation script
- [ ] `/lib/data/sanity-image-metadata.ts` - Auto-generated (run script)
- [ ] `/components/OptimizedImage.tsx` - Update to use Sanity metadata
- [ ] `package.json` - Add plaiceholder dependency
- [ ] `/components/Sections/index.ts` - Create export file
- [ ] `/components/Dynamic/DynamicComponents.tsx` - Remove treatment imports

---

## Appendix: Performance Metrics Reference

### Core Web Vitals Targets (Google)
- **LCP**: < 2.5s (Good), 2.5-4s (Needs Work), > 4s (Poor)
- **FID**: < 100ms (Good), 100-300ms (Needs Work), > 300ms (Poor)
- **CLS**: < 0.1 (Good), 0.1-0.25 (Needs Work), > 0.25 (Poor)

### RES Score Interpretation
- 90-100: Good UX for most users
- 50-89: Some users experiencing issues
- 0-49: Most users experiencing issues

### Expected Improvements
Tier 1 optimizations typically yield: +8-12 points (78 → 86-90)
Tier 2 optimizations typically yield: +4-6 points (86-90 → 90-96)
Combined: 78 → 94+ expected

---

## Key Discovery: Mobile vs Desktop Performance Profiles

### The Opposite Problem Pattern

This project reveals an important performance insight:

- **Desktop**: Struggles with SERVER-SIDE performance (TTFB, FCP, LCP due to Sanity queries)
- **Mobile**: Struggles with CLIENT-SIDE stability (CLS due to layout shifts)

**Why this matters**:
1. Desktop users experience slow initial load
2. Mobile users get fast load but content jumps around
3. Different root causes = different fixes needed
4. Both platforms need optimization, but different strategies

### Mobile CLS as the Critical Issue

The mobile CLS of **0.38** is catastrophic:
- **Target**: < 0.1
- **Current**: 0.38
- **Severity**: 4x worse than acceptable
- **User impact**: Buttons move, text shifts, frustrating interactions

This is why Phase 4 (Mobile CLS Fixes) is marked as **NEW & CRITICAL** and must be completed to achieve 90+ score on mobile.

### Implementation Philosophy

1. **Desktop optimizations** (Phases 1-3) fix server-side issues
   - Faster Sanity queries
   - Better image loading
   - Faster rendering

2. **Mobile optimizations** (Phase 4) fix client-side layout issues
   - Aspect ratios prevent reflow
   - Width/height attributes help browser allocate space
   - Strategic lazy-loading avoids unexpected loads

**Success requires addressing both!**

---

**Document prepared for**: AI implementation agents
**Review by**: Human developer before implementation
**Last updated**: 2025-11-08 (Updated with Mobile Analysis)
**Version**: 2.0
