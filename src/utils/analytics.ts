
// Google Analytics utility functions
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export const GA_MEASUREMENT_ID = 'G-1RX3HPX8ZV'; // Your actual GA4 Measurement ID

// Track page views
export const trackPageView = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

// Track custom events
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      ...parameters,
    });
  }
};

// Track payment events
export const trackPayment = (amount: number, currency: string = 'INR', paymentMethod: string) => {
  trackEvent('payment_initiated', {
    value: amount,
    currency: currency,
    payment_method: paymentMethod,
  });
};

// Track user registration
export const trackRegistration = (userType: 'merchant' | 'admin') => {
  trackEvent('sign_up', {
    method: 'email',
    user_type: userType,
  });
};

// Track login
export const trackLogin = (userType: 'merchant' | 'admin') => {
  trackEvent('login', {
    method: 'email',
    user_type: userType,
  });
};

// Track KYC completion
export const trackKycCompletion = () => {
  trackEvent('kyc_completed', {
    event_category: 'onboarding',
  });
};

// Track wallet transactions
export const trackWalletTransaction = (type: 'deposit' | 'withdraw' | 'transfer', amount: number) => {
  trackEvent('wallet_transaction', {
    transaction_type: type,
    value: amount,
    currency: 'INR',
  });
};
