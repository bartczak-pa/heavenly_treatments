import React, { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

/**
 * Call-to-action section component with customizable styling and accessibility features.
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
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    muted: 'bg-muted'
} as const;

const VARIANT_HEADING_COLORS = {
    primary: 'text-primary-foreground',
    secondary: 'text-secondary-foreground',
    muted: 'text-muted-foreground'
} as const;

const VARIANT_DESCRIPTION_COLORS = {
    primary: 'text-primary-foreground/90',
    secondary: 'text-secondary-foreground/80',
    muted: 'text-muted-foreground/80'
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
    // Memoize computed values to prevent unnecessary recalculations
    const { uid, headingId, descId, variantStyles, headingColor, descriptionColor } = useMemo(() => {
        const uid = Math.random().toString(36).substr(2, 9); // Simplified ID generation
        return {
            uid,
            headingId: `${uid}-heading`,
            descId: `${uid}-desc`,
            variantStyles: VARIANT_STYLES[variant],
            headingColor: VARIANT_HEADING_COLORS[variant],
            descriptionColor: VARIANT_DESCRIPTION_COLORS[variant]
        };
    }, [variant]);

    return (
        <section 
            className={cn(
                'py-16 md:py-24',
                variantStyles,
                className
            )}
            aria-labelledby={headingId}
        >
            <div className="container mx-auto px-4 text-center">
                <h2 
                    id={headingId}
                    className={cn(
                        'font-serif text-3xl md:text-4xl font-semibold mb-4',
                        headingColor
                    )}
                >
                    {title}
                </h2>
                <p 
                    id={descId}
                    className={cn(
                        'font-sans text-lg mb-8 max-w-2xl mx-auto',
                        descriptionColor
                    )}
                >
                    {description}
                </p>
                <Button 
                    size="lg" 
                    variant={buttonVariant}
                    asChild
                    aria-describedby={descId}
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
