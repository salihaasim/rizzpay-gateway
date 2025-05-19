
import { PaymentProcessingState, TransactionStatus } from '@/stores/transactionStore';

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

export const getRandomProcessor = () => {
  const processors = ['PayU', 'Razorpay', 'CCAvenue', 'Stripe', 'PayPal', 'RizzPay', 'Instamojo'];
  return processors[Math.floor(Math.random() * processors.length)];
};

export const getRandomDeclineReason = () => {
  const reasons = [
    'Insufficient funds',
    'Card expired',
    'Transaction limit exceeded',
    'Invalid card details',
    'Bank declined transaction'
  ];
  return reasons[Math.floor(Math.random() * reasons.length)];
};
