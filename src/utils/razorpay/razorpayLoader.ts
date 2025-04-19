
// Mock loader for simulated payments
export const loadRazorpayScript = async (): Promise<boolean> => {
  console.log('Using simulated payment system');
  return true;
};

export const isRazorpayLoaded = (): boolean => {
  return true;
};

// Add mock types
declare global {
  interface Window {
    Razorpay: any;
  }
}
