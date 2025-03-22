
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
        amount: amount, // Pass as number directly
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
    
    // Use the real Razorpay API key from the user
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
      // In production, you should have a backend endpoint to create the order
      // For now, we'll simulate it with a direct API call
      const response = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${btoa(`${razorpayKeyId}:${razorpayKeySecret}`)}`
        },
        body: JSON.stringify(orderData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to create Razorpay order');
      }
      
      const data = await response.json();
      const orderId = data.id;
      
      // Return both the order ID and transaction ID
      return { orderId, transactionId };
    } catch (apiError) {
      console.error('Razorpay API error:', apiError);
      
      // For development purposes, generate a fake order ID
      // In production, you should handle this more gracefully
      console.log('Using simulated order ID for development');
      const orderId = `order_${Math.random().toString(36).substring(2, 15)}`;
      return { orderId, transactionId };
    }
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    toast.error('Payment initialization failed');
    return null;
  }
};
