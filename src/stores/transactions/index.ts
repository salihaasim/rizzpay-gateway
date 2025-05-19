
// This file contains the main transaction store implementation
import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

// Types
export type UserRole = 'admin' | 'merchant';
export type TransactionStatus = 'pending' | 'processing' | 'successful' | 'failed' | 'refunded';
export type PaymentMethod = 'card' | 'upi' | 'net_banking' | 'wallet' | 'neft';
export type PaymentProcessingState = 'initiated' | 'processing' | 'auth_success' | 'auth_failed' | 'completed' | 'failed';

export interface PaymentDetails {
  cardLast4?: string;
  cardNetwork?: string;
  upiId?: string;
  bankAccount?: string;
  bankIfsc?: string;
  walletId?: string;
  paymentGateway?: string;
  gatewayTransactionId?: string;
  gatewayResponse?: Record<string, any>;
}

export interface Transaction {
  id: string;
  date: string;
  amount: string;
  rawAmount?: number;
  paymentMethod: PaymentMethod | string;
  status: TransactionStatus;
  detailedStatus?: string;
  customer: string;
  customerEmail?: string;
  description?: string;
  processingState: PaymentProcessingState;
  processingTimeline?: Array<{
    stage: string;
    timestamp: string;
    message: string;
  }>;
  paymentDetails?: PaymentDetails;
  createdBy?: string;
  walletTransactionType?: 'deposit' | 'withdrawal' | 'transfer' | 'payment';
}

interface Wallet {
  id: string;
  balance: number;
  transactions: Transaction[];
  owner: string;
}

export interface TransactionState {
  transactions: Transaction[];
  wallets: Record<string, Wallet>;
  userRole: UserRole | null;
  userEmail: string | null;
  isAuthenticated: () => boolean;
  setUserRole: (role: UserRole, email: string) => void;
  resetUserRole: () => void;
  clearUserData: () => void;
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (id: string, updatedTransaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
  getTransactionById: (id: string) => Transaction | undefined;
  initializeWallet: (userId: string) => void;
  getWalletBalance: (userId: string) => number;
  depositToWallet: (userId: string, amount: number) => void;
  withdrawFromWallet: (userId: string, amount: number) => boolean;
  transferBetweenWallets: (fromUserId: string, toUserId: string, amount: number) => boolean;
}

// Create the store
export const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: [],
  wallets: {},
  userRole: null,
  userEmail: null,
  
  isAuthenticated: () => {
    return get().userRole !== null;
  },
  
  setUserRole: (role, email) => {
    set({ userRole: role, userEmail: email });
    
    // Initialize wallet if it doesn't exist
    if (!get().wallets[email]) {
      get().initializeWallet(email);
    }
  },
  
  resetUserRole: () => {
    set({ userRole: null, userEmail: null });
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('isLoggedIn');
  },
  
  clearUserData: () => {
    set({ transactions: [], userRole: null, userEmail: null });
  },
  
  addTransaction: (transaction) => {
    // Convert string status to TransactionStatus type
    const safeTransaction = {
      ...transaction,
      status: transaction.status as TransactionStatus,
      processingState: transaction.processingState as PaymentProcessingState
    };
    
    set((state) => ({
      transactions: [safeTransaction, ...state.transactions],
    }));
  },
  
  updateTransaction: (id, updatedTransaction) => {
    // Convert string status to TransactionStatus type
    const safeTransaction = {
      ...updatedTransaction,
      status: updatedTransaction.status as TransactionStatus,
      processingState: updatedTransaction.processingState as PaymentProcessingState
    };
    
    set((state) => ({
      transactions: state.transactions.map((transaction) => 
        transaction.id === id ? safeTransaction : transaction
      ),
    }));
  },
  
  deleteTransaction: (id) => {
    set((state) => ({
      transactions: state.transactions.filter((transaction) => transaction.id !== id),
    }));
  },
  
  getTransactionById: (id) => {
    return get().transactions.find((transaction) => transaction.id === id);
  },
  
  // Wallet functionality
  initializeWallet: (userId) => {
    set((state) => ({
      wallets: {
        ...state.wallets,
        [userId]: {
          id: uuidv4(),
          balance: 0,
          transactions: [],
          owner: userId
        }
      }
    }));
  },
  
  getWalletBalance: (userId) => {
    const wallet = get().wallets[userId];
    return wallet ? wallet.balance : 0;
  },
  
