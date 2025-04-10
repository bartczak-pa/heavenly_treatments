'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getCategories, TreatmentCategorySlug } from '@/lib/data/treatments'; 

interface CategoryFiltersProps {
  selectedCategory: TreatmentCategorySlug | 'all';
  onCategoryChange: (value: string) => void;
}

export default function CategoryFilters({ selectedCategory, onCategoryChange }: CategoryFiltersProps) {
  const categories = getCategories();

  return (
    <div className="mb-8 flex flex-col sm:flex-row justify-center items-center gap-4">
      <span className="text-sm font-medium text-muted-foreground hidden sm:block">Filter by category:</span>
      {/* Desktop Buttons */}
      <div className="hidden sm:flex flex-wrap justify-center gap-2">
        <Button
          variant={selectedCategory === 'all' ? 'default' : 'outline'}
          onClick={() => onCategoryChange('all')}
          size="sm"
        >
          All Treatments
        </Button>
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.slug ? 'default' : 'outline'}
            onClick={() => onCategoryChange(category.slug)}
            size="sm"
          >
            {category.name}
          </Button>
        ))}
      </div>
      {/* Mobile Select Dropdown */}
      <div className="sm:hidden w-full max-w-xs">
        <Select value={selectedCategory} onValueChange={onCategoryChange}>
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

                    


