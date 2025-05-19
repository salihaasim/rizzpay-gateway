
import { PaymentProcessingState } from '@/stores/transactions/types';

// Dictionary for mapping processing states to display text
export const processingStateDisplay: Record<PaymentProcessingState, string> = {
  'initiated': 'Payment Initiated',
  'gateway_processing': 'Gateway Processing',
  'processor_routing': 'Processor Routing',
  'card_network_processing': 'Card Network Processing',
  'bank_authorization': 'Bank Authorization',
  'authorization_decision': 'Authorization Decision',
  'declined': 'Payment Declined',
  'settlement_recording': 'Settlement Recording',
  'settlement_initiated': 'Settlement Initiated',
  'settlement_processing': 'Settlement Processing',
  'funds_transferred': 'Funds Transferred',
  'merchant_credited': 'Merchant Credited',
  'completed': 'Completed',
  'failed': 'Failed',
  'processing': 'Processing'
};

// Function to get display text for a processing state
export const getProcessingStateDisplay = (state: PaymentProcessingState): string => {
  return processingStateDisplay[state] || state;
};

// Status badge color mapping
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'successful':
    case 'completed':
      return 'bg-emerald-100 text-emerald-800';
    case 'pending':
    case 'processing':
      return 'bg-amber-100 text-amber-800';
    case 'failed':
    case 'declined':
      return 'bg-rose-100 text-rose-800';
    case 'refunded':
      return 'bg-blue-100 text-blue-800';
    case 'settled':
      return 'bg-violet-100 text-violet-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Function to get status indicator CSS class
export const getStatusIndicatorClass = (status: string): string => {
  switch (status) {
    case 'successful':
      return 'bg-green-500';
    case 'pending':
    case 'processing':
      return 'bg-yellow-500';
    case 'failed':
    case 'declined':
      return 'bg-red-500';
    case 'refunded':
      return 'bg-blue-500';
    case 'settled':
      return 'bg-purple-500';
    default:
      return 'bg-gray-400';
  }
};

// Function to get payment state label
export const getPaymentStateLabel = (state: string): string => {
  return processingStateDisplay[state as PaymentProcessingState] || state;
};

// Get random processor for payment simulation
export const getRandomProcessor = (): string => {
  const processors = ['RuPay', 'Visa', 'Mastercard', 'HDFC Gateway', 'ICICI Gateway'];
  return processors[Math.floor(Math.random() * processors.length)];
};

// Get random decline reason for declined transactions
export const getRandomDeclineReason = (): string => {
  const reasons = [
    'Insufficient funds', 
    'Card expired', 
    'Invalid card number', 
    'Transaction declined by bank',
    'Risk management flag',
    'Unusual activity detected',
    'Card limit exceeded'
  ];
  return reasons[Math.floor(Math.random() * reasons.length)];
};
