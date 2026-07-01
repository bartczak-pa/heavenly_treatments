import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import {
  isValidSignature,
  SIGNATURE_HEADER_NAME,
} from '@sanity/webhook';

/**
 * Sanity webhook for ISR (Incremental Static Regeneration)
 *
 * This endpoint receives webhooks from Sanity when content is published/updated.
 * It verifies the webhook signature using @sanity/webhook and revalidates affected pages.
 *
 * @see https://www.sanity.io/docs/webhooks
 * @see https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration
 */

// Get webhook secret from environment
const WEBHOOK_SECRET = process.env.SANITY_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  console.log('[Webhook] Received request at /api/revalidate');

  // Verify webhook secret is configured
  if (!WEBHOOK_SECRET) {
    console.error('[Webhook] SANITY_WEBHOOK_SECRET not configured');
    return NextResponse.json(
      { success: false, message: 'Webhook secret not configured' },
      { status: 500 }
    );
  }

  try {
    // Get the request body as text for signature verification
    const bodyText = await request.text();
    const signature = request.headers.get(SIGNATURE_HEADER_NAME);

    // Verify the webhook signature using Sanity's official library
    const isValid = await isValidSignature(
      bodyText,
      signature || '',
      WEBHOOK_SECRET
    );

    if (!isValid) {
      console.error('[Webhook] Invalid signature');
      return NextResponse.json(
        { success: false, message: 'Invalid webhook signature' },
        { status: 401 }
      );
    }

    // Parse the webhook payload
    const payload = JSON.parse(bodyText);
    const { _type } = payload;

    console.log(`[Webhook] Verified webhook for type: ${_type}`);

    // Revalidate based on content type
    if (_type === 'promotionalOffer') {
      // Use cache tag for targeted revalidation instead of full site
      console.log(`[Webhook] Revalidating promotional-offer cache tag`);
      revalidateTag('promotional-offer');
    } else {
      // Revalidate all treatment pages (listing, category, and detail pages)
      // Using 'layout' type revalidates /treatments and all nested routes beneath it
      console.log(`[Webhook] Revalidating /treatments and all sub-pages for type: ${_type}`);
      revalidatePath('/treatments', 'layout');
    }

    console.log('[Webhook] Revalidation completed successfully');

    return NextResponse.json(
      { success: true, message: 'Cache revalidated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('[Webhook] Error processing webhook:', error);

    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';

    return NextResponse.json(
      { success: false, message: `Webhook processing failed: ${errorMessage}` },
      { status: 500 }
    );
  }
}

/**
 * Handler for GET requests (optional, for testing)
 * In production, you might want to remove this or restrict it further
 */
export async function GET() {
  // Only allow from localhost in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { success: false, message: 'Method not allowed' },
      { status: 405 }
    );
  }

  return NextResponse.json({
    status: 'Webhook endpoint is running',
    path: '/api/revalidate',
    note: 'Send POST requests from Sanity webhooks to this endpoint',
  });
}
