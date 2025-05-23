
import { NavigateFunction } from 'react-router-dom';

/**
 * Standardized back navigation function
 * First tries to go back in browser history, then falls back to home page
 */
export const goBack = (navigate: NavigateFunction) => {
  // Check if there's a previous page in history
  if (window.history.length > 1) {
    // Check if the previous page is within our app
    const referrer = document.referrer;
    const currentOrigin = window.location.origin;
    
    if (referrer && referrer.startsWith(currentOrigin)) {
      window.history.back();
    } else {
      // If no referrer or external referrer, go to home
      navigate('/', { replace: false });
    }
  } else {
    // No history, go to home page
    navigate('/', { replace: false });
  }
};

/**
 * Navigate to home page
 */
export const goHome = (navigate: NavigateFunction) => {
  navigate('/', { replace: false });
};

/**
 * Navigate to auth page
 */
export const goToAuth = (navigate: NavigateFunction) => {
  navigate('/auth', { replace: false });
};
