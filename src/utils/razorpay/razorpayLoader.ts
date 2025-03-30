
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
    
    // Create script element to load Razorpay
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.crossOrigin = 'anonymous';
    
    // Handle successful loading
    script.onload = () => {
      console.log('Razorpay script loaded successfully');
      
      // Additional validation to ensure Razorpay is properly loaded
      if (window.Razorpay) {
        resolve(true);
      } else {
        console.error('Razorpay object not found after script load');
        toast.error('Payment gateway failed to initialize properly');
        resolve(false);
      }
    };
    
    // Handle loading errors
    script.onerror = (error) => {
      console.error('Error loading Razorpay script:', error);
      toast.error('Failed to load payment gateway. Please check your internet connection.');
      resolve(false);
    };
    
    // Add the script to the document
    document.body.appendChild(script);
    
    // Set a timeout in case the script is taking too long
    setTimeout(() => {
      if (!window.Razorpay) {
        console.warn('Razorpay script loading timed out');
        toast.error('Payment gateway loading timed out. Please refresh the page and try again.');
        resolve(false);
      }
    }, 10000); // 10 second timeout
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
