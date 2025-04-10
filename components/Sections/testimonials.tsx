'use client';

import React from 'react';
import testimonialsData from '@/lib/data/testimonials';
// Import Card components
import { Card, CardHeader, CardContent } from '@/components/ui/card';


const Testimonials = () => {
    return (
        // Update section background and padding
        <section className="py-16 md:py-18 bg-secondary">
            <div className="container mx-auto px-4">
                {/* Update heading styles */}
                <h2 className="font-serif text-3xl md:text-4xl font-semibold text-primary text-center mb-12">
                    What my Clients Say
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonialsData.map((testimonial, index) => (
                        // Use Card component
                        <Card
                            key={index}
                            className="flex flex-col overflow-hidden shadow-lg group transition-all duration-300 ease-in-out hover:-translate-y-1"
                        >
                            {/* Use CardHeader for name/type, remove Image */}
                            <CardHeader className="px-4 py-1">
                                {/* Image component removed */}
                                <div className="flex flex-col">
                                    <h4 className="font-semibold text-primary">{testimonial.name}</h4>
                                    {/* Update customer type text color */}
                                    <p className="text-sm text-muted-foreground">
                                        {testimonial.customerType}
                                    </p>
                                </div>
                            </CardHeader>
                            {/* Use CardContent for the testimonial text */}
                            <CardContent className="flex-grow p-6 pt-0">
                                {/* Update testimonial text style and color */}
                                <p className="font-sans text-foreground/80 italic">&quot;{testimonial.testimonial}&quot;</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;