
// Re-export all utilities from their respective files
export { 
  generateTransactionId, 
  formatDate,
  generateAuthorizationCode
} from '@/utils/formatUtils';

export { 
  getStatusDescription,
  getProcessingStateDescription,
  getRandomProcessor,
  getRandomDeclineReason,
  // These were missing and causing errors
  getStatusIndicatorClass,
  getPaymentStateLabel
} from '@/utils/statusUtils';

export { 
  simulateWalletProcessing,
  calculateWalletFee
} from '@/utils/walletUtils';

export { delay } from '@/utils/commonUtils';

export { simulatePaymentProcessing } from '@/utils/paymentProcessingUtils';

// This was missing and causing errors
export { 
  updateTransactionFromWebhook,
  processWebhookTransaction
} from '@/utils/webhookUtils';

export { addTransaction } from '@/utils/transactionCreateUtils';

export { 
  checkSupabaseConnection,
  syncTransactionToSupabase,
  fetchTransactionsFromSupabase
} from '@/utils/supabaseClient';

export {
  processDirectPaymentCallback
} from '@/components/webhook/paymentUtils';

// Export Razorpay utilities from the new location
export {
  createRazorpayOrder,
  processRazorpayPayment,
  verifyRazorpayPayment
} from '@/utils/razorpay';
