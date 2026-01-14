/**
 * @fileoverview Category Introduction component for SEO-optimized category pages
 *
 * Displays introductory content for treatment category pages to improve
 * SEO rankings and provide users with context about the category.
 *
 * @author Claude Code
 * @version 1.0.0
 */

import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Props interface for the CategoryIntroduction component
 */
interface CategoryIntroductionProps {
  /** Array of introduction paragraphs to display */
  paragraphs: string[];
  /** Optional CSS class names */
  className?: string;
}

/**
 * Category Introduction Section
 *
 * Displays SEO-optimized introduction content for treatment category pages.
 * Uses safe text rendering with React elements.
 *
 * @param props - Component props
 * @returns JSX element representing the category introduction
 *
 * @example
 * ```typescript
 * <CategoryIntroduction
 *   paragraphs={["Experience healing...", "Choose from..."]}
 * />
 * ```
 */
export function CategoryIntroduction({
  paragraphs,
  className,
}: CategoryIntroductionProps) {
  if (!paragraphs || paragraphs.length === 0) {
    return null;
  }

  return (
    <section className={cn('py-2 md:py-4', className)}>
      <div className="max-w-3xl mx-auto text-center space-y-4 text-lg text-muted-foreground">
        {paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}

export default CategoryIntroduction;
