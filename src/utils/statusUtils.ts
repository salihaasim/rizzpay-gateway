
import { TransactionStatus, PaymentProcessingState } from '@/stores/transactions/types';

// Get human-readable status descriptions
export const getStatusDescription = (status: TransactionStatus): string => {
  const statusMessages: Record<TransactionStatus, string> = {
    'pending': 'Payment is being processed',
    'successful': 'Payment completed successfully',
    'failed': 'Payment attempt was unsuccessful',
    'processing': 'Payment is currently being processed',
    'refunded': 'Payment was refunded',
    'settled': 'Payment has been settled',
    'declined': 'Payment was declined'
  };
  
  return statusMessages[status] || 'Unknown status';
};

// Get a human-readable processing state description
export const getProcessingStateDescription = (state: PaymentProcessingState): string => {
  const stateMessages: Record<string, string> = {
    'initiated': 'Payment has been initiated',
    'gateway_processing': 'Payment is being processed by the payment gateway',
    'processor_routing': 'Transaction is being routed to the payment processor',
    'authorization_decision': 'Awaiting authorization decision',
    'completed': 'Payment processing completed',
    'failed': 'Payment processing failed',
    'declined': 'Payment was declined by the issuer',
    'card_network_processing': 'Processing through card network'
  };
  
  return stateMessages[state] || 'Unknown processing state';
};

// Get a random processor name for simulation
export const getRandomProcessor = (): string => {
  const processors = ['HDFC Bank', 'ICICI Processing', 'SBI Payments', 'Axis Gateway', 'Yes Bank'];
  return processors[Math.floor(Math.random() * processors.length)];
};

// Get a random decline reason for simulation
export const getRandomDeclineReason = (): string => {
  const reasons = [
    'Insufficient funds', 
    'Card expired',
    'Suspicious activity detected',
    'Payment limit exceeded',
    'Card blocked by issuer'
  ];
  return reasons[Math.floor(Math.random() * reasons.length)];
};
