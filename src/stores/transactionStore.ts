
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TransactionStatus = 'successful' | 'failed' | 'pending' | 'processing' | 'settled' | 'declined';
export type UserRole = 'admin' | 'merchant' | 'client' | null;
export type PaymentMethod = 'upi' | 'card' | 'netbanking';
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

export interface PaymentDetails {
  cardNumber?: string;
  cardHolderName?: string;
  expiryDate?: string;
  cvv?: string;
  bankName?: string;
  upiId?: string;
  processor?: string;
  cardNetwork?: string;
  issuingBank?: string;
  acquiringBank?: string;
  authorizationCode?: string;
  declineReason?: string;
  settlementId?: string;
  processingFee?: string;
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
}

interface TransactionState {
  transactions: Transaction[];
  userRole: UserRole;
  userEmail: string | null;
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  clearTransactions: () => void;
  setUserRole: (role: UserRole, email: string | null) => void;
  clearUserData: () => void;
}

export const useTransactionStore = create<TransactionState>()(
  persist(
    (set) => ({
      transactions: [],
      userRole: null,
      userEmail: null,
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
  } else if (userRole === 'client') {
    // Clients only see transactions they're involved in
    return transactions.filter(t => 
      t.customer === userEmail || 
      t.createdBy === userEmail
    );
  }
  
  return []; // If no role is set, return empty array
};
