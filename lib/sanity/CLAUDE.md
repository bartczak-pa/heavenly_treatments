# lib/sanity/ - Sanity Client & Configuration

Low-level Sanity integration including client setup, queries, and type definitions.

## Files Overview

### client.ts - Sanity Client Instance

Singleton Sanity client used by all content fetching:

```typescript
import { createClient } from '@sanity/client';
import { env } from '@/lib/env';

export const sanityClient = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: true, // Use CDN for faster public reads
  apiVersion: '2024-01-01', // Pin API version
});
```

**Usage**: Import and use in `lib/cms/` fetching functions:
```typescript
const data = await sanityClient.fetch<DataType>(query, params);
```

### config.ts - Sanity Studio Configuration

Configuration for Sanity CMS studio (`/studio` route):

```typescript
export default defineConfig({
  name: 'default',
  title: 'Heavenly Treatments',
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
  plugins: [
    structureTool(), // Content organization
    visionTool(),    // GROQ query testing
  ],
  schema: {
    types: schemaTypes,
  },
  basePath: '/studio',
});
```

Access studio at: `http://localhost:3000/studio` (dev) or `https://domain.com/studio` (production)

### image.ts - Image URL Building

Build optimized image URLs from Sanity images:

```typescript
import { urlBuilder } from '@/lib/sanity/image';

const imageUrl = urlBuilder(sanityImage)
  .width(400)
  .height(300)
  .fit('crop')
  .auto('format')
  .url();
```

**Supports**:
- Responsive sizing (width, height)
- Cropping and fitting (crop, fill, scale)
- Automatic format (WebP, AVIF)
- Quality control
- Blur effects for lazy loading

### queries.ts - GROQ Query Definitions

Reusable GROQ (Graph-Relational Object Queries) definitions:

```typescript
// Fetch all treatments with references
export const TREATMENTS_QUERY = `
  *[_type == "treatment"] | order(title) {
    _id,
    _createdAt,
    title,
    slug,
    description,
    price,
    duration,
    benefits[],
    image {
      asset->{
        _id,
        url,
        metadata {
          dimensions {
            width,
            height,
          }
        }
      },
      alt
    },
    category->{
      _id,
      name,
      slug,
    }
  }
`;

// Fetch single treatment
export const TREATMENT_BY_SLUG_QUERY = `
  *[_type == "treatment" && slug.current == $slug][0] {
    // fields
  }
`;

// Fetch testimonials with ratings
export const TESTIMONIALS_QUERY = `
  *[_type == "testimonial"] | order(_createdAt desc) {
    _id,
    author,
    content,
    rating,
    image {
      asset->{url},
      alt
    }
  }
`;
```

**Pattern**: Queries should be named in UPPER_SNAKE_CASE and include all needed fields upfront.

### types.ts - TypeScript Type Definitions

TypeScript interfaces matching Sanity schema:

```typescript
// Core content types
export interface Treatment {
  _id: string;
  _createdAt: string;
  title: string;
  slug: { current: string };
  description: string;
  price: number;
  duration: string;
  benefits: string[];
  image?: SanityImage;
  category?: TreatmentCategory;
}

export interface TreatmentCategory {
  _id: string;
  name: string;
  slug: { current: string };
  description?: string;
}

export interface Testimonial {
  _id: string;
  author: string;
  content: string;
  rating: number;
  image?: SanityImage;
}

// Sanity image type
export interface SanityImage {
  asset: {
    _id: string;
    url: string;
    metadata?: {
      dimensions?: {
        width: number;
        height: number;
      };
    };
  };
  alt?: string;
  crop?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
}
```

**Keeping Types in Sync**:
1. Update Sanity schema first
2. Update TypeScript types to match
3. Update GROQ queries to fetch new fields
4. Update components to use new fields

## Workflow

### Fetch Data in Server Component

```typescript
// 1. Import client
import { sanityClient } from '@/lib/sanity/client';

// 2. Import query
import { TREATMENTS_QUERY } from '@/lib/sanity/queries';

// 3. Fetch with typing
const treatments = await sanityClient.fetch<Treatment[]>(TREATMENTS_QUERY);

// 4. Pass to component
return <Grid items={treatments} />;
```

### Fetch with Parameters

```typescript
const TREATMENT_BY_SLUG_QUERY = `
  *[_type == "treatment" && slug.current == $slug][0]
`;

// Use $slug parameter
const treatment = await sanityClient.fetch<Treatment>(
  TREATMENT_BY_SLUG_QUERY,
  { slug: 'massage' }
);
```

### Image URL Building

```typescript
import { urlBuilder } from '@/lib/sanity/image';

// Build URL from Sanity image object
const imageUrl = urlBuilder(treatment.image)
  .width(800)
  .height(600)
  .auto('format')
  .url();

// Use in Image component
<img src={imageUrl} alt={treatment.image.alt} />
```

## Testing Sanity Queries

### Using Sanity Vision Tool

1. Visit `/studio` (in development)
2. Open Vision tab
3. Paste GROQ query
4. Run and inspect results
5. Adjust query until correct

### Test with GROQ Playground

External GROQ testing at: https://www.sanity.io/docs/groq

### Unit Testing

```typescript
describe('Sanity queries', () => {
  it('fetches treatments with correct fields', async () => {
    const results = await sanityClient.fetch<Treatment[]>(TREATMENTS_QUERY);
    expect(results).toHaveLength(expect.any(Number));
    expect(results[0]).toHaveProperty('title');
    expect(results[0]).toHaveProperty('price');
  });
});
```

## Best Practices

### ✅ Do
- Keep queries in `queries.ts`
- Use parameterized queries for dynamic values
- Include all needed fields upfront (no N+1 queries)
- Use descriptive type names
- Test queries in Vision tool before using
- Include image optimization hints

### ❌ Don't
- Inline GROQ queries in components
- Fetch entire documents then filter in code
- Use untyped `any` responses
- Make unbounded queries (always limit)
- Forget alt text for images

## Common GROQ Patterns

### Filtering & Ordering
```groq
*[_type == "treatment" && price < 100] | order(title)
```

### Pagination
```groq
*[_type == "treatment"][0...10]  // First 10
*[_type == "treatment"][10...20] // Next 10
```

### Conditional Fields
```groq
{
  title,
  "description": select(
    description != null => description,
    "No description"
  )
}
```

### Count Results
```groq
{
  "count": count(*[_type == "treatment"]),
  treatments: *[_type == "treatment"]
}
```

### References (Lookups)
```groq
{
  title,
  category-> {
    name,
    slug
  }
}
```

## Updating Schema & Types

When Sanity schema changes:

1. **Update Sanity schema** in `sanity/schemas/`
2. **Deploy schema**: `npm run sanity:deploy`
3. **Update queries** in `lib/sanity/queries.ts`
4. **Update types** in `lib/sanity/types.ts`
5. **Update fetching** in `lib/cms/`
6. **Update components** to use new fields
7. **Test in Vision** tool and with real data
