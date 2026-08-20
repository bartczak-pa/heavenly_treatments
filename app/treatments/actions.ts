'use server';

import { getTreatmentMenuByCategory } from '@/lib/cms/treatments';
import type { TreatmentMenuItem } from '@/lib/data/treatments';

/**
 * Server action backing the lazy-loaded `/treatments` accordion.
 *
 * Called from the client when a category panel expands; returns just that
 * category's treatments in accordion-row shape. An empty/blank slug short-circuits
 * to `[]` so the UI never issues a pointless query or crashes.
 */
export async function fetchCategoryTreatmentMenu(
  categorySlug: string
): Promise<TreatmentMenuItem[]> {
  if (!categorySlug?.trim()) {
    return [];
  }

  return getTreatmentMenuByCategory(categorySlug);
}
