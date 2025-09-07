'use client';

import React, { memo } from 'react';
import { Treatment, } from '@/lib/data/treatments';
import TreatmentCard from '@/components/Treatments/TreatmentCard';

interface TreatmentsGridProps {
    treatments: Treatment[];
}

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