'use client';

import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Treatment } from '@/lib/data/treatments';
import Image from 'next/image';
import Link from 'next/link';

interface TreatmentsGridProps {
    treatments: Treatment[];
}

const TreatmentsGrid: React.FC<TreatmentsGridProps> = ({ treatments }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {treatments.map((treatment) => (
                <Card key={treatment.id} className="flex flex-col overflow-hidden transition-shadow hover:shadow-lg">
                    <CardHeader className="p-0">
                        <div className="relative w-full h-48">
                            <Image
                                src={treatment.image}
                                alt={treatment.title}
                                fill
                                style={{ objectFit: 'cover' }}
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 flex-1">
                        <CardTitle className="text-lg font-semibold mb-2">{treatment.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">{treatment.description}</p>
                    </CardContent>
                    <CardFooter className="p-4">
                        <Button variant="outline" asChild>
                            <Link href={`/treatments/${treatment.category}/${treatment.slug}`}>
                                View Details
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
};

export default TreatmentsGrid;