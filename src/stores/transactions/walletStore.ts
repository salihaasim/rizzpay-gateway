
import { Transaction, Wallet, WalletTransactionType, TransactionState, PaymentMethod } from './types';
import { generateTransactionId } from './utils';

export interface WalletSlice {
  wallets: Record<string, Wallet>;
  initializeWallet: (email: string) => void;
  getWalletBalance: (email: string) => number;
  depositToWallet: (email: string, amount: number, paymentMethod: PaymentMethod) => string;
  withdrawFromWallet: (email: string, amount: number, paymentMethod: PaymentMethod) => string;
  transferFunds: (fromEmail: string, toEmail: string, amount: number, description?: string) => string;
}

export const createWalletSlice = (
  set: (fn: (state: TransactionState) => Partial<TransactionState>) => void,
  get: () => TransactionState
): WalletSlice => ({
  wallets: {},
  
  initializeWallet: (email) => {
    const state = get();
    if (!state.wallets[email]) {
      set((state) => ({
        wallets: {
          ...state.wallets,
          [email]: {
            id: generateTransactionId(),
            owner: email,
            balance: 0,
            transactions: []
          }
        }
      }));
    }
  },
  
  getWalletBalance: (email) => {
    const state = get();
    return state.wallets[email]?.balance || 0;
  },
  
  depositToWallet: (email, amount, paymentMethod) => {
    const state = get();
    const transactionId = generateTransactionId();
    const date = new Date().toISOString();
    
    // Create transaction
    const transaction: Transaction = {
      id: transactionId,
      date,
      amount: `₹${amount.toFixed(2)}`,
      rawAmount: amount,
      paymentMethod: paymentMethod,
      status: 'successful',
      customer: email,
      createdBy: email,
      walletTransactionType: 'deposit',
      description: 'Deposit to wallet',
      paymentDetails: {}
    };
    
    // Update wallet
    set((state) => {
      const userWallet = state.wallets[email] || { 
        id: generateTransactionId(), 
        owner: email, 
        balance: 0, 
        transactions: [] 
      };
      
      return {
        transactions: [transaction, ...state.transactions],
        wallets: {
          ...state.wallets,
          [email]: {
            ...userWallet,
            balance: userWallet.balance + amount,
            transactions: [transaction, ...userWallet.transactions],
          }
        }
      };
    });
    
    return transactionId;
  },
  
  withdrawFromWallet: (email, amount, paymentMethod) => {
    const state = get();
    const currentBalance = state.wallets[email]?.balance || 0;
    
    // Check if sufficient balance
    if (currentBalance < amount) {
      throw new Error("Insufficient balance");
    }
    
    const transactionId = generateTransactionId();
    const date = new Date().toISOString();
    
    // Create transaction
    const transaction: Transaction = {
      id: transactionId,
      date,
      amount: `₹${amount.toFixed(2)}`,
      rawAmount: amount,
      paymentMethod: paymentMethod,
      status: 'successful',
      customer: email,
      createdBy: email,
      walletTransactionType: 'withdrawal',
      description: 'Withdrawal from wallet',
      paymentDetails: {}
    };
    
    // Update wallet
    set((state) => {
      const userWallet = state.wallets[email] || { 
        id: generateTransactionId(), 
        owner: email, 
        balance: 0, 
        transactions: [] 
      };
      
      return {
        transactions: [transaction, ...state.transactions],
        wallets: {
          ...state.wallets,
          [email]: {
            ...userWallet,
            balance: userWallet.balance - amount,
            transactions: [transaction, ...userWallet.transactions],
          }
        }
      };
    });
    
    return transactionId;
  },
  
  transferFunds: (fromEmail, toEmail, amount, description = 'Fund transfer') => {
    const state = get();
    const senderBalance = state.wallets[fromEmail]?.balance || 0;
    
    // Check if sufficient balance
    if (senderBalance < amount) {
      throw new Error("Insufficient balance for transfer");
    }
    
    // Ensure recipient wallet exists
    if (!state.wallets[toEmail]) {
      throw new Error("Recipient wallet does not exist");
    }
    
    const transactionId = generateTransactionId();
    const date = new Date().toISOString();
    
    // Create transaction
    const transaction: Transaction = {
      id: transactionId,
      date,
      amount: `₹${amount.toFixed(2)}`,
      rawAmount: amount,
      paymentMethod: 'wallet',
      status: 'successful',
      customer: toEmail,
      createdBy: fromEmail,
      walletTransactionType: 'transfer_in',
      description,
      paymentDetails: {
        buyerEmail: toEmail
      }
    };
    
    // Update both wallets
    set((state) => {
      const senderWallet = state.wallets[fromEmail] || { 
        id: generateTransactionId(), 
        owner: fromEmail, 
        balance: 0, 
        transactions: [] 
      };
      const recipientWallet = state.wallets[toEmail] || { 
        id: generateTransactionId(), 
        owner: toEmail, 
        balance: 0, 
        transactions: [] 
      };
      
      return {
        transactions: [transaction, ...state.transactions],
        wallets: {
          ...state.wallets,
          [fromEmail]: {
            ...senderWallet,
            balance: senderWallet.balance - amount,
            transactions: [transaction, ...senderWallet.transactions],
          },
          [toEmail]: {
            ...recipientWallet,
            balance: recipientWallet.balance + amount,
            transactions: [transaction, ...recipientWallet.transactions],
          }
        }
      };
    });
    
    return transactionId;
  }
});
