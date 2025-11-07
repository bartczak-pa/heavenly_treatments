# lib/ Directory - Utilities & Helpers

This directory contains all utility functions, helpers, validation schemas, and data fetching logic.

## Directory Structure

```
lib/
├── CLAUDE.md              # This file
├── config.ts              # Site configuration constants
├── env.ts                 # Type-safe environment variable access
├── utils.ts               # General utility functions
├── cookieUtils.ts         # Cookie management utilities
├── jsonLsUtils.ts         # localStorage JSON helpers
├── optimizeImports.ts     # Import optimization utilities
│
├── cms/                   # Sanity CMS content fetching
│   └── treatments.ts      # Treatment queries and fetching
│
├── sanity/                # Sanity client & configuration
│   ├── client.ts          # Sanity client instance
│   ├── config.ts          # Sanity project config
│   ├── image.ts           # Image URL builder
│   ├── queries.ts         # GROQ queries
│   └── types.ts           # TypeScript types from Sanity schema
│
├── validations/           # Zod validation schemas
│   └── contact.ts         # Contact form validation
│
└── data/                  # Static data & constants
    ├── contactInfo.ts     # Contact details
    ├── treatments.ts      # Treatment categories/defaults
    ├── testimonials.ts    # Testimonials data
    └── image-metadata.ts  # Image optimization metadata
```

## Core Utilities

### env.ts - Environment Variables

Provides type-safe access to environment variables:

```typescript
import { env } from '@/lib/env';

const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = env.NEXT_PUBLIC_SANITY_DATASET;
```

**Pattern**: Use `z.string()` with Zod for validation:
```typescript
export const env = z.object({
  NEXT_PUBLIC_SANITY_PROJECT_ID: z.string(),
  NEXT_PUBLIC_SANITY_DATASET: z.string(),
  // ... other env vars
}).parse(process.env);
```

### config.ts - Site Configuration

Global site configuration:
```typescript
export const SITE_CONFIG = {
  name: 'Heavenly Treatments',
  description: 'Professional spa studio',
  url: 'https://heavenlytreatments.com',
  calendlyUrl: 'https://calendly.com/...',
};
```

### utils.ts - General Utilities

Common helper functions:
- `cn()` - Merge Tailwind classes (from clsx + tailwind-merge)
- `formatPrice()` - Format currency
- `slugify()` - Convert string to URL slug
- `classNames()` - Dynamic class composition

### cookieUtils.ts - Cookie Management

Utilities for cookie operations:
- `setCookie()` - Set cookie value
- `getCookie()` - Retrieve cookie value
- `removeCookie()` - Delete cookie
- Uses `js-cookie` library

### jsonLsUtils.ts - localStorage Helpers

JSON-safe localStorage operations:
```typescript
import { getFromLS, setToLS, removeFromLS } from '@/lib/jsonLsUtils';

// Safe JSON serialization
setToLS('key', { data: 'value' });
const data = getFromLS('key');
removeFromLS('key');
```

## Sanity CMS Layer

### sanity/client.ts - Sanity Client Instance

Single shared instance for all Sanity queries:

```typescript
import { createClient } from '@sanity/client';

export const sanityClient = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: true, // Faster for public content
});
```

### sanity/config.ts - Sanity Project Config

Project-specific configuration for Sanity studio:
- Project ID
- Dataset name
- API version
- Plugin configuration

### sanity/image.ts - Image URL Builder

Build optimized image URLs from Sanity:

```typescript
import { buildImageUrl } from '@/lib/sanity/image';

const imageUrl = buildImageUrl(sanityImage)
  .width(400)
  .height(300)
  .fit('crop')
  .auto('format')
  .url();
```

### sanity/queries.ts - GROQ Queries

Reusable GROQ query definitions for common data fetches:

```typescript
export const TREATMENT_QUERY = `
  *[_type == "treatment"] {
    _id,
    title,
    slug,
    description,
    price,
    duration,
    image,
  }
`;
```

### sanity/types.ts - TypeScript Types

Generated or manual TypeScript types from Sanity schema:

```typescript
export interface Treatment {
  _id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  duration: string;
  image?: SanityImage;
}

export interface Testimonial {
  _id: string;
  author: string;
  content: string;
  rating: number;
  image?: SanityImage;
}
```

## CMS Content Fetching

### cms/treatments.ts - Treatment Queries

High-level functions for fetching treatment data:

```typescript
export async function fetchTreatments() {
  return sanityClient.fetch(TREATMENT_QUERY);
}

export async function fetchTreatmentBySlug(slug: string) {
  return sanityClient.fetch(
    `*[_type == "treatment" && slug.current == $slug][0]`,
    { slug }
  );
}

export async function fetchTreatmentCategories() {
  return sanityClient.fetch(`
    *[_type == "treatmentCategory"] | order(name) {
      _id,
      name,
      slug,
      description,
    }
  `);
}
```

