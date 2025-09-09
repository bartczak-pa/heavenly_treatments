/**
 * @fileoverview Responsive grid component for displaying treatment cards
 * 
 * Optimized with React.memo for performance when treatment lists change frequently.
 * Uses CSS Grid with responsive breakpoints for optimal layout across devices.
 * 
 * @author Claude Code
 * @version 1.0.0
 */

'use client';

import React, { memo } from 'react';
import { Treatment, } from '@/lib/data/treatments';
import TreatmentCard from '@/components/Treatments/TreatmentCard';

/**
 * Props interface for the TreatmentsGrid component
 */
interface TreatmentsGridProps {
    /** Array of treatments to display in the grid */
    treatments: Treatment[];
}

/**
 * Responsive grid component for treatment cards
 * 
 * Displays treatments in a responsive CSS Grid layout:
 * - Mobile: 1 column
 * - Small screens (sm): 2 columns  
 * - Large screens (lg): 3 columns
 * 
 * Optimized with React.memo to prevent unnecessary re-renders when props haven't changed.
 * 
 * @param props - Component props
 * @returns JSX element representing the treatments grid
 * 
 * @example
 * ```typescript
 * <TreatmentsGrid treatments={filteredTreatments} />
 * ```
 */
const TreatmentsGrid = memo<TreatmentsGridProps>(({ treatments }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {treatments.map((treatment) => (
                <TreatmentCard 
                    key={treatment.id} 
                    treatment={treatment} 
                />
            ))}
        </div>
    );
});

TreatmentsGrid.displayName = 'TreatmentsGrid';

export default TreatmentsGrid;