  depositToWallet: (userId, amount) => {
    set((state) => {
      const wallet = state.wallets[userId];
      
      if (!wallet) {
        // Initialize wallet if it doesn't exist
        get().initializeWallet(userId);
        return get().depositToWallet(userId, amount);
      }
      
      // Create transaction for deposit
      const transaction: Transaction = {
        id: `deposit_${uuidv4().substring(0, 8)}`,
        date: new Date().toISOString(),
        amount: `₹${amount.toFixed(2)}`,
        rawAmount: amount,
        paymentMethod: 'wallet',
        status: 'successful',
        customer: userId,
        createdBy: userId,
        description: 'Wallet deposit',
        walletTransactionType: 'deposit',
        processingState: 'completed'
      };
      
      // Add to transactions list
      get().addTransaction(transaction);
      
      // Update wallet
      return {
        wallets: {
          ...state.wallets,
          [userId]: {
            ...wallet,
            balance: wallet.balance + amount,
            transactions: [transaction, ...wallet.transactions]
          }
        }
      };
    });
    
    toast.success(`Deposited ₹${amount.toFixed(2)} to wallet`);
  },
  
  withdrawFromWallet: (userId, amount) => {
    const wallet = get().wallets[userId];
    
    if (!wallet) {
      toast.error('Wallet not found');
      return false;
    }
    
    if (wallet.balance < amount) {
      toast.error('Insufficient wallet balance');
      return false;
    }
    
    set((state) => {
      // Create transaction for withdrawal
      const transaction: Transaction = {
        id: `withdraw_${uuidv4().substring(0, 8)}`,
        date: new Date().toISOString(),
        amount: `₹${amount.toFixed(2)}`,
        rawAmount: amount,
        paymentMethod: 'wallet',
        status: 'successful',
        customer: userId,
        createdBy: userId,
        description: 'Wallet withdrawal',
        walletTransactionType: 'withdrawal',
        processingState: 'completed'
      };
      
      // Add to transactions list
      get().addTransaction(transaction);
      
      // Update wallet
      return {
        wallets: {
          ...state.wallets,
          [userId]: {
            ...wallet,
            balance: wallet.balance - amount,
            transactions: [transaction, ...wallet.transactions]
          }
        }
      };
    });
    
    toast.success(`Withdrew ₹${amount.toFixed(2)} from wallet`);
    return true;
  },
  
  transferBetweenWallets: (fromUserId, toUserId, amount) => {
    const fromWallet = get().wallets[fromUserId];
    const toWallet = get().wallets[toUserId];
    
    if (!fromWallet) {
      toast.error('Source wallet not found');
      return false;
    }
    
    if (!toWallet) {
      toast.error('Destination wallet not found');
      return false;
    }
    
    if (fromWallet.balance < amount) {
      toast.error('Insufficient wallet balance');
      return false;
    }
    
    set((state) => {
      // Create transaction for sender
      const senderTransaction: Transaction = {
        id: `transfer_out_${uuidv4().substring(0, 8)}`,
        date: new Date().toISOString(),
        amount: `₹${amount.toFixed(2)}`,
        rawAmount: amount,
        paymentMethod: 'wallet',
        status: 'successful',
        customer: toUserId,
        createdBy: fromUserId,
        description: `Wallet transfer to ${toUserId}`,
        walletTransactionType: 'transfer',
        processingState: 'completed'
      };
      
      // Create transaction for receiver
      const receiverTransaction: Transaction = {
        id: `transfer_in_${uuidv4().substring(0, 8)}`,
        date: new Date().toISOString(),
        amount: `₹${amount.toFixed(2)}`,
        rawAmount: amount,
        paymentMethod: 'wallet',
        status: 'successful',
        customer: fromUserId,
        createdBy: fromUserId,
        description: `Wallet transfer from ${fromUserId}`,
        walletTransactionType: 'transfer',
        processingState: 'completed'
      };
      
      // Add to transactions list
      get().addTransaction(senderTransaction);
      get().addTransaction(receiverTransaction);
      
      // Update wallets
      return {
        wallets: {
          ...state.wallets,
          [fromUserId]: {
            ...fromWallet,
            balance: fromWallet.balance - amount,
            transactions: [senderTransaction, ...fromWallet.transactions]
          },
          [toUserId]: {
            ...toWallet,
            balance: toWallet.balance + amount,
            transactions: [receiverTransaction, ...toWallet.transactions]
          }
        }
      };
    });
    
    toast.success(`Transferred ₹${amount.toFixed(2)} from ${fromUserId} to ${toUserId}`);
    return true;
  }
}));
