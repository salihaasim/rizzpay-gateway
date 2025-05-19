export const getStatusDescription = (status: string): string => {
  switch (status) {
    case 'successful':
      return 'Payment was successful.';
    case 'processing':
      return 'Payment is currently being processed.';
    case 'pending':
      return 'Payment is pending confirmation.';
    case 'failed':
      return 'Payment failed.';
    case 'refunded':
      return 'Payment has been refunded.';
    default:
      return 'Unknown payment status.';
  }
};

export const getProcessingStateDescription = (state: string): string => {
  switch (state) {
    case 'initiated':
      return 'Payment process has been initiated.';
    case 'authorized':
      return 'Payment has been authorized.';
    case 'captured':
      return 'Payment has been captured.';
    case 'failed':
      return 'Payment processing failed.';
    default:
      return 'Unknown processing state.';
  }
};

export const getRandomProcessor = (): string => {
  const processors = ['Stripe', 'PayPal', 'Razorpay', 'PayU'];
  return processors[Math.floor(Math.random() * processors.length)];
};

export const getRandomDeclineReason = (): string => {
  const reasons = [
    'Insufficient funds',
    'Card expired',
    'Invalid CVV',
    'Transaction declined by bank',
    'Payment gateway error'
  ];
  return reasons[Math.floor(Math.random() * reasons.length)];
};

// Add the missing getStatusIndicatorClass function
export const getStatusIndicatorClass = (status: string): string => {
  switch (status) {
    case 'successful':
      return 'bg-green-500';
    case 'processing':
      return 'bg-blue-500';
    case 'pending':
      return 'bg-yellow-500';
    case 'failed':
      return 'bg-red-500';
    case 'refunded':
      return 'bg-purple-500';
    default:
      return 'bg-gray-500';
  }
};

// Add the missing getPaymentStateLabel function
export const getPaymentStateLabel = (state: string): string => {
  switch (state) {
    case 'initiated':
      return 'Payment Initiated';
    case 'processing':
      return 'Processing Payment';
    case 'authorized':
      return 'Payment Authorized';
    case 'completed':
      return 'Payment Completed';
    case 'failed':
      return 'Payment Failed';
    case 'declined':
      return 'Payment Declined';
    case 'refunded':
      return 'Payment Refunded';
    default:
      return 'Unknown State';
  }
};
