import DOMPurify from 'dompurify';

/**
 * Allowed HTML tags for Quran content (tafsir, chapter info, translations)
 * Restricted set to prevent XSS while allowing basic formatting
 */
const ALLOWED_TAGS = ['p', 'br', 'strong', 'em', 'b', 'i', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'sup'];

/**
 * Sanitize HTML content from external APIs (Quran.com, tafsir sources)
 * Uses DOMPurify for robust XSS protection
 */
export function sanitizeHtml(html: string): string {
  if (!html) return '';
  
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR: [], // No attributes allowed - prevents onclick, onerror, etc.
    KEEP_CONTENT: true, // Keep text content of removed tags
  });
}

/**
 * Alias for chapter info HTML sanitization
 */
export function sanitizeChapterHtml(html: string): string {
  return sanitizeHtml(html);
}

/**
 * Alias for tafsir HTML sanitization
 */
export function sanitizeTafsirHtml(html: string): string {
  return sanitizeHtml(html);
}

/**
 * Alias for basic HTML sanitization (translations, etc.)
 */
export function sanitizeBasicHtml(html: string): string {
  return sanitizeHtml(html);
}
