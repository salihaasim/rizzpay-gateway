
import { Transaction, useTransactionStore } from '@/stores/transactions';
import { handleWebhookCallback, WebhookPayload } from '@/api/webhook/handler';
import { processBankWebhook } from '@/api/webhook/bankHandlers';

// Extended Transaction type to include webhookData
type ExtendedTransaction = Transaction & {
  webhookData?: any;
};

// Renamed the local function to avoid name conflict with import
const fetchTransactionById = (id: string): ExtendedTransaction | null => {
  // In a real implementation, this would get the transaction from a store
  console.log(`Fetching transaction with ID: ${id}`);
  
  // Mock implementation
  return {
    id,
    date: new Date().toISOString(),
    amount: '₹100',
    rawAmount: 100,
    status: 'pending',
    processingState: 'initiated',
    customer: 'Test Customer',
    paymentMethod: 'card',
    webhookData: {} // Ensure this property exists
  } as ExtendedTransaction;
};

export const updateTransactionFromWebhook = (transactionId: string, webhookData: any) => {
  // Find the transaction in the store
  const transaction = fetchTransactionById(transactionId);
  
  if (!transaction) {
    console.error(`Transaction with ID ${transactionId} not found`);
    return null;
  }
  
  // Update the transaction with webhook data
  const updatedTransaction = {
    ...transaction,
    status: webhookData.status || transaction.status,
    processingState: webhookData.processingState || transaction.processingState,
    updatedAt: new Date().toISOString(),
    webhookData: {
      ...transaction.webhookData,
      ...webhookData,
      receivedAt: new Date().toISOString()
    }
  };
  
  // Save the updated transaction
  // This would typically use a store update function
  console.log('Transaction updated from webhook:', updatedTransaction);
  
  return updatedTransaction;
};

export const processWebhookTransaction = async (webhookData: any) => {
  try {
    // Validate webhook data (example: check for required fields)
    if (!webhookData || !webhookData.transaction_id || !webhookData.status) {
      console.error('Invalid webhook data:', webhookData);
      return { success: false, message: 'Invalid webhook data' };
    }

    // Extract transaction ID from webhook data
    const transactionId = webhookData.transaction_id;

    // Update transaction status in the database or store
    const updatedTransaction = updateTransactionFromWebhook(transactionId, webhookData);

    if (!updatedTransaction) {
      console.error(`Failed to update transaction ${transactionId} from webhook`);
      return { success: false, message: 'Failed to update transaction' };
    }

    console.log(`Transaction ${transactionId} updated successfully from webhook`);
    return { success: true, message: 'Transaction updated successfully' };

  } catch (error) {
    console.error('Error processing webhook transaction:', error);
    return { success: false, message: 'Error processing webhook transaction' };
  }
};

// New function to handle bank-specific webhooks
export const processBankWebhookRequest = async (
  bankSlug: string,
  payload: any,
  headers: Record<string, string>
) => {
  try {
    console.log(`Processing webhook for bank: ${bankSlug}`, payload);
    
    // Use the bank-specific processor
    const result = await processBankWebhook(bankSlug, payload, headers);
    
    if (result.success) {
      console.log(`Bank webhook processed successfully for ${bankSlug}`);
    } else {
      console.error(`Bank webhook processing failed for ${bankSlug}:`, result.message);
    }
    
    return result;
  } catch (error) {
    console.error(`Error in bank webhook processing for ${bankSlug}:`, error);
    return { success: false, message: 'Internal server error' };
  }
};

// Function to generate webhook endpoint URLs
export const generateWebhookEndpoints = (bankName: string, environment: 'test' | 'production') => {
  const baseUrl = environment === 'production' ? 'https://rizz-pay.in' : 'https://sandbox.rizz-pay.in';
  const sanitizedName = bankName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  
  return {
    callback: `${baseUrl}/api/${sanitizedName}/callback`,
    webhook: `${baseUrl}/api/${sanitizedName}/webhook`,
    status: `${baseUrl}/api/${sanitizedName}/status`
  };
};
