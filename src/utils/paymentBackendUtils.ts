import { supabase } from './supabaseClient';
import { toast } from 'sonner';
import { Transaction, PaymentMethod } from '@/stores/transactionStore';
import { v4 as uuidv4 } from 'uuid';
import { createRazorpayOrder, processRazorpayPayment } from './razorpay';

// Process NEFT payment
export const processNeftPayment = async (
  amount: number,
  customerName: string,
  customerEmail: string | undefined,
  bankDetails: {
    accountNumber: string;
    ifscCode: string;
    bankName: string;
  }
): Promise<Transaction | null> => {
  try {
    console.log('Processing NEFT payment via Razorpay:', { amount, customerName, bankDetails });
    
    // Create Razorpay order
    const orderResult = await createRazorpayOrder(
      amount,
      'INR',
      'netbanking',
      customerName,
      customerEmail,
      `NEFT Payment via ${bankDetails.bankName}`
    );
    
    if (!orderResult) {
      toast.error('Failed to create payment order');
      return null;
    }
    
    // Process the payment using Razorpay
    return await processRazorpayPayment({
      orderId: orderResult.orderId,
      transactionId: orderResult.transactionId,
      amount: amount,
      currency: 'INR',
      customerName: customerName,
      customerEmail: customerEmail,
      description: `NEFT Payment via ${bankDetails.bankName}`
    });
  } catch (error) {
    console.error('Razorpay NEFT payment processing error:', error);
    toast.error('An error occurred while processing Razorpay NEFT payment');
    return null;
  }
};

// Process card payment
export const processCardPayment = async (
  amount: number,
  customerName: string,
  customerEmail: string | undefined,
  cardDetails: {
    cardNumber: string;
    cardExpiry: string;
    cardHolderName: string;
  }
): Promise<Transaction | null> => {
  try {
    console.log('Processing card payment via Razorpay:', { amount, customerName });
    
    // Create Razorpay order
    const orderResult = await createRazorpayOrder(
      amount,
      'INR',
      'card',
      customerName,
      customerEmail,
      'Card Payment'
    );
    
    if (!orderResult) {
      toast.error('Failed to create payment order');
      return null;
    }
    
    // Process the payment using Razorpay
    return await processRazorpayPayment({
      orderId: orderResult.orderId,
      transactionId: orderResult.transactionId,
      amount: amount,
      currency: 'INR',
      customerName: customerName,
      customerEmail: customerEmail,
      description: 'Card Payment'
    });
  } catch (error) {
    console.error('Razorpay card payment processing error:', error);
    toast.error('An error occurred while processing Razorpay card payment');
    return null;
  }
};

// Process Razorpay payment
export const processRazorpayNeftPayment = async (
  amount: number,
  customerName: string,
  customerEmail: string | undefined,
  bankDetails: {
    accountNumber: string;
    ifscCode: string;
    bankName: string;
  }
): Promise<Transaction | null> => {
  return processNeftPayment(amount, customerName, customerEmail, bankDetails);
};

// Process Razorpay card payment
export const processRazorpayCardPayment = async (
  amount: number,
  customerName: string,
  customerEmail: string | undefined,
  cardDetails: {
    cardNumber: string;
    cardExpiry: string;
    cardHolderName: string;
  }
): Promise<Transaction | null> => {
  return processCardPayment(amount, customerName, customerEmail, cardDetails);
};

// Verify payment status
export const verifyPaymentStatus = async (transactionId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase()
      .from('transactions')
      .select('*')
      .eq('id', transactionId)
      .single();
    
    if (error || !data) {
      console.error('Error verifying payment:', error);
      return false;
    }
    
    // In a real implementation, you would verify the payment status with the payment processor
    // For now, we're just checking if the status is 'successful'
    return data.status === 'successful';
  } catch (error) {
    console.error('Payment verification error:', error);
    return false;
  }
};

// Update payment status
export const updatePaymentStatus = async (
  transactionId: string, 
  status: 'pending' | 'processing' | 'successful' | 'failed'
): Promise<boolean> => {
  try {
    const { error } = await supabase()
      .from('transactions')
      .update({
        status: status,
        processing_state: status === 'successful' ? 'completed' : 
                          status === 'failed' ? 'failed' : 'processing'
      })
      .eq('id', transactionId);
    
    if (error) {
      console.error('Error updating payment status:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Payment status update error:', error);
    return false;
  }
};
