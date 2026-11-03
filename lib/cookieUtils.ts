import Cookies from 'js-cookie';

/** Cookie storing the visitor's answer to the cookie banner ('true'/'false') */
export const CONSENT_COOKIE_NAME = 'HeavenlyTreatmentsCookieConsent';
/** Number of days before the consent answer expires */
export const CONSENT_COOKIE_EXPIRY_DAYS = 150;

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
export function hasConsent(cookieName: string = CONSENT_COOKIE_NAME): boolean {
  const consentCookie = getCookie(cookieName);
  return consentCookie === 'true';
}

/** Window event fired when the visitor accepts or declines cookies */
export const CONSENT_CHANGE_EVENT = 'heavenly:consent-change';

/**
 * Tells the rest of the page that the consent answer has changed, so
 * consent-gated features (analytics, the booking experiment) can react
 * within the same visit.
 */
export function notifyConsentChange(): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(CONSENT_CHANGE_EVENT));
}

/**
 * Subscribes to consent changes. Returns an unsubscribe function.
 */
export function subscribeToConsentChange(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener(CONSENT_CHANGE_EVENT, callback);
  return () => window.removeEventListener(CONSENT_CHANGE_EVENT, callback);
}

/**
 * Stores the visitor's answer to the cookie banner and tells the rest of
 * the page, so consent-gated features react within the same visit.
 */
export function setConsent(accepted: boolean): void {
  Cookies.set(CONSENT_COOKIE_NAME, String(accepted), {
    expires: CONSENT_COOKIE_EXPIRY_DAYS,
  });
  notifyConsentChange();
}
