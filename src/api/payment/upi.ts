
// UPI Payment API functions
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { Transaction, TransactionStatus, PaymentProcessingState } from '@/stores/transactions';
import { useTransactionStore } from '@/stores/transactions';

export interface UpiPaymentData {
  amount: string;
  currency: string;
  name?: string;
  email?: string;
  upiId: string;
  transactionId: string;
}

export const processUpiPayment = async (paymentData: UpiPaymentData): Promise<Transaction | null> => {
  try {
    const amount = parseFloat(paymentData.amount);
    
    if (isNaN(amount) || amount <= 0) {
      toast.error('Invalid payment amount');
      return null;
    }

    if (!paymentData.upiId.includes('@')) {
      toast.error('Invalid UPI ID format');
      return null;
    }

    // Create a transaction record
    const transactionStore = useTransactionStore.getState();
    
    // Create transaction object with proper types
    const transaction: Transaction = {
      id: paymentData.transactionId || `upi_${uuidv4().substring(0, 8)}`,
      amount: `₹${amount.toFixed(2)}`,
      customer: paymentData.name || 'Customer',
      customerEmail: paymentData.email,
      status: 'processing' as TransactionStatus,
      paymentMethod: 'upi',
      date: new Date().toISOString(),
      description: `UPI payment to ${paymentData.upiId}`,
      processingState: 'initiated' as PaymentProcessingState,
      processingTimeline: [
        {
          stage: 'initiated',
          timestamp: new Date().toISOString(),
          message: 'UPI payment initiated'
        }
      ]
    };
    
    // Add transaction to the store
    transactionStore.addTransaction(transaction);
    
    // Simulate payment processing
    // Update to real API call when available
    setTimeout(() => {
      const updatedTransaction = {
        ...transaction,
        status: 'successful' as TransactionStatus,
        processingState: 'completed' as PaymentProcessingState,
      };
      
      if (updatedTransaction.processingTimeline) {
        updatedTransaction.processingTimeline.push({
          stage: 'completed',
          timestamp: new Date().toISOString(),
          message: 'UPI payment successful'
        });
      }
      
      transactionStore.updateTransaction(transaction.id, updatedTransaction);
      
      toast.success('UPI payment successful');
    }, 2000);
    
    return transaction;
  } catch (error) {
    console.error('UPI payment processing error:', error);
    toast.error('Failed to process UPI payment');
    return null;
  }
};
