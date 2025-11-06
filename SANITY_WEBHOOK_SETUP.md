# Sanity Webhook Setup Guide

This guide explains how to set up webhooks for Incremental Static Regeneration (ISR) with Sanity CMS and Next.js.

## Overview

Webhooks allow Sanity to notify your Next.js application when content is published, updated, or deleted. This enables **Incremental Static Regeneration (ISR)**, which means:

- Content updates appear on your site within seconds (no full rebuild needed)
- Pages are revalidated on-demand whenever Sanity content changes
- Users always see fresh content without deployment delays

## What's Already Configured

✅ **API Route**: `/app/api/revalidate/route.ts` - Handles webhook requests from Sanity
✅ **.env.example**: Updated with `SANITY_WEBHOOK_SECRET` documentation
⏳ **Next Step**: Configure webhook in Sanity dashboard

## Step-by-Step Setup

### 1. Generate a Webhook Secret

A webhook secret is used to verify that requests to your API route come from Sanity (security measure).

You can generate a random secret using any of these methods:

**Option A: Using Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Option B: Using OpenSSL**
```bash
openssl rand -base64 32
```

**Option C: Using Online Generator**
Visit: https://www.random.org/bytes/ (generate 32 bytes and convert to hex)

Example secret (use your own!):
```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e
```

### 2. Add Secret to Environment Variables

Add your generated secret to `.env.local`:

```bash
SANITY_WEBHOOK_SECRET=your_generated_secret_here
```

**Important**: Do NOT commit `.env.local` to version control. It contains secrets.

### 3. Configure Webhook in Sanity Dashboard

1. **Go to Sanity Dashboard**:
   - Visit: https://sanity.io/manage
   - Select your project: "Heavenly Treatments"
   - Navigate to: **API** → **Webhooks** (in the left menu)

2. **Create New Webhook**:
   - Click: **+ New webhook**
   - Fill in the details:

   **Webhook URL**:
   ```
   https://yourdomain.com/api/revalidate
   ```

   Replace `yourdomain.com` with:
   - **Production**: Your actual domain (e.g., `https://heavenly-treatments.com/api/revalidate`)
   - **Staging/Preview**: Your staging URL (e.g., `https://preview.heavenly-treatments.com/api/revalidate`)
   - **Local Development**: Cannot use localhost; use ngrok or similar tunnel service

   **Authentication**:
   - Select: **HMAC SHA-256**
   - Paste your webhook secret in the secret field

3. **Configure Events**:
   - Trigger on: **Publish**, **Unpublish**, **Update**
   - Document types: Select only:
     - ✅ `treatment`
     - ✅ `treatmentCategory`

4. **Set Timeout**:
   - Timeout: **20 seconds** (Next.js ISR should complete within this time)

5. **Save Webhook**:
   - Click: **Create webhook**

### 4. Test the Webhook (Optional)

Sanity dashboard provides a test feature:

1. Go back to your webhook in the dashboard
2. Click the **...** menu → **Test**
3. Choose a test document type (e.g., `treatment`)
4. Click **Send test event**

Expected response:
```json
{
  "success": true,
  "message": "Cache revalidated successfully"
}
```

## Webhook Behavior

### What Happens When Content Changes

1. **You publish a treatment in Sanity**
2. **Sanity sends webhook to**: `https://yourdomain.com/api/revalidate`
3. **API route verifies**: Webhook signature matches secret
4. **Next.js revalidates**: All `/treatments` routes and related pages
5. **Next build**: Static files are regenerated
6. **Result**: Users see updated content within seconds

### Revalidation Details

The webhook endpoint revalidates:

- ✅ `/treatments` (main treatments page)
- ✅ `/treatments/[categorySlug]` (category filters)
- ✅ `/treatments/[categorySlug]/[treatmentSlug]` (treatment detail pages)

All routes with `treatment` or `treatmentCategory` tags are regenerated.

## Troubleshooting

### Webhook Shows "Failed"

**Check 1: Verify Webhook URL**
- Ensure your domain is correct and reachable
- Test: `curl https://yourdomain.com/api/revalidate` should return 405 (Method Not Allowed) for GET

**Check 2: Verify Secret**
- Ensure `SANITY_WEBHOOK_SECRET` is set in production environment
- The secret in `.env.local` must match the secret in Sanity dashboard exactly

**Check 3: Check Server Logs**
- Look for errors in your Next.js logs
- Search for `[Webhook]` to find webhook processing logs

### ISR Not Working (Changes Don't Appear)

**Possible causes**:

1. **Webhook not configured**: Check if webhook appears in Sanity dashboard
2. **Secret mismatch**: Verify secret in `.env` matches Sanity dashboard
3. **Revalidation tags mismatch**: Check document types are set to `treatment` or `treatmentCategory`
4. **ISR not enabled**: Ensure you're using Next.js 12.2+
5. **Route not in App Router**: Verify pages are in `/app` directory (not `/pages`)

## Advanced Configuration

### Multiple Environments

For staging and production, create separate webhooks:

| Environment | URL | Secret |
|---|---|---|
| Production | `https://heavenly-treatments.com/api/revalidate` | `PROD_SECRET_XXX` |
| Staging | `https://staging.heavenly-treatments.com/api/revalidate` | `STAGING_SECRET_XXX` |

Each needs its own webhook configured in Sanity with matching secret.

### Selective Revalidation

If you want different behavior for different document types, modify `/app/api/revalidate/route.ts`:

```typescript
if (_type === 'treatment') {
  // Revalidate only treatment pages
  revalidatePath('/treatments');
  revalidateTag('treatment');
} else if (_type === 'treatmentCategory') {
  // Revalidate only category pages
  revalidateTag('treatmentCategory');
}
```

### Custom Cache Duration

To increase ISR revalidation time (makes pages cache longer):

```typescript
// In page.tsx
export const revalidate = 3600; // Revalidate every hour instead of on-demand
```

However, with webhooks, you don't need this - content updates instantly.

## Security Best Practices

1. ✅ **Use a strong secret**: At least 32 characters, randomized
2. ✅ **Verify signatures**: The API route verifies `sanity-webhook-signature` header
3. ✅ **Use HTTPS only**: Never use HTTP for webhook URLs
4. ✅ **Rotate secrets regularly**: Change secret and update both Sanity and `.env` annually
5. ✅ **Don't share secrets**: Never commit `.env.local` to git

## References

- [Sanity Webhooks Documentation](https://www.sanity.io/docs/webhooks)
- [Next.js ISR Documentation](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration)
- [Next.js revalidatePath API](https://nextjs.org/docs/app/api-reference/functions/revalidatePath)
- [Next.js revalidateTag API](https://nextjs.org/docs/app/api-reference/functions/revalidateTag)

## Support

If you encounter issues:

1. Check the webhook test in Sanity dashboard
2. Review Next.js server logs for `[Webhook]` entries
3. Verify `.env.local` has `SANITY_WEBHOOK_SECRET` set
4. Ensure the webhook URL is publicly accessible (not localhost)
