'use client';

import React, { useState, useMemo } from 'react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { getTreatments, Treatment, TreatmentCategorySlug } from '@/lib/data/treatments';
import CategoryFilters from '@/components/Treatments/categoryFilters';
import TreatmentsGrid from '@/components/Treatments/treatmentsGrid';


const allTreatments: Treatment[] = getTreatments();


export default function TreatmentsOverviewPage() {
  // State for the selected category filter
  const [selectedCategory, setSelectedCategory] = useState<TreatmentCategorySlug | 'all'>('all');

  // Memoize filtered treatments to avoid recalculation on every render
  const filteredTreatments = useMemo(() => {
    if (selectedCategory === 'all') {
      return allTreatments;
    }
    return allTreatments.filter(treatment => treatment.category === selectedCategory);
  }, [selectedCategory]); // Recalculate only when selectedCategory changes

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value as TreatmentCategorySlug | 'all');
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-4 text-primary">
          My Treatments
        </h1>
        <p className="text-lg text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
          Discover a range of therapies designed to relax your body, rejuvenate your skin, and restore your sense of well-being.
        </p>

        <CategoryFilters
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />

        {filteredTreatments.length > 0 ? (
          <TreatmentsGrid treatments={filteredTreatments} />
        ) : (
          <p className="text-center text-muted-foreground mt-8">
            No treatments found for the selected category.
          </p>
        )}
      </div>
    </MainLayout>
  );
}
