
export type TransactionStatus = 'pending' | 'processing' | 'successful' | 'failed' | 'refunded' | 'settled' | 'declined';

export type PaymentProcessingState = 
  | 'initiated' 
  | 'processing' 
  | 'completed' 
  | 'failed' 
  | 'gateway_processing' 
  | 'processor_routing' 
  | 'authorization_decision' 
  | 'declined';

export interface TransactionTimelineItem {
  stage: string;
  timestamp: string;
  message: string;
}

export interface Transaction {
  id: string;
  date: string;
  amount: string;
  paymentMethod: PaymentMethod;
  status: TransactionStatus;
  customer: string;
  customerEmail?: string;
  createdBy?: string;
  processingState?: PaymentProcessingState;
  processingTimeline?: TransactionTimelineItem[];
  paymentDetails?: PaymentDetails;
  description?: string;
  walletTransactionType?: 'deposit' | 'withdrawal' | 'transfer';
  detailedStatus?: string;
  rawAmount?: number;
}

export type PaymentMethod = 'card' | 'upi' | 'netbanking' | 'wallet' | 'neft' | 'unknown';

export type UserRole = 'admin' | 'merchant';

export interface Wallet {
  id?: string;
  balance: number;
  transactions: string[];
  owner?: string;
  currency?: string;
}

export type WalletTransactionType = 'deposit' | 'withdrawal' | 'transfer' | 'payment';

export interface TransactionState {
  transactions: Transaction[];
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (id: string, updatedTransaction: Partial<Transaction>) => void;
  removeTransaction: (id: string) => void;
  getTransactionById: (id: string) => Transaction | undefined;
  userRole: UserRole;
  userEmail: string;
  setUserRole: (role: UserRole, email: string) => void;
  clearUserData: () => void;
  resetUserRole: () => void;
  isAuthenticated: () => boolean;
  getSuccessfulTransactions: () => Transaction[];
  getPendingTransactions: () => Transaction[];
  getFailedTransactions: () => Transaction[];
  getRefundedTransactions: () => Transaction[];
  wallets: Record<string, Wallet>;
  initializeWallet: (walletId: string, initialBalance?: number) => void;
  getWalletBalance: (walletId: string) => number;
  depositToWallet: (walletId: string, amount: number) => boolean;
  withdrawFromWallet: (walletId: string, amount: number) => boolean;
  transferBetweenWallets: (fromWalletId: string, toWalletId: string, amount: number) => boolean;
  transferFunds: (fromEmail: string, toEmail: string, amount: number, description?: string) => string;
}
