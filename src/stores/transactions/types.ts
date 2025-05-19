
export type UserRole = 'admin' | 'merchant' | null;

export type TransactionStatus = 'pending' | 'processing' | 'successful' | 'failed' | 'refunded' | 'settled' | 'declined';

export type PaymentMethod = 'card' | 'upi' | 'netbanking' | 'wallet' | 'neft' | 'instamojo_card' | 'instamojo_neft' | 'upi_manual';

export type PaymentProcessingState = 
  'initiated' | 
  'gateway_processing' | 
  'processor_routing' | 
  'card_network_processing' | 
  'bank_authorization' | 
  'authorization_decision' | 
  'declined' | 
  'settlement_recording' | 
  'settlement_initiated' | 
  'settlement_processing' | 
  'funds_transferred' | 
  'merchant_credited' | 
  'completed' | 
  'failed' | 
  'processing';

export interface ProcessingTimelineItem {
  stage: string;
  timestamp: string;
  message: string;
}

export interface PaymentDetails {
  // Basic payment details
  routingDetails?: any;
  processingDetails?: any;
  internalNotes?: any;
  description?: string;
  
  // Card payment details
  cardLast4?: string;
  cardNetwork?: string;
  authorizationCode?: string;
  declineReason?: string;
  cardHolderName?: string;
  
  // UPI payment details
  upiId?: string;
  upiTransactionId?: string;
  razorpay_payment_id?: string;
  
  // Bank transfer details
  bankAccount?: string;
  bankIfsc?: string;
  
  // Wallet details
  walletId?: string;
  
  // Gateway details
  paymentGateway?: string;
  gatewayTransactionId?: string;
  gatewayResponse?: Record<string, any>;
  processor?: string;
  
  // Customer details
  buyerName?: string;
  buyerEmail?: string;
  customerTransactionId?: string;
}

export type WalletTransactionType = 'deposit' | 'withdrawal' | 'transfer_in' | 'transfer_out' | 'payment' | 'refund';

export interface Transaction {
  id: string;
  date: string;
  amount: string;
  rawAmount?: number;
  customer: string;
  customerEmail?: string;
  status: TransactionStatus;
  paymentMethod: PaymentMethod;
  description?: string;
  detailedStatus?: string;
  processingState?: PaymentProcessingState;
  processingTimeline?: ProcessingTimelineItem[];
  paymentDetails: PaymentDetails;
  walletTransactionType?: WalletTransactionType;
  createdBy?: string;
}

export interface Wallet {
  id: string;
  owner: string;
  balance: number;
  transactions: Transaction[];
}

export interface TransactionState {
  transactions: Transaction[];
  filteredTransactions: Transaction[];
  filters: {
    status: string | null;
    paymentMethod: string | null;
    dateRange: {
      from: Date | null;
      to: Date | null;
    };
    searchQuery: string;
  };
  wallets: Record<string, Wallet>;
  activeWallet: string | null;
  userRole: UserRole;
  userEmail: string | null;
  isLoading: boolean;
  error: string | null;
  
  // Methods
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  setTransactions: (transactions: Transaction[]) => void;
  setFilters: (filters: Partial<TransactionState['filters']>) => void;
  resetFilters: () => void;
  setUserRole: (role: UserRole, email: string | null) => void;
  clearUserData: () => void;
  resetUserRole: () => void;
  isAuthenticated: () => boolean;
  transferFunds: (fromWalletId: string, toWalletId: string, amount: number, description: string) => boolean;
  
  // Wallet methods
  initializeWallet: (owner: string) => void;
  depositToWallet: (owner: string, amount: number, description: string, paymentDetails?: Partial<PaymentDetails>) => string;
  withdrawFromWallet: (owner: string, amount: number, description: string) => boolean;
  getWalletBalance: (owner: string) => number;
}
