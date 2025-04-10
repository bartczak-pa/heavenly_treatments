'use client';

import React, { useState } from 'react';
import { Treatment, TreatmentCategorySlug } from '@/lib/data/treatments';
import TreatmentsGrid from './treatmentsGrid';
import { Button } from '@/components/ui/button';

interface FilteredTreatmentsDisplayProps {
  filteredTreatments: Treatment[];
  currentSelection: TreatmentCategorySlug | 'all';
}

const initialVisibleCount = 6;

export default function FilteredTreatmentsDisplay({ 
  filteredTreatments,
  currentSelection
}: FilteredTreatmentsDisplayProps) {
  const [visibleCount, setVisibleCount] = useState(initialVisibleCount);

  const treatmentsToShow = filteredTreatments.slice(0, visibleCount);
  const hasMoreTreatments = filteredTreatments.length > visibleCount;

  // Get the category name for the button text (if not 'all')
  const categoryName = currentSelection !== 'all' 
    ? currentSelection.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) // Simple slug-to-name approximation
    : ''; 

  return (
    <>
      {treatmentsToShow.length > 0 ? (
        <TreatmentsGrid treatments={treatmentsToShow} />
      ) : (
        <p className="text-center text-muted-foreground mt-8">
          No treatments found for the selected category.
        </p>
      )}

      {hasMoreTreatments && (
        <div className="text-center mt-12">
          <Button 
            onClick={() => setVisibleCount(filteredTreatments.length)}
            variant="outline"
            size="lg"
          >
            Show All {categoryName} Treatments ({filteredTreatments.length})
          </Button>
        </div>
      )}
    </>
  );
} 