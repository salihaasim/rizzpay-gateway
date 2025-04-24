
/**
 * RizzPay Gambling Mode - Wallet Module
 * Handles internal wallet credit/debit logic for gambling transactions
 */

import { Transaction, WalletTransactionType } from '@/stores/transactions/types';
import { useTransactionStore } from '@/stores/transactions';
import { delay } from '@/utils/commonUtils';

/**
 * Process gambling deposit with enhanced anonymity
 */
export const processGamblingDeposit = async (
  userEmail: string,
  amount: number,
  description: string = 'Entertainment Services'
): Promise<string> => {
  const store = useTransactionStore.getState();
  
  // Create obfuscated transaction record
  const transactionId = store.depositToWallet(userEmail, amount, 'wallet');
  
  // Get the transaction and update it with gambling mode flags
  const transaction = store.transactions.find(t => t.id === transactionId);
  
  if (!transaction) {
    throw new Error('Transaction creation failed');
  }
  
  // Update transaction with obfuscated description and metadata
  store.updateTransaction(transactionId, {
    description: description,
    paymentDetails: {
      ...transaction.paymentDetails,
      isGamblingTransaction: true,
      obfuscated: true,
      routedVia: 'entertainment-gateway'
    }
  });
  
  return transactionId;
};

/**
 * Process gambling withdrawal with enhanced privacy
 */
export const processGamblingWithdrawal = async (
  userEmail: string,
  amount: number,
  description: string = 'Entertainment Services Withdrawal'
): Promise<string> => {
  const store = useTransactionStore.getState();
  
  // Check for sufficient balance
  const currentBalance = store.getWalletBalance(userEmail);
  if (currentBalance < amount) {
    throw new Error('Insufficient balance for withdrawal');
  }
  
  // Create withdrawal with obfuscated description
  const transactionId = store.withdrawFromWallet(userEmail, amount, 'wallet');
  
  // Update transaction with gambling mode flags
  store.updateTransaction(transactionId, {
    description: description,
    paymentDetails: {
      isGamblingTransaction: true,
      obfuscated: true,
      routedVia: 'entertainment-payout'
    }
  });
  
  return transactionId;
};

/**
 * Get gambling transaction history with filtered sensitive information
 */
export const getFilteredGamblingTransactions = (userEmail: string): Transaction[] => {
  const store = useTransactionStore.getState();
  const allTransactions = store.transactions;
  
  // Filter transactions related to this user
  const userTransactions = allTransactions.filter(t => 
    (t.customer === userEmail || t.createdBy === userEmail) &&
    t.paymentDetails?.isGamblingTransaction === true
  );
  
  // Return filtered transactions with sensitive data removed
  return userTransactions.map(t => ({
    ...t,
    paymentDetails: {
      ...t.paymentDetails,
      routingDetails: undefined,
      processingDetails: undefined,
      internalNotes: undefined
    }
  }));
};
