/**
 * @fileoverview Category filter component for treatment pages
 * 
 * Provides both desktop (button-based) and mobile (dropdown-based) filtering
 * interfaces for treatment categories. Handles URL navigation and scroll behavior.
 * 
 * @author Claude Code
 * @version 1.0.0
 */

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TreatmentCategorySlug, TreatmentCategory } from '@/lib/data/treatments';

/**
 * Props interface for the CategoryFilters component
 */
interface CategoryFiltersProps {
  /** Currently selected category slug or 'all' for all treatments */
  selectedCategory: TreatmentCategorySlug | 'all';
  /** Treatment categories to display in filters */
  categories: TreatmentCategory[];
}

/**
 * Category filters component with responsive design
 *
 * Displays treatment category filters with different interfaces for desktop and mobile:
 * - Desktop: Button-based horizontal filter bar
 * - Mobile: Dropdown select component for space efficiency
 *
 * Handles URL navigation without scroll reset for better UX.
 *
 * @param props - Component props
 * @returns JSX element representing the category filter interface
 *
 * @example
 * ```typescript
 * <CategoryFilters selectedCategory="facial-treatments" categories={categories} />
 * ```
 */
export default function CategoryFilters({ selectedCategory, categories }: CategoryFiltersProps) {
  const router = useRouter();

  /**
   * Handles category filter change events
   * 
   * Navigates to the appropriate URL based on the selected category.
   * Uses router.push with scroll: false to maintain scroll position.
   * 
   * @param slug - The category slug to filter by, or 'all' for all treatments
   * @returns void
   */
  const handleFilterChange = (slug: string) => {
    if (slug === 'all') {
      router.push('/treatments', { scroll: false });
    } else {
      router.push(`/treatments?category=${slug}`, { scroll: false });
    }
  };

  return (
    <div className="mb-8 flex flex-col sm:flex-row justify-center items-center gap-4">
      <span className="text-sm font-medium text-muted-foreground hidden sm:block">Filter by category:</span>
      {/* Desktop Buttons */}
      <div className="hidden sm:flex flex-wrap justify-center gap-2">
        <Button
          variant={selectedCategory === 'all' ? 'default' : 'ghost'}
          onClick={() => handleFilterChange('all')}
          size="sm"
          aria-pressed={selectedCategory === 'all'}
        >
          All Treatments
        </Button>
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.slug ? 'default' : 'ghost'}
            onClick={() => handleFilterChange(category.slug)}
            size="sm"
            aria-pressed={selectedCategory === category.slug}
          >
            {category.name}
          </Button>
        ))}
      </div>
      {/* Mobile Select Dropdown */}
      <div className="sm:hidden w-full max-w-xs">
        <Select value={selectedCategory} onValueChange={handleFilterChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Treatments</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.slug}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

                    


