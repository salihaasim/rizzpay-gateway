
import { useTransactionStore } from '@/stores/transactions';
import { toast } from 'sonner';
import type { Transaction, TransactionStatus, PaymentMethod } from '@/stores/transactions/types';
import { syncTransactionToSupabase } from '@/utils/supabaseClient';

// Function to handle webhook payment completion
export const completeWebhookPayment = async (transactionId: string, status: 'success' | 'failed'): Promise<boolean> => {
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
        paymentMethod: 'webhook' as PaymentMethod,
        status: 'successful' as TransactionStatus, // Explicitly cast to TransactionStatus
        customer: paymentData.customerEmail || paymentData.customerName,
        createdBy: paymentData.merchantEmail,
        processingState: 'completed',
        description: paymentData.description,
        paymentDetails: {
          // Using existing fields in PaymentDetails that are compatible 
          cardHolderName: paymentData.customerName,
          // We'll use recipientEmail instead of email since that exists in the type
          recipientEmail: paymentData.customerEmail
        }
      };
      
      store.addTransaction(transaction);
      
      // Sync to Supabase
      try {
        await syncTransactionToSupabase(transaction);
      } catch (error) {
        console.error('Error syncing webhook transaction to Supabase:', error);
        // Continue even if sync fails
      }
      
      // Add funds to merchant wallet
      if (paymentData.merchantEmail) {
        try {
          store.depositToWallet(paymentData.merchantEmail, parseFloat(paymentData.amount));
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
