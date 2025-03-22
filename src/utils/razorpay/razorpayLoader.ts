
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
      toast.error('Payment gateway loading timed out. Please refresh the page and try again.');
      resolve(false);
    }, 10000); // 10 second timeout
    
    // Create script element to load Razorpay
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.crossOrigin = 'anonymous';
    
    script.onload = () => {
      console.log('Razorpay script loaded successfully');
      clearTimeout(timeoutId);
      
      // Additional validation to ensure Razorpay is properly loaded
      if (window.Razorpay) {
        resolve(true);
      } else {
        console.error('Razorpay object not found after script load');
        toast.error('Payment gateway failed to initialize properly');
        resolve(false);
      }
    };
    
    script.onerror = (error) => {
      console.error('Error loading Razorpay script:', error);
      clearTimeout(timeoutId);
      toast.error('Failed to load payment gateway. Please check your internet connection.');
      resolve(false);
    };
    
    // Add the script to the document
    document.body.appendChild(script);
    
    // Add a backup timeout in case the script loads but onload never fires
    const backupTimeoutId = setTimeout(() => {
      if (window.Razorpay) {
        console.log('Razorpay detected via backup timeout');
        clearTimeout(timeoutId);
        resolve(true);
      }
    }, 3000);
    
    // Clear backup timeout when main onload/onerror handlers run
    script.onload = () => {
      clearTimeout(backupTimeoutId);
      clearTimeout(timeoutId);
      console.log('Razorpay script loaded successfully');
      resolve(true);
    };
    
    script.onerror = (error) => {
      clearTimeout(backupTimeoutId);
      clearTimeout(timeoutId);
      console.error('Error loading Razorpay script:', error);
      toast.error('Failed to load payment gateway');
      resolve(false);
    };
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
