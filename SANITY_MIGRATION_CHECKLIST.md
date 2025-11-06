# Sanity CMS Migration Checklist

This checklist outlines the steps to complete the Sanity CMS migration for Heavenly Treatments.

## ✅ Completed

- [x] Install Sanity dependencies (@sanity/client, next-sanity, etc.)
- [x] Create Sanity Studio configuration (sanity.config.ts, sanity.cli.ts)
- [x] Define content schemas (Treatment, TreatmentCategory)
- [x] Set up Sanity client for data fetching
- [x] Create GROQ queries for treatments and categories
- [x] Build abstraction layer (lib/cms/treatments.ts)
- [x] Create data migration script (scripts/migrate-to-sanity.ts)
- [x] Update environment variable template (.env.example)
- [x] Add npm scripts for migration and Studio
- [x] Update main pages to use Sanity data:
  - [x] app/treatments/page.tsx
  - [x] app/treatments/[categorySlug]/[treatmentSlug]/page.tsx
  - [x] app/sitemap.ts
- [x] Add ISR revalidation (3600 seconds = 1 hour)
- [x] Create comprehensive documentation (SANITY_SETUP.md)

## 🚧 Remaining Tasks

### 1. Set Up Sanity Project

**Priority: HIGH** - Required before testing

- [x] Create a Sanity account at [sanity.io](https://www.sanity.io)
- [x] Create a new project in the Sanity dashboard
- [x] Copy the Project ID
- [x] Generate an API token with Editor permissions
- [x] Add credentials to `.env.local`:
  ```bash
  NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id_here
  NEXT_PUBLIC_SANITY_DATASET=production
  SANITY_API_TOKEN=your_api_token_here
  ```

### 2. Run Data Migration

**Priority: HIGH** - Required to populate Sanity

- [x] Ensure environment variables are set
- [x] Run the migration script:
  ```bash
  npm run sanity:migrate
  ```
- [x] Verify in terminal that all categories and treatments were migrated successfully
- [x] Check for any error messages

### 3. Upload Images to Sanity

**Priority: HIGH** - Required for site to display properly

Since images aren't automatically migrated, you need to upload them manually:

- [x] Start the development server: `npm run dev`
- [x] Navigate to `http://localhost:3000/studio`
- [x] Sign in with your Sanity account
- [x] For each **Treatment Category**:
  - [x] Open the category
  - [x ] Upload the corresponding image from `/public/images/categories/`
  - [x] Add descriptive alt text
  - [x] Click "Publish"
- [x] For each **Treatment**:
  - [x] Open the treatment
  - [x] Upload the corresponding image from `/public/images/`
  - [x] Add descriptive alt text (e.g., "Woman receiving Swedish massage treatment")
  - [x] Click "Publish"

**Tip:** You can also use the Sanity CLI to bulk upload images if needed.

### 4. Update Client Components (Optional)

**Priority: MEDIUM** - These components currently use static data

✅ **COMPLETED** - All client components migrated to accept data as props from server components:

- [x] `components/Contact/ContactForm.tsx` - Now accepts `treatments` prop
- [x] `components/Sections/Services.tsx` - Now accepts `categories` prop
- [x] `components/Layout/Navbar.tsx` - Now accepts `categories` prop and fetches from MainLayout
- [x] `components/Treatments/CategoryFilters.tsx` - Now accepts `categories` prop
- [x] `components/Layout/MainLayout.tsx` - Now fetches categories from Sanity CMS

**Implementation Details:**
1. **Navbar**: Updated MainLayout to be async and fetch categories from CMS. Navbar now receives categories as props.
2. **Services Section**: Updated home page (app/page.tsx) to fetch categories and pass to Services component
3. **ContactForm**: Updated contact page (app/contact/page.tsx) to fetch treatments and pass to ContactForm
4. **CategoryFilters**: Updated treatments page to fetch categories and pass to CategoryFilters

**Performance Benefits:**
- Data fetched server-side (no client waterfall)
- Categories cached via ISR (revalidate every 1 hour)
- No duplicate requests
- Improved SEO (data available at build time)

### 5. Test the Implementation

**Priority: HIGH** - Verify everything works

- [x] Start development server: `npm run dev`
- [x] Test main pages:
  - [x] Visit `/treatments` - Should load all treatments from Sanity
  - [x] Filter by category - Should show filtered treatments
  - [x] Click on a treatment - Should show treatment detail page
  - [x] Check that images load correctly
  - [x] Verify prices and durations display
- [x] Test Studio:
  - [x] Visit `/studio`
  - [x] Edit a treatment price
  - [x] Publish the change
  - [x] Wait for revalidation (max 1 hour) or restart dev server
  - [x] Verify change appears on site
- [x] Test Contact Form:
  - [x] Visit `/contact`
  - [x] Check that treatment dropdown works
  - [x] Verify all treatments appear in the list

### 6. Configure CORS (if needed)

**Priority: MEDIUM** - Required if you encounter CORS errors

- [x] Go to Sanity dashboard → API → CORS Origins
- [x] Add development URL: `http://localhost:3000`
- [x] Add production URL: `https://yourdomain.com`

### 7. Set Up Webhooks (Optional)

**Priority: LOW** - For instant content updates

- [x] Create a revalidation API route: `app/api/revalidate/route.ts`
- [x] In Sanity dashboard, go to API → Webhooks
- [x] Create webhook pointing to: `https://yourdomain.com/api/revalidate`
- [x] Set secret token for security
- [x] Select events: create, update, delete
- [x] Filter by document types: treatment, treatmentCategory

### 8. Deploy to Production

**Priority: HIGH** - When ready to go live

- [x] Add environment variables to hosting platform (Vercel, Netlify, etc.):
  - [x] `NEXT_PUBLIC_SANITY_PROJECT_ID`
  - [x] `NEXT_PUBLIC_SANITY_DATASET`
- [x] Deploy the application
- [x] Test all pages in production
- [x] Verify Sanity Studio works at `yourdomain.com/studio`
- [x] Check that ISR revalidation works (content updates within 1 hour)

### 9. Update Client Components to Use CMS (Future Enhancement)

**Priority: COMPLETED** ✅

All client components have been migrated to use Sanity CMS data via props:

1. **ContactForm** - Now accepts treatments as props from contact page
2. **Services Section** - Now accepts categories as props from home page
3. **Navigation** - Fetches categories in MainLayout and passes to Navbar
4. **CategoryFilters** - Now accepts categories as props from treatments page

### 10. Performance Optimization (Future Enhancement)

**Priority: LOW** - After everything works

- [ ] Enable Sanity CDN in production
- [ ] Add image optimization parameters to Sanity image URLs
- [ ] Add loading states for client components
- [ ] Implement error boundaries for failed CMS fetches

## 📋 Testing Checklist

Before considering the migration complete:

- [ ] All treatment pages load correctly
- [ ] Category filtering works
- [ ] Treatment images display
- [ ] Prices and durations are correct
- [ ] Contact form treatment dropdown works
- [ ] Sitemap includes all treatments
- [ ] SEO metadata is correct
- [ ] JSON-LD structured data is valid
- [ ] Sanity Studio is accessible and functional
- [ ] Can create/edit/delete treatments in Studio
- [ ] Changes in Studio reflect on the website (within revalidation period)

## 🆘 Troubleshooting

If you encounter issues, check:

1. **Environment variables** - Are they set correctly in `.env.local`?
2. **Migration success** - Did the migration script complete without errors?
3. **Images uploaded** - Did you upload all images to Sanity Studio?
4. **CORS configured** - Did you add your domain to Sanity CORS settings?
5. **Console errors** - Check browser and terminal for error messages

See `SANITY_SETUP.md` for detailed troubleshooting guide.

## 📊 Migration Timeline

**Estimated time to complete:** 4-6 hours

- Sanity setup: 30 minutes
- Data migration: 15 minutes
- Image upload: 2-3 hours (depending on number of images)
- Testing: 1 hour
- Deployment: 30 minutes

## 🎯 Success Criteria

The migration is successful when:

1. ✅ All treatments load from Sanity (not static data)
2. ✅ Content editors can update treatments via Studio
3. ✅ Changes in Studio appear on the website
4. ✅ No broken images or missing data
5. ✅ Performance is acceptable (under 2 seconds load time)
6. ✅ SEO remains intact (meta tags, JSON-LD)

## 📝 Notes

- The original static data file (`lib/data/treatments.ts`) is kept as a backup
- Type definitions remain in the original file for backwards compatibility
- Client components may still use static data temporarily
- ISR is set to 1 hour - adjust `revalidate` value in pages if needed

---

**Next Step:** Start with #1 - Set Up Sanity Project

For detailed instructions, refer to `SANITY_SETUP.md`
