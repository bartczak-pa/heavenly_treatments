import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import crypto from 'crypto';

/**
 * Sanity webhook for ISR (Incremental Static Regeneration)
 *
 * This endpoint receives webhooks from Sanity when content is published/updated.
 * It verifies the webhook signature and revalidates affected pages.
 *
 * @see https://www.sanity.io/docs/webhooks
 * @see https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration
 */

// Get webhook secret from environment
const WEBHOOK_SECRET = process.env.SANITY_WEBHOOK_SECRET;

/**
 * Verify webhook signature to ensure request is from Sanity
 */
function verifyWebhookSignature(
  body: string,
  signature: string | null
): boolean {
  if (!WEBHOOK_SECRET || !signature) {
    return false;
  }

  try {
    // Create HMAC-SHA256 hash of the body
    const hash = crypto
      .createHmac('sha256', WEBHOOK_SECRET)
      .update(body, 'utf8')
      .digest('base64');

    // Compare with the signature from header
    return crypto.timingSafeEqual(
      Buffer.from(hash),
      Buffer.from(signature)
    );
  } catch (error) {
    console.error('Webhook signature verification error:', error);
    return false;
  }
}

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
    const signature = request.headers.get('sanity-webhook-signature');

    // Verify the webhook signature
    if (!verifyWebhookSignature(bodyText, signature)) {
      console.error('[Webhook] Invalid signature');
      return NextResponse.json(
        { success: false, message: 'Invalid webhook signature' },
        { status: 401 }
      );
    }

    // Parse the webhook payload
    const payload = JSON.parse(bodyText);
    const { _type, slug } = payload;

    console.log(`[Webhook] Verified webhook for type: ${_type}`);

    // Revalidate paths based on document type
    if (_type === 'treatment') {
      // Revalidate the treatment detail pages
      if (slug?.current) {
        console.log(`[Webhook] Revalidating treatment: ${slug.current}`);
        // Revalidate all treatment detail routes (we don't know the category from webhook)
        revalidatePath('/treatments');
        revalidateTag('treatment');
      }
    } else if (_type === 'treatmentCategory') {
      // Revalidate category pages
      if (slug?.current) {
        console.log(`[Webhook] Revalidating category: ${slug.current}`);
        revalidatePath('/treatments');
        revalidateTag('treatmentCategory');
      }
    }

    // Always revalidate the main treatments page
    revalidatePath('/treatments');

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
export async function GET(request: NextRequest) {
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
