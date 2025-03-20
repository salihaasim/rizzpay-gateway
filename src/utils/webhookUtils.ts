
import { useTransactionStore } from '@/stores/transactionStore';
import { toast } from 'sonner';
import { showTransactionNotification } from './notificationUtils';
import { syncTransactionToSupabase } from './supabaseClient';

// Update the transactionStore to include new Instamojo payment methods
export const updateTransactionFromWebhook = async (
  paymentRequestId: string,
  status: 'success' | 'failure',
  paymentId?: string,
  additionalDetails?: Record<string, string>
): Promise<boolean> => {
  try {
    const store = useTransactionStore.getState();
    const transaction = store.transactions.find(t => 
      t.id === paymentRequestId || 
      t.paymentDetails?.authorizationCode === paymentRequestId
    );
    
    if (!transaction) {
      console.error(`Transaction with ID ${paymentRequestId} not found`);
      return false;
    }
    
    // Update transaction status
    store.updateTransaction(transaction.id, {
      status: status === 'success' ? 'successful' : 'failed',
      processingState: status === 'success' ? 'authorization_decision' : 'declined',
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
        ...additionalDetails
      }
    });
    
    // Show notification to user
    showTransactionNotification(
      status === 'success' ? 'success' : 'error',
      status === 'success' ? "Payment successful" : "Payment failed",
      status === 'success' 
        ? `Your payment of ${transaction.amount} has been confirmed.`
        : additionalDetails?.error || "Your payment could not be processed."
    );
    
    // Sync updated transaction to Supabase
    const updatedTransaction = store.transactions.find(t => t.id === transaction.id);
    if (updatedTransaction) {
      try {
        await syncTransactionToSupabase(updatedTransaction);
      } catch (error) {
        console.error("Error syncing transaction to Supabase:", error);
        // Continue even if syncing fails
      }
    }
    
    return true;
  } catch (error) {
    console.error("Error updating transaction from webhook:", error);
    return false;
  }
};

// Process payment gateway webhook
export const processPaymentGatewayWebhook = async (
  gatewayName: string,
  webhookData: Record<string, string>
): Promise<boolean> => {
  console.log(`Processing ${gatewayName} webhook:`, webhookData);
  
  // Extract transaction status based on gateway-specific format
  try {
    switch (gatewayName.toLowerCase()) {
      case 'instamojo':
        // Handle Instamojo webhook format according to their documentation
        const paymentId = webhookData.payment_id;
        const paymentRequestId = webhookData.payment_request_id;
        const status = webhookData.status?.toLowerCase() === 'credit' ? 'success' : 'failure';
        
        // Additional validation for production
        if (process.env.NODE_ENV === 'production') {
          // In production, you would validate the webhook signature here
          // if (!validateInstamojoSignature(webhookData)) {
          //   console.error('Invalid Instamojo webhook signature');
          //   return false;
          // }
        }
        
        // Extract payment method details from the webhook data
        let paymentMethod = webhookData.instrument_type || 'unknown';
        if (paymentMethod.toLowerCase().includes('neft')) {
          paymentMethod = 'neft';
        } else if (paymentMethod.toLowerCase().includes('card')) {
          paymentMethod = 'card';
        }
        
        return await updateTransactionFromWebhook(
          paymentRequestId,
          status,
          paymentId,
          {
            gatewayName: 'Instamojo',
            paidAmount: webhookData.amount,
            paymentMethod,
            buyerName: webhookData.buyer_name || undefined,
            buyerEmail: webhookData.buyer_email || undefined,
            buyerPhone: webhookData.buyer_phone || undefined,
            // Include additional payment details that might be useful
            cardNetwork: webhookData.card_network || undefined,
            issuingBank: webhookData.bank_name || undefined
          }
        );
        
      default:
        console.error(`Unsupported payment gateway: ${gatewayName}`);
        return false;
    }
  } catch (error) {
    console.error(`Error processing ${gatewayName} webhook:`, error);
    return false;
  }
};

// Function to validate Instamojo webhook signature (would be implemented in production)
const validateInstamojoSignature = (webhookData: Record<string, string>): boolean => {
  // This is a placeholder for the actual implementation
  // In production, you would validate the MAC signature using the salt provided by Instamojo
  return true;
};
