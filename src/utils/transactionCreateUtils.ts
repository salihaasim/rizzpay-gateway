
import { Transaction, TransactionStatus, PaymentDetails, useTransactionStore } from '@/stores/transactionStore';
import { generateTransactionId, formatDate } from './formatUtils';

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
  
  store.addTransaction(transaction);
  return transaction;
};
