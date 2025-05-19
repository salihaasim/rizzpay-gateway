
/**
 * HDFC Bank NEFT API Integration
 * API Documentation: https://developer.hdfcbank.com/api-category-landing/34
 */

import { toast } from 'sonner';

// Types for HDFC Bank API
export interface HdfcNeftRequest {
  accountNumber: string;
  ifscCode: string;
  beneficiaryName: string;
  amount: number;
  remarks?: string;
  reference?: string;
}

export interface HdfcNeftResponse {
  status: 'success' | 'failure' | 'pending';
  transactionId: string;
  message: string;
  utrNumber?: string;
  timestamp: string;
}

// Mock HDFC Bank NEFT API (in production, this would be replaced with actual API calls)
export const initiateNeftTransfer = async (data: HdfcNeftRequest): Promise<HdfcNeftResponse> => {
  console.log('Initiating NEFT transfer with HDFC Bank API', data);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Simulate success (90% of the time) or failure (10% of the time)
  const isSuccess = Math.random() < 0.9;
  
  if (isSuccess) {
    return {
      status: 'success',
      transactionId: 'HDFC' + Date.now().toString().slice(-10),
      message: 'NEFT transfer initiated successfully',
      utrNumber: 'UTR' + Math.random().toString(36).substring(2, 10).toUpperCase(),
      timestamp: new Date().toISOString()
    };
  } else {
    throw new Error('NEFT transfer failed. Please try again later.');
  }
};

// Helper function to validate IFSC code
export const validateIfscCode = (ifsc: string): boolean => {
  // IFSC code format: 4 characters (bank code) + 0 + 6 characters (branch code)
  const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
  return ifscRegex.test(ifsc);
};

// Handler for wallet to bank transfers
export const handleWalletToBankTransfer = async (
  accountNumber: string, 
  ifscCode: string, 
  beneficiaryName: string, 
  amount: number,
  email: string
): Promise<string | null> => {
  try {
    // Validate IFSC code
    if (!validateIfscCode(ifscCode)) {
      toast.error('Invalid IFSC code');
      return null;
    }
    
    // Initiate NEFT transfer
    const response = await initiateNeftTransfer({
      accountNumber,
      ifscCode,
      beneficiaryName,
      amount
    });
    
    // Return transaction ID on success
    return response.transactionId;
  } catch (error) {
    console.error('NEFT transfer error:', error);
    toast.error(error instanceof Error ? error.message : 'Failed to process bank transfer');
    return null;
  }
};
