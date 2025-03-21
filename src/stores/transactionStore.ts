import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TransactionStatus = 'successful' | 'failed' | 'pending' | 'processing' | 'settled' | 'declined';
export type UserRole = 'admin' | 'merchant' | null;
export type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'neft' | 'wallet' | 'webhook';
export type PaymentProcessingState = 
  | 'initiated' 
  | 'gateway_processing'
  | 'processor_routing'
  | 'card_network_processing'
  | 'bank_authorization'
  | 'authorization_decision'
  | 'declined'
  | 'settlement_recording'
  | 'settlement_initiated'
  | 'settlement_processing'
  | 'funds_transferred'
  | 'merchant_credited'
  | 'completed';

export type WalletTransactionType = 'deposit' | 'withdrawal' | 'payment' | 'transfer';

export interface PaymentDetails {
  cardNumber?: string;
  cardHolderName?: string;
  expiryDate?: string;
  cvv?: string;
  bankName?: string;
  bankAccount?: string;
  bankIfsc?: string;
  upiId?: string;
  processor?: string;
  cardNetwork?: string;
  issuingBank?: string;
  acquiringBank?: string;
  authorizationCode?: string;
  declineReason?: string;
  settlementId?: string;
  processingFee?: string;
  recipientEmail?: string;
  recipientName?: string;
  gateway?: string;
  buyerName?: string;
  buyerEmail?: string;
  paidAmount?: string;
  neftReference?: string;
}

export interface Transaction {
  id: string;
  date: string;
  amount: string;
  paymentMethod: string;
  status: TransactionStatus;
  customer: string;
  createdBy?: string;
  processingState?: PaymentProcessingState;
  detailedStatus?: string;
  rawAmount?: number;
  paymentDetails?: PaymentDetails;
  processingTimeline?: {
    stage: string;
    timestamp: string;
    message: string;
  }[];
  walletTransactionType?: WalletTransactionType;
  description?: string;
}

export interface Wallet {
  balance: number;
  currency: string;
  transactions: string[]; // Array of transaction IDs
}

interface TransactionState {
  transactions: Transaction[];
  userRole: UserRole;
  userEmail: string | null;
  wallets: Record<string, Wallet>; // Email -> Wallet mapping
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  clearTransactions: () => void;
  setUserRole: (role: UserRole, email: string | null) => void;
  clearUserData: () => void;
  // Wallet methods
  initializeWallet: (email: string) => void;
  getWalletBalance: (email: string) => number;
  depositToWallet: (email: string, amount: number, paymentMethod: string) => string;
  withdrawFromWallet: (email: string, amount: number, paymentMethod: string) => string;
  // New methods for merchant transfers
  transferFunds: (fromEmail: string, toEmail: string, amount: number, description?: string) => string;
}

export interface TransactionStore {
  transactions: Transaction[];
  userRole: UserRole;
  userEmail: string | null;
  wallets: Record<string, Wallet>; // Email -> Wallet mapping
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  clearTransactions: () => void;
  setUserRole: (role: UserRole, email: string | null) => void;
  clearUserData: () => void;
  // Wallet methods
  initializeWallet: (email: string) => void;
  getWalletBalance: (email: string) => number;
  depositToWallet: (email: string, amount: number, paymentMethod: string) => string;
  withdrawFromWallet: (email: string, amount: number, paymentMethod: string) => string;
  // New methods for merchant transfers
  transferFunds: (fromEmail: string, toEmail: string, amount: number, description?: string) => string;
  resetUserRole: () => void;
}

export const useTransactionStore = create<TransactionStore>()(
  persist(
    (set, get) => ({
      transactions: [],
      userRole: null,
      userEmail: null,
      wallets: {},
      
      addTransaction: (transaction) => 
        set((state) => ({ 
          transactions: [transaction, ...state.transactions] 
        })),
        
      updateTransaction: (id, updates) =>
        set((state) => ({
          transactions: state.transactions.map(transaction => 
            transaction.id === id 
              ? { ...transaction, ...updates } 
              : transaction
          )
        })),
        
      clearTransactions: () => set({ transactions: [] }),
      
      setUserRole: (role, email) => set({ userRole: role, userEmail: email }),
      
      clearUserData: () => set({ userRole: null, userEmail: null }),
      
      // New method to initialize a wallet for a user if it doesn't exist
      initializeWallet: (email) => {
        const state = get();
        if (!state.wallets[email]) {
          set((state) => ({
            wallets: {
              ...state.wallets,
              [email]: {
                balance: 0,
                currency: '₹',
                transactions: []
              }
            }
          }));
        }
      },
      
      // Wallet methods
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
          paymentMethod,
          status: 'successful',
          customer: email,
          createdBy: email,
          walletTransactionType: 'deposit',
          description: 'Deposit to wallet',
        };
        
        // Update wallet
        set((state) => {
          const userWallet = state.wallets[email] || { balance: 0, currency: '₹', transactions: [] };
          
          return {
            transactions: [transaction, ...state.transactions],
            wallets: {
              ...state.wallets,
              [email]: {
                ...userWallet,
                balance: userWallet.balance + amount,
                transactions: [transactionId, ...userWallet.transactions],
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
          paymentMethod,
          status: 'successful',
          customer: email,
          createdBy: email,
          walletTransactionType: 'withdrawal',
          description: 'Withdrawal from wallet',
        };
        
        // Update wallet
        set((state) => {
          const userWallet = state.wallets[email] || { balance: 0, currency: '₹', transactions: [] };
          
          return {
            transactions: [transaction, ...state.transactions],
            wallets: {
              ...state.wallets,
              [email]: {
                ...userWallet,
                balance: userWallet.balance - amount,
                transactions: [transactionId, ...userWallet.transactions],
              }
            }
          };
        });
        
        return transactionId;
      },
      
      // New method for merchant transfers
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
          walletTransactionType: 'transfer',
          description,
          paymentDetails: {
            recipientEmail: toEmail,
          }
        };
        
        // Update both wallets
        set((state) => {
          const senderWallet = state.wallets[fromEmail] || { balance: 0, currency: '₹', transactions: [] };
          const recipientWallet = state.wallets[toEmail] || { balance: 0, currency: '₹', transactions: [] };
          
          return {
            transactions: [transaction, ...state.transactions],
            wallets: {
              ...state.wallets,
              [fromEmail]: {
                ...senderWallet,
                balance: senderWallet.balance - amount,
                transactions: [transactionId, ...senderWallet.transactions],
              },
              [toEmail]: {
                ...recipientWallet,
                balance: recipientWallet.balance + amount,
                transactions: [transactionId, ...recipientWallet.transactions],
              }
            }
          };
        });
        
        return transactionId;
      },
      
      resetUserRole: () => {
        set({ userRole: null, userEmail: null });
      },
    }),
    {
      name: 'transactions-storage',
    }
  )
);

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
const generateTransactionId = () => {
  return 'txn_' + Math.random().toString(36).substr(2, 9);
};
