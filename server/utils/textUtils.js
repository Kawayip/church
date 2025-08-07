/**
 * Server-side utility functions for text processing
 */

/**
 * Cleans HTML text by removing tags and normalizing whitespace
 * @param {string} htmlText - The HTML text to clean
 * @param {number} maxLength - Maximum length for the cleaned text
 * @returns {string} Cleaned text
 */
function cleanHtmlText(htmlText, maxLength = 160) {
  if (!htmlText) return '';
  
  // Remove HTML tags
  let cleanText = htmlText.replace(/<[^>]*>/g, '');
  
  // Normalize whitespace
  cleanText = cleanText.replace(/\s+/g, ' ').trim();
  
  // Truncate if needed
  if (maxLength && cleanText.length > maxLength) {
    cleanText = cleanText.substring(0, maxLength).trim() + '...';
  }
  
  return cleanText;
}

/**
 * Creates a social media friendly description
 * @param {string} htmlContent - The HTML content
 * @param {string} fallbackText - Fallback text if content is empty
 * @param {number} maxLength - Maximum length for the description
 * @returns {string} Social media friendly description
 */
function createSocialDescription(htmlContent, fallbackText = '', maxLength = 160) {
  const cleanText = cleanHtmlText(htmlContent, maxLength);
  return cleanText || fallbackText;
}

/**
 * Extracts plain text for sharing
 * @param {string} htmlContent - The HTML content
 * @param {number} maxLength - Maximum length for the extracted text
 * @returns {string} Plain text for sharing
 */
function extractPlainTextForSharing(htmlContent, maxLength = 200) {
  return cleanHtmlText(htmlContent, maxLength);
}

module.exports = {
  cleanHtmlText,
  createSocialDescription,
  extractPlainTextForSharing
};
