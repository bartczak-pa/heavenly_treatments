import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names with Tailwind CSS classes optimally.
 * This utility is used by Shadcn UI components.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Truncates text to a maximum length without cutting a word in half.
 *
 * Trims back to the last whole word and appends an ellipsis when truncation
 * occurs. Used for SEO meta descriptions so SERP snippets never end mid-word.
 */
export function truncateAtWord(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  // Reserve one character for the ellipsis.
  const sliced = text.slice(0, maxLength - 1);
  const lastSpace = sliced.lastIndexOf(' ');
  const truncated = lastSpace > 0 ? sliced.slice(0, lastSpace) : sliced;
  return `${truncated.trimEnd()}…`;
}
