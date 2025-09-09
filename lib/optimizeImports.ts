// Third-party dependency optimization utilities
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Optimized icon imports - only import what's needed
export { 
  ReloadIcon, 
  Cross2Icon,
  ChevronDownIcon,
  CheckIcon,
  ChevronRightIcon 
} from '@radix-ui/react-icons';

// Optimized Radix UI imports - tree-shakeable
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

// Optimized utility functions
export { clsx } from 'clsx';
export { twMerge } from 'tailwind-merge';

// Custom utility function to replace class-variance-authority for simpler use cases
export const createVariant = (base: string, variants: Record<string, string>) => {
  return (variant?: string) => {
    const variantClass = variant && variants[variant] ? variants[variant] : '';
    return `${base} ${variantClass}`.trim();
  };
};

// Utility to optimize className merging
export const cn = (...classes: (string | undefined)[]) => {
  return twMerge(clsx(classes));
};