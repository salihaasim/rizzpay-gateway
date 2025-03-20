
import { useTransactionStore, Transaction, TransactionStatus } from '@/stores/transactionStore';
import { toast } from 'sonner';

// Function to handle webhook payment completion
export const completeWebhookPayment = (transactionId: string, status: 'success' | 'failed'): boolean => {
  try {
    // Get transaction details from local storage
    const paymentDataStr = localStorage.getItem(`webhook_payment_${transactionId}`);
    if (!paymentDataStr) {
      console.error('Transaction not found:', transactionId);
      return false;
    }
    
    const paymentData = JSON.parse(paymentDataStr);
    
    // Create transaction in store if payment was successful
    if (status === 'success') {
      const store = useTransactionStore.getState();
      
      // Add transaction to store with correct TransactionStatus type
      const transaction: Transaction = {
        id: transactionId,
        date: new Date().toISOString(),
        amount: `₹${parseFloat(paymentData.amount).toFixed(2)}`,
        rawAmount: parseFloat(paymentData.amount),
        paymentMethod: 'webhook',
        status: 'successful' as TransactionStatus, // Explicitly cast to TransactionStatus
        customer: paymentData.customerEmail || paymentData.customerName,
        createdBy: paymentData.merchantEmail,
        processingState: 'completed',
        description: paymentData.description,
        paymentDetails: {
          upiId: paymentData.customerEmail, // Using existing fields in PaymentDetails
          cardHolderName: paymentData.customerName // Using existing fields in PaymentDetails
        }
      };
      
      store.addTransaction(transaction);
      
      // Add funds to merchant wallet
      if (paymentData.merchantEmail) {
        try {
          store.depositToWallet(
            paymentData.merchantEmail, 
            parseFloat(paymentData.amount),
            'webhook'
          );
        } catch (error) {
          console.error('Failed to deposit to merchant wallet:', error);
          // Continue anyway, as the transaction is still successful
        }
      }
    }
    
    // Remove from local storage
    localStorage.removeItem(`webhook_payment_${transactionId}`);
    
    // Redirect to callback URL if exists
    if (paymentData.callbackUrl) {
      window.location.href = `${paymentData.callbackUrl}&status=${status}`;
      return true;
    }
    
    return true;
  } catch (error) {
    console.error('Error completing webhook payment:', error);
    return false;
  }
};
