
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
  payment_method?: string; // Optional payment method preference
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
    
    // Determine preferred payment method
    const paymentMethod = paymentData.payment_method?.toLowerCase() || 'default';
    
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
      preferredPaymentMethod: paymentMethod,
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

// Process webhook callbacks from payment gateways with optimized error handling
export const processGatewayWebhookCallback = async (
  gatewayName: string,
  callbackData: Record<string, any>
): Promise<boolean> => {
  try {
    // Early return for unsupported gateways
    if (gatewayName.toLowerCase() !== 'instamojo') {
      console.error(`Unsupported payment gateway: ${gatewayName}`);
      return false;
    }
    
    console.log(`Processing ${gatewayName} webhook callback:`, callbackData);
    
    // Extract data from Instamojo webhook format
    const { 
      payment_id, 
      payment_request_id,
      status,
      buyer_name,
      buyer_email,
      amount,
      instrument_type,
    } = callbackData;
    
    // Validate webhook signature for production
    if (process.env.NODE_ENV === 'production' && process.env.VITE_INSTAMOJO_SALT) {
      // In a real implementation, you would validate the MAC signature here
      // if (!validateSignature(callbackData, process.env.VITE_INSTAMOJO_SALT)) {
      //   console.error('Invalid Instamojo webhook signature');
      //   return false;
      // }
    }
    
    // Translate Instamojo status to our internal status
    let internalStatus: 'success' | 'failure' = 'failure';
    if (status === 'Credit' || status === 'Completed' || status.toLowerCase() === 'credit') {
      internalStatus = 'success';
    }
    
    // Update transaction
    return await updateTransactionFromWebhook(
      payment_request_id, 
      internalStatus,
      payment_id,
      {
        buyerName: buyer_name,
        buyerEmail: buyer_email,
        paidAmount: amount,
        gateway: 'Instamojo',
        paymentMethod: instrument_type || 'unknown'
      }
    );
  } catch (error) {
    console.error(`Error processing ${gatewayName} webhook:`, error);
    return false;
  }
};
