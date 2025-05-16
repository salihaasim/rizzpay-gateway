
// Razorpay API integration
import { v4 as uuidv4 } from 'uuid';

export const createRazorpayOrder = async (
  amount: number,
  currency: string,
  paymentMethod: string,
  customerName: string,
  customerEmail?: string,
  description?: string
): Promise<{ orderId: string; transactionId: string } | null> => {
  try {
    // Reusing existing implementation from utils/razorpay
    const { createRazorpayOrder } = await import('../../utils/razorpay');
    return await createRazorpayOrder(
      amount,
      currency,
      paymentMethod,
      customerName,
      customerEmail,
      description
    );
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return null;
  }
};

export const processRazorpayPayment = async (options: {
  orderId: string;
  transactionId: string;
  amount: number;
  currency: string;
  customerName: string;
  customerEmail?: string;
  description?: string;
}) => {
  try {
    const { processRazorpayPayment } = await import('../../utils/razorpay');
    return await processRazorpayPayment(options);
  } catch (error) {
    console.error('Error processing Razorpay payment:', error);
    return null;
  }
};

export const verifyRazorpayPayment = async (paymentId: string, orderId: string) => {
  try {
    const { verifyRazorpayPayment } = await import('../../utils/razorpay');
    return await verifyRazorpayPayment(paymentId, orderId);
  } catch (error) {
    console.error('Error verifying Razorpay payment:', error);
    return false;
  }
};
