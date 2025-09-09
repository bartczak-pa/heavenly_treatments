/**
 * @fileoverview Third-party dependency optimization utilities
 * 
 * Provides tree-shakeable exports and utility functions to reduce bundle size.
 * Consolidates commonly used dependencies and provides optimized alternatives
 * to heavier utility libraries.
 * 
 * @author Claude Code
 * @version 1.0.0
 */

import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Optimized icon imports - only import what's needed
 * 
 * Tree-shakeable icon exports from Radix UI to reduce bundle size
 * compared to importing the entire icon library.
 */
export { 
  ReloadIcon, 
  Cross2Icon,
  ChevronDownIcon,
  CheckIcon,
  ChevronRightIcon 
} from '@radix-ui/react-icons';

/**
 * Optimized Radix UI imports - tree-shakeable
 * 
 * Named exports from Radix UI primitives to enable better tree-shaking
 * and reduce bundle size compared to default imports.
 */
export {
  Root as ToastRoot,
  Provider as ToastProvider,
  Title as ToastTitle,
  Description as ToastDescription,
  Close as ToastClose,
  Viewport as ToastViewport,
} from '@radix-ui/react-toast';

export {
  Root as SelectRoot,
  Trigger as SelectTrigger,
  Value as SelectValue,
  Content as SelectContent,
  Item as SelectItem,
} from '@radix-ui/react-select';

export {
  Root as DialogRoot,
  Trigger as DialogTrigger,
  Content as DialogContent,
  Title as DialogTitle,
  Description as DialogDescription,
} from '@radix-ui/react-dialog';

/**
 * Optimized utility functions
 * 
 * Re-exports of essential utility libraries for consistent usage across the application.
 */
export { clsx } from 'clsx';
export { twMerge } from 'tailwind-merge';

/**
 * Custom utility function to replace class-variance-authority for simpler use cases
 * 
 * Creates a variant function for conditional class application without the overhead
 * of a full class variance authority library.
 * 
 * @param base - Base CSS classes to always apply
 * @param variants - Object mapping variant names to their CSS classes
 * @returns Function that takes a variant name and returns combined classes
 * 
 * @example
 * ```typescript
 * const buttonVariants = createVariant('px-4 py-2 rounded', {
 *   primary: 'bg-blue-500 text-white',
 *   secondary: 'bg-gray-200 text-gray-800'
 * });
 * 
 * const primaryButton = buttonVariants('primary');
 * ```
 */
export const createVariant = (base: string, variants: Record<string, string>) => {
  return (variant?: string) => {
    const variantClass = variant && variants[variant] ? variants[variant] : '';
    return `${base} ${variantClass}`.trim();
  };
};

/**
 * Utility to optimize className merging with Tailwind CSS
 * 
 * Combines clsx for conditional class application with tailwind-merge
 * for handling Tailwind CSS class conflicts and duplicates.
 * 
 * @param classes - Array of class strings or conditional class expressions
 * @returns Merged and deduplicated class string optimized for Tailwind CSS
 * 
 * @example
 * ```typescript
 * const classes = cn(
 *   'px-4 py-2',
 *   isActive && 'bg-blue-500',
 *   'px-6' // This will override px-4 due to tailwind-merge
 * );
 * ```
 */
export const cn = (...classes: (string | undefined)[]) => {
  return twMerge(clsx(classes));
};