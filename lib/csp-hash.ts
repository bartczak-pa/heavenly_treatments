import crypto from 'crypto';

/**
 * Generate CSP-compliant SHA-256 hash for static inline scripts
 * This allows us to use static generation while maintaining CSP security
 */
export function generateCSPHash(content: string): string {
  const hash = crypto.createHash('sha256').update(content, 'utf8').digest('base64');
  return `sha256-${hash}`;
}

/**
 * Generate inline script content for JSON-LD with CSP hash
 */
export function createJSONLDScript(data: object): { content: string; hash: string } {
  const content = JSON.stringify(data);
  const hash = generateCSPHash(content);
  
  return {
    content,
    hash
  };
}