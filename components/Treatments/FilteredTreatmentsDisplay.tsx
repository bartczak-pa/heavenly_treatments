'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Treatment, TreatmentCategorySlug } from '@/lib/data/treatments';
import TreatmentsGrid from '@/components/Treatments/TreatmentsGrid';
import { Button } from '@/components/ui/button';

interface FilteredTreatmentsDisplayProps {
  filteredTreatments: Treatment[];
  currentSelection: TreatmentCategorySlug | 'all';
}

const INITIAL_VISIBLE_COUNT: number = 3; 


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


  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);

  
  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE_COUNT);
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
   * Dynamically adjusts the number of visible treatments based on screen width:
   * - Small screens (< 1024px): Shows 3 more treatments
   * - Large screens (1024px - 1279px): Shows 4 more treatments
   * - Extra large screens (≥ 1280px): Shows 6 more treatments
   * 
   * @function
   * @returns {void}
   */

  const handleShowMore = useCallback(() => {
    const screenWidth: number = window.innerWidth;
    let increment: number = 3; // Default increment (small screens)

    if (screenWidth >= 1280) { // Approx XL breakpoint
      increment = 6;
    } else if (screenWidth >= 1024) { // Approx LG breakpoint
      increment = 4;
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
          >
            Show More Treatments
          </Button>
        </div>
      )}
    </>
  );
} 