
import { useState, useEffect } from 'react';

/**
 * Custom hook for responsive design
 * @param query The media query to check
 * @returns Boolean indicating if the media query matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    // Create a media query list
    const mediaQuery = window.matchMedia(query);
    
    // Set initial value
    setMatches(mediaQuery.matches);

    // Define callback for media query change events
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Add event listener for media query changes
    mediaQuery.addEventListener('change', handleChange);
    
    // Clean up event listener on unmount
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [query]);

  return matches;
}

// Common media query presets
export const mediaQueries = {
  isMobile: '(max-width: 640px)',
  isTablet: '(min-width: 641px) and (max-width: 1024px)',
  isDesktop: '(min-width: 1025px)',
  isLandscape: '(orientation: landscape)',
  isPortrait: '(orientation: portrait)',
  isDarkMode: '(prefers-color-scheme: dark)',
  isLightMode: '(prefers-color-scheme: light)',
  isReducedMotion: '(prefers-reduced-motion: reduce)',
  isTouchDevice: '(hover: none) and (pointer: coarse)',
};
