'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Treatment, TreatmentCategorySlug } from '@/lib/data/treatments';
import TreatmentsGrid from '@/components/Treatments/TreatmentsGrid';
import { Button } from '@/components/ui/button';
import { config } from '@/lib/config';

interface FilteredTreatmentsDisplayProps {
  filteredTreatments: Treatment[];
  currentSelection: TreatmentCategorySlug | 'all';
}

const { INITIAL_VISIBLE_TREATMENTS, RESPONSIVE_INCREMENTS, BREAKPOINTS } = config.ui; 


  /**
   * FilteredTreatmentsDisplay Component
   * 
   * A component that displays a grid of treatment cards with pagination functionality.
   * 
   * Features:
   * - Displays treatments in a responsive grid layout
   * - Implements "Show More" pagination
   * - Dynamically adjusts visible items based on screen size
   * - Resets visible count when category changes
   * - Handles empty states gracefully
   * 
   * @returns a JSX element
   */ 

export default function FilteredTreatmentsDisplay({ 
  filteredTreatments,
  currentSelection
}: FilteredTreatmentsDisplayProps) {


  const [visibleCount, setVisibleCount] = useState<number>(INITIAL_VISIBLE_TREATMENTS);

  
  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE_TREATMENTS);
  }, [currentSelection]);

  const totalTreatments: number = filteredTreatments.length;
  
  const treatmentsToShow: Treatment[] = useMemo(() => {
    return filteredTreatments.slice(0, visibleCount);
  }, [filteredTreatments, visibleCount]);
  
  const canShowMore: boolean = useMemo(() => {
    return visibleCount < totalTreatments;
  }, [visibleCount, totalTreatments]);

  
  /**
   * Handles the "Show More" button click event.
   * 
   * Dynamically adjusts the number of visible treatments based on screen width
   * using configuration values from @/lib/config.
   * 
   * @function
   * @returns {void}
   */

  const handleShowMore = useCallback(() => {
    const screenWidth: number = window.innerWidth;
    let increment: number = RESPONSIVE_INCREMENTS.SMALL; // Default increment (small screens)

    if (screenWidth >= BREAKPOINTS.EXTRA_LARGE) {
      increment = RESPONSIVE_INCREMENTS.EXTRA_LARGE;
    } else if (screenWidth >= BREAKPOINTS.LARGE) {
      increment = RESPONSIVE_INCREMENTS.LARGE;
    }

    setVisibleCount((prevCount) => Math.min(prevCount + increment, totalTreatments));
  }, [totalTreatments]);


  return (
    <>
      {treatmentsToShow.length > 0 ? (
        <TreatmentsGrid treatments={treatmentsToShow} />
      ) : (
        <p className="text-center text-muted-foreground mt-8">
          No treatments found for the selected category.
        </p>
      )}

      {canShowMore && (
        <div className="mt-12 text-center">
          <Button 
            variant="outline"
            size="lg"
            onClick={handleShowMore}
            aria-label="Show more treatments"
          >
            Show More Treatments
          </Button>
        </div>
      )}
    </>
  );
} 