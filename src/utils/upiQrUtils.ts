
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
