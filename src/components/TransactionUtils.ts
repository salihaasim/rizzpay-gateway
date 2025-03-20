
import { Transaction, TransactionStatus, PaymentProcessingState, PaymentDetails, useTransactionStore } from '@/stores/transactionStore';

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
  
  // 3. Card Network Processing
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

  // 4. Bank Authorization
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
  
  // 5. Authorization Decision
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
  // 6. Authorization Approved
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
  
  // 7. Settlement Recording
  await delay(1000);
  const settlementId = generateSettlementId();
  updateTransactionState(
    'settlement_recording',
    `Settlement process initiated with ID: ${settlementId}`,
    {
      paymentDetails: {
        ...transaction.paymentDetails,
        settlementId
      }
    }
  );
  
  // 8. Settlement Initiated
  await delay(1000);
  updateTransactionState(
    'settlement_initiated',
    'Processor initiated settlement'
  );
  
  // 9. Settlement Processing
  await delay(1000);
  updateTransactionState(
    'settlement_processing',
    'Batch settlement processing'
  );
  
  // 10. Funds Transferred
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
  
  // 11. Merchant Credited
  const processingFee = calculateProcessingFee(transaction.rawAmount || 0);
  await delay(1000);
  updateTransactionState(
    'merchant_credited',
    `Merchant account credited with ₹${(transaction.rawAmount || 0) - processingFee}`
  );
  
  // 12. Completed
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
  
  return store.transactions.find(t => t.id === transactionId)!;
};

// Helper functions
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getRandomProcessor = () => {
  const processors = ['PayU', 'Razorpay', 'CCAvenue', 'Stripe', 'PayPal'];
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
    'Bank declined transaction'
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
