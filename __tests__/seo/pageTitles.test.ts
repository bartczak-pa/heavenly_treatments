import { describe, it, expect, vi } from 'vitest';
import type { Metadata } from 'next';
import { config } from '@/lib/config';

// Page modules pull in the Sanity client transitively; it throws without env config
vi.mock('@/lib/sanity/client', () => ({
  sanityClient: { fetch: vi.fn() },
}));

vi.mock('@/lib/cms/treatments', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/lib/cms/treatments')>()),
  getCategories: vi.fn(async () => [
    { id: 'c1', name: 'Massages', slug: 'massages', description: 'Massage treatments in Kelso.' },
  ]),
  getTreatmentBySlug: vi.fn(async () => ({
    id: 't1',
    title: 'Hot Stone Massage',
    slug: 'hot-stone-massage',
    description: 'A deeply relaxing massage using warm basalt stones.',
    price: '£60',
    duration: '60 minutes',
    category: 'massages',
    keyFeatures: [],
  })),
}));

const BRAND = 'Heavenly Treatments';
const MAX_TITLE_LENGTH = 60;

/**
 * Mirrors how Next.js renders a page's title: a string title from a nested
 * segment goes through the root layout's template, while the homepage shares
 * the root segment, so the template doesn't apply to it.
 */
function renderTitle(metadata: Metadata, { templated }: { templated: boolean }): string {
  const { title } = metadata;
  if (typeof title !== 'string') throw new Error('Expected a string title');
  return templated ? config.seo.TITLE_TEMPLATE.replace('%s', title) : title;
}

function ogTitle(metadata: Metadata): string {
  const title = metadata.openGraph?.title;
  if (typeof title !== 'string') throw new Error('Expected a string OpenGraph title');
  return title;
}

function brandCount(title: string): number {
  return title.split(BRAND).length - 1;
}

interface PageCase {
  route: string;
  load: () => Promise<Metadata>;
  templated: boolean;
}

const pages: PageCase[] = [
  {
    route: '/',
    templated: false,
    load: async () => (await import('@/app/page')).generateMetadata(),
  },
  {
    route: '/treatments',
    templated: true,
    load: async () => (await import('@/app/treatments/page')).generateMetadata(),
  },
  {
    route: '/treatments/massages',
    templated: true,
    load: async () =>
      (await import('@/app/treatments/[categorySlug]/page')).generateMetadata({
        params: Promise.resolve({ categorySlug: 'massages' }),
      }),
  },
  {
    route: '/treatments/massages/hot-stone-massage',
    templated: true,
    load: async () =>
      (await import('@/app/treatments/[categorySlug]/[treatmentSlug]/page')).generateMetadata({
        params: Promise.resolve({ categorySlug: 'massages', treatmentSlug: 'hot-stone-massage' }),
      }),
  },
  {
    route: '/about',
    templated: true,
    load: async () => (await import('@/app/about/page')).generateMetadata(),
  },
  {
    route: '/contact',
    templated: true,
    load: async () => (await import('@/app/contact/page')).generateMetadata(),
  },
  {
    route: '/booking-confirmation',
    templated: true,
    load: async () => (await import('@/app/booking-confirmation/page')).generateMetadata(),
  },
  {
    route: '/cookie-policy',
    templated: true,
    load: async () => (await import('@/app/cookie-policy/page')).generateMetadata(),
  },
  {
    route: '/privacy-policy',
    templated: true,
    load: async () => (await import('@/app/privacy-policy/page')).generateMetadata(),
  },
  {
    route: '/terms',
    templated: true,
    load: async () => (await import('@/app/terms/page')).generateMetadata(),
  },
];

describe('Page titles (issue #156)', () => {
  describe.each(pages)('$route', ({ load, templated }) => {
    it('renders the brand exactly once in the title', async () => {
      const metadata = await load();
      expect(brandCount(renderTitle(metadata, { templated }))).toBe(1);
    });

    it('keeps the brand exactly once in the OpenGraph title', async () => {
      const metadata = await load();
      expect(brandCount(ogTitle(metadata))).toBe(1);
    });
  });

  it('leaves the homepage title unchanged', async () => {
    const metadata = await pages[0].load();
    expect(renderTitle(metadata, { templated: false })).toBe(
      'Massage & Beauty Treatments in Kelso | Heavenly Treatments'
    );
  });

  it.each([
    ['/treatments', 'Spa Treatment Menu in Kelso | Heavenly Treatments'],
    ['/about', 'About Hayley, Kelso Massage Therapist | Heavenly Treatments'],
    ['/contact', 'Contact & Bookings in Kelso | Heavenly Treatments'],
    ['/treatments/massages', 'Massages in Kelso | Heavenly Treatments'],
    ['/treatments/massages/hot-stone-massage', 'Hot Stone Massage in Kelso | Heavenly Treatments'],
  ])(`%s renders "%s" within ${MAX_TITLE_LENGTH} characters`, async (route, expected) => {
    const page = pages.find((p) => p.route === route)!;
    const title = renderTitle(await page.load(), { templated: true });
    expect(title).toBe(expected);
    expect(title.length).toBeLessThanOrEqual(MAX_TITLE_LENGTH);
  });
});
