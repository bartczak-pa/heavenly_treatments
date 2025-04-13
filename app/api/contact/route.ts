import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';
import { contactFormSchema, } from '@/lib/validations/contact';
import ContactEmail from '@/components/Email/ContactEmail';
import { createElement } from 'react';
import { render } from '@react-email/render';

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

// Turnstile secrets
const turnstileSecretKey = process.env.TURNSTILE_SECRET_KEY;
const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

async function verifyTurnstileToken(token: string): Promise<boolean> {
  /**
   * Verifies a Turnstile token with Cloudflare's verification service.
   * 
   * This function:
   * 1. Validates the presence of the Turnstile secret key
   * 2. Sends a POST request to Cloudflare's verification endpoint
   * 3. Handles timeouts and errors gracefully
   * 4. Returns a boolean indicating verification success
   * 
   * @param {string} token - The Turnstile token to verify
   * @returns {Promise<boolean>} - True if verification succeeds, false otherwise
   * 
   * @example
   * ```ts
   * const isValid = await verifyTurnstileToken(token);
   * if (!isValid) {
   *   throw new Error('Invalid Turnstile token');
   * }
   * ```
   */
  if (!turnstileSecretKey) {
    console.error('TURNSTILE_SECRET_KEY environment variable is not set.');
    return false; // Cannot verify without secret key
  }
  
  const formData = new FormData();
  formData.append('secret', turnstileSecretKey);
  formData.append('response', token);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000); // 5-second timeout

  try {
    console.log('API Route - Sending request to Turnstile...');
    const response = await fetch(TURNSTILE_VERIFY_URL, {
      method: 'POST', 
      body: formData,
      signal: controller.signal, // Add abort signal
    });
    
    if (!response.ok) {
      console.error(`Turnstile verification failed with status: ${response.status}`);
      return false;
    }
    const data = await response.json();
    console.log('Turnstile verification response:', data); 
    return data.success === true;

  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('API Route - Turnstile verification fetch timed out.');
    } else {
      console.error('API Route - Turnstile verification fetch error:', error);
    }
    return false;
  } finally {
    clearTimeout(timeoutId); // Clear the timeout always
  }
}

export async function POST(request: NextRequest) {
  /**
   * POST handler for the contact form API endpoint.
   * 
   * This handler processes contact form submissions by:
   * 1. Validating the request body against the contact form schema
   * 2. Verifying the Turnstile token for bot protection
   * 3. Rendering and sending an email using the Resend SDK
   * 
   * @param {NextRequest} request - The incoming request object containing form data
   * @returns {Promise<NextResponse>} A response indicating success or failure
   * 
   * @example
   * ```ts
   * // Example request body
   * {
   *   firstName: "John",
   *   email: "john@example.com",
   *   phone: "1234567890",
   *   treatment: "massage",
   *   message: "I'd like to book an appointment",
   *   preferredDate: "2024-03-15",
   *   preferredTime: "14:00",
   *   cancellationPolicy: true,
   *   turnstileToken: "valid_token_here"
   * }
   * ```
   * 
   * @throws {Error} If environment variables are missing or invalid
   * @throws {Error} If form validation fails
   * @throws {Error} If Turnstile verification fails
   * @throws {Error} If email sending fails
   */
  console.log('API Route /api/contact POST request received');

  // --- Envs validated at startup --- 
  const fromEmail = process.env.EMAIL_FROM_ADDRESS;
  const toEmail = process.env.CONTACT_EMAIL;

  try {
    // 1. Parse request body
    const body = await request.json();
    console.log('API Route - Received contact form submission.'); 

    // 2. Validate data using Zod schema
    const validatedData = contactFormSchema.parse(body);
    console.log('API Route - Validation successful');

    // 3. Verify Turnstile token
    const isHuman = await verifyTurnstileToken(validatedData.turnstileToken);
    if (!isHuman) {
      // Error already logged in verifyTurnstileToken
      return NextResponse.json(
        { success: false, message: 'Bot verification failed. Please try again.' },
        { status: 422 } // Unprocessable Entity
      );
    }
    console.log('API Route - Turnstile verification successful');

    // 4. Prepare email data (remove token)
    // eslint-disable-next-line no-unused-vars
    const { turnstileToken, ...emailData } = validatedData;

    // 5. Render email template
    console.log('API Route - Rendering email template...');
    const emailHtml = await render(
      createElement(ContactEmail, { formData: emailData })
    );
    console.log('API Route - Email template rendered.');

    // 6. Send email using Resend SDK (ensure fromEmail/toEmail were loaded)
    if (!fromEmail || !toEmail) { // Minimal check here in case startup validation failed silently
       console.error('API Route Critical Error: EMAIL_FROM_ADDRESS or CONTACT_EMAIL missing despite startup validation!');
       return NextResponse.json({ success: false, message: 'Server configuration error.' },{ status: 500 });
    }
    
    
    if (process.env.NODE_ENV !== 'production') {
      console.log(`API Route - Sending email from ${fromEmail} to ${toEmail} via Resend SDK...`);
    } else {
      console.log('API Route - Sending email via Resend SDK...'); 
    }

    const { data, error } = await resend.emails.send({
      from: fromEmail, 
      to: [toEmail], 
      subject: `New Contact Form Submission: ${emailData.firstName}`,
      html: emailHtml,
    });

    if (error) {
      console.error('API Route - Resend SDK Error:', error);
      let clientMessage = 'Failed to send message due to a server error.';
      if (error.message.includes('verified sender address')) {
        clientMessage = 'Server configuration error: Sending email address is not verified.';
      } else if (error.message.includes('Invalid `to` field')) {
        clientMessage = 'Server configuration error: Invalid recipient email address.';
      }
      return NextResponse.json(
        { success: false, message: clientMessage },
        { status: 500 }
      );
    }
    
    console.log('API Route - Email sent successfully via Resend. ID:', data?.id);
    return NextResponse.json(
      { success: true, message: 'Thank you! Your message has been sent successfully.' },
      { status: 200 }
    );

  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: 'Invalid form data. Please check your entries.', errors: error.flatten().fieldErrors },
        { status: 400 } // Bad Request
      );
    }
    // Handle other types of errors
    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred on the server.' },
      { status: 500 }
    );
  }
} 