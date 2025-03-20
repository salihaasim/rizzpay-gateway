
import { useTransactionStore } from '@/stores/transactionStore';
import { toast } from 'sonner';
import { generateTransactionId } from './formatUtils';
import { delay } from './commonUtils';

export const calculateWalletFee = (amount: number, type: 'deposit' | 'withdrawal') => {
  if (type === 'deposit') {
    // 1.2% for deposits
    return amount * 0.012;
  } else {
    // ₹25 or 1.5%, whichever is higher, for withdrawals
    return Math.max(25, amount * 0.015);
  }
};

// Wallet processing simulation
export const simulateWalletProcessing = async (
  email: string,
  amount: number,
  transactionType: 'deposit' | 'withdrawal',
  description?: string
): Promise<string> => {
  const store = useTransactionStore.getState();
  
  // Create a pending transaction first
  const transactionId = generateTransactionId();
  const date = new Date().toISOString();
  
  // Calculate processing fee
  const processingFee = calculateWalletFee(amount, transactionType);
  const finalAmount = transactionType === 'deposit' 
    ? amount - processingFee 
    : amount;
  
  // Create initial pending transaction
  const transaction = {
    id: transactionId,
    date,
    amount: `₹${amount.toFixed(2)}`,
    rawAmount: amount,
    paymentMethod: 'wallet',
    status: 'pending',
    customer: email,
    createdBy: email,
    walletTransactionType: transactionType,
    description: description || `${transactionType} to wallet`,
    processingState: 'initiated',
    processingTimeline: [{
      stage: 'initiated',
      timestamp: date,
      message: `${transactionType} of ₹${amount.toFixed(2)} initiated`
    }],
    paymentDetails: {
      processingFee: `₹${processingFee.toFixed(2)}`
    }
  };
  
  store.addTransaction(transaction);
  
  // Simulate processing
  await delay(1500);
  
  // Update to processing
  store.updateTransaction(transactionId, {
    status: 'processing',
    processingState: 'processor_routing',
    processingTimeline: [
      ...(transaction.processingTimeline || []),
      {
        stage: 'processor_routing',
        timestamp: new Date().toISOString(),
        message: `${transactionType} request sent to payment processor`
      }
    ]
  });
  
  await delay(2000);
  
  // Randomly determine if transaction should succeed
  const shouldSucceed = Math.random() > 0.1; // 90% success rate
  
  if (!shouldSucceed) {
    const failureReason = transactionType === 'withdrawal' 
      ? 'Bank rejected the transaction' 
      : 'Payment gateway declined the transaction';
    
    store.updateTransaction(transactionId, {
      status: 'failed',
      processingState: 'declined',
      processingTimeline: [
        ...(transaction.processingTimeline || []),
        {
          stage: 'declined',
          timestamp: new Date().toISOString(),
          message: failureReason
        }
      ],
      paymentDetails: {
        ...transaction.paymentDetails,
        declineReason: failureReason
      }
    });
    
    toast.error(`${transactionType} failed`, {
      description: failureReason
    });
    
    return transactionId;
  }
  
  // Complete transaction successfully
  
  // For deposits, add funds to wallet
  if (transactionType === 'deposit') {
    try {
      store.depositToWallet(email, finalAmount, 'wallet');
    } catch (error) {
      console.error('Failed to deposit to wallet:', error);
      
      store.updateTransaction(transactionId, {
        status: 'failed',
        processingState: 'declined',
        processingTimeline: [
          ...(transaction.processingTimeline || []),
          {
            stage: 'declined',
            timestamp: new Date().toISOString(),
            message: 'Failed to credit user wallet'
          }
        ]
      });
      
      toast.error("Deposit failed", {
        description: "Failed to credit your wallet. Please try again."
      });
      
      return transactionId;
    }
  } 
  // For withdrawals, remove funds from wallet
  else if (transactionType === 'withdrawal') {
    try {
      store.withdrawFromWallet(email, finalAmount, 'wallet');
    } catch (error) {
      console.error('Failed to withdraw from wallet:', error);
      
      store.updateTransaction(transactionId, {
        status: 'failed',
        processingState: 'declined',
        processingTimeline: [
          ...(transaction.processingTimeline || []),
          {
            stage: 'declined',
            timestamp: new Date().toISOString(),
            message: 'Insufficient funds in wallet'
          }
        ]
      });
      
      toast.error("Withdrawal failed", {
        description: "Insufficient funds in your wallet."
      });
      
      return transactionId;
    }
  }
  
  // Mark original transaction as successful
  store.updateTransaction(transactionId, {
    status: 'successful',
    processingState: 'authorization_decision',
    processingTimeline: [
      ...(transaction.processingTimeline || []),
      {
        stage: 'authorization_decision',
        timestamp: new Date().toISOString(),
        message: 'Transaction authorized'
      }
    ]
  });
  
  toast.success(`${transactionType} successful`, {
    description: `Your ${transactionType} of ₹${amount.toFixed(2)} was processed successfully.`
  });
  
  return transactionId;
};
