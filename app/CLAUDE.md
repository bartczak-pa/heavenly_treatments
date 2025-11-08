# app/ Directory - Next.js App Router

This directory contains all Next.js App Router pages, layouts, and API routes.

## Directory Structure

```
app/
├── layout.tsx              # Root layout wrapper (global styles, providers)
├── page.tsx                # Home page
├── sitemap.ts              # Dynamic XML sitemap generation
├── global-error.tsx        # Global error boundary
├── favicon.ico             # Site favicon
│
├── (routes)/               # Optional route grouping (doesn't affect URL)
├── about/                  # /about page
├── contact/                # /contact page
├── treatments/             # /treatments pages
│   └── [categorySlug]/     # /treatments/[category] dynamic routes
├── studio/                 # /studio (Sanity CMS admin panel)
├── api/                    # /api/* server endpoints
│   ├── contact/           # POST /api/contact
│   └── revalidate/        # POST /api/revalidate (ISR)
├── home/                   # Internal components for home page
├── styles/                 # Global CSS and styles
├── privacy-policy/         # /privacy-policy page
├── terms/                  # /terms page
├── cookie-policy/          # /cookie-policy page
└── booking-confirmation/   # /booking-confirmation page
```

## Root Layout & Setup

**File**: `layout.tsx`

Wraps all pages with:
- Global CSS imports
- Metadata setup (title, description, OG tags)
- Analytics providers (Vercel Analytics, Speed Insights)
- Root HTML structure
- Any global context providers

## Page Patterns

### Static Pages
- **`page.tsx`** (Home, About, Contact, Privacy, Terms, Cookie Policy)
- Fetch content from Sanity CMS using `lib/cms/` utilities
- Use `generateMetadata()` for SEO optimization
- Import and compose section components from `components/Sections/`

### Dynamic Pages
- **`treatments/page.tsx`** - Treatments overview
  - ✅ **OPTIMIZED** (2025-11-08): Uses `getTreatmentsByCategory()` for filtered requests
  - Pattern: Parameterized queries at server level (not client-side filtering)
  - Benefit: 75% faster queries, ~900ms TTFB improvement
- **`treatments/[categorySlug]/page.tsx`** - Individual treatment category pages
- Uses `generateStaticParams()` for static generation
- Receives `params: { categorySlug: string }` prop

## API Routes Pattern

### Contact Form Submission
**File**: `api/contact/route.ts`

- `POST /api/contact` - Receives form data from Contact form
- Validates request using Zod schema
- Sends email via Resend
- Returns success/error JSON response

### ISR Revalidation
**File**: `api/revalidate/route.ts`

- `POST /api/revalidate` - Triggered by Sanity webhooks
- Revalidates Sanity content at build time
- Called when treatments or testimonials update
- Regenerates affected pages without full rebuild

## Metadata & SEO

### Pattern
```typescript
export const metadata: Metadata = {
  title: 'Page Title',
  description: 'Meta description for search engines',
};
```

### Per-Page Generation
Use `generateMetadata()` for dynamic content from Sanity:
```typescript
export async function generateMetadata(): Promise<Metadata> {
  const data = await fetchSanityData();
  return {
    title: data.title,
    description: data.description,
  };
}
```

## Static Generation

### Full Static Generation
Pages generated at build time and cached:
- Home, About, Contact, treatments overview
- Use `revalidate: 3600` (1 hour) for ISR

### Dynamic Routes with `generateStaticParams()`
```typescript
export async function generateStaticParams() {
  const categories = await fetchTreatmentCategories();
  return categories.map(cat => ({
    categorySlug: cat.slug,
  }));
}
```

## Error Handling

### Page-Level Errors
- Each page boundary can have `error.tsx`
- Wraps page in error boundary
- Shows fallback UI on crash

### Global Errors
**File**: `global-error.tsx`
- Catches errors not handled by other boundaries
- Should have minimal dependencies
- Always use client component

## Important Patterns

### Importing Sections
```typescript
import { Services } from '@/components/Sections/Services';
import { Testimonials } from '@/components/Sections/Testimonials';
```

### Fetching Sanity Data
```typescript
import { fetchTreatments } from '@/lib/cms/treatments';

export default async function Page() {
  const treatments = await fetchTreatments();
  return <TreatmentsGrid treatments={treatments} />;
}
```

### Environment Variables
Access via `process.env` in server components:
```typescript
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
```

## Common Tasks

### Add New Page
1. Create new directory: `app/new-page/`
2. Create `page.tsx` with metadata
3. Fetch any Sanity data needed
4. Import and compose section components
5. Add route to navigation in `components/Layout/Navbar.tsx`

### Modify Existing Page
1. Open corresponding `page.tsx`
2. Update metadata if needed
3. Modify section components imported
4. Test with `npm run dev`

### Update API Route
1. Edit file in `api/` directory
2. Keep request/response types strict (Zod validation)
3. Test with actual POST requests
4. Verify error handling

## Next.js Specific

- **Server Components by default** - Pages are server components
- **Static exports** - Use ISR with `revalidate` for dynamic content
- **Image optimization** - Use Next.js `Image` component via `OptimizedImage`
- **Route groups** - `(routes)` doesn't affect URL but groups related pages
- **Dynamic routes** - `[slug]` creates catch-all routes with `params` prop
