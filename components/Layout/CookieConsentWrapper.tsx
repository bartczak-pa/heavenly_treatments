/**
 * @fileoverview Cookie consent wrapper component with GDPR compliance
 * 
 * Provides a user-friendly cookie consent banner with accept/decline options.
 * Integrates with the application's theme system and includes proper cookie
 * management with expiration handling.
 * 
 * @author Claude Code
 * @version 1.0.0
 */

'use client';

import React from 'react';
import CookieConsent from 'react-cookie-consent';
import Link from 'next/link';
import Cookies from 'js-cookie';

/** Cookie name used for storing consent preferences */
const COOKIE_NAME = 'HeavenlyTreatmentsCookieConsent';
/** Number of days before cookie consent expires */
const COOKIE_EXPIRY_DAYS = 150;

/**
 * Cookie consent wrapper component with GDPR compliance
 * 
 * Displays a cookie consent banner at the bottom of the page with:
 * - Accept/Decline button options
 * - Link to detailed cookie policy
 * - Theme-consistent styling using CSS custom properties
 * - Automatic cookie management with proper expiration
 * 
 * The component manages consent state and integrates with Google Analytics
 * and other tracking services based on user preferences.
 * 
 * @returns JSX element representing the cookie consent banner
 * 
 * @example
 * ```typescript
 * <CookieConsentWrapper />
 * ```
 */
const CookieConsentWrapper: React.FC = () => {

  /**
   * Handles cookie consent acceptance
   * 
   * Sets the consent cookie to 'true' with proper expiration.
   * This enables analytics and tracking functionality.
   * 
   * @returns void
   */
  const handleAccept = () => {
    Cookies.set(COOKIE_NAME, 'true', { expires: COOKIE_EXPIRY_DAYS });
  };

  /**
   * Handles cookie consent decline
   * 
   * Sets the consent cookie to 'false' with proper expiration.
   * This disables analytics and tracking functionality.
   * 
   * @returns void
   */
  const handleDecline = () => {
    Cookies.set(COOKIE_NAME, 'false', { expires: COOKIE_EXPIRY_DAYS });
  };

  return (
    <CookieConsent
      location="bottom"
      buttonText="Accept Cookies"
      declineButtonText="Decline Cookies"
      cookieName={COOKIE_NAME}
      enableDeclineButton
      onAccept={handleAccept}
      onDecline={handleDecline}
      style={{
        background: 'var(--primary)',
        color: 'hsl(var(--primary-foreground))',
        borderTop: '1px solid hsl(var(--border))',
        padding: '1rem',
      }}
      buttonStyle={{
        background: 'var(--secondary)',
        color: 'hsl(var(--primary-foreground))',
        fontSize: '13px',
        padding: '0.5rem 1rem',
        borderRadius: 'var(--radius)',
        marginRight: '10px',
      }}
      declineButtonStyle={{ 
        background: 'var(--secondary)',
        color: 'hsl(var(--muted-foreground))',
        fontSize: '13px',
        padding: '0.5rem 1rem',
        borderRadius: 'var(--radius)',
      }}
      expires={COOKIE_EXPIRY_DAYS}
    >
      This website uses cookies, including Google Analytics for performance tracking, to enhance your experience. See our{' '}
      <Link href="/cookie-policy" className="underline hover:text-background">
        Cookie Policy
      </Link>{' '}
      for details.
    </CookieConsent>
  );
};

export default CookieConsentWrapper; 