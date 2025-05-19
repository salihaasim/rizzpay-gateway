
import { TransactionState, WalletTransaction, WalletSlice } from './types';

export const createWalletSlice = (
  set: (fn: (state: TransactionState) => Partial<TransactionState>) => void,
  get: () => TransactionState
): WalletSlice => ({
  walletBalance: 10000, // Default wallet balance for demo
  walletTransactions: [],
  
  // Add a transaction to the wallet
  addWalletTransaction: (transaction) => {
    set((state) => {
      let newBalance = state.walletBalance;
      
      // Update balance based on transaction type
      if (transaction.type === 'payment' || transaction.type === 'withdrawal') {
        // 1% transaction fee for all outgoing transactions (updated from prior 1.5%)
        const fee = transaction.amount * 0.01; 
        newBalance -= (transaction.amount + fee);
      } else if (transaction.type === 'transfer_out') {
        // 1% transaction fee for transfers out (updated from prior 1.5%)
        const fee = transaction.amount * 0.01;
        newBalance -= (transaction.amount + fee);
      } else if (transaction.type === 'transfer_in' || transaction.type === 'refund' || transaction.type === 'deposit') {
        // No fee for incoming transfers, refunds or deposits
        newBalance += transaction.amount;
      }
      
      // Return updated state
      return {
        walletTransactions: [transaction, ...state.walletTransactions],
        walletBalance: parseFloat(newBalance.toFixed(2))
      };
    });
  },
  
  // Process a payment from the wallet
  processWalletPayment: (amount, recipient, description) => {
    const state = get();
    
    // Calculate fee (1% of transaction amount)
    const fee = amount * 0.01;
    const totalAmount = amount + fee;
    
    // Check if sufficient balance
    if (state.walletBalance < totalAmount) {
      console.error('Insufficient wallet balance');
      return false;
    }
    
    // Create new transaction
    const transaction: WalletTransaction = {
      id: `wt-${Date.now()}`,
      type: 'payment',
      amount: amount,
      fee: fee,
      recipient: recipient,
      description: description || 'Payment',
      timestamp: new Date().toISOString(),
      status: 'completed'
    };
    
    // Add transaction to wallet
    state.addWalletTransaction(transaction);
    return true;
  },
  
  // Process a withdrawal from the wallet
  processWalletWithdrawal: (amount, bankAccount, description) => {
    const state = get();
    
    // Calculate fee (1% of withdrawal amount)
    const fee = amount * 0.01;
    const totalAmount = amount + fee;
    
    // Check if sufficient balance
    if (state.walletBalance < totalAmount) {
      console.error('Insufficient wallet balance');
      return false;
    }
    
    // Create new transaction
    const transaction: WalletTransaction = {
      id: `wt-${Date.now()}`,
      type: 'withdrawal',
      amount: amount,
      fee: fee,
      recipient: bankAccount,
      description: description || 'Withdrawal to bank account',
      timestamp: new Date().toISOString(),
      status: 'processing' // Initially set as processing
    };
    
    // Add transaction to wallet
    state.addWalletTransaction(transaction);
    
    // Simulate processing completion after 3 seconds
    setTimeout(() => {
      set((state) => ({
        walletTransactions: state.walletTransactions.map(t => 
          t.id === transaction.id ? { ...t, status: 'completed' } : t
        )
      }));
    }, 3000);
    
    return true;
  },
  
  // Process a wallet transfer
  processWalletTransfer: (amount, recipient, description) => {
    const state = get();
    
    // Calculate fee (1% of transfer amount)
    const fee = amount * 0.01;
    const totalAmount = amount + fee;
    
    // Check if sufficient balance
    if (state.walletBalance < totalAmount) {
      console.error('Insufficient wallet balance');
      return false;
    }
    
    // Create outgoing transaction
    const outgoingTransaction: WalletTransaction = {
      id: `wt-out-${Date.now()}`,
      type: 'transfer_out',
      amount: amount,
      fee: fee,
      recipient: recipient,
      description: description || 'Transfer to merchant',
      timestamp: new Date().toISOString(),
      status: 'completed'
    };
    
    // Add outgoing transaction to wallet
    state.addWalletTransaction(outgoingTransaction);
    return true;
  }
});
