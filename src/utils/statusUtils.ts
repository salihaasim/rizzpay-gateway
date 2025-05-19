
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
