import React from 'react';
import testimonialsData from '@/lib/data/testimonials';
import { Card, CardHeader, CardContent } from '@/components/ui/card';


const Testimonials = () => {
    /**
     * Testimonials Component
     * 
     * This component displays a grid of client testimonials using a Card-based layout.
     * Each testimonial includes the client's name, customer type, and their testimonial text.
     * 
     * Features:
     * - Responsive grid layout (1 column on mobile, 2 on tablet, 3 on desktop)
     * - Hover animations for cards
     * - Consistent styling using the theme's color system
     * - Uses shadcn/ui Card components for consistent design
     * 
     * @returns {JSX.Element} A section containing a grid of testimonial cards
     * 
     * @example
     * ```tsx
     * <Testimonials />
     * ```
     */
    return (
        // Update section background and padding
        <section className="py-16 md:py-18 bg-secondary">
            <div className="container mx-auto px-4">
                {/* Update heading styles */}
                <h2 className="font-serif text-3xl md:text-4xl font-semibold text-primary text-center mb-12">
                    What My Clients Say
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonialsData.map((testimonial, index) => (
                        // Use Card component
                        <Card
                            key={index}
                            className="flex flex-col overflow-hidden shadow-md group transition-all duration-300 ease-out hover:shadow-lg hover:-translate-y-1"
                        >
                            <CardHeader className="px-4 py-1">
                                <div className="flex flex-col">
                                    <h4 className="font-semibold text-primary">{testimonial.name}</h4>
                                    <p className="text-sm text-muted-foreground">
                                        {testimonial.customerType}
                                    </p>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-grow p-6 pt-0">
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