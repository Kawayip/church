import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Component that scrolls to top on route change
 * This ensures that when users navigate to a new page,
 * they start at the top instead of maintaining the previous scroll position
 */
export const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Small delay to ensure content is rendered
    const timer = setTimeout(() => {
      // Check if user prefers reduced motion
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      if (prefersReducedMotion) {
        // Instant scroll for users who prefer reduced motion
        window.scrollTo(0, 0);
      } else {
        // Smooth scroll for better UX with fallback
        try {
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
          });
        } catch (error) {
          // Fallback for browsers that don't support smooth scrolling
          window.scrollTo(0, 0);
        }
      }
    }, 100); // Small delay to ensure content is loaded

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
};
