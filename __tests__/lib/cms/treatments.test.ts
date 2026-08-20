import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getTreatmentMenuByCategory } from '@/lib/cms/treatments';
import { sanityClient } from '@/lib/sanity/client';
import { treatmentsMenuByCategoryQuery } from '@/lib/sanity/queries';
import type { SanityTreatmentMenuItem } from '@/lib/sanity/types';

vi.mock('@/lib/sanity/client', () => ({
  sanityClient: {
    fetch: vi.fn(),
  },
}));

// sanityClient.fetch is heavily overloaded; treat the mock as a simple
// async function so resolved/rejected values type-check cleanly.
const mockedFetch = sanityClient.fetch as unknown as ReturnType<typeof vi.fn>;

describe('getTreatmentMenuByCategory', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('returns accordion-row-shaped items for a category (happy path)', async () => {
    const rows: SanityTreatmentMenuItem[] = [
      {
        _id: 'treatment-1',
        title: 'Swedish Full Body Massage',
        slug: 'swedish-full-body-massage',
        description: 'Relax and unwind with a classic full-body Swedish massage.',
        duration: '60 mins',
        price: '£40',
        categorySlug: 'massages',
      },
    ];
    mockedFetch.mockResolvedValueOnce(rows);

    const result = await getTreatmentMenuByCategory('massages');

    // Uses the parameterized GROQ query with the category slug (server-side filter).
    expect(mockedFetch).toHaveBeenCalledWith(treatmentsMenuByCategoryQuery, {
      categorySlug: 'massages',
    });
    expect(result).toEqual([
      {
        id: 'treatment-1',
        name: 'Swedish Full Body Massage',
        slug: 'swedish-full-body-massage',
        shortDescription:
          'Relax and unwind with a classic full-body Swedish massage.',
        durationLabel: '60 mins',
        price: '£40',
        href: '/treatments/massages/swedish-full-body-massage',
      },
    ]);
  });

  it('returns an empty list for an unknown or empty category', async () => {
    mockedFetch.mockResolvedValueOnce([]);

    const result = await getTreatmentMenuByCategory('does-not-exist');

    expect(result).toEqual([]);
  });

  it('returns an empty list (no crash) when the query throws', async () => {
    mockedFetch.mockRejectedValueOnce(new Error('Sanity unavailable'));

    const result = await getTreatmentMenuByCategory('massages');

    expect(result).toEqual([]);
  });
});
