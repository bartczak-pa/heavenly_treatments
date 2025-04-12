import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';
import { contactFormSchema, } from '@/lib/validations/contact';
import ContactEmail from '@/components/Email/ContactEmail';
import { createElement } from 'react';
import { render } from '@react-email/render';

// Initialize Resend client - ensure RESEND_API_KEY is set in .env.local / Vercel envs
const resendApiKey = process.env.RESEND_API_KEY;


if (!resendApiKey) {
  console.error('RESEND_API_KEY environment variable is not set.'); 
  // TODO: Add a graceful error handling mechanism
}
const resend = new Resend(resendApiKey);

// Turnstile secrets
const turnstileSecretKey = process.env.TURNSTILE_SECRET_KEY;
const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';


async function verifyTurnstileToken(token: string): Promise<boolean> {
  /* 
  This function verifies the Turnstile token using the Cloudflare Turnstile API.
  It sends the token to the API and returns true if the token is valid, otherwise false. 
  It also logs the success/failure details to the console.

  @param token - The Turnstile token to verify
  @returns true if the token is valid, otherwise false
  @throws Error if the token is invalid / secret key is not set / API call fails / response is not ok / response is not JSON
  */
  if (!turnstileSecretKey) {
    console.error('TURNSTILE_SECRET_KEY environment variable is not set.');
    return false; // Cannot verify without secret key
  }
  const formData = new FormData();
  formData.append('secret', turnstileSecretKey);
  formData.append('response', token);
  try {
    const response = await fetch(TURNSTILE_VERIFY_URL, { method: 'POST', body: formData });
    if (!response.ok) {
      console.error(`Turnstile verification failed with status: ${response.status}`);
      return false;
    }
    const data = await response.json();
    console.log('Turnstile verification response:', data); // Log success/failure details
    return data.success === true;
  } catch (error) {
    console.error('API Route - Turnstile verification fetch error:', error);
    return false;
  }
}

// POST Handler for the contact form
export async function POST(request: NextRequest) {

  /* 
  This function handles the POST request for the contact form.
  It parses the request body, validates the data using the Zod schema, verifies the Turnstile token, and sends the email using the Resend SDK.
  It also logs the success/failure details to the console.

  @param request - The POST request object
  @returns A JSON response with the success/failure details
  @throws Error if the request body is not valid / Zod schema validation fails / Turnstile token verification fails / Email sending fails
  */
  try {
    // 1. Parse request body
    const body = await request.json();

    // 2. Validate data using Zod schema
    const validatedData = contactFormSchema.parse(body);

    // 3. Verify Turnstile token
    const isHuman = await verifyTurnstileToken(validatedData.turnstileToken);
    if (!isHuman) {
      console.error('API Route - Turnstile verification FAILED.');
      return NextResponse.json(
        { success: false, message: 'Bot verification failed. Please try again.' },
        { status: 422 } // Unprocessable Entity
      );
    }

    // 4. Prepare email data (remove token)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { turnstileToken: _token, ...emailData } = validatedData;

    // 5. Render email template
    const emailHtml = await render(
      createElement(ContactEmail, { formData: emailData })
    );

    // 6. Send email using Resend SDK
    const fromEmail = process.env.EMAIL_FROM_ADDRESS;
    const toEmail = process.env.CONTACT_EMAIL;

    if (!fromEmail || !toEmail) {
      console.error('Missing EMAIL_FROM_ADDRESS or CONTACT_EMAIL environment variables.');
      return NextResponse.json(
        { success: false, message: 'Server configuration error.' },
        { status: 500 }
      );
    }

    const { error } = await resend.emails.send({
      from: fromEmail, 
      to: [toEmail], 
      subject: `New Contact Form Submission: ${emailData.firstName} `,
      html: emailHtml,
    });

    if (error) {
      
      // @TODO: Add a more specific error message
      let clientMessage = 'Failed to send message due to a server error.';
      if (error.message.includes('verified sender address')) {
        clientMessage = 'Server configuration error: Sending email address is not verified.';
      } else if (error.message.includes('Invalid `to` field')) {
        clientMessage = 'Server configuration error: Invalid recipient email address.';
      }
      return NextResponse.json(
        { success: false, message: clientMessage, error: error.message },
        { status: 500 }
      );
    }
    
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