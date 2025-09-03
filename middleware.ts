import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Generate a unique nonce for each request
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const isDev = process.env.NODE_ENV === 'development';


  // Define CSP directives with necessary third-party integrations
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic' 
      https://www.googletagmanager.com 
      https://www.google-analytics.com 
      https://vercel.live 
      ${isDev ? "'unsafe-eval'" : ''};
    style-src 'self' 'nonce-${nonce}' 
      https://fonts.googleapis.com 
      ${isDev ? "'unsafe-inline'" : ''};
    img-src 'self' blob: data: 
      https://www.google-analytics.com 
      https://www.googletagmanager.com
      https://vercel.com;
    font-src 'self' 
      https://fonts.gstatic.com;
    connect-src 'self' 
      https://www.google-analytics.com 
      https://www.googletagmanager.com
      https://region1.google-analytics.com
      https://analytics.google.com
      https://vitals.vercel-analytics.com
      https://vercel.live;
    frame-src 'self' 
      https://www.google.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    ${!isDev ? 'upgrade-insecure-requests;' : ''}
  `.replace(/\s{2,}/g, ' ').trim();

  // Clone request headers and add nonce
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', cspHeader);

  // Create response with CSP header
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Set CSP header on response
  response.headers.set('Content-Security-Policy', cspHeader);

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)  
     * - favicon.ico (favicon file)
     */
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};