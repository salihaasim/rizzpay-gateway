export interface PaymentDetails {
  upiId?: string;
  cardNumber?: string;
  cardExpiry?: string;
  cardCvv?: string;
  bankReferenceId?: string;
  customerTransactionId?: string;
  paymentMethod?: 'upi' | 'card' | 'bank_transfer' | 'wallet';
  
  cardHolderName?: string;
  upiTransactionId?: string;
  razorpay_payment_id?: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
  buyerName?: string;
  buyerEmail?: string;
  paidAmount?: string;
  amountInPaise?: number;
  recipientEmail?: string;
  recipientName?: string;
  
  processor?: string;
  authorizationCode?: string;
  declineReason?: string;
  
  cardType?: string;
  cardNetwork?: string;
  cardLastDigits?: string;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  description?: string;
  gateway?: string;
}
