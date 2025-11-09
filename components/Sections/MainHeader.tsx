'use client';

import React, { useId } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import OptimizedImage from '@/components/OptimizedImage';
import Link from 'next/link';

// Component configuration constants
const HERO_CONFIG = {
  heights: {
    mobile: 'h-[60svh]',
    desktop: 'md:h-[70svh]'
  },
  image: {
    src: 'young-woman-having-face-massage-relaxing-spa-salon',
    alt: 'Young woman having face massage relaxing in a spa salon',
    decorative: true,
    fallback: '/images/mainPage/young-woman-having-face-massage-relaxing-spa-salon.jpg'
  },
  content: {
    title: 'Professional Massage, Facials, Reflexology and Beauty Treatments in Kelso',
    subtitle: 'Revitalize Your Mind, Body, and Soul at Heavenly Treatments – Kelso\'s Hidden Gem for Relaxation and Wellness.',
    ctaText: 'Explore Treatments',
    ctaLink: '/treatments'
  }
} as const;

// CSS class combinations for better readability
const styles = {
  hero: `relative ${HERO_CONFIG.heights.mobile} ${HERO_CONFIG.heights.desktop} w-full 
         flex items-center justify-center text-center overflow-hidden`,
  
  imageContainer: 'absolute inset-0 z-0',
  
  overlay: 'absolute inset-0 bg-black/50 z-10',
  
  contentWrapper: `relative z-20 container mx-auto px-4 
                   flex flex-col items-center`,
  
  title: `font-serif text-4xl sm:text-5xl md:text-6xl font-bold 
          leading-tight mb-4 drop-shadow-md text-primary`,
  
  subtitle: `font-sans text-lg md:text-xl mb-8 max-w-2xl 
             text-primary-foreground`,
  
  ctaButton: `bg-gradient-to-r from-primary to-primary/80 
              hover:from-primary/80 hover:to-primary 
              text-primary-foreground shadow-lg
              focus-visible:outline-none focus-visible:ring-2 
              focus-visible:ring-offset-2 focus-visible:ring-primary`
} as const;

type MainHeaderProps = {
  id?: string;
  className?: string;
}

/**
 * MainHeader - Hero section component for the homepage
 * 
 * Displays a full-width hero section with background image, 
 * headline, subtitle, and call-to-action button.
 * 
 * Features:
 * - Responsive design with mobile-first approach
 * - Optimized image loading with fallback
 * - Accessible markup with proper semantic structure
 * - Customizable through HERO_CONFIG constant
 */
const MainHeader: React.FC<MainHeaderProps> = ({ id, className }) => {
    const reactId = useId();
    const sectionId = id ?? `main-hero-${reactId}`;
    const headingId = `${sectionId}-heading`;
    
    return (
        <section 
          id={sectionId}
          className={cn(styles.hero, className)}
          aria-labelledby={headingId}
        >
            {/* Background image with overlay */}
            <div className={styles.imageContainer}>
                <div className="relative w-full h-full">
                    <OptimizedImage
                        src={HERO_CONFIG.image.src}
                        alt={HERO_CONFIG.image.decorative ? "" : HERO_CONFIG.image.alt}
                        fill
                        skipAutoAspectRatio
                        sizes="100vw"
                        style={{ objectFit: 'cover' }}
                        priority
                        fallback={HERO_CONFIG.image.fallback}
                    />
                </div>
                <div className={styles.overlay} aria-hidden="true" />
            </div>

            {/* Main content */}
            <div className={styles.contentWrapper}>
                <h1 id={headingId} className={styles.title}>
                    {HERO_CONFIG.content.title}
                </h1>
                
                <p className={styles.subtitle}>
                    {HERO_CONFIG.content.subtitle}
                </p>
                
                <Button 
                  size="lg" 
                  asChild 
                  className={styles.ctaButton}
                >
                    <Link href={HERO_CONFIG.content.ctaLink}>
                        {HERO_CONFIG.content.ctaText}
                    </Link>
                </Button>
            </div>
        </section>
    )
}

export default MainHeader;