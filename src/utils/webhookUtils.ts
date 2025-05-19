
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { Transaction, TransactionStatus } from '@/stores/transactions/types';
import { useTransactionStore } from '@/stores/transactions';
import { generateTransactionId } from '@/utils/formatUtils';

// Function to process a webhook transaction
export const processWebhookTransaction = async (data: any): Promise<boolean> => {
  const { id, amount, currency, customer, paymentMethod } = data;
  
  if (!id || !amount) {
    toast.error("Invalid webhook data");
    return false;
  }
  
  try {
    const store = useTransactionStore.getState();
    
    // Create a transaction ID if not provided
    const transactionId = id || `webhook_${uuidv4()}`;
    
    // Add transaction to store
    const transaction: Transaction = {
      id: transactionId,
      date: new Date().toISOString(),
      amount: `${currency || '₹'} ${parseFloat(amount).toFixed(2)}`,
      rawAmount: parseFloat(amount),
      paymentMethod: 'webhook',
      status: 'pending' as TransactionStatus,
      customer: customer?.name || 'Webhook Customer',
      customerEmail: customer?.email,
      processingState: 'initiated',
      description: data.description || 'Payment via webhook',
      paymentDetails: {
        gatewayTransactionId: data.gatewayTransactionId,
        paymentGateway: data.paymentGateway,
        upiId: data.upiId,
        cardNetwork: data.cardNetwork,
        recipientEmail: data.recipientEmail
      }
    };
    
    store.addTransaction(transaction);
    
    // Return success status
    return true;
  } catch (error) {
    console.error("Error processing webhook:", error);
    toast.error("Error processing webhook");
    return false;
  }
};

// Generate a webhook signature for verification
export const generateWebhookSignature = (payload: any, secret: string): string => {
  // In a real implementation, this would use a proper HMAC function
  return `sha256=${uuidv4()}`;
};

// Verify a webhook request
export const verifyWebhookRequest = (
  signature: string, 
  payload: any, 
  secret: string
): boolean => {
  // In a real implementation, this would verify the signature
  return true;
};

// Create a webhook subscription
export const createWebhookSubscription = async (
  url: string,
  events: string[],
  description?: string
): Promise<string> => {
  // In a real implementation, this would register the webhook URL with the payment service
  return `sub_${uuidv4()}`;
};
