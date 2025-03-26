
import React from 'react';
import CardPayment from './CardPayment';
import NetBankingPayment from './NetBankingPayment';
import UpiPayment from './UpiPayment';
import { AlertCircle } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useTransactionStore } from '@/stores/transactionStore';

interface PaymentMethodProps {
  paymentMethod: string;
  paymentData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  loading: boolean;
}

const PaymentMethod: React.FC<PaymentMethodProps> = ({
  paymentMethod,
  paymentData,
  handleInputChange,
  loading
}) => {
  const userEmail = useTransactionStore(state => state.userEmail);
  const walletBalance = useTransactionStore(state => {
    if (state.userEmail) {
      return state.getWalletBalance(state.userEmail);
    }
    return 0;
  });
  
  // Simple UPI ID validation function
  const validateUpiId = (upiId: string): boolean => {
    // Basic UPI ID validation (alphanumeric@provider format)
    const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/;
    return upiRegex.test(upiId);
  };

  // Generate QR code for UPI
  const generateQrCode = () => {
    if (!validateUpiId(paymentData.upiId) || !paymentData.amount) {
      return "";
    }
    
    try {
      // Format the UPI payment URL (upi://pay format)
      const upiUrl = `upi://pay?pa=${paymentData.upiId}&pn=${encodeURIComponent(paymentData.name || 'User')}&am=${paymentData.amount}&cu=${paymentData.currency || 'INR'}&tn=${encodeURIComponent(`Transaction ${paymentData.transactionId}`)}&tr=${paymentData.transactionId}`;
      
      // Generate QR code URL using a third-party service
      const qrCodeApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiUrl)}`;
      
      return qrCodeApiUrl;
    } catch (error) {
      console.error("QR code generation error:", error);
      return "";
    }
  };

  // Placeholder functions needed for UpiPayment props
  const handleQrCodeError = () => {
    // This is just a placeholder - actual implementation is in PaymentFlow
    console.log("QR code error handled in PaymentMethod");
  };

  const handleUpiPayment = () => {
    // This is just a placeholder - actual implementation is in PaymentFlow
    console.log("UPI payment handled in PaymentMethod");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-secondary rounded-lg p-4">
        <div className="text-sm text-muted-foreground mb-1">Amount</div>
        <div className="text-2xl font-semibold">
          {paymentData.currency === 'INR' ? '₹' : paymentData.currency === 'USD' ? '$' : '€'} {paymentData.amount}
        </div>
        <div className="text-xs text-muted-foreground mt-2">
          Transaction ID: {paymentData.transactionId}
        </div>
      </div>
      
      {paymentMethod === 'wallet' && userEmail && (
        <div className="space-y-4">
          <div className="border p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">RizzPay Wallet</span>
              <span className="text-sm bg-primary/10 text-primary rounded-full px-2 py-0.5">
                ₹{walletBalance.toFixed(2)}
              </span>
            </div>
            
            <div className="text-sm text-muted-foreground">
              {parseFloat(paymentData.amount) > walletBalance ? (
                <div className="flex items-center text-destructive">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  Insufficient balance
                </div>
              ) : (
                <div>Pay directly from your RizzPay wallet balance</div>
              )}
            </div>
          </div>
        </div>
      )}
      
      <div className="space-y-4">
        {paymentMethod === 'card' && (
          <CardPayment 
            name={paymentData.name} 
            onSubmit={(cardData) => {
              // Update card data in parent component
              handleInputChange({
                target: { name: 'cardNumber', value: cardData.cardNumber }
              } as React.ChangeEvent<HTMLInputElement>);
              handleInputChange({
                target: { name: 'cardExpiry', value: cardData.expiryDate }
              } as React.ChangeEvent<HTMLInputElement>);
              handleInputChange({
                target: { name: 'cardCvv', value: cardData.cvv }
              } as React.ChangeEvent<HTMLInputElement>);
              handleInputChange({
                target: { name: 'cardName', value: cardData.cardHolderName }
              } as React.ChangeEvent<HTMLInputElement>);
            }}
            isLoading={loading}
          />
        )}

        {paymentMethod === 'neft' && (
          <NetBankingPayment 
            onBankSelect={(bank) => {
              handleInputChange({
                target: { name: 'bankName', value: bank }
              } as React.ChangeEvent<HTMLInputElement>);
            }}
            selectedBank={paymentData.bankName || "hdfc"}
            onAccountChange={(account) => {
              handleInputChange({
                target: { name: 'bankAccount', value: account }
              } as React.ChangeEvent<HTMLInputElement>);
            }}
            onIfscChange={(ifsc) => {
              handleInputChange({
                target: { name: 'bankIfsc', value: ifsc }
              } as React.ChangeEvent<HTMLInputElement>);
            }}
            isLoading={loading}
          />
        )}
        
        {paymentMethod === 'upi' && (
          <UpiPayment
            paymentData={paymentData}
            handleInputChange={handleInputChange}
            validateUpiId={validateUpiId}
            qrCodeUrl={generateQrCode()}
            qrCodeError={false}
            handleQrCodeError={handleQrCodeError}
            handleUpiPayment={handleUpiPayment}
            isLoading={loading}
          />
        )}
      </div>
    </div>
  );
};

export default PaymentMethod;
