
import { supabase } from './supabaseClient';
import { toast } from 'sonner';
import { Transaction, PaymentMethod } from '@/stores/transactionStore';
import { v4 as uuidv4 } from 'uuid';
import { createRazorpayOrder, processRazorpayPayment } from './razorpay';

// Process card payment
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
  try {
    console.log('Processing card payment:', { amount, customerName });
    
    // Create payment order
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
    
    console.log('Payment order created:', orderResult);
    
    // Process the payment
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
    console.error('Card payment processing error:', error);
    toast.error('An error occurred while processing card payment');
    return null;
  }
};

// Process NEFT payment
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
  try {
    console.log('Processing NEFT payment:', { amount, customerName, bankDetails });
    
    // Create payment order
    const orderResult = await createRazorpayOrder(
      amount,
      'INR',
      'netbanking',
      customerName,
      customerEmail,
      `NetBanking Payment via ${bankDetails.bankName}`
    );
    
    if (!orderResult) {
      toast.error('Failed to create payment order');
      return null;
    }
    
    console.log('Payment order created for NEFT:', orderResult);
    
    // Process the payment
    return await processRazorpayPayment({
      orderId: orderResult.orderId,
      transactionId: orderResult.transactionId,
      amount: amount,
      currency: 'INR',
      customerName: customerName,
      customerEmail: customerEmail,
      description: `NetBanking Payment via ${bankDetails.bankName}`
    });
  } catch (error) {
    console.error('NEFT payment processing error:', error);
    toast.error('An error occurred while processing NEFT payment');
    return null;
  }
};

// Legacy methods - kept for backward compatibility
export const processNeftPayment = processRazorpayNeftPayment;
export const processCardPayment = processRazorpayCardPayment;

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
