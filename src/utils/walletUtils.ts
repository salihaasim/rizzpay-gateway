
import { toast } from 'sonner';
import { TransactionStatus } from '@/types/transaction';
import { useTransactionStore } from '@/stores/transactions';

// Simulate wallet processing with success/failure
export const simulateWalletProcessing = (
  fromWalletId: string,
  toWalletId: string,
  amount: number
): Promise<string> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.1) {
        resolve('transaction_success_id');
      } else {
        reject(new Error('Transaction failed'));
      }
    }, 1500);
  });
};

// Calculate wallet fee
export const calculateWalletFee = (amount: number): number => {
  // Basic fee calculation
  const fee = amount * 0.01; // 1% fee
  return Math.min(Math.max(fee, 5), 100); // Min 5, Max 100
};
