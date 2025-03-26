
import { TransactionState } from './types';

// Helper functions to get transactions filtered by role
export const getFilteredTransactions = (state: TransactionState) => {
  const { transactions, userRole, userEmail } = state;
  
  if (userRole === 'admin') {
    return transactions; // Admin sees all transactions
  } else if (userRole === 'merchant') {
    // Merchants see transactions they created or where they are the receiver
    return transactions.filter(t => 
      t.createdBy === userEmail || 
      t.customer === userEmail
    );
  }
  
  return []; // If no role is set, return empty array
};

// Helper to generate transaction ID
export const generateTransactionId = () => {
  return 'txn_' + Math.random().toString(36).substr(2, 9);
};
