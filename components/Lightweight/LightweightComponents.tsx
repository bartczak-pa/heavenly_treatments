'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/optimizeImports';

// Lightweight Select component - reduces bundle size compared to full Radix Select
interface LightweightSelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  children: React.ReactNode;
  className?: string;
}

export const LightweightSelect: React.FC<LightweightSelectProps> = ({
  value,
  onValueChange,
  placeholder,
  children,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={selectRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between px-3 py-2 border rounded-md bg-background",
          "text-left focus:outline-none focus:ring-2 focus:ring-primary"
        )}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={value ? 'text-foreground' : 'text-muted-foreground'}>
          {value || placeholder}
        </span>
        <svg
          className={cn("h-4 w-4 transform transition-transform", isOpen ? "rotate-180" : "")}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className={cn(
          "absolute z-50 mt-1 w-full bg-background border rounded-md shadow-lg max-h-60 overflow-auto"
        )}>
          <div
            role="listbox"
            onClick={(e) => {
              const target = e.target as HTMLElement;
              const value = target.getAttribute('data-value');
              if (value && onValueChange) {
                onValueChange(value);
                setIsOpen(false);
              }
            }}
          >
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

// Lightweight Select Option
interface LightweightSelectOptionProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export const LightweightSelectOption: React.FC<LightweightSelectOptionProps> = ({
  value,
  children,
  className,
}) => {
  return (
    <div
      data-value={value}
      role="option"
      className={cn(
        "px-3 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground",
        "focus:bg-accent focus:text-accent-foreground",
        className
      )}
    >
      {children}
    </div>
  );
};

// Lightweight Button component - simpler than full UI library button
interface LightweightButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  children: React.ReactNode;
}

export const LightweightButton: React.FC<LightweightButtonProps> = ({
  variant = 'default',
  size = 'default',
  className,
  children,
  ...props
}) => {
  const variantClasses = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    link: 'text-primary underline-offset-4 hover:underline',
  };

  const sizeClasses = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 rounded-md px-3',
    lg: 'h-11 rounded-md px-8',
    icon: 'h-10 w-10',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background',
        'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        'focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

// Lightweight Toast component - smaller than full Radix Toast
interface LightweightToastProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

export const LightweightToast: React.FC<LightweightToastProps> = ({
  open,
  onOpenChange,
  title,
  description,
  variant = 'default',
}) => {
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        onOpenChange(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [open, onOpenChange]);

  if (!open) return null;

  const variantClasses = {
    default: 'bg-background border shadow-md',
    destructive: 'bg-destructive text-destructive-foreground',
  };

  return (
    <div
      className={cn(
        'fixed bottom-4 right-4 z-50 w-full max-w-sm p-4 rounded-md',
        'animate-in slide-in-from-bottom-2',
        variantClasses[variant]
      )}
      role="alert"
    >
      <div className="flex justify-between items-start">
        <div>
          {title && <div className="font-semibold">{title}</div>}
          {description && <div className="text-sm mt-1">{description}</div>}
        </div>
        <button
          onClick={() => onOpenChange(false)}
          className="ml-2 hover:opacity-70"
          aria-label="Close notification"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};