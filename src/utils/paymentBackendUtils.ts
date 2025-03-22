
import { supabase } from './supabaseClient';
import { toast } from 'sonner';
import { Transaction, PaymentMethod } from '@/stores/transactionStore';
import { v4 as uuidv4 } from 'uuid';

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
    // Generate a unique transaction ID
    const transactionId = `NEFT_${uuidv4().substring(0, 8)}`;
    
    // Create payment details for NEFT transaction
    const paymentDetails = {
      bankName: bankDetails.bankName,
      accountNumber: `xxxx${bankDetails.accountNumber.slice(-4)}`, // Mask account number for security
      ifscCode: bankDetails.ifscCode,
      processor: 'DirectNEFT',
      paymentType: 'neft',
      verificationStatus: 'pending'
    };
    
    // Store the transaction in Supabase
    const { data, error } = await supabase()
      .from('transactions')
      .insert({
        id: transactionId,
        amount: amount.toString(), // Convert number to string
        currency: 'INR',
        status: 'pending',
        payment_method: 'neft',
        customer_name: customerName,
        customer_email: customerEmail,
        payment_details: paymentDetails,
        processing_state: 'initiated'
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error storing NEFT payment:', error);
      toast.error('Failed to process NEFT payment');
      return null;
    }
    
    // Return the created transaction with formatted data
    return {
      id: data.id,
      date: new Date(data.date).toISOString(),
      amount: `₹${data.amount}`,
      rawAmount: parseFloat(data.amount),
      paymentMethod: 'neft' as PaymentMethod,
      status: 'pending',
      customer: customerName,
      processingState: 'initiated',
      paymentDetails
    };
  } catch (error) {
    console.error('NEFT payment processing error:', error);
    toast.error('An error occurred while processing NEFT payment');
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
    // Generate a unique transaction ID
    const transactionId = `CARD_${uuidv4().substring(0, 8)}`;
    
    // Create payment details for card transaction
    const paymentDetails = {
      cardNumber: `xxxx xxxx xxxx ${cardDetails.cardNumber.slice(-4)}`, // Mask card number for security
      cardHolderName: cardDetails.cardHolderName,
      cardExpiry: cardDetails.cardExpiry,
      processor: 'DirectCard',
      paymentType: 'card',
      authorizationStatus: 'pending'
    };
    
    // Store the transaction in Supabase
    const { data, error } = await supabase()
      .from('transactions')
      .insert({
        id: transactionId,
        amount: amount.toString(), // Convert number to string
        currency: 'INR',
        status: 'pending',
        payment_method: 'card',
        customer_name: customerName,
        customer_email: customerEmail,
        payment_details: paymentDetails,
        processing_state: 'initiated'
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error storing card payment:', error);
      toast.error('Failed to process card payment');
      return null;
    }
    
    // Return the created transaction with formatted data
    return {
      id: data.id,
      date: new Date(data.date).toISOString(),
      amount: `₹${data.amount}`,
      rawAmount: parseFloat(data.amount),
      paymentMethod: 'card' as PaymentMethod,
      status: 'pending',
      customer: customerName,
      processingState: 'initiated',
      paymentDetails
    };
  } catch (error) {
    console.error('Card payment processing error:', error);
    toast.error('An error occurred while processing card payment');
    return null;
  }
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
