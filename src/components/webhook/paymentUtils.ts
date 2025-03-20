
import { v4 as uuidv4 } from 'uuid';
import { validateWebhookToken } from './tokenUtils';
import { updateTransactionFromWebhook } from '../TransactionUtils';

// Process a webhook payment request
export const processWebhookPayment = async (paymentData: {
  token: string;
  amount: string;
  currency?: string;
  description?: string;
  customer_name: string;
  customer_email?: string;
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
    
    // Determine preferred payment method
    const paymentMethod = paymentData.payment_method || 'default';
    
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
      preferredPaymentMethod: paymentMethod,
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

// Process webhook callbacks from payment gateways
export const processGatewayWebhookCallback = (
  gatewayName: string,
  callbackData: Record<string, any>
): boolean => {
  try {
    console.log(`Processing ${gatewayName} webhook callback:`, callbackData);
    
    // Handle different gateway formats
    if (gatewayName === 'instamojo') {
      // Extract data from Instamojo webhook format
      const { 
        payment_id, 
        payment_request_id,
        status,
        buyer_name,
        buyer_email,
        amount
      } = callbackData;
      
      // Translate Instamojo status to our internal status
      let internalStatus: 'success' | 'failure' = 'failure';
      if (status === 'Credit' || status === 'Completed') {
        internalStatus = 'success';
      }
      
      // Update transaction
      return updateTransactionFromWebhook(
        payment_request_id, 
        internalStatus,
        payment_id,
        {
          buyerName: buyer_name,
          buyerEmail: buyer_email,
          paidAmount: amount,
          gateway: 'Instamojo'
        }
      );
    }
    
    // Default case - unknown gateway
    console.error(`Unsupported payment gateway: ${gatewayName}`);
    return false;
  } catch (error) {
    console.error(`Error processing ${gatewayName} webhook:`, error);
    return false;
  }
};
