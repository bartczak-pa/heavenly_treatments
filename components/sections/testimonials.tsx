'use client';

import React from 'react';
import Image from 'next/image';
import testimonialsData from '@/lib/data/testimonials';




const Testimonials = () => {
    return (
        <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">What Our Clients Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Map through your testimonials data here */}
            {testimonialsData.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-lg">
                <div className="flex items-center mb-4">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                  <div className="ml-4">
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-gray-500">
                      {testimonial.customerType}
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 italic">&quot;{testimonial.testimonial}&quot;</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
}

export default Testimonials;