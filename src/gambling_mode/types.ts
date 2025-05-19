
import { Transaction } from '@/stores/transactions/types';
import { PaymentDetails } from '@/types/payment';

export interface GamblingModeContext {
  merchantId: string;
  isEnabled: boolean;
  settings: Record<string, any>;
}

// Extend the PaymentDetails type with gambling-specific fields
export interface GamblingPaymentDetails extends PaymentDetails {
  isGamblingTransaction?: boolean;
  obfuscated?: boolean;
  routedVia?: string;
  routingDetails?: Record<string, any>;
  processingDetails?: Record<string, any>;
  internalNotes?: string;
}

// Add a utility type to safely update payment details with gambling properties
export type ExtendedTransaction = Omit<Transaction, 'paymentDetails'> & {
  paymentDetails?: GamblingPaymentDetails;
};
