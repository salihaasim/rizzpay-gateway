
export interface PaymentDetails {
  upiId?: string;
  cardNumber?: string;
  cardExpiry?: string;
  cardCvv?: string;
  bankReferenceId?: string;
  customerTransactionId?: string;
  upiTransactionId?: string;
  razorpay_payment_id?: string;
  authorizationCode?: string;
  declineReason?: string;
  processor?: string;
  cardHolderName?: string;
  buyerEmail?: string;
  buyerName?: string;
  paymentMethod?: 'upi' | 'card' | 'bank_transfer' | 'wallet';
}
