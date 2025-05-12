
export interface PaymentDetails {
  upiId?: string;
  cardNumber?: string;
  cardExpiry?: string;
  cardCvv?: string;
  bankReferenceId?: string;
  customerTransactionId?: string; // Added to fix the TS2353 error
  paymentMethod?: 'upi' | 'card' | 'bank_transfer' | 'wallet';
}
