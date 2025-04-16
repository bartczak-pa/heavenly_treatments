/**
 * Reads a specific cookie by name.
 * This function should only be called on the client-side.
 * @param name The name of the cookie to read.
 * @returns The cookie value or null if not found or not on client.
 */
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') {
    // Running on the server, cannot access document.cookie
    return null;
  }
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
}

/**
 * Checks if the user has given consent for non-essential cookies.
 * Reads the consent cookie set by react-cookie-consent.
 * @param cookieName The name of the consent cookie.
 * @returns True if consent is granted ('true'), false otherwise.
 */
export function hasConsent(cookieName: string = 'HeavenlyTreatmentsCookieConsent'): boolean {
  const consentCookie = getCookie(cookieName);
  return consentCookie === 'true';
} 