
import { supabase } from './supabaseClient';
import { toast } from 'sonner';
import { Transaction, PaymentDetails } from '@/stores/transactionStore';

// Initialize Razorpay
const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    // Check if Razorpay is already loaded
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    // Create script element to load Razorpay
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
      toast.error('Failed to load payment gateway');
    };
    document.body.appendChild(script);
  });
};

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
    
    // In a real implementation, you would call your backend API to create a Razorpay order
    // For now, we'll simulate the order creation
    const orderId = `order_${Math.random().toString(36).substring(2, 15)}`;
    
    // Return both the order ID and transaction ID
    return { orderId, transactionId };
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    toast.error('Payment initialization failed');
    return null;
  }
};

// Process payment using Razorpay checkout
export const processRazorpayPayment = async (
  orderData: {
    orderId: string,
    transactionId: string,
    amount: number,
    currency: string,
    customerName: string,
    customerEmail?: string,
    description?: string
  }
): Promise<Transaction | null> => {
  try {
    // Load Razorpay script
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      toast.error('Failed to load payment gateway');
      return null;
    }
    
    // Convert amount to paise (Razorpay requires amount in smallest currency unit)
    const amountInPaise = Math.round(orderData.amount * 100);
    
    // Return a promise that resolves when payment completes
    return new Promise((resolve, reject) => {
      const options = {
        key: "rzp_test_xxxxxxxxxx", // Replace with your Razorpay Key ID (ideally from an env variable)
        amount: amountInPaise,
        currency: orderData.currency,
        name: "Rizzpay",
        description: orderData.description || "Payment Processing",
        order_id: orderData.orderId,
        prefill: {
          name: orderData.customerName,
          email: orderData.customerEmail || '',
        },
        theme: {
          color: "#2563eb", // Primary color
        },
        handler: async function(response: any) {
          try {
            // Process successful payment
            // response contains: razorpay_payment_id, razorpay_order_id, razorpay_signature
            
            // Update transaction in database
            const { data, error } = await supabase()
              .from('transactions')
              .update({
                status: 'successful',
                processing_state: 'completed',
                payment_details: {
                  processor: 'Razorpay',
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                  amountInPaise: amountInPaise
                },
                processing_timeline: [
                  {
                    stage: 'initiated',
                    timestamp: new Date().toISOString(),
                    message: `Payment of ${orderData.amount} ${orderData.currency} initiated via Razorpay`
                  },
                  {
                    stage: 'completed',
                    timestamp: new Date().toISOString(),
                    message: `Payment successfully processed via Razorpay (ID: ${response.razorpay_payment_id})`
                  }
                ]
              })
              .eq('id', orderData.transactionId)
              .select()
              .single();
            
            if (error) {
              console.error('Error updating transaction after Razorpay payment:', error);
              toast.error('Payment completed but error updating records');
              reject(error);
              return;
            }
            
            // Create a properly typed PaymentDetails object from the JSON data
            const paymentDetailsFromDB = data.payment_details as Record<string, any>;
            const typedPaymentDetails: PaymentDetails = {
              processor: paymentDetailsFromDB?.processor as string,
              cardNumber: paymentDetailsFromDB?.cardNumber as string,
              cardHolderName: paymentDetailsFromDB?.cardHolderName as string,
              razorpay_payment_id: paymentDetailsFromDB?.razorpay_payment_id as string,
              razorpay_order_id: paymentDetailsFromDB?.razorpay_order_id as string,
              razorpay_signature: paymentDetailsFromDB?.razorpay_signature as string
            };
            
            // Format transaction for return
            const transaction: Transaction = {
              id: data.id,
              date: new Date(data.date).toISOString(),
              amount: `${data.currency === 'INR' ? '₹' : data.currency} ${data.amount}`,
              rawAmount: parseFloat(data.amount.toString()),
              paymentMethod: data.payment_method,
              status: 'successful',
              customer: data.customer_name,
              processingState: 'completed',
              paymentDetails: typedPaymentDetails
            };
            
            toast.success('Payment successful!');
            resolve(transaction);
          } catch (error) {
            console.error('Error processing Razorpay success:', error);
            reject(error);
          }
        },
        modal: {
          ondismiss: function() {
            toast.info('Payment cancelled');
            reject(new Error('Payment cancelled by user'));
          }
        }
      };
      
      // Open Razorpay checkout
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    });
  } catch (error) {
    console.error('Error processing Razorpay payment:', error);
    toast.error('Payment processing failed');
    return null;
  }
};

// Verify Razorpay payment (usually done on backend)
export const verifyRazorpayPayment = async (
  paymentId: string,
  orderId: string,
  signature: string,
  transactionId: string
): Promise<boolean> => {
  try {
    // In a real implementation, you would call your backend API to verify the payment
    // For now, we'll simulate the verification
    
    // Update transaction status based on verification
    const { error } = await supabase()
      .from('transactions')
      .update({
        status: 'successful',
        processing_state: 'completed'
      })
      .eq('id', transactionId);
    
    if (error) {
      console.error('Error updating transaction after verification:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error verifying Razorpay payment:', error);
    return false;
  }
};

// Add typings for Razorpay
declare global {
  interface Window {
    Razorpay: any;
  }
}
