
import { Transaction, TransactionStatus } from '@/stores/transactions/types';
import { useTransactionStore } from '@/stores/transactions';
import { generateTransactionId, formatDate } from './formatUtils';
import { syncTransactionToSupabase } from './supabaseClient';
import { PaymentDetails } from '@/types/payment';

export const addTransaction = (transaction: Partial<Transaction>): Transaction => {
  const store = useTransactionStore.getState();
  
  const newTransaction: Transaction = {
    id: transaction.id || generateTransactionId(),
    date: transaction.date || formatDate(),
    amount: transaction.amount || '₹0',
    paymentMethod: transaction.paymentMethod || 'unknown',
    status: transaction.status || ('pending' as TransactionStatus),
    customer: transaction.customer || 'Unknown Customer',
    createdBy: transaction.createdBy || store.userEmail || undefined,
    processingState: transaction.processingState || ('initiated' as any),
    processingTimeline: transaction.processingTimeline || [{
      stage: 'initiated',
      timestamp: new Date().toISOString(),
      message: `Payment initiated using ${transaction.paymentMethod}`
    }],
    paymentDetails: transaction.paymentDetails,
    description: transaction.description,
    customerEmail: transaction.customerEmail,
    walletTransactionType: transaction.walletTransactionType,
    detailedStatus: transaction.detailedStatus,
    rawAmount: transaction.rawAmount
  };
  
  // Add transaction to store first
  store.addTransaction(newTransaction);
  
  // Sync with Supabase
  syncTransactionToSupabase(newTransaction)
    .catch(error => console.error('Error syncing transaction to Supabase:', error));
  
  // Return the transaction object
  return newTransaction;
};
