
import { toast } from 'sonner';

// Initialize Razorpay
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    // Check if Razorpay is already loaded
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    // Create script element to load Razorpay
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
      toast.error('Failed to load payment gateway');
    };
    document.body.appendChild(script);
  });
};

// Add typings for Razorpay
declare global {
  interface Window {
    Razorpay: any;
  }
}
