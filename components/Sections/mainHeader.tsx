'use client';

import React from 'react';
import { Button } from '../ui/button';
import Image from 'next/image';
import Link from 'next/link';
import hero from '@/public/images/mainPage/young-woman-having-face-massage-relaxing-spa-salon.webp';

interface MainHeaderProps {
    priority?: boolean;
}

const MainHeader = ({ priority = false }: MainHeaderProps) => {
    return (
        <section className="relative h-[60vh] md:h-[70vh] w-full flex items-center justify-center text-center text-white overflow-hidden">
            <div className="absolute inset-0 z-0">
                <Image
                    src={hero}
                    alt=""
                    fill
                    className="object-cover absolute inset-0 w-full h-full"
                    sizes="100vw"
                    placeholder="blur"
                    priority={priority}
                    aria-hidden="true"
                />
                <div className="absolute inset-0 bg-black/50 z-10 pointer-events-none" aria-hidden="true"></div>
            </div>
            <div className="relative z-20 container mx-auto px-4 flex flex-col items-center">
                <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 drop-shadow-md text-primary">
                Professional Massage, Facials, Reflexology and Beauty Treatments in Kelso
                </h1>
                <p className="font-sans text-lg md:text-xl mb-12 sm:mb-24 max-w-2xl text-primary-foreground">
                    Revitalize Your Mind, Body, and Soul at Heavenly Treatments – Kelso&rsquo;s Hidden Gem for Relaxation and Wellness.
                </p>
                <Button size="xl" asChild className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/80 hover:to-primary text-primary-foreground shadow-lg">
                    <Link href="/treatments">Explore Treatments</Link>
                </Button>
            </div>
        </section>
    )
}

export default MainHeader;