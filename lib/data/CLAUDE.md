# lib/data/ - Static Data & Constants

Static data, configuration constants, and fallback/default values.

## Pattern

Static files export typed constants that are:
- Never modified at runtime
- Grouped logically by domain
- Well-documented with comments
- Typed for IDE autocomplete

```typescript
export const CONTACT_INFO = {
  phone: '+44 (0) 1573 224402',
  email: 'hello@heavenlytreatments.com',
} as const;

// Type-safe access
type ContactKeys = keyof typeof CONTACT_INFO; // 'phone' | 'email'
```

## Files

### contactInfo.ts - Contact Details

Static contact information displayed throughout site:

```typescript
export const CONTACT_INFO = {
  phone: '+44 (0) 1573 224402',
  email: 'hello@heavenlytreatments.com',
  address: 'Kelso, Scottish Borders, Scotland',
  postcode: 'TD5 7AA',
} as const;

export const BUSINESS_HOURS = {
  monday: { open: '10:00', close: '18:00' },
  tuesday: { open: '10:00', close: '18:00' },
  wednesday: { open: '10:00', close: '18:00' },
  thursday: { open: '10:00', close: '18:00' },
  friday: { open: '10:00', close: '18:00' },
  saturday: { open: '10:00', close: '16:00' },
  sunday: null, // Closed
} as const;

export const LOCATION = {
  lat: 55.394,
  lng: -2.439,
  mapUrl: 'https://goo.gl/maps/...',
} as const;
```

**Usage**:
```typescript
import { CONTACT_INFO, BUSINESS_HOURS } from '@/lib/data/contactInfo';

export function Footer() {
  return (
    <footer>
      <a href={`tel:${CONTACT_INFO.phone}`}>{CONTACT_INFO.phone}</a>
      <a href={`mailto:${CONTACT_INFO.email}`}>{CONTACT_INFO.email}</a>
    </footer>
  );
}
```

### treatments.ts - Treatment Defaults

Default treatment categories and fallback data:

```typescript
export const TREATMENT_CATEGORIES = [
  {
    id: 'massage',
    name: 'Massage',
    slug: 'massage',
    description: 'Therapeutic massage treatments',
  },
  {
    id: 'facials',
    name: 'Facials',
    slug: 'facials',
    description: 'Professional facial treatments',
  },
  {
    id: 'body-treatments',
    name: 'Body Treatments',
    slug: 'body-treatments',
    description: 'Full body spa treatments',
  },
  // ... more categories
] as const;

export const TREATMENT_DURATIONS = {
  SHORT: '30 minutes',
  STANDARD: '60 minutes',
  EXTENDED: '90 minutes',
  FULL: '120 minutes',
} as const;

// Fallback treatment if Sanity data unavailable
export const DEFAULT_TREATMENT = {
  _id: 'default',
  title: 'Treatment',
  slug: { current: 'treatment' },
  description: 'Professional spa treatment',
  price: 0,
  duration: TREATMENT_DURATIONS.STANDARD,
  benefits: [],
} as const;
```

**Usage**:
```typescript
// Filter treatments by category
const massages = treatments.filter(t => t.category.slug === 'massage');

// Use duration constants
const defaultDuration = TREATMENT_DURATIONS.STANDARD; // '60 minutes'

// Fallback when data unavailable
const treatment = sanityTreatment || DEFAULT_TREATMENT;
```

### testimonials.ts - Fallback Testimonials

Static testimonials for fallback when Sanity data unavailable:

```typescript
export const DEFAULT_TESTIMONIALS = [
  {
    author: 'Sarah M.',
    content: 'The most relaxing experience. Highly recommended!',
    rating: 5,
  },
  {
    author: 'James T.',
    content: 'Professional and welcoming. Great value for money.',
    rating: 5,
  },
  {
    author: 'Emma L.',
    content: 'I come back every month. Excellent therapist!',
    rating: 5,
  },
] as const;

export const RATING_LABELS = {
  1: 'Poor',
  2: 'Fair',
  3: 'Good',
  4: 'Very Good',
  5: 'Excellent',
} as const;
```

**Usage**:
```typescript
// Fetch from Sanity with fallback
const testimonials = await fetchTestimonials().catch(() => DEFAULT_TESTIMONIALS);

// Display rating with label
function RatingDisplay({ rating }: { rating: 1 | 2 | 3 | 4 | 5 }) {
  return <span>{RATING_LABELS[rating]}</span>;
}
```

