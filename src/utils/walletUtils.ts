
import { TransactionStatus, useTransactionStore } from '@/stores/transactionStore';
import { delay } from './commonUtils';

export const simulateWalletProcessing = async (
  userEmail: string,
  amount: number,
  type: 'deposit' | 'withdrawal',
  description?: string
): Promise<void> => {
  const store = useTransactionStore.getState();
  
  // Create appropriate transaction ID based on type
  let transactionId: string;
  
  if (type === 'deposit') {
    transactionId = store.depositToWallet(userEmail, amount, 'wallet');
  } else if (type === 'withdrawal') {
    transactionId = store.withdrawFromWallet(userEmail, amount, 'wallet');
  } else {
    throw new Error(`Invalid transaction type: ${type}`);
  }
  
  const transaction = store.transactions.find(t => t.id === transactionId);
  
  if (!transaction) {
    throw new Error(`Transaction with ID ${transactionId} not found`);
  }
  
  // Update to processing
  store.updateTransaction(transactionId, {
    processingState: 'gateway_processing',
    processingTimeline: [
      ...(transaction.processingTimeline || []),
      {
        stage: 'gateway_processing',
        timestamp: new Date().toISOString(),
        message: 'Wallet transaction processing initiated'
      }
    ]
  });
  
  // Simulate processing delay
  await delay(1500);
  
  // Complete transaction
  store.updateTransaction(transactionId, {
    status: 'successful' as TransactionStatus,
    processingState: 'completed',
    processingTimeline: [
      ...(transaction.processingTimeline || []),
      {
        stage: 'completed',
        timestamp: new Date().toISOString(),
        message: 'Wallet transaction completed successfully'
      }
    ],
    description: description || transaction.description
  });
};

export const calculateWalletFee = (amount: number): number => {
  // Simple fee calculation: 1.5% with min fee of ₹5 and max of ₹100
  const fee = amount * 0.015;
  return Math.max(5, Math.min(fee, 100));
};
