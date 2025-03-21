
import React from 'react';
import CardPayment from './CardPayment';
import NetBankingPayment from './NetBankingPayment';
import UpiPayment from './UpiPayment';

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
  // Simple UPI ID validation function
  const validateUpiId = (upiId: string): boolean => {
    // Basic UPI ID validation (alphanumeric@provider format)
    const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/;
    return upiRegex.test(upiId);
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
            isLoading={loading}
          />
        )}
        
        {paymentMethod === 'upi' && (
          <UpiPayment
            paymentData={paymentData}
            handleInputChange={handleInputChange}
            validateUpiId={validateUpiId}
            qrCodeUrl=""
            qrCodeError={false}
            handleQrCodeError={handleQrCodeError}
            handleUpiPayment={handleUpiPayment}
          />
        )}
      </div>
    </div>
  );
};

export default PaymentMethod;
