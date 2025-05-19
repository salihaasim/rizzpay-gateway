
import { v4 as uuidv4 } from 'uuid';
import { validateWebhookToken } from './tokenUtils';
import { updateTransactionFromWebhook } from '@/utils/webhookUtils';

// Process a webhook payment request with performance optimizations
export const processWebhookPayment = async (paymentData: {
  token: string;
  amount: string;
  currency?: string;
  description?: string;
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
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
    
    // Create transaction ID (use more concise IDs for better performance)
    const transactionId = `wh_${uuidv4().split('-')[0]}`;
    
    // Format for callbackUrl (add transaction ID)
    let callbackUrl = paymentData.callback_url || '';
    if (callbackUrl) {
      const separator = callbackUrl.includes('?') ? '&' : '?';
      callbackUrl = `${callbackUrl}${separator}transaction_id=${transactionId}`;
    }
    
    // Generate payment URL (optimized query string)
    const paymentUrl = `${window.location.origin}/payment?id=${transactionId}`;
    
    // Store transaction details in local storage to be picked up by the payment page
    const paymentInfo = {
      id: transactionId,
      amount: paymentData.amount,
      currency: paymentData.currency || 'INR',
      description: paymentData.description || 'Payment via webhook',
      customerName: paymentData.customer_name,
      customerEmail: paymentData.customer_email || '',
      customerPhone: paymentData.customer_phone || '',
      callbackUrl,
      merchantEmail: tokenValidation.email,
      createdAt: new Date().toISOString()
    };
    
    // Performance optimization: use sessionStorage instead of localStorage for temp data
    sessionStorage.setItem(`webhook_payment_${transactionId}`, JSON.stringify(paymentInfo));
    
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

// Get webhook payment details with improved error handling
export const getWebhookPaymentDetails = (transactionId: string) => {
  try {
    // First try sessionStorage (faster)
    let paymentDataStr = sessionStorage.getItem(`webhook_payment_${transactionId}`);
    
    // Fallback to localStorage if not found
    if (!paymentDataStr) {
      paymentDataStr = localStorage.getItem(`webhook_payment_${transactionId}`);
    }
    
    if (!paymentDataStr) {
      return null;
    }
    
    return JSON.parse(paymentDataStr);
  } catch (error) {
    console.error('Error getting webhook payment details:', error);
    return null;
  }
};

// Process direct payment callbacks
export const processDirectPaymentCallback = async (
  paymentMethod: string,
  callbackData: Record<string, any>
): Promise<boolean> => {
  try {
    console.log(`Processing ${paymentMethod} payment callback:`, callbackData);
    
    const { 
      payment_id, 
      transaction_id,
      status
    } = callbackData;
    
    if (!transaction_id) {
      console.error('Missing transaction_id in callback data');
      return false;
    }
    
    // Prepare webhook data
    const webhookData = {
      payment_id,
      status: status === 'completed' || status === 'success' ? 'successful' : 'failed',
      processingState: status === 'completed' || status === 'success' ? 'completed' : 'failed'
    };
    
    // Update transaction
    const result = updateTransactionFromWebhook(transaction_id, webhookData);
    return result !== null;
    
  } catch (error) {
    console.error(`Error processing ${paymentMethod} payment callback:`, error);
    return false;
  }
};
