'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getCategories, TreatmentCategorySlug } from '@/lib/data/treatments'; 

interface CategoryFiltersProps {
  selectedCategory: TreatmentCategorySlug | 'all';
}

export default function CategoryFilters({ selectedCategory }: CategoryFiltersProps) {
  const categories = getCategories();
  const router = useRouter();

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
          variant={selectedCategory === 'all' ? 'default' : 'outline'}
          onClick={() => handleFilterChange('all')}
          size="sm"
        >
          All Treatments
        </Button>
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.slug ? 'default' : 'outline'}
            onClick={() => handleFilterChange(category.slug)}
            size="sm"
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

                    


