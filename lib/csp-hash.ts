import { createHash } from 'node:crypto';

/**
 * Generate CSP-compliant SHA-256 hash for static inline scripts
 * This allows us to use static generation while maintaining CSP security
 */
export function generateCSPHash(content: string): string {
  const hash = createHash('sha256').update(content, 'utf8').digest('base64');
  return `sha256-${hash}`;
}

/**
 * Generate inline script content for JSON-LD with CSP hash
 * Note: The returned hash must be added to the CSP header middleware for exact inline content matching
 */
export function createJSONLDScript(
  data: Record<string, unknown> | Array<Record<string, unknown>>
): { content: string; hash: string } {
  const content = JSON.stringify(data);
  const hash = generateCSPHash(content);
  
  return {
    content,
    hash
  };
}