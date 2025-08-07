/**
 * Utility functions for image handling and URL generation
 */

/**
 * Ensures an image URL is absolute and optimized for social media
 * @param imageUrl - The image URL (can be relative or absolute)
 * @param baseUrl - The base URL of the application
 * @returns Optimized absolute image URL
 */
export const getOptimizedImageUrl = (imageUrl: string, baseUrl?: string): string => {
  if (!imageUrl) return '';
  
  // If it's already an absolute URL, return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // If it's a relative URL, make it absolute
  const base = baseUrl || window.location.origin;
  const absoluteUrl = imageUrl.startsWith('/') 
    ? `${base}${imageUrl}` 
    : `${base}/${imageUrl}`;
  
  // Add optimization parameters for social media
  const separator = absoluteUrl.includes('?') ? '&' : '?';
  return `${absoluteUrl}${separator}w=1200&h=630&fit=crop`;
};

/**
 * Gets the default church logo URL
 * @param baseUrl - The base URL of the application
 * @returns Default church logo URL
 */
export const getDefaultLogoUrl = (baseUrl?: string): string => {
  const base = baseUrl || window.location.origin;
  return `${base}/images/logos/church-logo.png`;
};

/**
 * Validates if an image URL is accessible
 * @param imageUrl - The image URL to validate
 * @returns Promise that resolves to true if image is accessible
 */
export const validateImageUrl = async (imageUrl: string): Promise<boolean> => {
  try {
    const response = await fetch(imageUrl, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.warn('Image validation failed:', error);
    return false;
  }
};

/**
 * Gets the best available image URL for social media sharing
 * @param primaryImage - Primary image URL
 * @param fallbackImage - Fallback image URL
 * @param baseUrl - The base URL of the application
 * @returns Promise that resolves to the best available image URL
 */
export const getBestImageUrl = async (
  primaryImage?: string, 
  fallbackImage?: string, 
  baseUrl?: string
): Promise<string> => {
  // Try primary image first
  if (primaryImage) {
    const optimizedPrimary = getOptimizedImageUrl(primaryImage, baseUrl);
    const isValid = await validateImageUrl(optimizedPrimary);
    if (isValid) {
      return optimizedPrimary;
    }
  }
  
  // Try fallback image
  if (fallbackImage) {
    const optimizedFallback = getOptimizedImageUrl(fallbackImage, baseUrl);
    const isValid = await validateImageUrl(optimizedFallback);
    if (isValid) {
      return optimizedFallback;
    }
  }
  
  // Return default logo as last resort
  return getDefaultLogoUrl(baseUrl);
};
