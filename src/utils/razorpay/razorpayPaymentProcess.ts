
import { toast } from 'sonner';
import { Transaction, PaymentDetails } from '@/stores/transactionStore';

// Simulate payment processing without actual Razorpay integration
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
    console.log('Simulating payment processing:', orderData);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate 80% success rate
    const isSuccessful = Math.random() < 0.8;
    
    if (!isSuccessful) {
      toast.error('Payment simulation failed');
      return null;
    }
    
    // Create a simulated transaction
    const simulatedPaymentId = 'SIM_' + Math.random().toString(36).substring(2, 15);
    
    const transaction: Transaction = {
      id: orderData.transactionId,
      date: new Date().toISOString(),
      amount: `₹ ${orderData.amount}`,
      rawAmount: orderData.amount,
      paymentMethod: 'simulated',
      status: 'successful',
      customer: orderData.customerName,
      processingState: 'completed',
      paymentDetails: {
        processor: 'RizzPay Simulation',
        authorizationCode: simulatedPaymentId,
        cardNumber: '************1111',
        cardHolderName: orderData.customerName
      }
    };
    
    toast.success('Payment simulation successful!');
    return transaction;
  } catch (error) {
    console.error('Error in payment simulation:', error);
    toast.error('Payment simulation error');
    return null;
  }
};

