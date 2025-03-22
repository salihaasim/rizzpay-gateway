
import { useState, useEffect } from 'react';
import { PaymentMethod } from '@/stores/transactionStore';

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
    currency: 'INR',
    paymentMethod: 'card' as PaymentMethod,
    upiId: 'salihaasimdevloper-4@okaxis', // Default UPI ID
    name: '',
    transactionId: '',
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

  // Generate transaction ID only once on component mount
  useEffect(() => {
    const randomId = 'RIZZPAY' + Math.floor(Math.random() * 10000000);
    setPaymentData(prev => ({
      ...prev,
      transactionId: randomId
    }));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setPaymentData(prev => ({ ...prev, [name]: value }));
    
    // Clear QR code when changing payment method
    if (name === 'paymentMethod') {
      setQrCodeUrl('');
    }
  };

  const validateUpiId = (upiId: string): boolean => {
    // Basic UPI ID validation (alphanumeric@provider format)
    const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/;
    return upiRegex.test(upiId);
  };

  const generateUpiQrCode = () => {
    if (!validateUpiId(paymentData.upiId) || !paymentData.amount) {
      return;
    }
    
    setQrCodeError(false);
    
    try {
      // Format the UPI payment URL (upi://pay format)
      const upiUrl = `upi://pay?pa=${paymentData.upiId}&pn=${encodeURIComponent(paymentData.name || 'User')}&am=${paymentData.amount}&cu=${paymentData.currency}&tn=${encodeURIComponent(`Transaction ${paymentData.transactionId}`)}&tr=${paymentData.transactionId}`;
      
      // Generate QR code URL using a third-party service
      const qrCodeApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiUrl)}`;
      
      setQrCodeUrl(qrCodeApiUrl);
    } catch (error) {
      console.error("QR code generation error:", error);
      setQrCodeError(true);
    }
  };

  const handleQrCodeError = () => {
    setQrCodeError(false);
    setQrCodeUrl('');
    setTimeout(() => {
      generateUpiQrCode();
    }, 500);
  };

  const resetForm = () => {
    setStep(1);
    setPaymentData(prev => ({
      ...prev,
      amount: '',
      paymentStatus: '',
      transactionId: 'RIZZPAY' + Math.floor(Math.random() * 10000000)
    }));
    setCurrentTransactionId(null);
    setQrCodeUrl('');
  };

  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case 'INR': return '₹';
      case 'USD': return '$';
      case 'EUR': return '€';
      default: return '₹';
    }
  };

  return {
    step,
    setStep,
    loading,
    setLoading,
    qrCodeError,
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
