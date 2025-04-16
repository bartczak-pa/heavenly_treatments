'use client';

import React from 'react';
import CookieConsent from 'react-cookie-consent';
import Link from 'next/link';
import Cookies from 'js-cookie';

const COOKIE_NAME = 'HeavenlyTreatmentsCookieConsent';
const COOKIE_EXPIRY_DAYS = 150;

const CookieConsentWrapper: React.FC = () => {

  const handleAccept = () => {
    Cookies.set(COOKIE_NAME, 'true', { expires: COOKIE_EXPIRY_DAYS });
    // Optional: Reload or trigger analytics initialization if needed immediately
    // window.location.reload(); 
  };

  const handleDecline = () => {
    Cookies.set(COOKIE_NAME, 'false', { expires: COOKIE_EXPIRY_DAYS });
    // Optional: Remove existing analytics cookies if any
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
        background: 'hsl(var(--secondary))',
        color: 'hsl(var(--secondary-foreground))',
        borderTop: '1px solid hsl(var(--border))',
        padding: '1rem',
      }}
      buttonStyle={{
        background: 'hsl(var(--primary))',
        color: 'hsl(var(--primary-foreground))',
        fontSize: '13px',
        padding: '0.5rem 1rem',
        borderRadius: 'var(--radius)',
        marginRight: '10px',
      }}
      declineButtonStyle={{ 
        background: 'hsl(var(--muted)) / 0.5',
        color: 'hsl(var(--muted-foreground))',
        fontSize: '13px',
        padding: '0.5rem 1rem',
        borderRadius: 'var(--radius)',
      }}
      expires={COOKIE_EXPIRY_DAYS}
    >
      This website uses cookies, including Google Analytics for performance tracking, to enhance your experience. See our{' '}
      <Link href="/cookie-policy" className="underline hover:text-primary">
        Cookie Policy
      </Link>{' '}
      for details.
    </CookieConsent>
  );
};

export default CookieConsentWrapper; 