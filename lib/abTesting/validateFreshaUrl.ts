/**
 * Fresha URL validation for Booking Button links stored in Sanity
 *
 * Only expanded `www.fresha.com/.../a/...` URLs keep the campaign tags
 * `getBookingUrl` adds. Fresha short links (`l.fresha.com`) and
 * `/book-now/` URLs both redirect server-side and drop any extra query
 * parameters, so tagged bookings could no longer be credited to the
 * Fresha Group.
 */

const HOW_TO_EXPAND =
  'Open it in a browser, copy the www.fresha.com address it lands on, and remove "&cartId=…".';

/**
 * Validate a Fresha booking URL.
 *
 * @param url - The URL entered in Sanity (empty is allowed: the field is
 * optional and falls back to the general Fresha URL)
 * @returns `true` when valid, otherwise an editor-facing error message
 */
export function validateFreshaUrl(url: string | undefined): true | string {
  if (!url) {
    return true;
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return 'Enter the full link, starting with https://www.fresha.com/';
  }

  if (parsed.hostname === 'l.fresha.com') {
    return `This is a Fresha short link, which loses the booking tracking tags. ${HOW_TO_EXPAND}`;
  }

  if (parsed.hostname !== 'www.fresha.com') {
    return 'Use a www.fresha.com booking link.';
  }

  if (parsed.pathname.startsWith('/book-now/')) {
    return `Fresha "/book-now/" links lose the booking tracking tags. ${HOW_TO_EXPAND}`;
  }

  if (!/^\/(?:[a-z]{2}-[A-Z]{2}\/)?a\//.test(parsed.pathname)) {
    return 'Use a Fresha booking page link (the address contains "/a/heavenly-treatments-…").';
  }

  if (parsed.searchParams.has('cartId')) {
    return 'Remove "&cartId=…" from the link: Fresha creates a new one for each visitor.';
  }

  return true;
}
