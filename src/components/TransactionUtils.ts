
import { Transaction, TransactionStatus, PaymentProcessingState, PaymentDetails, useTransactionStore } from '@/stores/transactionStore';
import { toast } from 'sonner';

export const generateTransactionId = (): string => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

export const formatDate = (): string => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = (hours % 12) || 12;
  
  return `Today, ${formattedHours}:${minutes} ${ampm}`;
};

export const addTransaction = (
  amount: string,
  paymentMethod: string,
  status: TransactionStatus,
  customer: string,
  paymentDetails?: PaymentDetails
): Transaction => {
  const store = useTransactionStore.getState();
  
  const transaction: Transaction = {
    id: generateTransactionId(),
    date: formatDate(),
    amount: `₹${amount}`,
    rawAmount: parseFloat(amount),
    paymentMethod,
    status,
    customer,
    createdBy: store.userEmail || undefined,
    processingState: 'initiated',
    processingTimeline: [{
      stage: 'Payment Initiated',
      timestamp: new Date().toISOString(),
      message: `Payment of ₹${amount} initiated by ${customer} using ${paymentMethod}`
    }],
    paymentDetails
  };
  
  store.addTransaction(transaction);
  return transaction;
};

// Enhanced simulatePaymentProcessing function
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

  // Apply risk analysis
  const applyRiskAnalysis = () => {
    const riskScore = Math.floor(Math.random() * 100);
    let riskLevel = 'low';
    
    if (riskScore > 80) {
      riskLevel = 'high';
    } else if (riskScore > 50) {
      riskLevel = 'medium';
    }
    
    return { riskScore, riskLevel };
  };

  // Apply fraud detection
  const applyFraudDetection = () => {
    const flaggedPatterns = [];
    const amount = transaction.rawAmount || 0;
    
    // Check for suspicious amount patterns
    if (amount === 1337 || amount === 420 || amount === 666) {
      flaggedPatterns.push('suspicious amount pattern');
    }
    
    // Random flagging for demo purposes
    if (Math.random() > 0.95) {
      flaggedPatterns.push('unusual transaction velocity');
    }
    
    if (Math.random() > 0.97) {
      flaggedPatterns.push('mismatched geolocation');
    }
    
    return flaggedPatterns;
  };

  // 1. Payment Gateway processing
  await delay(800);
  updateTransactionState(
    'gateway_processing',
    'Payment received by gateway and being validated'
  );
  
  // 2. Apply risk analysis
  await delay(600);
  const { riskScore, riskLevel } = applyRiskAnalysis();
  
  if (riskLevel === 'high' && Math.random() > 0.7) {
    updateTransactionState(
      'declined',
      `Payment declined: High risk score (${riskScore}/100)`,
      {
        status: 'declined',
        paymentDetails: {
          ...transaction.paymentDetails,
          declineReason: `High risk score (${riskScore}/100)`
        }
      }
    );
    return store.transactions.find(t => t.id === transactionId)!;
  }
  
  // 3. Apply fraud detection
  await delay(700);
  const fraudFlags = applyFraudDetection();
  
  if (fraudFlags.length > 0 && Math.random() > 0.7) {
    updateTransactionState(
      'declined',
      `Payment declined: Suspected fraud (${fraudFlags.join(', ')})`,
      {
        status: 'declined',
        paymentDetails: {
          ...transaction.paymentDetails,
          declineReason: `Suspected fraud (${fraudFlags.join(', ')})`
        }
      }
    );
    return store.transactions.find(t => t.id === transactionId)!;
  }
  
  // 4. Payment Processor routing
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
  
  // 5. Card Network Processing
  await delay(1200);
  const cardNetwork = getRandomCardNetwork(paymentMethod);
  updateTransactionState(
    'card_network_processing',
    `Transaction sent to ${cardNetwork} for processing`,
    {
      paymentDetails: {
        ...transaction.paymentDetails,
        cardNetwork
      }
    }
  );

  // 6. Bank Authorization
  await delay(1000);
  const issuingBank = getRandomBank();
  updateTransactionState(
    'bank_authorization',
    `Awaiting authorization from ${issuingBank}`,
    {
      paymentDetails: {
        ...transaction.paymentDetails,
        issuingBank
      }
    }
  );
  
  // 7. Authorization Decision
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
  // 8. Authorization Approved
  const authCode = generateAuthorizationCode();
  updateTransactionState(
    'authorization_decision',
    `Payment authorized with code: ${authCode}`,
    {
      status: 'processing',
      paymentDetails: {
        ...transaction.paymentDetails,
        authorizationCode: authCode
      }
    }
  );
  
  // 9. Settlement Recording
  await delay(1000);
  const settlementId = generateSettlementId();
  const processingFee = calculateProcessingFee(transaction.rawAmount || 0);
  
  updateTransactionState(
    'settlement_recording',
    `Settlement process initiated with ID: ${settlementId}`,
    {
      paymentDetails: {
        ...transaction.paymentDetails,
        settlementId,
        processingFee: `₹${processingFee.toFixed(2)}`
      }
    }
  );
  
  // 10. Settlement Initiated
  await delay(1000);
  updateTransactionState(
    'settlement_initiated',
    'Processor initiated settlement'
  );
  
  // 11. Settlement Processing
  await delay(1000);
  updateTransactionState(
    'settlement_processing',
    'Batch settlement processing'
  );
  
  // 12. Funds Transferred
  await delay(1000);
  const acquiringBank = getRandomBank();
  updateTransactionState(
    'funds_transferred',
    `Funds transferred from ${transaction.paymentDetails?.issuingBank} to ${acquiringBank}`,
    {
      paymentDetails: {
        ...transaction.paymentDetails,
        acquiringBank
      }
    }
  );
  
  // 13. Merchant Credited
  await delay(1000);
  updateTransactionState(
    'merchant_credited',
    `Merchant account credited with ₹${(transaction.rawAmount || 0) - processingFee}`
  );
  
  // 14. Completed
  await delay(500);
  updateTransactionState(
    'completed',
    'Transaction completed successfully',
    {
      status: 'successful',
      paymentDetails: {
        ...transaction.paymentDetails,
        processingFee: `₹${processingFee.toFixed(2)}`
      }
    }
  );
  
  // Notify user of successful transaction
  toast.success("Transaction processed successfully", {
    description: `Your payment of ${transaction.amount} has been processed.`
  });
  
  return store.transactions.find(t => t.id === transactionId)!;
};

