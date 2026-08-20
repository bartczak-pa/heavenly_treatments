'use client';

import type { CSSProperties, ElementType, HTMLAttributes, ReactNode } from 'react';
import { useReveal } from '@/hooks/useReveal';
import { cn } from '@/lib/utils';

interface RevealProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  /** Extra classes for the wrapper element. */
  className?: string;
  /** Stagger delay in milliseconds (drives the --reveal-delay CSS var). */
  delay?: number;
  /** Element to render as. Defaults to a plain div. */
  as?: ElementType;
}

/**
 * Wraps server-rendered content in a scroll-reveal.
 *
 * The child markup stays server-rendered — only this thin wrapper ships to the
 * client. It attaches an IntersectionObserver (via useReveal) and toggles the
 * `data-reveal` attribute that the CSS in globals.css transitions on.
 *
 * @example
 * <Reveal>
 *   <SomeServerSection />
 * </Reveal>
 *
 * @example Staggered grid
 * {items.map((item, i) => (
 *   <Reveal key={item.id} delay={i * 80}>
 *     <Card {...item} />
 *   </Reveal>
 * ))}
 */
export default function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = 'div',
  style: styleProp,
  ...rest
}: RevealProps) {
  const { ref, revealed } = useReveal<HTMLElement>();

  const style = delay
    ? ({ ...styleProp, '--reveal-delay': `${delay}ms` } as CSSProperties)
    : styleProp;

  return (
    <Tag
      ref={ref}
      data-reveal={revealed}
      style={style}
      className={cn(className)}
      {...rest}
    >
      {children}
    </Tag>
  );
}
