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
  };

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