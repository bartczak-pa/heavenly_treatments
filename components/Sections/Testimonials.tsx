'use client';

import React from 'react';
import testimonialsData from '@/lib/data/testimonials';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

const Testimonials = () => {
  /**
   * Testimonials Component
   *
   * Enhanced testimonials section with:
   * - Star ratings display
   * - Avatar initials with color backgrounds
   * - Improved typography and visual hierarchy
   * - Better spacing and card styling
   * - Responsive grid layout (1 column on mobile, 2 on tablet, 3 on desktop)
   * - Hover animations and transitions
   *
   * @returns {JSX.Element} A section containing a grid of testimonial cards
   */

  // Generate avatar background color based on name
  const getAvatarColor = (name: string): string => {
    const colors = [
      'bg-rose-100',
      'bg-pink-100',
      'bg-purple-100',
      'bg-blue-100',
      'bg-cyan-100',
      'bg-teal-100',
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  // Get initials from name
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Render star rating
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={i < rating ? 'text-primary text-lg' : 'text-muted-foreground/30 text-lg'}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <section className="py-16 md:py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <h2 className="font-serif text-3xl md:text-4xl font-semibold text-primary text-center mb-12">
          What My Clients Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonialsData.map((testimonial, index) => (
            <Card
              key={index}
              className="flex flex-col overflow-hidden shadow-md transition-all duration-300 ease-out hover:shadow-lg hover:-translate-y-1"
            >
              <CardHeader className="px-6 py-6 border-b border-border/50">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-col space-y-2 flex-grow">
                    <h4 className="font-serif text-lg font-semibold text-primary">
                      {testimonial.name}
                    </h4>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      {testimonial.customerType}
                    </p>
                  </div>
                  <div
                    className={`flex-shrink-0 w-12 h-12 rounded-lg ${getAvatarColor(
                      testimonial.name
                    )} flex items-center justify-center`}
                  >
                    <span className="text-sm font-bold text-foreground">
                      {getInitials(testimonial.name)}
                    </span>
                  </div>
                </div>
                <div className="mt-3">{renderStars(testimonial.rating)}</div>
              </CardHeader>
              <CardContent className="flex-grow px-6 py-6">
                <p className="font-sans text-sm leading-relaxed text-foreground/85">
                  &quot;{testimonial.testimonial}&quot;
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;