import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useTrackTreatmentView } from '@/hooks/useTrackTreatmentView';

// Mock the ga4 module
vi.mock('@/lib/analytics/ga4', () => ({
  trackViewItem: vi.fn(),
  parsePrice: vi.fn((price?: string) => {
    if (!price) return undefined;
    const cleaned = price.replace(/[^0-9.]/g, '');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? undefined : parsed;
  }),
}));

import { trackViewItem } from '@/lib/analytics/ga4';

describe('useTrackTreatmentView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should track view_item event on initial render', () => {
    const treatment = {
      id: 'treatment_1',
      title: 'Swedish Massage',
      category: 'Massages',
      price: '£65',
    };

    renderHook(() => useTrackTreatmentView(treatment));

    expect(trackViewItem).toHaveBeenCalledTimes(1);
    expect(trackViewItem).toHaveBeenCalledWith({
      id: 'treatment_1',
      name: 'Swedish Massage',
      category: 'Massages',
      price: 65,
    });
  });

  it('should NOT track duplicate events on re-render with same treatment', () => {
    const treatment = {
      id: 'treatment_1',
      title: 'Swedish Massage',
      category: 'Massages',
      price: '£65',
    };

    const { rerender } = renderHook(() => useTrackTreatmentView(treatment));

    // Re-render with same props
    rerender();
    rerender();

    expect(trackViewItem).toHaveBeenCalledTimes(1);
  });

  it('should track new event when treatment ID changes', () => {
    const treatment1 = {
      id: 'treatment_1',
      title: 'Swedish Massage',
      category: 'Massages',
      price: '£65',
    };

    const treatment2 = {
      id: 'treatment_2',
      title: 'Deep Tissue Massage',
      category: 'Massages',
      price: '£75',
    };

    const { rerender } = renderHook(
      ({ treatment }) => useTrackTreatmentView(treatment),
      { initialProps: { treatment: treatment1 } }
    );

    expect(trackViewItem).toHaveBeenCalledTimes(1);

    // Change to different treatment
    rerender({ treatment: treatment2 });

    expect(trackViewItem).toHaveBeenCalledTimes(2);
    expect(trackViewItem).toHaveBeenLastCalledWith({
      id: 'treatment_2',
      name: 'Deep Tissue Massage',
      category: 'Massages',
      price: 75,
    });
  });

  it('should handle treatment without price', () => {
    const treatment = {
      id: 'treatment_3',
      title: 'Consultation',
    };

    renderHook(() => useTrackTreatmentView(treatment));

    expect(trackViewItem).toHaveBeenCalledWith({
      id: 'treatment_3',
      name: 'Consultation',
      category: undefined,
      price: undefined,
    });
  });

  it('should handle treatment without category', () => {
    const treatment = {
      id: 'treatment_4',
      title: 'Special Treatment',
      price: '£50',
    };

    renderHook(() => useTrackTreatmentView(treatment));

    expect(trackViewItem).toHaveBeenCalledWith({
      id: 'treatment_4',
      name: 'Special Treatment',
      category: undefined,
      price: 50,
    });
  });
});
