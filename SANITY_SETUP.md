# Sanity CMS Setup Guide

This guide will walk you through setting up and using Sanity CMS for managing treatments data.

## Overview

Treatments data has been migrated to use Sanity CMS, a headless content management system. This allows non-technical team members to update treatments, prices, and descriptions without touching code.

## Prerequisites

- Node.js 18+ installed
- A Sanity account (create one at [sanity.io](https://www.sanity.io))

## Initial Setup

### 1. Create a Sanity Project

1. Go to [sanity.io/manage](https://www.sanity.io/manage)
2. Click "Create project"
3. Choose a name for your project (e.g., "Heavenly Treatments")
4. Select a dataset name (recommended: `production`)
5. Copy your **Project ID**

### 2. Generate an API Token

1. In your Sanity project dashboard, go to **API** → **Tokens**
2. Click "Add API token"
3. Give it a name (e.g., "Migration Token")
4. Set permissions to **Editor** (for write access)
5. Copy the token immediately (it won't be shown again)

### 3. Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Add your Sanity credentials to `.env.local`:
   ```bash
   NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id_here
   NEXT_PUBLIC_SANITY_DATASET=production
   SANITY_API_TOKEN=your_api_token_here
   ```

### 4. Migrate Existing Data

Run the migration script to populate Sanity with your existing treatments:

```bash
npm run sanity:migrate
```

This will:
- Create all treatment categories in Sanity
- Create all treatments in Sanity
- Link treatments to their categories

**Note:** Images are not automatically migrated. You'll need to upload them manually through the Sanity Studio (see below).

## Using Sanity Studio

### Accessing the Studio

The Sanity Studio is embedded in your Next.js application:

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to:
   ```
   http://localhost:3000/studio
   ```

3. Sign in with your Sanity account

### Managing Content

#### Treatment Categories

1. In the Studio, click **Treatment Category** in the sidebar
2. You can:
   - Edit existing categories
   - Add new categories
   - Upload category images
   - Change display order
   - Update descriptions

#### Treatments

1. Click **Treatment** in the sidebar
2. You can:
   - Edit existing treatments (title, price, duration, description)
   - Add new treatments
   - Upload treatment images
   - Add/edit key features
   - Change category assignment

### Uploading Images

After migration, you need to upload images for each treatment and category:

1. Open a treatment or category in the Studio
2. Click the image field
3. Upload the corresponding image from your `/public/images/` directory
4. Add alt text for accessibility
5. Click **Publish**

## Architecture

### Directory Structure

```
├── app/
│   └── studio/               # Sanity Studio route
│       └── [[...tool]]/
│           └── page.tsx
├── lib/
│   ├── cms/
│   │   └── treatments.ts     # Abstraction layer for fetching data
│   ├── sanity/
│   │   ├── client.ts         # Sanity client instance
│   │   ├── config.ts         # Sanity configuration
│   │   ├── image.ts          # Image URL helpers
│   │   ├── queries.ts        # GROQ queries
│   │   └── types.ts          # TypeScript types
│   └── data/
│       └── treatments.ts     # Original static data (kept for reference)
├── sanity/
│   └── schemas/
│       ├── index.ts          # Schema exports
│       ├── treatment.ts      # Treatment schema
│       └── treatmentCategory.ts  # Category schema
├── scripts/
│   └── migrate-to-sanity.ts  # Migration script
├── sanity.config.ts          # Studio configuration
└── sanity.cli.ts             # CLI configuration
```

### Data Flow

1. **Content Entry:** Editors update content in Sanity Studio
2. **Storage:** Content is stored in Sanity's cloud database
3. **Fetching:** Next.js pages fetch data via GROQ queries
4. **Transformation:** Data is transformed to match existing TypeScript interfaces
5. **Rendering:** Components receive data in the same format as before
6. **Caching:** Next.js caches responses for performance

### API Abstraction Layer

The abstraction layer (`lib/cms/treatments.ts`) provides the same API as the original static data:

```typescript
// Same functions as before
await getTreatments()              // Get all treatments
await getTreatmentBySlug(slug)     // Get single treatment
await getCategories()              // Get all categories
await getTreatmentsByCategory(categorySlug) // Filter by category
getTreatmentPath(treatment)        // Generate URL path
```

This means **minimal code changes** were needed in components and pages.

## Content Schema

### Treatment Category

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | String | Yes | Category name (e.g., "Massages") |
| slug | Slug | Yes | URL-friendly identifier |
| description | Text | Yes | Full description for SEO |
| shortDescription | Text | Yes | Brief description for navigation |
| image | Image | No | Category header image |
| iconName | String | No | Lucide icon name |
| displayOrder | Number | No | Sort order for display |

### Treatment

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | String | Yes | Treatment name |
| slug | Slug | Yes | URL-friendly identifier |
| description | Text | Yes | Full treatment description |
| category | Reference | Yes | Link to category |
| duration | String | Yes | Duration (e.g., "70 mins") |
| price | String | Yes | Price with currency (e.g., "£50") |
| keyFeatures | Array | No | List of key features/steps |
| image | Image | Yes | Treatment image |

## Deployment

### Deploy Sanity Studio

To deploy the Studio as a standalone app (optional):

```bash
npm run sanity:deploy
```

This creates a hosted version at `your-project.sanity.studio`

### Deploy Next.js Application

Make sure your environment variables are set in your hosting platform (Vercel, Netlify, etc.):

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`

The `SANITY_API_TOKEN` is only needed for migration, not for production builds.

## Caching & Performance

### ISR (Incremental Static Regeneration)

Pages that fetch treatment data use ISR with revalidation:

```typescript
export const revalidate = 3600; // Revalidate every hour
```

### CDN Caching

Sanity responses are cached at the CDN level when `useCdn: true` in production.

### On-Demand Revalidation

You can set up webhooks to trigger revalidation when content changes:

1. In Sanity dashboard, go to **API** → **Webhooks**
2. Create a new webhook
3. Set the URL to: `https://yourdomain.com/api/revalidate`
4. Select events: `create`, `update`, `delete`
5. Filter by document types: `treatment`, `treatmentCategory`

Then create the revalidation endpoint (example):

```typescript
// app/api/revalidate/route.ts
import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
  const secret = request.headers.get('x-webhook-secret');

  if (secret !== process.env.REVALIDATION_SECRET) {
    return new Response('Unauthorized', { status: 401 });
  }

  revalidatePath('/treatments');
  return new Response('Revalidated', { status: 200 });
}
```

## Troubleshooting

### Migration Issues

**"Error: SANITY_API_TOKEN not found"**
- Make sure you've added the token to `.env.local`
- Check that the token has Editor permissions

**"Error: NEXT_PUBLIC_SANITY_PROJECT_ID not found"**
- Verify you've copied the correct project ID from Sanity dashboard
- Ensure `.env.local` exists and is properly formatted

### Studio Not Loading

**Blank screen at /studio**
- Check browser console for errors
- Verify Sanity packages are installed: `npm install`
- Ensure environment variables are set correctly

### Data Not Appearing

**No treatments showing on the site**
- Verify data was migrated: check Sanity Studio
- Check browser network tab for failed API requests
- Ensure you're using the correct dataset name

### CORS Errors

If you see CORS errors:
1. Go to Sanity dashboard → API → CORS Origins
2. Add your development URL: `http://localhost:3000`
3. Add your production URL: `https://yourdomain.com`

## Best Practices

### Content Management

1. **Always add alt text** to images for SEO and accessibility
2. **Use consistent slug formats** (lowercase, hyphens only)
3. **Preview changes** before publishing
4. **Keep descriptions SEO-friendly** (descriptive, keyword-rich)

### Development

1. **Never commit `.env.local`** - it contains secrets
2. **Use the abstraction layer** - don't import Sanity client directly in components
3. **Test locally** before deploying changes
4. **Keep the original data file** as a backup reference

### Performance

1. **Optimize images** - Sanity automatically serves optimized formats (WebP)
2. **Use ISR** - Don't fetch on every request
3. **Enable CDN** in production for faster reads

## Support

- **Sanity Documentation:** [sanity.io/docs](https://www.sanity.io/docs)
- **Next.js + Sanity Guide:** [sanity.io/plugins/next-sanity](https://www.sanity.io/plugins/next-sanity)
- **GROQ Query Language:** [sanity.io/docs/groq](https://www.sanity.io/docs/groq)

## Rollback Plan

If you need to rollback to static data:

1. Change imports in pages from `lib/cms/treatments` back to `lib/data/treatments`
2. Change async functions back to synchronous
3. Remove `revalidate` exports from pages
4. Redeploy

The original static data is preserved in `lib/data/treatments.ts` for this purpose.
