
import { useTransactionStore } from '@/stores/transactionStore';
import { toast } from 'sonner';
import { showTransactionNotification } from './notificationUtils';

// Update the transactionStore to include new Instamojo payment methods
export const updateTransactionFromWebhook = (
  paymentRequestId: string,
  status: 'success' | 'failure',
  paymentId?: string,
  additionalDetails?: Record<string, string>
): boolean => {
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
    
    return true;
  } catch (error) {
    console.error("Error updating transaction from webhook:", error);
    return false;
  }
};

// Process payment gateway webhook
export const processPaymentGatewayWebhook = (
  gatewayName: string,
  webhookData: Record<string, string>
): boolean => {
  console.log(`Processing ${gatewayName} webhook:`, webhookData);
  
  // Extract transaction status based on gateway-specific format
  switch (gatewayName.toLowerCase()) {
    case 'instamojo':
      // Handle Instamojo webhook format from docs
      const paymentId = webhookData.payment_id;
      const paymentRequestId = webhookData.payment_request_id;
      const status = webhookData.status === 'Credit' ? 'success' : 'failure';
      
      return updateTransactionFromWebhook(
        paymentRequestId,
        status,
        paymentId,
        {
          gatewayName: 'Instamojo',
          paidAmount: webhookData.amount,
          paymentMethod: webhookData.instrument_type || 'unknown'
        }
      );
      
    default:
      console.error(`Unsupported payment gateway: ${gatewayName}`);
      return false;
  }
};
