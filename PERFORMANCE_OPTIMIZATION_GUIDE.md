# Performance Optimization Guide

Comprehensive guide to performance optimizations implemented for the Heavenly Treatments website with Sanity CMS integration.

## Table of Contents

1. [Sanity CDN Optimization](#sanity-cdn-optimization)
2. [Image Optimization](#image-optimization)
3. [Loading States](#loading-states)
4. [Error Boundaries](#error-boundaries)
5. [Monitoring & Metrics](#monitoring--metrics)

---

## Sanity CDN Optimization

### Overview

Sanity CDN is **automatically enabled in production** (`NODE_ENV === 'production'`) to provide:

- **50-90% faster queries**: Response times of 50-100ms vs 500ms+ without CDN
- **Global edge caching**: Content cached across 200+ edge locations worldwide
- **Request deduplication**: Identical concurrent requests served from cache
- **Reduced server load**: Less traffic to origin servers
- **Better reliability**: Automatic failover and redundancy

### Configuration

Located in: `lib/sanity/config.ts`

```typescript
export const sanityConfig = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2025-11-06',
  useCdn: process.env.NODE_ENV === 'production', // ✅ Auto-enabled
  token: process.env.SANITY_API_TOKEN,
};
```

### How CDN Works

**Production Flow**:
```
User Request → CDN Edge (cached) → Sanity API
```

**Development Flow** (CDN disabled):
```
Developer Request → Sanity API (direct)
```

### CDN Cache TTL

By default, Sanity CDN caches responses for:

- **Published content**: 60 minutes (can be updated with webhooks for instant updates)
- **Draft content**: Not cached (always fresh)
- **Query results**: Cached per unique query with parameters

Our ISR webhook integration ensures content updates appear within seconds.

---

## Image Optimization

### Advanced Image Optimization API

Enhanced `getImageUrl()` function now supports advanced optimization options.

#### Basic Usage (Backward Compatible)

```typescript
// Simple usage - works exactly as before
const url = getImageUrl(imageAsset, 800, 600);

// With legacy quality parameter
const url = getImageUrl(imageAsset, 800, 600, 90);
```

#### Advanced Usage with Options

```typescript
import { getImageUrl, ImageOptimizationOptions } from '@/lib/sanity/image';

const options: ImageOptimizationOptions = {
  quality: 85,           // 1-100, default 90
  compression: 'webp',   // auto, jpeg, webp, png
  progressive: true,     // Progressive JPEG loading
  fit: 'crop',          // clamp, clip, crop, fill, fillmax, max, scale, min
  dpr: 2,               // Device pixel ratio for retina displays
};

const url = getImageUrl(imageAsset, 800, 600, options);
```

### Responsive Images

Generate responsive images with srcset for multiple device sizes:

```typescript
import { getResponsiveImage } from '@/lib/sanity/image';

const { src, srcSet, sizes } = getResponsiveImage(
  imageAsset,
  800,        // Base width
  600,        // Base height
  90          // Quality
);

return (
  <img
    src={src}
    srcSet={srcSet}
    sizes={sizes}
    alt="Treatment image"
  />
);
```

**Generated Sizes**:
- 320w - Mobile
- 640w - Mobile landscape / Small tablet
- 1024w - Tablet
- 1280w - Desktop
- 1536w - Large desktop
- 1920w - Extra large desktop

### Image Optimization Pipeline

```
Sanity Image Upload
    ↓
Automatic Format Conversion (AVIF, WebP, JPEG)
    ↓
Quality Optimization (90% quality)
    ↓
Progressive JPEG Interlacing
    ↓
Responsive Sizing (6 breakpoints)
    ↓
CDN Caching
    ↓
Edge Delivery (200+ global locations)
```

### Image Format Selection

Sanity automatically selects the best format based on client capability:

| Client | Format | Benefit |
|--------|--------|---------|
| Modern browsers (Chrome 90+, Firefox 89+) | AVIF | 20-30% smaller files |
| Chrome, Edge, Firefox | WebP | 25-35% smaller files |
| Safari, older browsers | JPEG | Maximum compatibility |

### Image Quality Settings

Current configuration uses **quality 90** (default was 75):

| Quality | Use Case | File Size |
|---------|----------|-----------|
| 75 | Web thumbnails | Small |
| 85 | General web use | Medium |
| 90 | Treatment displays | Larger |
| 95+ | High-end galleries | Very large |

---

## Loading States

### Implemented Features

✅ **Dynamic Component Loading** - Components load asynchronously with loading states
✅ **Priority Levels** - Components prioritized by importance (high, normal, low)
✅ **Accessibility** - ARIA labels and roles for screen readers
✅ **Reduced Motion Support** - Respects `prefers-reduced-motion` setting
✅ **Error Boundaries** - Graceful fallbacks for failed loads

### Loading Priority Levels

Located in: `components/Dynamic/DynamicComponents.tsx`

#### High Priority
- Treatments display
- Category filters
- Services section

**Characteristics**:
- Faster animation (1s pulse)
- `aria-live="assertive"` for screen readers
- Critical for user experience

#### Normal Priority
- Contact form
- Testimonials
- Experience section

**Characteristics**:
- Medium animation (2s pulse)
- `aria-live="polite"` for screen readers
- Important but not critical

#### Low Priority
- Map embed
- Cookie consent
- Analytics

**Characteristics**:
- Slower animation (3s pulse)
- No aria-live (not critical)
- Non-blocking load

### Component Loading Example

```typescript
// Treatments display with high priority
export const DynamicFilteredTreatmentsDisplay = createDynamicComponent(
  () => import('@/components/Treatments/FilteredTreatmentsDisplay'),
  {
    className: 'h-96',
    ariaLabel: 'Loading treatments',
    priority: 'high',           // ✅ High priority
    withErrorBoundary: true,    // ✅ Error handling
  }
);
```

### Reducing Motion

The loading states automatically respect user preferences:

```css
/* Automatically disables animations for users who prefer reduced motion */
@media (prefers-reduced-motion: reduce) {
  .animate-pulse {
    animation: none;
  }
}
```

---

## Error Boundaries

### Implementation

Error boundaries protect against failed CMS fetches and component errors.

#### Class Component Error Boundary

Located in: `components/ErrorBoundary.tsx`

```typescript
<ErrorBoundary
  fallback={<CustomErrorUI />}
  onError={(error, errorInfo) => {
    // Log to error tracking service (Sentry, etc.)
    console.error('Component error:', error);
  }}
>
  <RiskyComponent />
</ErrorBoundary>
```

#### Dynamic Component Error Boundaries

All dynamic imports wrap components with error boundaries:

```typescript
export const DynamicCategoryFilters = createDynamicComponent(
  () => import('@/components/Treatments/CategoryFilters'),
  {
    withErrorBoundary: true,  // ✅ Auto-wrapped
    ariaLabel: 'Loading filters',
  }
);
```

### Error Fallback UI

When a component fails:

1. Error boundary catches the error
2. Displays user-friendly fallback
3. Allows page refresh
4. Logs error for debugging

**Example Fallback**:
```
Failed to load component
Please try refreshing the page.
[Reload button]
```

### Error Handling Strategy

For CMS failures:

**Treatment Fetch Fails**:
- ✅ ISR prevents immediate crash
- ✅ Error boundary catches component error
- ✅ Shows fallback UI
- ✅ Next revalidation attempt fixes it

**Image Load Fails**:
- ✅ Next.js Image component fallback
- ✅ Graceful degradation
- ✅ No broken image placeholders

---

## Monitoring & Metrics

### Performance Metrics to Track

1. **Core Web Vitals**:
   - Largest Contentful Paint (LCP): Target < 2.5s
   - First Input Delay (FID): Target < 100ms
   - Cumulative Layout Shift (CLS): Target < 0.1

2. **Custom Metrics**:
   - Sanity query response time (should be < 100ms with CDN)
   - Image load time (should be < 500ms)
   - Component render time

3. **Error Rates**:
   - CMS fetch errors
   - Component loading errors
   - Image load failures

### Tools for Monitoring

**Built-in**:
- Google Analytics (configured)
- Next.js Analytics
- Browser DevTools

**Recommended**:
- [Sentry.io](https://sentry.io) - Error tracking
- [LogRocket](https://logrocket.com) - Session replay
- [Vercel Analytics](https://vercel.com/analytics) - Web Vitals

### Testing Performance

**Local Development**:
```bash
# Build and test production bundle
npm run build
npm start
```

**Chrome DevTools**:
1. Open DevTools → Performance tab
2. Record page load
3. Check metrics and flamegraph

**Lighthouse**:
```bash
# Run Lighthouse audit
npm run lighthouse
```

**Web Vitals**:
```typescript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

---

## Performance Checklist

- ✅ Sanity CDN enabled in production
- ✅ Image quality optimized (90%)
- ✅ Responsive images with srcset
- ✅ Dynamic component loading
- ✅ Loading states with accessibility
- ✅ Error boundaries on all dynamic components
- ✅ ISR webhooks for instant updates
- ✅ Next.js Image optimization
- ✅ Code splitting via dynamic imports
- ✅ Reduced motion support

---

## Future Enhancements

1. **Service Worker** - Cache treatments data offline
2. **Stale-while-revalidate** - Show cached data while fetching fresh
3. **Prefetching** - Preload common treatment pages
4. **Compression** - Enable Brotli compression on server
5. **CDN Edge Functions** - Add custom caching logic
6. **Database Indexing** - Optimize Sanity queries with better structure

---

## References

- [Sanity CDN Documentation](https://www.sanity.io/docs/cdn)
- [Image Optimization Guide](https://www.sanity.io/docs/image-url)
- [Web Vitals](https://web.dev/vitals/)
- [Next.js Image Optimization](https://nextjs.org/docs/basic-features/image-optimization)
- [React Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)

---

**Last Updated**: November 2024
**Status**: Complete ✅
