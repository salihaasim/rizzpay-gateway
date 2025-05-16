
// UPI Payment API functions
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { Transaction } from '@/stores/transactionStore';
import { addTransaction } from '@/utils/transactionCreateUtils';
import { simulatePaymentProcessing } from '@/utils/paymentProcessingUtils';

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
    const transaction = addTransaction({
      id: paymentData.transactionId || `upi_${uuidv4().substring(0, 8)}`,
      amount: amount,
      customer: paymentData.name || 'Customer',
      customerEmail: paymentData.email,
      status: 'processing',
      paymentMethod: 'upi',
      date: new Date().toISOString(),
      description: `UPI payment to ${paymentData.upiId}`,
      processingState: 'initiated',
      processingTimeline: [
        {
          stage: 'initiated',
          timestamp: new Date().toISOString(),
          message: 'UPI payment initiated'
        }
      ]
    });

    // Simulate payment processing
    const processedTransaction = await simulatePaymentProcessing(
      transaction.id,
      'upi',
      true // Force success for UPI payments
    );
    
    return processedTransaction;
  } catch (error) {
    console.error('UPI payment processing error:', error);
    toast.error('Failed to process UPI payment');
    return null;
  }
};
