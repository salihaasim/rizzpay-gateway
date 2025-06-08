
// Main exports for the transactions module
export { WebhookController } from './webhook.controller';
export { WebhookService } from './webhook.service';
export { PayoutController } from './payout.controller';
export { PayoutService } from './payout.service';
export { ReconciliationService, setupReconciliationCron } from './reconciliation.cron';

// Transaction module types
export interface TransactionModule {
  webhook: {
    controller: typeof WebhookController;
    service: typeof WebhookService;
  };
  payout: {
    controller: typeof PayoutController;
    service: typeof PayoutService;
  };
  reconciliation: {
    service: typeof ReconciliationService;
  };
}
