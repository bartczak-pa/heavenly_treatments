'use client';

import React from 'react';

const ContactInfo = () => {
    return (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <h3 className="text-xl font-bold mb-4">Hours</h3>
                <p className="text-gray-700">Mon to Sun: 9 AM – 7 PM</p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold mb-4">Location</h3>
                <p className="text-gray-700">6 EASTER SOFTLAW FARM COTTAGE</p>
                <p className="text-gray-700">TD5 8BJ KELSO</p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold mb-4">Contact</h3>
                <p className="text-gray-700">hayley@heavenly-treatments.co.uk</p>
                <p className="text-gray-700">07960 315337</p>
              </div>
            </div>
          </div>
        </section>
    )
}

export default ContactInfo;
