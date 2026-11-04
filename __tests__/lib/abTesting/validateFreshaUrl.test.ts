import { describe, it, expect } from 'vitest';
import { validateFreshaUrl } from '@/lib/abTesting/validateFreshaUrl';

const LISTING =
  'https://www.fresha.com/en-GB/a/heavenly-treatments-with-hayleybell-kelso-easter-softlaw-farm-cottage-h3aozhyl';

describe('validateFreshaUrl', () => {
  it('accepts an expanded treatment link', () => {
    expect(
      validateFreshaUrl(
        `${LISTING}/booking?sl=3w38j82ms&pId=2525483&configToken=3w38j82ms`
      )
    ).toBe(true);
  });

  it('accepts an /a/ link without the locale prefix', () => {
    expect(
      validateFreshaUrl(
        'https://www.fresha.com/a/heavenly-treatments-with-hayleybell-kelso-easter-softlaw-farm-cottage-h3aozhyl/booking?sl=3w38j82ms&pId=2525483'
      )
    ).toBe(true);
  });

  it('treats an empty field as valid (the field is optional)', () => {
    expect(validateFreshaUrl(undefined)).toBe(true);
    expect(validateFreshaUrl('')).toBe(true);
  });

  it('rejects a Fresha short link and says how to expand it', () => {
    const result = validateFreshaUrl('https://l.fresha.com/3w38j82ms');
    expect(result).toMatch(/short link/i);
    expect(result).toMatch(/open it/i);
  });

  it('rejects a /book-now/ link', () => {
    const result = validateFreshaUrl(
      'https://www.fresha.com/book-now/heavenly-treatments-with-hayleybell-wvoyw0pw/services?lid=2607755&oiid=sv%3A24904170&pId=2525483'
    );
    expect(result).toMatch(/book-now/);
  });

  it('rejects a link containing a cartId', () => {
    const result = validateFreshaUrl(
      `${LISTING}/booking?sl=3w38j82ms&pId=2525483&cartId=cae44050-1667-47c5-9400-458847346b90`
    );
    expect(result).toMatch(/cartId/);
  });

  it('rejects a non-Fresha link', () => {
    expect(validateFreshaUrl('https://example.com/a/booking')).toMatch(
      /www\.fresha\.com/
    );
  });

  it('rejects a Fresha link outside the /a/ booking pages', () => {
    expect(validateFreshaUrl('https://www.fresha.com/for-business')).toMatch(
      /\/a\//
    );
  });

  it('rejects a value that is not a URL', () => {
    expect(validateFreshaUrl('fresha.com/a/whatever')).toEqual(
      expect.any(String)
    );
  });
});
