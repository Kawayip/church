/**
 * Utility functions for text processing and cleaning
 */

/**
 * Cleans HTML text by removing tags and normalizing whitespace
 * @param htmlText - The HTML text to clean
 * @param maxLength - Optional maximum length for truncation
 * @returns Cleaned plain text
 */
export const cleanHtmlText = (htmlText: string, maxLength?: number): string => {
  if (!htmlText) return '';
  
  // Remove HTML tags
  let cleanText = htmlText.replace(/<[^>]*>/g, '');
  
  // Normalize whitespace (replace multiple spaces/tabs/newlines with single space)
  cleanText = cleanText.replace(/\s+/g, ' ').trim();
  
  // Truncate if maxLength is provided
  if (maxLength && cleanText.length > maxLength) {
    cleanText = cleanText.substring(0, maxLength).trim() + '...';
  }
  
  return cleanText;
};

/**
 * Extracts plain text from HTML content for social sharing
 * @param htmlContent - The HTML content
 * @param maxLength - Maximum length for the extracted text (default: 200)
 * @returns Plain text suitable for social sharing
 */
export const extractPlainTextForSharing = (htmlContent: string, maxLength: number = 200): string => {
  return cleanHtmlText(htmlContent, maxLength);
};

/**
 * Creates a social media friendly description
 * @param htmlContent - The HTML content
 * @param fallbackText - Fallback text if content is empty
 * @param maxLength - Maximum length (default: 160 for meta descriptions)
 * @returns Clean description text
 */
export const createSocialDescription = (
  htmlContent: string, 
  fallbackText: string = '', 
  maxLength: number = 160
): string => {
  const cleanText = cleanHtmlText(htmlContent, maxLength);
  return cleanText || fallbackText;
};