// Modified simulateWalletProcessing function
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
  const transaction: Transaction = {
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
    processingState: 'completed',
    processingTimeline: [
      ...(transaction.processingTimeline || []),
      {
        stage: 'authorization_decision',
        timestamp: new Date().toISOString(),
        message: 'Transaction authorized'
      },
      {
        stage: 'completed',
        timestamp: new Date().toISOString(),
        message: `${transactionType} completed successfully`
      }
    ]
  });
  
  toast.success(`${transactionType} successful`, {
    description: `Your ${transactionType} of ₹${amount.toFixed(2)} was processed successfully.`
  });
  
  return transactionId;
};

// Helper functions
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getRandomProcessor = () => {
  const processors = ['PayU', 'Razorpay', 'CCAvenue', 'Stripe', 'PayPal', 'RizzPay'];
  return processors[Math.floor(Math.random() * processors.length)];
};

const getRandomCardNetwork = (paymentMethod: string) => {
  if (paymentMethod === 'card') {
    const networks = ['Visa', 'Mastercard', 'RuPay', 'American Express'];
    return networks[Math.floor(Math.random() * networks.length)];
  } else if (paymentMethod === 'upi') {
    return 'UPI Network';
  } else {
    return 'Banking Network';
  }
};

const getRandomBank = () => {
  const banks = ['HDFC Bank', 'SBI', 'ICICI Bank', 'Axis Bank', 'Kotak Bank', 'Yes Bank'];
  return banks[Math.floor(Math.random() * banks.length)];
};

const getRandomDeclineReason = () => {
  const reasons = [
    'Insufficient funds',
    'Card expired',
    'Suspected fraud',
    'Transaction limit exceeded',
    'Invalid card details',
    'Bank declined transaction',
    'Account temporarily locked',
    'International transactions disabled',
    'Security verification required'
  ];
  return reasons[Math.floor(Math.random() * reasons.length)];
};

const generateAuthorizationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const generateSettlementId = () => {
  return `STLMT-${Math.floor(1000000 + Math.random() * 9000000).toString()}`;
};

const calculateProcessingFee = (amount: number) => {
  // Typically 2-3% of transaction amount
  return amount * 0.025;
};

const calculateWalletFee = (amount: number, type: 'deposit' | 'withdrawal') => {
  if (type === 'deposit') {
    // 1.2% for deposits
    return amount * 0.012;
  } else {
    // ₹25 or 1.5%, whichever is higher, for withdrawals
    return Math.max(25, amount * 0.015);
  }
};

export const getStatusIndicatorClass = (status: TransactionStatus) => {
  switch (status) {
    case 'successful':
      return 'bg-emerald-500';
    case 'pending':
      return 'bg-amber-500';
    case 'processing':
      return 'bg-blue-500';
    case 'settled':
      return 'bg-indigo-500';
    case 'failed':
    case 'declined':
      return 'bg-rose-500';
    default:
      return 'bg-slate-500';
  }
};

export const getPaymentStateLabel = (state: PaymentProcessingState) => {
  const stateLabels: Record<PaymentProcessingState, string> = {
    initiated: 'Payment Initiated',
    gateway_processing: 'Payment Gateway',
    processor_routing: 'Payment Processor',
    card_network_processing: 'Card Network',
    bank_authorization: 'Bank Authorization',
    authorization_decision: 'Authorization',
    declined: 'Payment Declined',
    settlement_recording: 'Settlement Recording',
    settlement_initiated: 'Settlement Initiated',
    settlement_processing: 'Settlement Process',
    funds_transferred: 'Funds Transfer',
    merchant_credited: 'Merchant Payment',
    completed: 'Completed'
  };
  
  return stateLabels[state] || state;
};

// Export new simulator for wallet payments
export { simulateWalletProcessing };
