
import { useMediaQuery, mediaQueries } from './use-media-query';

/**
 * Re-export useMediaQuery for backwards compatibility
 * This ensures any existing imports using useMediaQuery from use-mobile
 * will continue to work while we transition to use-media-query
 */
export { useMediaQuery, mediaQueries };

/**
 * Custom hook to detect if the current device is a mobile device
 * @returns Boolean indicating if the device is mobile
 */
export function useMobile(): boolean {
  return useMediaQuery(mediaQueries.isMobile);
}

export default useMobile;