### image-metadata.ts - Image Optimization

Image dimensions and optimization metadata:

```typescript
export const IMAGE_SIZES = {
  HERO: {
    width: 1920,
    height: 1080,
    aspect: '16/9',
  },
  CARD: {
    width: 400,
    height: 300,
    aspect: '4/3',
  },
  THUMBNAIL: {
    width: 200,
    height: 150,
    aspect: '4/3',
  },
  PORTRAIT: {
    width: 300,
    height: 400,
    aspect: '3/4',
  },
} as const;

export const RESPONSIVE_SIZES = {
  HERO: [320, 640, 1024, 1280, 1536, 1920],
  CARD: [320, 400, 640],
  THUMBNAIL: [200, 400],
} as const;

export const IMAGE_FORMATS = ['webp', 'avif'] as const;
```

**Usage**:
```typescript
import { IMAGE_SIZES, RESPONSIVE_SIZES } from '@/lib/data/image-metadata';

<OptimizedImage
  src={imageUrl}
  alt="Description"
  width={IMAGE_SIZES.CARD.width}
  height={IMAGE_SIZES.CARD.height}
  sizes={`(max-width: 640px) 100vw, ${IMAGE_SIZES.CARD.width}px`}
/>
```

## Patterns

### Using `as const`

```typescript
// Without as const
const config = { timeout: 5000 };
// Type is { timeout: number }

// With as const
const config = { timeout: 5000 } as const;
// Type is { readonly timeout: 5000 }
// Allows literal type inference
```

### Typed Access

```typescript
export const HOURS = {
  open: '10:00',
  close: '18:00',
} as const;

// Type-safe access
const openTime: typeof HOURS.open = HOURS.open; // ✅ Correct
const closeTime: typeof HOURS.open = HOURS.close; // ✅ Type error caught!

// Union type of keys
type HourKeys = keyof typeof HOURS; // 'open' | 'close'
```

### Array Constants

```typescript
export const CATEGORIES = [
  { id: 'cat1', name: 'Category 1' },
  { id: 'cat2', name: 'Category 2' },
] as const;

// Infer union type from array
type CategoryId = (typeof CATEGORIES)[number]['id']; // 'cat1' | 'cat2'

// Type-safe access
const id: CategoryId = 'cat1'; // ✅
const id: CategoryId = 'cat3'; // ❌ Type error
```

## Best Practices

### ✅ Do
- Use `as const` for literal type inference
- Group related data in objects
- Add JSDoc comments for complex data
- Use consistent naming conventions
- Export with clear, descriptive names
- Type-check usage in components

### ❌ Don't
- Modify data at runtime (use different structure)
- Mix data from different domains in one file
- Store sensitive info (use environment variables)
- Create deep nesting (keep structure flat)
- Use generic names like `config` or `data`

## Difference from Sanity Data

| Source | Use When | Frequency | Storage |
|--------|----------|-----------|---------|
| **Sanity CMS** | Content changes (treatments, testimonials) | Often updated | Database |
| **Static Data** | Site config, constants, fallbacks | Rarely changes | Codebase |

**Example**:
- ✅ Treatments → Sanity (updated by admin)
- ✅ Business hours → lib/data/ (rarely changes)
- ✅ Contact info → lib/data/ (rarely changes)
- ✅ Treatment categories → Sanity (managed with treatments)
- ✅ Default/fallback values → lib/data/ (hardcoded backups)

## Testing Data Constants

```typescript
import { CONTACT_INFO, BUSINESS_HOURS } from '@/lib/data/contactInfo';

describe('contact data', () => {
  it('exports required contact info', () => {
    expect(CONTACT_INFO.phone).toBeDefined();
    expect(CONTACT_INFO.email).toBeDefined();
  });

  it('has hours for each day', () => {
    const days = Object.keys(BUSINESS_HOURS);
    expect(days).toContain('monday');
    expect(days).toContain('sunday');
  });
});
```

## Adding New Data Files

1. Create file in `lib/data/[name].ts`
2. Define `export const` constants with `as const`
3. Add TypeScript types if complex structure
4. Export with descriptive, specific names
5. Add JSDoc comments for non-obvious data
6. Create tests that validate data structure
7. Update this CLAUDE.md with file description
