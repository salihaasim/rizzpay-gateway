
import React from 'react';
import UpiPayment from './UpiPayment';
import CardPayment from './CardPayment';
import NetBankingPayment from './NetBankingPayment';
import InstamojoPayment from './InstamojoPayment';

interface PaymentMethodProps {
  paymentMethod: string;
  paymentData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  validateUpiId: (value: string) => boolean;
  qrCodeUrl: string;
  qrCodeError: boolean;
  handleQrCodeError: () => void;
  handleUpiPayment: () => void;
  loading: boolean;
  initiateInstamojoPayment: (type: 'card' | 'neft') => void;
}

const PaymentMethod: React.FC<PaymentMethodProps> = ({
  paymentMethod,
  paymentData,
  handleInputChange,
  validateUpiId,
  qrCodeUrl,
  qrCodeError,
  handleQrCodeError,
  handleUpiPayment,
  loading,
  initiateInstamojoPayment
}) => {
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
        {paymentMethod === 'upi' && (
          <UpiPayment
            paymentData={paymentData}
            handleInputChange={handleInputChange}
            validateUpiId={validateUpiId}
            qrCodeUrl={qrCodeUrl}
            qrCodeError={qrCodeError}
            handleQrCodeError={handleQrCodeError}
            handleUpiPayment={handleUpiPayment}
          />
        )}

        {paymentMethod === 'card' && (
          <CardPayment name={paymentData.name} />
        )}

        {paymentMethod === 'netbanking' && (
          <NetBankingPayment />
        )}

        {paymentMethod === 'instamojo_card' && (
          <InstamojoPayment 
            type="card" 
            loading={loading} 
            initiateInstamojoPayment={initiateInstamojoPayment} 
          />
        )}

        {paymentMethod === 'instamojo_neft' && (
          <InstamojoPayment 
            type="neft" 
            loading={loading} 
            initiateInstamojoPayment={initiateInstamojoPayment} 
          />
        )}
      </div>
    </div>
  );
};

export default PaymentMethod;
