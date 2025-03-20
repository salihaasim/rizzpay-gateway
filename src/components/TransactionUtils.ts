
import { Transaction, TransactionStatus, useTransactionStore } from '@/stores/transactionStore';

export const generateTransactionId = (): string => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

export const formatDate = (): string => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = (hours % 12) || 12;
  
  return `Today, ${formattedHours}:${minutes} ${ampm}`;
};

export const addTransaction = (
  amount: string,
  paymentMethod: string,
  status: TransactionStatus,
  customer: string
): Transaction => {
  const store = useTransactionStore.getState();
  
  const transaction: Transaction = {
    id: generateTransactionId(),
    date: formatDate(),
    amount: `₹${amount}`,
    paymentMethod,
    status,
    customer,
    createdBy: store.userEmail || undefined
  };
  
  store.addTransaction(transaction);
  return transaction;
};
