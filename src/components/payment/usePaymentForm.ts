
import { useState, useCallback } from 'react';
import { PaymentMethod } from '@/stores/transactionStore';
import { delay } from '@/utils/commonUtils';

interface PaymentFormData {
  amount: string;
  currency: string;
  paymentMethod: PaymentMethod;
  upiId: string;
  name: string;
  transactionId: string;
  paymentStatus: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvv: string;
  cardName: string;
  bankAccount: string;
  bankIfsc: string;
  bankName: string;
  purpose: string;
  customerEmail: string;
}

export const usePaymentForm = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [qrCodeError, setQrCodeError] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [currentTransactionId, setCurrentTransactionId] = useState<string | null>(null);
  
  const [paymentData, setPaymentData] = useState<PaymentFormData>({
    amount: '',
    currency: 'INR', // Only INR is allowed
    paymentMethod: 'card' as PaymentMethod,
    upiId: 'yourname@okaxis', // Default UPI ID template
    name: '',
    transactionId: 'RIZZPAY' + Math.floor(Math.random() * 10000000),
    paymentStatus: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    cardName: '',
    bankAccount: '',
    bankIfsc: '',
    bankName: '',
    purpose: 'Payment',
    customerEmail: ''
  });

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSelectChange = useCallback((name: string, value: string) => {
    // Always enforce INR for currency
    if (name === 'currency' && value !== 'INR') {
      value = 'INR';
    }
    
    setPaymentData(prev => ({ ...prev, [name]: value }));
    
    // Clear QR code when changing payment method
    if (name === 'paymentMethod') {
      setQrCodeUrl('');
    }
  }, []);

  const validateUpiId = useCallback((upiId: string): boolean => {
    // Enhanced UPI ID validation (alphanumeric@provider format)
    const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/;
    return upiRegex.test(upiId);
  }, []);

  const generateUpiQrCode = useCallback(() => {
    if (!validateUpiId(paymentData.upiId) || !paymentData.amount) {
      return;
    }
    
    setQrCodeError(false);
    
    try {
      // Format the UPI payment URL (upi://pay format)
      const upiUrl = `upi://pay?pa=${paymentData.upiId}&pn=${encodeURIComponent(paymentData.name || 'User')}&am=${paymentData.amount}&cu=INR&tn=${encodeURIComponent(`Transaction ${paymentData.transactionId}`)}&tr=${paymentData.transactionId}`;
      
      // Generate QR code URL using a third-party service
      const qrCodeApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiUrl)}`;
      
      setQrCodeUrl(qrCodeApiUrl);
    } catch (error) {
      console.error("QR code generation error:", error);
      setQrCodeError(true);
    }
  }, [paymentData.upiId, paymentData.amount, paymentData.name, paymentData.transactionId, validateUpiId]);

  const handleQrCodeError = useCallback(() => {
    setQrCodeError(false);
    setQrCodeUrl('');
    setTimeout(() => {
      generateUpiQrCode();
    }, 500);
  }, [generateUpiQrCode]);

  const resetForm = useCallback(() => {
    setStep(1);
    setPaymentData(prev => ({
      ...prev,
      amount: '',
      paymentStatus: '',
      transactionId: 'RIZZPAY' + Math.floor(Math.random() * 10000000)
    }));
    setCurrentTransactionId(null);
    setQrCodeUrl('');
  }, []);

  const getCurrencySymbol = useCallback((currency: string) => {
    // Always return Indian Rupee symbol regardless of input
    return '₹';
  }, []);

  return {
    step,
    setStep,
    loading,
    setLoading,
    qrCodeError,
    setQrCodeError,
    qrCodeUrl,
    currentTransactionId,
    setCurrentTransactionId,
    paymentData,
    setPaymentData,
    handleInputChange,
    handleSelectChange,
    validateUpiId,
    generateUpiQrCode,
    handleQrCodeError,
    resetForm,
    getCurrencySymbol
  };
};
