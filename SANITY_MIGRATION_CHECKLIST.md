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

- [ ] Create a Sanity account at [sanity.io](https://www.sanity.io)
- [ ] Create a new project in the Sanity dashboard
- [ ] Copy the Project ID
- [ ] Generate an API token with Editor permissions
- [ ] Add credentials to `.env.local`:
  ```bash
  NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id_here
  NEXT_PUBLIC_SANITY_DATASET=production
  SANITY_API_TOKEN=your_api_token_here
  ```

### 2. Run Data Migration

**Priority: HIGH** - Required to populate Sanity

- [ ] Ensure environment variables are set
- [ ] Run the migration script:
  ```bash
  npm run sanity:migrate
  ```
- [ ] Verify in terminal that all categories and treatments were migrated successfully
- [ ] Check for any error messages

### 3. Upload Images to Sanity

**Priority: HIGH** - Required for site to display properly

Since images aren't automatically migrated, you need to upload them manually:

- [ ] Start the development server: `npm run dev`
- [ ] Navigate to `http://localhost:3000/studio`
- [ ] Sign in with your Sanity account
- [ ] For each **Treatment Category**:
  - [ ] Open the category
  - [ ] Upload the corresponding image from `/public/images/categories/`
  - [ ] Add descriptive alt text
  - [ ] Click "Publish"
- [ ] For each **Treatment**:
  - [ ] Open the treatment
  - [ ] Upload the corresponding image from `/public/images/`
  - [ ] Add descriptive alt text (e.g., "Woman receiving Swedish massage treatment")
  - [ ] Click "Publish"

**Tip:** You can also use the Sanity CLI to bulk upload images if needed.

### 4. Update Client Components (Optional)

**Priority: MEDIUM** - These components currently use static data

The following client components still import from `lib/data/treatments.ts`:

- [ ] `components/Contact/ContactForm.tsx` - Uses `getTreatments()` for treatment dropdown
- [ ] `components/Sections/Services.tsx` - Uses `treatmentCategories` for home page
- [ ] `components/Layout/Navbar.tsx` - May use categories for navigation
- [ ] `components/Layout/TreatmentCategoryLinks.tsx` - May use categories
- [ ] `components/Treatments/CategoryFilters.tsx` - May use categories for filters

**Options:**
1. **Pass data as props** from parent server components (recommended)
2. **Keep static data** as fallback for client components
3. **Use client-side fetching** with React Query or SWR

**For now:** These components will continue to use the static data from `lib/data/treatments.ts`, which is fine as a temporary solution.

### 5. Test the Implementation

**Priority: HIGH** - Verify everything works

- [ ] Start development server: `npm run dev`
- [ ] Test main pages:
  - [ ] Visit `/treatments` - Should load all treatments from Sanity
  - [ ] Filter by category - Should show filtered treatments
  - [ ] Click on a treatment - Should show treatment detail page
  - [ ] Check that images load correctly
  - [ ] Verify prices and durations display
- [ ] Test Studio:
  - [ ] Visit `/studio`
  - [ ] Edit a treatment price
  - [ ] Publish the change
  - [ ] Wait for revalidation (max 1 hour) or restart dev server
  - [ ] Verify change appears on site
- [ ] Test Contact Form:
  - [ ] Visit `/contact`
  - [ ] Check that treatment dropdown works
  - [ ] Verify all treatments appear in the list

### 6. Configure CORS (if needed)

**Priority: MEDIUM** - Required if you encounter CORS errors

- [ ] Go to Sanity dashboard → API → CORS Origins
- [ ] Add development URL: `http://localhost:3000`
- [ ] Add production URL: `https://yourdomain.com`

### 7. Set Up Webhooks (Optional)

**Priority: LOW** - For instant content updates

- [ ] Create a revalidation API route: `app/api/revalidate/route.ts`
- [ ] In Sanity dashboard, go to API → Webhooks
- [ ] Create webhook pointing to: `https://yourdomain.com/api/revalidate`
- [ ] Set secret token for security
- [ ] Select events: create, update, delete
- [ ] Filter by document types: treatment, treatmentCategory

### 8. Deploy to Production

**Priority: HIGH** - When ready to go live

- [ ] Add environment variables to hosting platform (Vercel, Netlify, etc.):
  - [ ] `NEXT_PUBLIC_SANITY_PROJECT_ID`
  - [ ] `NEXT_PUBLIC_SANITY_DATASET`
- [ ] Deploy the application
- [ ] Test all pages in production
- [ ] Verify Sanity Studio works at `yourdomain.com/studio`
- [ ] Check that ISR revalidation works (content updates within 1 hour)

### 9. Update Client Components to Use CMS (Future Enhancement)

**Priority: LOW** - Nice to have

To fully migrate client components to use CMS data:

1. **ContactForm** - Refactor to accept treatments as props:
   ```tsx
   // In contact page.tsx
   const treatments = await getTreatments();
   <ContactForm treatments={treatments} />
   ```

2. **Services Section** - Pass categories as props from home page
3. **Navigation** - Fetch categories in layout and pass to Navbar

### 10. Performance Optimization (Future Enhancement)

**Priority: LOW** - After everything works

- [ ] Enable Sanity CDN in production
- [ ] Add image optimization parameters to Sanity image URLs
- [ ] Consider reducing revalidation time if content updates frequently
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
