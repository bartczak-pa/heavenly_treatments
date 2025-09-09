'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import OptimizedImage from '@/components/OptimizedImage';
import Link from 'next/link';

const MainHeader = () => {
    return (
        <section className="relative h-[60vh] md:h-[70vh] w-full flex items-center justify-center text-center text-white overflow-hidden">
            <div className="absolute inset-0 z-0"> 
                <OptimizedImage
                    src="young-woman-having-face-massage-relaxing-spa-salon" 
                    alt="Young woman having face massage relaxing in a spa salon"
                    fill
                    sizes="100vw"
                    style={{ objectFit: 'cover' }}
                    priority
                    fallback="/images/mainPage/young-woman-having-face-massage-relaxing-spa-salon.jpg"
                />
                <div className="absolute inset-0 bg-black/50 z-1"></div> 
            </div>
            <div className="relative z-20 container mx-auto px-4 flex flex-col items-center">
                <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-4 drop-shadow-md text-primary">
                Professional Massage, Facials, Reflexology and Beauty Treatments in Kelso
                </h1>
                <p className="font-sans text-lg md:text-xl mb-8 max-w-2xl text-primary-foreground">
                    Revitalize Your Mind, Body, and Soul at Heavenly Treatments – Kelso&rsquo;s Hidden Gem for Relaxation and Wellness.
                </p>
                <Button size="lg" asChild className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/80 hover:to-primary text-primary-foreground shadow-lg">
                    <Link href="/treatments">Explore Treatments</Link>
                </Button>
            </div>
        </section>
    )
}

export default MainHeader;