import React, { useEffect } from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as Toast from '@radix-ui/react-toast';
import ContactFormComponent from '@/components/Contact/ContactForm';
import { CONSENT_COOKIE_NAME } from '@/lib/cookieUtils';
import type { Treatment } from '@/lib/data/treatments';
import type { ABTestVariant } from '@/lib/abTesting/variantAssignment';

const push = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}));

// Turnstile passes verification straight away
vi.mock('react-turnstile', () => ({
  default: function TurnstileStub({
    onVerify,
  }: {
    onVerify: (token: string) => void;
  }) {
    useEffect(() => {
      onVerify('test-token');
      // Verify once on mount, like the real widget (onVerify changes every
      // render, so depending on it would loop)
    }, []);
    return null;
  },
}));

/** The site layout mounts a Toast provider around every page */
function ContactForm(props: React.ComponentProps<typeof ContactFormComponent>) {
  return (
    <Toast.Provider>
      <ContactFormComponent {...props} />
      <Toast.Viewport />
    </Toast.Provider>
  );
}

const treatments = [
  {
    id: 'swedish-massage',
    title: 'Swedish Massage',
    slug: 'swedish-massage',
    price: '£40',
    category: 'massages',
  },
] as unknown as Treatment[];

function clearCookies() {
  document.cookie.split(';').forEach((c) => {
    const name = c.split('=')[0].trim();
    if (name) {
      document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }
  });
}

function giveConsent() {
  document.cookie = `${CONSENT_COOKIE_NAME}=true; path=/`;
}

/** A consented Participant in the given Assigned Group */
function joinGroup(group: ABTestVariant) {
  giveConsent();
  // Experiment IDs that hash to each group
  document.cookie = `ab_test_variant=user_${group}_group; path=/`;
}

async function fillAndSubmit({ valid = true } = {}) {
  const user = userEvent.setup();
  await user.type(screen.getByPlaceholderText('Your first name'), 'Anna');
  await user.type(
    screen.getByPlaceholderText('your.email@example.com'),
    'anna@example.com'
  );
  await user.type(
    screen.getByPlaceholderText('07123456789'),
    valid ? '07123456789' : '12345'
  );
  await user.type(
    screen.getByPlaceholderText(/allergies or medical conditions/i),
    'I would like to book a massage please.'
  );
  await user.click(screen.getByRole('checkbox'));
  await user.click(screen.getByRole('button', { name: /send my message/i }));
}

function conversions(gtag: ReturnType<typeof vi.fn>) {
  return gtag.mock.calls
    .filter(([cmd, name]) => cmd === 'event' && name === 'booking_form_submitted')
    .map(([, , params]) => params as Record<string, unknown>);
}

function respond(ok: boolean) {
  return vi.fn().mockResolvedValue({
    ok,
    json: () => Promise.resolve({ message: ok ? 'Sent' : 'Server error' }),
  });
}

describe('ContactForm Booking Request tracking', () => {
  let gtag: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    clearCookies();
    sessionStorage.clear();
    vi.stubEnv('NEXT_PUBLIC_AB_TEST_ENABLED', 'true');
    gtag = vi.fn();
    window.gtag = gtag;
    push.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    clearCookies();
    delete window.gtag;
  });

  it('records one Booking Request with the Assigned Group and treatment once the server accepts it', async () => {
    joinGroup('form');
    vi.stubGlobal('fetch', respond(true));
    render(
      <ContactForm treatments={treatments} initialTreatment="Swedish Massage" />
    );

    await fillAndSubmit();

    await waitFor(() => expect(push).toHaveBeenCalled());
    expect(conversions(gtag)).toEqual([
      { ab_test_variant: 'form', treatment_name: 'Swedish Massage' },
    ]);
  });

  it('credits a Fresha Group Participant who reached the form through a Contact Link to fresha, with treatment_name=none', async () => {
    joinGroup('fresha');
    vi.stubGlobal('fetch', respond(true));
    render(<ContactForm treatments={treatments} />);

    await fillAndSubmit();

    await waitFor(() => expect(push).toHaveBeenCalled());
    expect(conversions(gtag)).toEqual([
      { ab_test_variant: 'fresha', treatment_name: 'none' },
    ]);
  });

  it('records a Booking Request as non_participant while the experiment flag is off', async () => {
    vi.stubEnv('NEXT_PUBLIC_AB_TEST_ENABLED', 'false');
    giveConsent();
    vi.stubGlobal('fetch', respond(true));
    render(<ContactForm treatments={treatments} />);

    await fillAndSubmit();

    await waitFor(() => expect(push).toHaveBeenCalled());
    expect(conversions(gtag)).toEqual([
      { ab_test_variant: 'non_participant', treatment_name: 'none' },
    ]);
  });

  it('records no Booking Request when the server rejects the submission', async () => {
    joinGroup('fresha');
    const fetchMock = respond(false);
    vi.stubGlobal('fetch', fetchMock);
    render(<ContactForm treatments={treatments} />);

    await fillAndSubmit();

    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /send my message/i })).toBeInTheDocument()
    );
    expect(conversions(gtag)).toEqual([]);
    expect(push).not.toHaveBeenCalled();
  });

  it('records no Booking Request on a network error', async () => {
    joinGroup('fresha');
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const fetchMock = vi.fn().mockRejectedValue(new Error('offline'));
    vi.stubGlobal('fetch', fetchMock);
    render(<ContactForm treatments={treatments} />);

    await fillAndSubmit();

    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /send my message/i })).toBeInTheDocument()
    );
    expect(conversions(gtag)).toEqual([]);
  });

  it('records no Booking Request when validation fails', async () => {
    joinGroup('fresha');
    const fetchMock = respond(true);
    vi.stubGlobal('fetch', fetchMock);
    render(<ContactForm treatments={treatments} />);

    await fillAndSubmit({ valid: false });

    expect(
      await screen.findByText('Please enter a valid UK phone number.')
    ).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(conversions(gtag)).toEqual([]);
  });
});
