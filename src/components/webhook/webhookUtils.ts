
import { v4 as uuidv4 } from 'uuid';
import { jwtDecode, jwtEncode } from './jwtHelper';
import { useTransactionStore, addTransaction } from '@/stores/transactionStore';
import { toast } from 'sonner';

// Create a webhook token
export const createWebhookToken = (userEmail: string): string => {
  // Create a token with user email and an expiration date (1 year)
  const now = new Date();
  const expiration = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
  
  const tokenData = {
    id: uuidv4(),
    email: userEmail,
    exp: Math.floor(expiration.getTime() / 1000),
    iat: Math.floor(now.getTime() / 1000)
  };
  
  return jwtEncode(tokenData);
};

// Validate a webhook token
export const validateWebhookToken = (token: string): { 
  valid: boolean; 
  email?: string;
  error?: string;
} => {
  try {
    const decoded = jwtDecode(token);
    
    // Check if token is expired
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < now) {
      return { valid: false, error: 'Token expired' };
    }
    
    // Token is valid
    return { valid: true, email: decoded.email };
  } catch (error) {
    return { valid: false, error: 'Invalid token' };
  }
};

// Process a webhook payment request
export const processWebhookPayment = async (paymentData: {
  token: string;
  amount: string;
  currency?: string;
  description?: string;
  customer_name: string;
  customer_email?: string;
  callback_url?: string;
}): Promise<{
  status: 'success' | 'error';
  message: string;
  paymentUrl?: string;
  transactionId?: string;
}> => {
  try {
    // Validate the token
    const tokenValidation = validateWebhookToken(paymentData.token);
    if (!tokenValidation.valid) {
      return { 
        status: 'error', 
        message: tokenValidation.error || 'Invalid webhook token' 
      };
    }
    
    // Validate required fields
    if (!paymentData.amount || isNaN(parseFloat(paymentData.amount))) {
      return { status: 'error', message: 'Invalid amount' };
    }
    
    if (!paymentData.customer_name) {
      return { status: 'error', message: 'Customer name is required' };
    }
    
    // Create transaction ID
    const transactionId = `webhook_${uuidv4().substring(0, 8)}`;
    
    // Format for callbackUrl (add transaction ID)
    let callbackUrl = paymentData.callback_url || '';
    if (callbackUrl) {
      const separator = callbackUrl.includes('?') ? '&' : '?';
      callbackUrl = `${callbackUrl}${separator}transaction_id=${transactionId}`;
    }
    
    // Generate payment URL 
    const paymentUrl = `${window.location.origin}/payment?source=webhook&id=${transactionId}`;
    
    // Store transaction details in local storage to be picked up by the payment page
    localStorage.setItem(`webhook_payment_${transactionId}`, JSON.stringify({
      id: transactionId,
      amount: paymentData.amount,
      currency: paymentData.currency || 'INR',
      description: paymentData.description || 'Payment via webhook',
      customerName: paymentData.customer_name,
      customerEmail: paymentData.customer_email || '',
      callbackUrl,
      merchantEmail: tokenValidation.email,
      createdAt: new Date().toISOString()
    }));
    
    return {
      status: 'success',
      message: 'Payment initiated successfully',
      paymentUrl,
      transactionId
    };
  } catch (error) {
    console.error('Webhook payment processing error:', error);
    return {
      status: 'error',
      message: 'An error occurred while processing the payment'
    };
  }
};

// Function to handle webhook payment completion
export const completeWebhookPayment = (transactionId: string, status: 'success' | 'failed'): boolean => {
  try {
    // Get transaction details from local storage
    const paymentDataStr = localStorage.getItem(`webhook_payment_${transactionId}`);
    if (!paymentDataStr) {
      console.error('Transaction not found:', transactionId);
      return false;
    }
    
    const paymentData = JSON.parse(paymentDataStr);
    
    // Create transaction in store if payment was successful
    if (status === 'success') {
      const store = useTransactionStore.getState();
      
      // Add transaction to store
      const transaction = {
        id: transactionId,
        date: new Date().toISOString(),
        amount: `₹${parseFloat(paymentData.amount).toFixed(2)}`,
        rawAmount: parseFloat(paymentData.amount),
        paymentMethod: 'webhook',
        status: 'successful',
        customer: paymentData.customerEmail || paymentData.customerName,
        createdBy: paymentData.merchantEmail,
        processingState: 'completed',
        description: paymentData.description,
        paymentDetails: {
          customerName: paymentData.customerName,
          customerEmail: paymentData.customerEmail
        }
      };
      
      store.addTransaction(transaction);
      
      // Add funds to merchant wallet
      if (paymentData.merchantEmail) {
        try {
          store.depositToWallet(
            paymentData.merchantEmail, 
            parseFloat(paymentData.amount),
            'webhook'
          );
        } catch (error) {
          console.error('Failed to deposit to merchant wallet:', error);
          // Continue anyway, as the transaction is still successful
        }
      }
    }
    
    // Remove from local storage
    localStorage.removeItem(`webhook_payment_${transactionId}`);
    
    // Redirect to callback URL if exists
    if (paymentData.callbackUrl) {
      window.location.href = `${paymentData.callbackUrl}&status=${status}`;
      return true;
    }
    
    return true;
  } catch (error) {
    console.error('Error completing webhook payment:', error);
    return false;
  }
};

// Get webhook payment details
export const getWebhookPaymentDetails = (transactionId: string) => {
  try {
    const paymentDataStr = localStorage.getItem(`webhook_payment_${transactionId}`);
    if (!paymentDataStr) {
      return null;
    }
    
    return JSON.parse(paymentDataStr);
  } catch (error) {
    console.error('Error getting webhook payment details:', error);
    return null;
  }
};
