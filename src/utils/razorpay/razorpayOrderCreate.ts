
import { supabase } from '../supabaseClient';
import { toast } from 'sonner';

// Create a Razorpay order in the backend
export const createRazorpayOrder = async (
  amount: number,
  currency: string = 'INR',
  paymentMethod: string,
  customerName: string,
  customerEmail?: string,
  description?: string
): Promise<{ orderId: string, transactionId: string } | null> => {
  try {
    // Create a transaction record first
    const transactionId = `RZRP_${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    
    // Convert amount to paise (Razorpay requires amount in smallest currency unit)
    const amountInPaise = Math.round(amount * 100);
    
    // Store the transaction in Supabase
    const { error } = await supabase()
      .from('transactions')
      .insert({
        id: transactionId,
        amount: amount,
        currency: currency,
        status: 'pending',
        payment_method: paymentMethod,
        customer_name: customerName,
        customer_email: customerEmail,
        description: description || 'Payment via Razorpay',
        processing_state: 'initiated',
        payment_details: {
          processor: 'Razorpay',
          paymentType: paymentMethod,
          amountInPaise: amountInPaise
        }
      });
    
    if (error) {
      console.error('Error creating transaction for Razorpay order:', error);
      toast.error('Failed to create payment');
      return null;
    }
    
    // Use the real Razorpay API key from the config
    const razorpayKeyId = "rzp_test_JXIkZl2p0iUbRw";
    const razorpayKeySecret = "sa7TIRHn3yuzJsqXLybRjBYL";
    
    // Prepare the order data
    const orderData = {
      amount: amountInPaise,
      currency: currency,
      receipt: transactionId,
      notes: {
        paymentMethod: paymentMethod,
        customerName: customerName,
        customerEmail: customerEmail || '',
        description: description || 'Payment via Razorpay'
      }
    };
    
    try {
      // Make the API call to create the order
      const response = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${btoa(`${razorpayKeyId}:${razorpayKeySecret}`)}`
        },
        body: JSON.stringify(orderData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Razorpay API error:', errorData);
        throw new Error(`Failed to create Razorpay order: ${errorData.error?.description || 'Unknown error'}`);
      }
      
      const data = await response.json();
      console.log('Razorpay order created successfully:', data);
      const orderId = data.id;
      
      // Update transaction with order ID
      await supabase()
        .from('transactions')
        .update({
          payment_details: {
            processor: 'Razorpay',
            paymentType: paymentMethod,
            amountInPaise: amountInPaise,
            razorpayOrderId: orderId
          }
        })
        .eq('id', transactionId);
      
      // Return both the order ID and transaction ID
      return { orderId, transactionId };
    } catch (apiError) {
      console.error('Razorpay API error:', apiError);
      toast.error('Payment gateway error. Please try again later.');
      
      // Update transaction to failed state
      await supabase()
        .from('transactions')
        .update({
          status: 'failed',
          processing_state: 'failed',
          payment_details: {
            processor: 'Razorpay',
            paymentType: paymentMethod,
            error: String(apiError)
          }
        })
        .eq('id', transactionId);
      
      return null;
    }
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    toast.error('Payment initialization failed');
    return null;
  }
};
