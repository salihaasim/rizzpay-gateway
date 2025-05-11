
export interface PaymentDetails {
  upiId?: string;
  customerTransactionId?: string;
  cardType?: string;
  cardNetwork?: string;
  cardLastDigits?: string;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
}
