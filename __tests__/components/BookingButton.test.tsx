import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BookingButton } from '@/components/BookingButton';
import { useAbTestVariant } from '@/hooks/useAbTestVariant';

vi.mock('@/hooks/useAbTestVariant', () => ({
  useAbTestVariant: vi.fn(),
}));

const FRESHA_URL = 'https://www.fresha.com/book/swedish-massage';

function inGroup(variant: 'form' | 'fresha', isParticipant = true) {
  vi.mocked(useAbTestVariant).mockReturnValue({
    variant,
    isParticipant,
    isLoading: false,
  });
}

describe('BookingButton', () => {
  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_AB_TEST_ENABLED', 'true');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetAllMocks();
  });

  it("routes a Fresha Group Participant to the treatment's Fresha page", () => {
    inGroup('fresha');

    render(
      <BookingButton
        context="treatment-card"
        treatmentTitle="Swedish Massage"
        freshaUrl={FRESHA_URL}
      />
    );

    expect(screen.getByRole('link')).toHaveAttribute('href', FRESHA_URL);
  });

  it('routes the Form Group to the contact form with the treatment prefilled', () => {
    inGroup('form');

    render(
      <BookingButton
        context="treatment-card"
        treatmentTitle="Swedish Massage"
        freshaUrl={FRESHA_URL}
      />
    );

    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      '/contact?treatment=Swedish%20Massage'
    );
  });

  it('writes no group cookie while rendering', () => {
    document.cookie = 'HeavenlyTreatmentsCookieConsent=true; path=/';
    inGroup('form');

    render(<BookingButton context="navbar" />);

    expect(document.cookie).not.toContain('ab_test_variant=');
    document.cookie =
      'HeavenlyTreatmentsCookieConsent=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  });
});
