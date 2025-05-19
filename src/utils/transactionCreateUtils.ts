
import { Transaction, TransactionStatus, PaymentDetails, useTransactionStore } from '@/stores/transactionStore';
import { generateTransactionId, formatDate } from './formatUtils';
import { syncTransactionToSupabase } from './supabaseClient';

export const addTransaction = (
  amount: string,
  paymentMethod: string,
  status: TransactionStatus,
  customer: string,
  paymentDetails?: PaymentDetails
): Transaction => {
  const store = useTransactionStore.getState();
  
  const transaction: Transaction = {
    id: generateTransactionId(),
    date: formatDate(),
    amount: `₹${amount}`,
    rawAmount: parseFloat(amount),
    paymentMethod,
    status,
    customer,
    createdBy: store.userEmail || undefined,
    processingState: 'initiated',
    processingTimeline: [{
      stage: 'initiated',
      timestamp: new Date().toISOString(),
      message: `Payment of ₹${amount} initiated by ${customer} using ${paymentMethod}`
    }],
    paymentDetails
  };
  
  // Add transaction to store first
  store.addTransaction(transaction);
  
  // Sync with Supabase
  syncTransactionToSupabase(transaction)
    .catch(error => console.error('Error syncing transaction to Supabase:', error));
  
  // Return the transaction object
  return transaction;
};
