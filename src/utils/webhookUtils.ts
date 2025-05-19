
import { Transaction, useTransactionStore } from '@/stores/transactions';

// Renamed the local function to avoid name conflict with import
const fetchTransactionById = (id: string): Transaction | null => {
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
    webhookData: {}
  } as Transaction;
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
