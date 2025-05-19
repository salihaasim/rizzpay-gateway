
// Extended payment details type that includes all the properties used across the app
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
  cardLast4?: string;
  cardNetwork?: string;
  bankAccount?: string;
  bankIfsc?: string;
  walletId?: string;
  paymentGateway?: string;
  gatewayTransactionId?: string;
  gatewayResponse?: Record<string, any>;
  recipientEmail?: string;
  recipientName?: string;
  description?: string;
  paidAmount?: string;
  card_network_processing?: string;
}
