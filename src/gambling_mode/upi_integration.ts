
/**
 * RizzPay Gambling Mode - UPI Integration Module
 * Handles UPI generation and status checks for gambling transactions
 */

import { v4 as uuidv4 } from 'uuid';
import { delay } from '@/utils/commonUtils';

interface UPIDetails {
  vpa: string;
  payeeName: string;
  transactionRef: string;
  amount: number;
  description: string;
  isObfuscated: boolean;
}

interface StaticQROptions {
  merchantId: string;
  merchantName: string;
  obfuscate?: boolean;
  rotationPeriod?: number; // in hours
}

interface DynamicQROptions {
  amount: number;
  description: string;
  merchantId: string;
  expiryMinutes?: number;
  obfuscate?: boolean;
}

/**
 * Generate static UPI QR with obfuscated details for gambling transactions
 */
export const generateGamblingStaticQR = (options: StaticQROptions): string => {
  const {
    merchantId,
    merchantName,
    obfuscate = true,
    rotationPeriod = 24
  } = options;
  
  // Generate obfuscated merchant name if needed
  const displayName = obfuscate 
    ? `${merchantName.substring(0, 3)}***${uuidv4().substring(0, 5)}` 
    : merchantName;
  
  // Generate a unique VPA based on rotation period
  const today = new Date();
  const rotationKey = Math.floor(today.getTime() / (rotationPeriod * 60 * 60 * 1000));
  const rotatedVPA = `rz${merchantId.substring(0, 5)}${rotationKey}@rizzpay`;
  
  // Construct UPI details with obfuscated info
  const upiDetails: UPIDetails = {
    vpa: rotatedVPA,
    payeeName: displayName,
    transactionRef: `RZ${uuidv4().substring(0, 8).toUpperCase()}`,
    amount: 0, // Static QR doesn't specify amount
    description: obfuscate ? "Entertainment Services" : "Payment",
    isObfuscated: obfuscate
  };
  
  // Generate and return QR data
  return generateUPIQRString(upiDetails);
};

/**
 * Generate dynamic UPI QR for gambling transactions
 */
export const generateGamblingDynamicQR = (options: DynamicQROptions): string => {
  const {
    amount,
    description,
    merchantId,
    expiryMinutes = 15,
    obfuscate = true
  } = options;
  
  // Generate transaction reference
  const txnRef = `RZ${uuidv4().substring(0, 10).toUpperCase()}`;
  
  // Generate a unique VPA with session identifier
  const sessionId = uuidv4().substring(0, 8);
  const vpa = `rz${merchantId.substring(0, 5)}.${sessionId}@rizzpay`;
  
  // Construct UPI details
  const upiDetails: UPIDetails = {
    vpa: vpa,
    payeeName: obfuscate ? "RZPay Services" : "RizzPay",
    transactionRef: txnRef,
    amount: amount,
    description: obfuscate ? "Entertainment Services" : description,
    isObfuscated: obfuscate
  };
  
  // Generate and return QR data
  return generateUPIQRString(upiDetails);
};

/**
 * Check UPI payment status with additional verification for gambling transactions
 */
export const checkGamblingUpiStatus = async (
  transactionRef: string,
  merchantId: string
): Promise<{status: 'pending' | 'completed' | 'failed', details?: any}> => {
  // In a real implementation, this would call the actual payment gateway
  // For demo purposes, we'll simulate a delay and return a status
  await delay(1500);
  
  return {
    status: Math.random() > 0.3 ? 'completed' : 'pending',
    details: {
      transactionRef,
      timestamp: new Date().toISOString(),
      gatewayRef: `GWAY${uuidv4().substring(0, 10).toUpperCase()}`
    }
  };
};

/**
 * Helper function to generate UPI QR string
 */
const generateUPIQRString = (details: UPIDetails): string => {
  const { vpa, payeeName, transactionRef, amount, description } = details;
  
  // Construct UPI URI as per specification
  const upiUri = `upi://pay?pa=${encodeURIComponent(vpa)}`
    + `&pn=${encodeURIComponent(payeeName)}`
    + `&tr=${encodeURIComponent(transactionRef)}`
    + (amount > 0 ? `&am=${amount}` : '')
    + `&tn=${encodeURIComponent(description)}`;
    
  return upiUri;
};
