
import { createQR } from '@/utils/commonUtils';

/**
 * Generates a UPI payment URL based on the UPI ID
 */
export const generateUpiUrl = (
  upiId: string, 
  amount?: number, 
  description?: string
): string => {
  // Create UPI payment URL format
  let upiUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent('RizzPay')}`;
  
  // Add optional parameters if provided
  if (amount && amount > 0) {
    upiUrl += `&am=${amount}`;
  }
  
  if (description) {
    upiUrl += `&tn=${encodeURIComponent(description)}`;
  }
  
  upiUrl += '&cu=INR';
  
  return upiUrl;
};

/**
 * Generates a QR code URL for a UPI payment link
 */
export const getUpiQrCodeUrl = (
  upiId: string, 
  amount?: number, 
  description?: string
): string => {
  const upiUrl = generateUpiUrl(upiId, amount, description);
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiUrl)}`;
};

/**
 * Validates a UPI ID format
 */
export const validateUpiId = (upiId: string): boolean => {
  if (!upiId) return false;
  
  // Basic validation: must contain @ and have parts before and after it
  const parts = upiId.split('@');
  if (parts.length !== 2) return false;
  if (!parts[0] || !parts[1]) return false;
  
  return true;
};

/**
 * Generate deep link for UPI apps
 */
export const getUpiAppDeepLink = (
  upiId: string,
  amount: number,
  description: string,
  app: 'gpay' | 'phonepe' | 'paytm' | 'bhim' = 'gpay'
): string => {
  const upiUrl = generateUpiUrl(upiId, amount, description);
  
  switch (app) {
    case 'gpay':
      return `tez://upi/pay?pa=${encodeURIComponent(upiId)}&am=${amount}&pn=RizzPay&tn=${encodeURIComponent(description)}&cu=INR`;
    case 'phonepe':
      return `phonepe://${upiUrl}`;
    case 'paytm':
      return `paytmmp://${upiUrl}`;
    case 'bhim':
      return `upi://${upiUrl}`;
    default:
      return upiUrl;
  }
};
