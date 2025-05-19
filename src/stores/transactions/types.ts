
// Transaction related types
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

export type WalletTransactionType = 'payment' | 'withdrawal' | 'transfer_out' | 'transfer_in' | 'refund' | 'deposit';

export interface WalletTransaction {
  id: string;
  type: WalletTransactionType;
  amount: number;
  fee?: number;
  recipient?: string;
  description?: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'processing' | 'failed';
}

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
  razorpay_payment_id?: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
  amountInPaise?: number;
  upiTransactionId?: string; // Used for UTR IDs
  description?: string; // Added for UPI link payments
  customerTransactionId?: string; // Added for UPI QR payments
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

// Add the WalletSlice interface to define the wallet-related state and actions
export interface WalletSlice {
  walletBalance: number;
  walletTransactions: WalletTransaction[];
  addWalletTransaction: (transaction: WalletTransaction) => void;
  processWalletPayment: (amount: number, recipient: string, description?: string) => boolean;
  processWalletWithdrawal: (amount: number, bankAccount: string, description?: string) => boolean;
  processWalletTransfer: (amount: number, recipient: string, description?: string) => boolean;
}

export interface TransactionState {
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
  // Wallet properties
  walletBalance: number;
  walletTransactions: WalletTransaction[];
  addWalletTransaction: (transaction: WalletTransaction) => void;
  processWalletPayment: (amount: number, recipient: string, description?: string) => boolean;
  processWalletWithdrawal: (amount: number, bankAccount: string, description?: string) => boolean;
  processWalletTransfer: (amount: number, recipient: string, description?: string) => boolean;
}

export interface TransactionStore extends TransactionState {
  resetUserRole: () => void;
}
