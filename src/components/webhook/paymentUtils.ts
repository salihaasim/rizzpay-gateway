
import { v4 as uuidv4 } from 'uuid';
import { validateWebhookToken } from './tokenUtils';

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
