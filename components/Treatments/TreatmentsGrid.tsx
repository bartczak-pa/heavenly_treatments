'use client';

import React from 'react';
import { Treatment, } from '@/lib/data/treatments';
import TreatmentCard from '@/components/Treatments/TreatmentCard';

interface TreatmentsGridProps {
    treatments: Treatment[];
}

const TreatmentsGrid: React.FC<TreatmentsGridProps> = ({ treatments }) => {
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
};

export default TreatmentsGrid;