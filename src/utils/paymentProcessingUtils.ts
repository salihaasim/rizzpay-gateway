
import { Transaction, TransactionStatus, PaymentProcessingState, useTransactionStore } from '@/stores/transactionStore';
import { toast } from 'sonner';
import { delay } from './commonUtils';
import { getRandomProcessor, getRandomDeclineReason } from './statusUtils';
import { generateAuthorizationCode } from './formatUtils';

// Simplified payment processing simulation
export const simulatePaymentProcessing = async (
  transactionId: string, 
  paymentMethod: string,
  shouldSucceed: boolean = Math.random() > 0.2 // 80% success rate
): Promise<Transaction> => {
  const store = useTransactionStore.getState();
  const transaction = store.transactions.find(t => t.id === transactionId);
  
  if (!transaction) {
    throw new Error(`Transaction with ID ${transactionId} not found`);
  }
  
  // Helper function to update transaction and add to timeline
  const updateTransactionState = (
    processingState: PaymentProcessingState, 
    detailedStatus: string,
    additionalUpdates: Partial<Transaction> = {}
  ) => {
    store.updateTransaction(transactionId, {
      processingState,
      detailedStatus,
      processingTimeline: [
        ...(transaction.processingTimeline || []),
        {
          stage: processingState,
          timestamp: new Date().toISOString(),
          message: detailedStatus
        }
      ],
      ...additionalUpdates
    });
    
    return store.transactions.find(t => t.id === transactionId)!;
  };

  // Check if this is an Instamojo payment
  const isInstamojoPayment = paymentMethod === 'instamojo_card' || paymentMethod === 'instamojo_neft';
  
  if (isInstamojoPayment) {
    // Instamojo payments are handled differently - redirect to their gateway
    // So here we just update our local state to processing
    updateTransactionState(
      'processor_routing',
      `Transaction routed to Instamojo payment gateway`,
      {
        paymentDetails: {
          ...transaction.paymentDetails,
          processor: 'Instamojo'
        }
      }
    );
    
    return store.transactions.find(t => t.id === transactionId)!;
  }

  // 1. Payment Gateway processing
  await delay(800);
  updateTransactionState(
    'gateway_processing',
    'Payment received by gateway and being validated'
  );
  
  // 2. Payment Processor routing
  await delay(1000);
  const processor = getRandomProcessor();
  updateTransactionState(
    'processor_routing',
    `Transaction routed to ${processor} payment processor`,
    {
      paymentDetails: {
        ...transaction.paymentDetails,
        processor
      }
    }
  );
  
  // 3. Authorization Decision
  await delay(1500);
  
  if (!shouldSucceed) {
    // Payment declined path
    const declineReason = getRandomDeclineReason();
    updateTransactionState(
      'declined',
      `Payment declined: ${declineReason}`,
      {
        status: 'failed',
        paymentDetails: {
          ...transaction.paymentDetails,
          declineReason
        }
      }
    );
    
    return store.transactions.find(t => t.id === transactionId)!;
  }
  
  // Payment approved path
  const authCode = generateAuthorizationCode();
  updateTransactionState(
    'authorization_decision',
    `Payment authorized with code: ${authCode}`,
    {
      status: 'successful',
      paymentDetails: {
        ...transaction.paymentDetails,
        authorizationCode: authCode
      }
    }
  );
  
  // Notify user of successful transaction
  toast.success("Transaction processed successfully", {
    description: `Your payment of ${transaction.amount} has been processed.`
  });
  
  return store.transactions.find(t => t.id === transactionId)!;
};
