
/**
 * SLAM Engine - Smart Labeling & Masking Module
 * Main entry point that integrates all SLAM capabilities
 */

import { ObfuscationConfig, TransactionMaskingResult } from './types';
import { getNextUpiHandle } from './upiRotation';
import { cleanTransactionDescription, cleanMerchantName, getRandomSafeLabel } from './labelRewriter';
import { generateUpiPayment, generateStaticUpiQr, validateUpiId, getUpiStats } from './upiIntegration';

// Default configuration for SLAM Engine
const DEFAULT_CONFIG: ObfuscationConfig = {
  enable_upi_rotation: true,
  enable_label_rewriting: true,
  enable_merchant_obfuscation: true,
  enable_dashboard_cleaning: true,
  restricted_terms: [
    'gambling', 'casino', 'betting', 'fantasy', 'poker', 'rummy', 
    'teen patti', 'lottery', 'jackpot', 'winnings'
  ],
  allowed_payment_labels: [
    'Payment', 'Transfer', 'Services', 'Subscription',
    'Invoice', 'Retail', 'Purchase', 'Order'
  ],
  rotation_frequency: 'per_transaction'
};

/**
 * Process a transaction through SLAM Engine to mask sensitive information
 */
export const processSLAMTransaction = (
  transaction: {
    description: string;
    merchantName: string;
    upiId?: string;
    payeeName?: string;
  },
  merchantId?: string,
  config: Partial<ObfuscationConfig> = {}
): TransactionMaskingResult => {
  // Merge with default config
  const finalConfig: ObfuscationConfig = { ...DEFAULT_CONFIG, ...config };
  
  const originalValues = {
    description: transaction.description || '',
    merchantName: transaction.merchantName || '',
    upiId: transaction.upiId || '',
    payeeName: transaction.payeeName || transaction.merchantName || ''
  };
  
  // Apply masking based on configuration
  const maskedValues = {
    description: finalConfig.enable_label_rewriting 
      ? cleanTransactionDescription(originalValues.description) 
      : originalValues.description,
    
    merchantName: finalConfig.enable_merchant_obfuscation 
      ? cleanMerchantName(originalValues.merchantName) 
      : originalValues.merchantName,
    
    upiId: finalConfig.enable_upi_rotation 
      ? getNextUpiHandle(merchantId) 
      : originalValues.upiId,
    
    payeeName: finalConfig.enable_merchant_obfuscation 
      ? cleanMerchantName(originalValues.payeeName) 
      : originalValues.payeeName
  };
  
  // Determine if any masking was applied
  const maskingApplied = 
    maskedValues.description !== originalValues.description ||
    maskedValues.merchantName !== originalValues.merchantName ||
    maskedValues.upiId !== originalValues.upiId ||
    maskedValues.payeeName !== originalValues.payeeName;
    
  return {
    originalValues,
    maskedValues,
    maskingApplied
  };
};

/**
 * Check if a transaction description contains sensitive terms that should be masked
 */
export const containsSensitiveTerms = (text: string, config: Partial<ObfuscationConfig> = {}): boolean => {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  
  return finalConfig.restricted_terms.some(term => 
    new RegExp(term, 'i').test(text)
  );
};

/**
 * Generate a clean UPI payment intent URL with masked values
 */
export const generateCleanUpiIntent = (
  amount: number,
  merchantId: string,
  originalDescription?: string
): string => {
  const cleanHandle = getNextUpiHandle(merchantId);
  const cleanDescription = cleanTransactionDescription(originalDescription || 'Payment');
  
  return `upi://pay?pa=${cleanHandle}&pn=${encodeURIComponent(cleanMerchantName("Rizz Payment"))}&am=${amount}&tn=${encodeURIComponent(cleanDescription)}`;
};

// Export all components for external use
export * from './types';
export * from './upiRotation';
export * from './labelRewriter';
export * from './upiIntegration'; // Export the new UPI integration utilities
