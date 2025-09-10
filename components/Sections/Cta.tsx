'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

/**
 * Call-to-action section component with customizable styling and accessibility features
 * 
 * @param title - The main heading text for the CTA
 * @param description - Supporting description text
 * @param buttonText - Text displayed on the action button
 * @param buttonLink - URL or path for the button link
 * @param variant - Background style variant
 * @param buttonVariant - Button style variant
 * @param className - Additional CSS classes
 */
interface CTAProps {
    /** Main heading text for the CTA */
    title: string;
    /** Supporting description text */
    description: string;
    /** Text displayed on the action button */
    buttonText: string;
    /** URL or path for the button link */
    buttonLink: string;
    /** Background style variant */
    variant?: 'primary' | 'secondary' | 'muted';
    /** Button style variant */
    buttonVariant?: 'default' | 'secondary' | 'outline';
    /** Additional CSS classes for customization */
    className?: string;
}

const VARIANT_STYLES = {
    primary: 'bg-primary text-white',
    secondary: 'bg-secondary text-secondary-foreground',
    muted: 'bg-muted text-muted-foreground'
} as const;

const CTASection = ({ 
    title, 
    description, 
    buttonText, 
    buttonLink,
    variant = 'primary',
    buttonVariant = 'secondary',
    className
}: CTAProps) => {
    const variantStyles = VARIANT_STYLES[variant];
    const descriptionColor = variant === 'primary' ? 'text-background/90' : 'text-muted-foreground/80';

    return (
        <section 
            className={cn(
                'py-16 md:py-24',
                variantStyles,
                className
            )}
            role="banner"
            aria-labelledby="cta-heading"
        >
            <div className="container mx-auto px-4 text-center">
                <h2 
                    id="cta-heading"
                    className="font-serif text-3xl md:text-4xl font-semibold mb-4"
                >
                    {title}
                </h2>
                <p className={cn(
                    'font-sans text-lg mb-8 max-w-2xl mx-auto',
                    descriptionColor
                )}>
                    {description}
                </p>
                <Button 
                    size="lg" 
                    variant={buttonVariant}
                    asChild
                    aria-label={`${buttonText} - ${description}`}
                >
                    <Link href={buttonLink}>
                        {buttonText}
                    </Link>
                </Button>
            </div>
        </section>
    );
};

CTASection.displayName = 'CTASection';

export default CTASection;
