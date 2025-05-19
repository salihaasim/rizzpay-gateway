
/**
 * SLAM Engine - UPI Integration Module
 * Enhanced for easy integration with AI assistants and external systems
 */

import { UpiHandle } from './types';
import { getNextUpiHandle, getUpiHandleStats } from './upiRotation';
import { cleanTransactionDescription, cleanMerchantName } from './labelRewriter';

/**
 * Simple UPI payment processing interface for external integrations
 */
export interface UpiPaymentRequest {
  amount: number;
  description?: string;
  merchantId?: string;
  merchantName?: string;
  customerName?: string;
  customerReference?: string;
}

/**
 * UPI payment response with masked values
 */
export interface UpiPaymentResponse {
  paymentUrl: string;
  qrCodeUrl: string;
  upiId: string;
  maskedDescription: string;
  maskedMerchantName: string;
  referenceId: string;
}

/**
 * Generate a UPI payment URL with obfuscated details
 * This is the main entry point for creating UPI payment intents
 */
export const generateUpiPayment = (request: UpiPaymentRequest): UpiPaymentResponse => {
  // Get clean UPI handle through rotation engine
  const upiHandle = getNextUpiHandle(request.merchantId);
  
  // Clean description and merchant name
  const maskedDescription = cleanTransactionDescription(request.description || 'Payment');
  const maskedMerchantName = cleanMerchantName(request.merchantName || 'Merchant');
  
  // Generate reference ID
  const referenceId = `RIZZ${Date.now().toString(36).toUpperCase()}`;
  
  // Build UPI payment URL
  const upiUrl = `upi://pay?pa=${upiHandle}`
    + `&pn=${encodeURIComponent(maskedMerchantName)}`
    + `&am=${request.amount}`
    + `&tn=${encodeURIComponent(maskedDescription)}`
    + `&tr=${referenceId}`
    + `&cu=INR`;
  
  // Generate QR code URL
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiUrl)}`;
  
  return {
    paymentUrl: upiUrl,
    qrCodeUrl,
    upiId: upiHandle,
    maskedDescription,
    maskedMerchantName,
    referenceId
  };
};

/**
 * Generate a static UPI QR code for merchant display
 */
export const generateStaticUpiQr = (merchantId: string, merchantName: string): UpiPaymentResponse => {
  const upiHandle = getNextUpiHandle(merchantId);
  const maskedMerchantName = cleanMerchantName(merchantName);
  const referenceId = `STATIC-${merchantId.substring(0, 6)}`;
  
  // Build static UPI URL (no amount)
  const upiUrl = `upi://pay?pa=${upiHandle}`
    + `&pn=${encodeURIComponent(maskedMerchantName)}`
    + `&tn=${encodeURIComponent('Payment')}`;
  
  // Generate QR code URL
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiUrl)}`;
  
  return {
    paymentUrl: upiUrl,
    qrCodeUrl,
    upiId: upiHandle,
    maskedDescription: 'Payment',
    maskedMerchantName,
    referenceId
  };
};

/**
 * API-friendly function to validate a UPI ID
 */
export const validateUpiId = (upiId: string): boolean => {
  if (!upiId) return false;
  
  // Basic validation: must contain @ and have parts before and after it
  const parts = upiId.split('@');
  if (parts.length !== 2) return false;
  if (parts[0].length === 0 || parts[1].length === 0) return false;
  
  return true;
};

/**
 * Simple API to get UPI handle stats for analytics
 */
export const getUpiStats = () => {
  return {
    upiHandles: getUpiHandleStats(),
    timestamp: new Date().toISOString()
  };
};

// Re-export functions from upiRotation to provide a complete API
export { getUpiHandleStats } from './upiRotation';
