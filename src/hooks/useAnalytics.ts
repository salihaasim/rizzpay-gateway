
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView, trackEvent } from '@/utils/analytics';

export const useAnalytics = () => {
  const location = useLocation();

  // Track page views automatically
  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);

  return {
    trackEvent,
    trackPageView,
  };
};