**Pattern**: Always include error handling and type safety:
```typescript
export async function fetchTreatments(): Promise<Treatment[]> {
  try {
    const treatments = await sanityClient.fetch<Treatment[]>(TREATMENT_QUERY);
    return treatments ?? [];
  } catch (error) {
    console.error('Failed to fetch treatments:', error);
    return [];
  }
}
```

## Validation Schemas

### validations/contact.ts - Contact Form Schema

Zod schema for contact form validation:

```typescript
import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  captcha: z.string().min(1, 'Captcha validation required'),
});

export type ContactFormData = z.infer<typeof contactSchema>;
```

## Static Data

### data/contactInfo.ts

Static contact information:

```typescript
export const CONTACT_INFO = {
  phone: '+44 (0) 1573 224402',
  email: 'hello@heavenlytreatments.com',
  address: 'Kelso, Scottish Borders',
  hours: {
    mon: '10:00 - 18:00',
    tue: '10:00 - 18:00',
    // ...
  },
};
```

### data/treatments.ts

Default/fallback treatment data and categories:

```typescript
export const TREATMENT_CATEGORIES = [
  { name: 'Massage', slug: 'massage', description: '...' },
  { name: 'Facials', slug: 'facials', description: '...' },
  // ...
];
```

### data/testimonials.ts

Static testimonial data (as fallback):

```typescript
export const DEFAULT_TESTIMONIALS = [
  {
    author: 'Client Name',
    content: 'Great experience...',
    rating: 5,
  },
  // ...
];
```

### data/image-metadata.ts

Image optimization metadata for static images:

```typescript
export const IMAGE_SIZES = {
  hero: { width: 1920, height: 1080 },
  card: { width: 400, height: 300 },
  thumbnail: { width: 200, height: 150 },
};
```

## Usage Patterns

### In Server Components

Fetch data in server components:

```typescript
import { fetchTreatments } from '@/lib/cms/treatments';

export default async function TreatmentsPage() {
  const treatments = await fetchTreatments();
  return <TreatmentsGrid treatments={treatments} />;
}
```

### In API Routes

Use Sanity client for server-side operations:

```typescript
import { sanityClient } from '@/lib/sanity/client';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const validated = contactSchema.parse(data);
    // Process validated data
  } catch (error) {
    return Response.json({ error: 'Validation failed' }, { status: 400 });
  }
}
```

### In Client Components

Pass fetched data as props from server component:

```typescript
// Server component
const data = await fetchTreatments();
return <ClientComponent treatments={data} />;

// Client component
'use client';

interface Props {
  treatments: Treatment[];
}

export function ClientComponent({ treatments }: Props) {
  return <Grid items={treatments} />;
}
```

## Best Practices

### ✅ Do
- Keep utilities focused on single purpose
- Type all function parameters and returns
- Handle errors in data fetching with try/catch
- Cache expensive queries with ISR
- Use environment variables for secrets
- Document complex utility functions

### ❌ Don't
- Mix business logic with utilities
- Fetch data in utility functions (do in components/routes)
- Use `any` type
- Store secrets in code
- Create circular dependencies between utilities
- Put component-specific logic in lib/

## Testing Utilities

Test utilities located in `__tests__/` mirror lib structure:

```
__tests__/lib/
├── utils.test.ts
├── cookieUtils.test.ts
├── validations/
│   └── contact.test.ts
└── sanity/
    └── queries.test.ts
```

Test validation schemas:
```typescript
import { contactSchema } from '@/lib/validations/contact';

describe('contactSchema', () => {
  it('validates contact form data', () => {
    const data = { name: 'John', email: 'john@example.com', ... };
    expect(() => contactSchema.parse(data)).not.toThrow();
  });
});
```

## Common Tasks

### Add New Utility Function
1. Determine appropriate file (or create new)
2. Write typed function with JSDoc comments
3. Export as named export
4. Add unit tests in `__tests__/lib/`
5. Import and use in components/routes

### Add New Sanity Query
1. Add GROQ query to `lib/sanity/queries.ts`
2. Create fetch function in `lib/cms/`
3. Add TypeScript type if needed
4. Document with comments
5. Test with Sanity Vision tool

### Add New Validation Schema
1. Create file in `lib/validations/`
2. Define Zod schema with helpful error messages
3. Export TypeScript type with `z.infer`
4. Add tests
5. Use in forms with `useForm` + `zodResolver`
