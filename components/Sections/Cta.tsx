'use client';
import React from 'react';

import { Button } from '@/components/ui/button';
import Link from 'next/link';

type CTAProps = {
    title: string,
    description: string,
    buttonText: string,
    buttonLink: string
}

const CTASection = ({ title, description, buttonText, buttonLink }: CTAProps) => {
    return (
        <section className="py-16 md:py-24 bg-primary">
            <div className="container mx-auto px-4 text-center">
                <h2 className="font-serif text-3xl md:text-4xl font-semibold text-white mb-4">
                    {title}
                </h2>
                <p className="font-sans text-lg text-background/90 mb-8 max-w-2xl mx-auto">
                    {description}
                </p>
                <Link href={buttonLink}>
                    <Button size="lg" variant="secondary">
                        {buttonText}
                    </Button>
                </Link>
            </div>
        </section>
    )
}

export default CTASection;
