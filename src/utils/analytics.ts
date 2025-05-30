
// Google Analytics utility functions

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

// Check if Google Analytics is loaded
export const isGALoaded = (): boolean => {
  return typeof window !== 'undefined' && typeof window.gtag === 'function';
};

// Track page views
export const trackPageView = (url: string, title?: string): void => {
  if (!isGALoaded()) return;
  
  window.gtag('config', 'G-1RX3HPX8ZV', {
    page_path: url,
    page_title: title || document.title,
  });
};

// Track custom events
export const trackEvent = (
  action: string,
  category: string = 'General',
  label?: string,
  value?: number
): void => {
  if (!isGALoaded()) return;
  
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

// Track user interactions
export const trackUserAction = (action: string, details?: Record<string, any>): void => {
  if (!isGALoaded()) return;
  
  window.gtag('event', action, {
    event_category: 'User Interaction',
    ...details,
  });
};

// Track payment events
export const trackPaymentEvent = (
  event: 'payment_initiated' | 'payment_completed' | 'payment_failed',
  paymentData: {
    transaction_id?: string;
    payment_method?: string;
    amount?: number;
    currency?: string;
  }
): void => {
  if (!isGALoaded()) return;
  
  window.gtag('event', event, {
    event_category: 'Payment',
    transaction_id: paymentData.transaction_id,
    payment_method: paymentData.payment_method,
    value: paymentData.amount,
    currency: paymentData.currency || 'INR',
  });
};

// Track merchant events
export const trackMerchantEvent = (
  event: 'merchant_registration' | 'kyc_submitted' | 'merchant_approved',
  merchantData?: Record<string, any>
): void => {
  if (!isGALoaded()) return;
  
  window.gtag('event', event, {
    event_category: 'Merchant',
    ...merchantData,
  });
};

// Track errors
export const trackError = (error: string, context?: string): void => {
  if (!isGALoaded()) return;
  
  window.gtag('event', 'exception', {
    description: error,
    fatal: false,
    custom_map: { context },
  });
};

// Track feature usage
export const trackFeatureUsage = (feature: string, action: string): void => {
  if (!isGALoaded()) return;
  
  window.gtag('event', 'feature_usage', {
    event_category: 'Feature',
    feature_name: feature,
    action: action,
  });
};

// Track timing events (for performance monitoring)
export const trackTiming = (
  category: string,
  variable: string,
  value: number,
  label?: string
): void => {
  if (!isGALoaded()) return;
  
  window.gtag('event', 'timing_complete', {
    name: variable,
    value: value,
    event_category: category,
    event_label: label,
  });
};
