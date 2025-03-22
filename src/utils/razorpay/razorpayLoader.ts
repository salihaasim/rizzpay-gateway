
import { toast } from 'sonner';

// Initialize Razorpay
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    // Check if Razorpay is already loaded
    if (window.Razorpay) {
      console.log('Razorpay already loaded');
      resolve(true);
      return;
    }

    console.log('Loading Razorpay script...');
    
    // Handle cases where script loading takes too long
    const timeoutId = setTimeout(() => {
      console.warn('Razorpay script loading timed out');
      resolve(false);
    }, 10000); // 10 second timeout
    
    // Create script element to load Razorpay
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      console.log('Razorpay script loaded successfully');
      clearTimeout(timeoutId);
      resolve(true);
    };
    script.onerror = (error) => {
      console.error('Error loading Razorpay script:', error);
      clearTimeout(timeoutId);
      resolve(false);
    };
    
    // Add the script to the document
    document.body.appendChild(script);
  });
};

// Utility to check if Razorpay is loaded
export const isRazorpayLoaded = (): boolean => {
  return typeof window !== 'undefined' && window.Razorpay !== undefined;
};

// Add typings for Razorpay
declare global {
  interface Window {
    Razorpay: any;
  }
}
