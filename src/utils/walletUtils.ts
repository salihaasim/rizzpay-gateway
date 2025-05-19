
import { Transaction, PaymentMethod } from '@/stores/transactions/types';
import { useTransactionStore } from '@/stores/transactions';
import { v4 as uuidv4 } from 'uuid';

// Calculate wallet fee based on transaction type and amount
export const calculateWalletFee = (
  transactionType: 'deposit' | 'withdrawal' | 'transfer', 
  amount: number
): number => {
  switch (transactionType) {
    case 'deposit':
      return Math.max(10, amount * 0.012); // 1.2% with 10 INR minimum
    case 'withdrawal':
      return Math.max(25, amount * 0.015); // 1.5% with 25 INR minimum
    case 'transfer':
      return Math.max(5, amount * 0.005); // 0.5% with 5 INR minimum
    default:
      return 0;
  }
};

// Simulate wallet processing with delays and realistic success/failure rates
export const simulateWalletProcessing = async (
  email: string,
  amount: number,
  transactionType: 'deposit' | 'withdrawal' | 'transfer',
  paymentMethod: PaymentMethod,
  description?: string
): Promise<string> => {
  const store = useTransactionStore.getState();
  
  // Initialize wallet if it doesn't exist
  store.initializeWallet(email);
  
  // Perform deposit or withdrawal
  try {
    let transactionId: string;
    
    if (transactionType === 'deposit') {
      transactionId = store.depositToWallet(email, amount, paymentMethod);
      return transactionId;
    } else if (transactionType === 'withdrawal') {
      transactionId = store.withdrawFromWallet(email, amount, paymentMethod);
      return transactionId;
    } else if (transactionType === 'transfer' && description) {
      // The description parameter is used to pass the recipient email
      const recipientEmail = description;
      return store.transferFunds(email, recipientEmail, amount);
    }
    
    throw new Error(`Unsupported transaction type: ${transactionType}`);
  } catch (error) {
    console.error(`Wallet ${transactionType} failed:`, error);
    throw new Error(`Failed to process ${transactionType}: ${(error as Error).message}`);
  }
};
