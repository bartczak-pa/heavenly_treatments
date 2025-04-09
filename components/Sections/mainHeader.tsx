'use client';

import React from 'react';
import { Button } from '../UI/button';
import Image from 'next/image';
import Link from 'next/link';

const MainHeader = () => {
    return (
        <section className="relative h-screen">
        <div className="absolute inset-0">
          <Image
            src="/images/spa-hero.jpg" //TODO:  Replace with hero image path
            alt="Luxury Spa Interior"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-4">
          <h1 className="text-5xl md:text-7xl font-bold text-center mb-6">
            Experience Heavenly Treatments
          </h1>
          <p className="text-xl md:text-2xl text-center mb-8 max-w-2xl">
            Indulge in luxury spa treatments designed to rejuvenate your body and soul.
          </p>
          <Link href="/treatments">
            <Button size="lg" className="bg-white text-black hover:bg-gray-100">
                Book Your Treatment
            </Button>
          </Link>
        </div>
      </section>
    )
}


export default MainHeader;