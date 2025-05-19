
import { useTransactionStore } from '@/stores/transactionStore';
import { toast } from 'sonner';
import { showTransactionNotification } from './notificationUtils';
import { syncTransactionToSupabase } from './supabaseClient';
import type { Transaction, TransactionStatus, PaymentProcessingState } from '@/stores/transactionStore';

// Optimization: Use a debounce mechanism for updates
const pendingUpdates = new Map();

// Update the transactionStore to include new payment methods
export const updateTransactionFromWebhook = async (
  paymentRequestId: string,
  status: 'success' | 'failure',
  paymentId?: string,
  additionalDetails?: Record<string, string>
): Promise<boolean> => {
  try {
    // Avoid duplicate webhook processing
    const updateKey = `${paymentRequestId}-${status}-${paymentId}`;
    if (pendingUpdates.has(updateKey)) {
      console.log(`Skipping duplicate webhook update: ${updateKey}`);
      return true;
    }
    
    pendingUpdates.set(updateKey, true);
    
    // Performance optimization: Get state directly instead of subscribing
    const store = useTransactionStore.getState();
    const transaction = store.transactions.find(t => 
      t.id === paymentRequestId || 
      t.paymentDetails?.authorizationCode === paymentRequestId
    );
    
    if (!transaction) {
      console.error(`Transaction with ID ${paymentRequestId} not found`);
      pendingUpdates.delete(updateKey);
      return false;
    }
    
    // Prepare update data with proper type casting
    const updatedTransaction: Partial<Transaction> = {
      status: status === 'success' ? 'successful' as TransactionStatus : 'failed' as TransactionStatus,
      processingState: status === 'success' ? 'authorization_decision' as PaymentProcessingState : 'declined' as PaymentProcessingState,
      processingTimeline: [
        ...(transaction.processingTimeline || []),
        {
          stage: status === 'success' ? 'authorization_decision' : 'declined',
          timestamp: new Date().toISOString(),
          message: status === 'success' 
            ? `Payment confirmed with ID: ${paymentId || 'N/A'}`
            : `Payment failed: ${additionalDetails?.error || 'Unknown reason'}`
        }
      ],
      paymentDetails: {
        ...transaction.paymentDetails,
        authorizationCode: paymentId || transaction.paymentDetails?.authorizationCode,
        declineReason: status === 'failure' ? additionalDetails?.error : undefined,
        // Only include fields that exist in PaymentDetails type
        cardNumber: additionalDetails?.cardNumber,
        cardHolderName: additionalDetails?.buyerName,
        recipientEmail: additionalDetails?.buyerEmail,
        recipientName: additionalDetails?.buyerName,
        processor: additionalDetails?.paymentMethod
      }
    };
    
    // Update transaction
    store.updateTransaction(transaction.id, updatedTransaction);
    
    // Show notification to user
    showTransactionNotification(
      status === 'success' ? 'success' : 'error',
      status === 'success' ? "Payment successful" : "Payment failed",
      status === 'success' 
        ? `Your payment of ${transaction.amount} has been confirmed.`
        : additionalDetails?.error || "Your payment could not be processed."
    );
    
    // Sync updated transaction to Supabase
    const finalTransaction = store.transactions.find(t => t.id === transaction.id);
    if (finalTransaction) {
      // Don't await this - allow it to run in the background
      syncTransactionToSupabase(finalTransaction).catch(error => {
        console.error("Error syncing transaction to Supabase:", error);
      });
    }
    
    pendingUpdates.delete(updateKey);
    return true;
  } catch (error) {
    console.error("Error updating transaction from webhook:", error);
    return false;
  }
};

// Process payment gateway webhook with performance optimizations
export const processPaymentGatewayWebhook = async (
  gatewayName: string,
  webhookData: Record<string, string>
): Promise<boolean> => {
  console.log(`Processing ${gatewayName} webhook:`, webhookData);
  
  // Extract transaction status based on gateway-specific format
  try {
    const paymentId = webhookData.payment_id;
    const paymentRequestId = webhookData.transaction_id || webhookData.payment_request_id;
    const status = webhookData.status?.toLowerCase() === 'completed' ? 'success' : 'failure';
    
    return await updateTransactionFromWebhook(
      paymentRequestId,
      status,
      paymentId,
      {
        paymentMethod: webhookData.payment_method || 'card',
        paidAmount: webhookData.amount,
        buyerName: webhookData.customer_name || webhookData.buyer_name || undefined,
        buyerEmail: webhookData.customer_email || webhookData.buyer_email || undefined,
        buyerPhone: webhookData.customer_phone || webhookData.buyer_phone || undefined
      }
    );
  } catch (error) {
    console.error(`Error processing ${gatewayName} webhook:`, error);
    return false;
  }
};
