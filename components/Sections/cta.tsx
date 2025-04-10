'use client';
import React from 'react';

import { Button } from '../ui/button';
import Link from 'next/link';

type CTAProps = {
    title: string,
    description: string,
    buttonText: string, 
    buttonLink: string
}

const CTASection = ({ title, description, buttonText, buttonLink }: CTAProps) => {
    return (
        <section className="py-20 bg-black text-white">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-4xl font-bold mb-6">{title}</h2>
                <p className="text-xl mb-8 max-w-2xl mx-auto">
                    {description}
                </p>
                <Link href={buttonLink}>
                    <Button size="lg" className="bg-white text-black hover:bg-gray-100">
                        {buttonText}
                    </Button>
                </Link>
            </div>
        </section>
    )
}

export default CTASection;
