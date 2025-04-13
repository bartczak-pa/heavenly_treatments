import React from 'react';
import Link from 'next/link';
import { TreatmentCategory, categoryIconMap } from '@/lib/data/treatments';
import { cn } from '@/lib/utils';

interface Props {
  categories: TreatmentCategory[];
  baseLinkClasses?: string; // Base classes for all links
  iconClasses?: string; // Classes specifically for the icon
  textClasses?: string; // Classes specifically for the text
  showIcon?: boolean;
}

export default function TreatmentCategoryLinks({ 
    categories, 
    baseLinkClasses = '',
    iconClasses = 'h-4 w-4 flex-shrink-0 text-primary',
    textClasses = 'text-sm font-medium leading-none',
    showIcon = false 
}: Props) {
  return (
    <>
      {categories.map((category) => {
        const IconComponent = category.iconName ? categoryIconMap[category.iconName] : null;
        return (
          <Link
            key={category.id}
            href={`/treatments/${category.slug}`}
            className={cn('flex items-center space-x-2', baseLinkClasses)} // Combine base classes
          >
            {showIcon && IconComponent && <IconComponent className={cn(iconClasses)} />} 
            <span className={cn(textClasses)}>{category.name}</span>
          </Link>
        );
      })}
    </>
  );
} 