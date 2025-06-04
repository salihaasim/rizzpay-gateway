
import { Router } from 'express';
import { PayoutController } from '../api/payout/payoutController';
import { validateBody } from '../middleware/validation';
import { asyncHandler } from '../middleware/errorHandler';
import { decryptionMiddleware } from '../middleware/encryptionMiddleware';
import { webhookPayloadSchema } from '../validators/schemas';

const router = Router();

// Webhook endpoint for bank callbacks with decryption support
router.post('/payout-status',
  decryptionMiddleware(), // Auto-detect and decrypt if needed
  validateBody(webhookPayloadSchema),
  asyncHandler(PayoutController.handleWebhook)
);

// Bank-specific webhook endpoints with encryption
router.post('/canara/payout-status',
  decryptionMiddleware('canara'),
  validateBody(webhookPayloadSchema),
  asyncHandler(PayoutController.handleWebhook)
);

router.post('/hdfc/payout-status',
  decryptionMiddleware('hdfc'),
  validateBody(webhookPayloadSchema),
  asyncHandler(PayoutController.handleWebhook)
);

router.post('/icici/payout-status',
  decryptionMiddleware('icici'),
  validateBody(webhookPayloadSchema),
  asyncHandler(PayoutController.handleWebhook)
);

router.post('/sbm/payout-status',
  decryptionMiddleware('sbm'),
  validateBody(webhookPayloadSchema),
  asyncHandler(PayoutController.handleWebhook)
);

// Health check for webhook endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Webhook endpoint is active with encryption support',
    timestamp: new Date().toISOString(),
    encryption_support: {
      canara: true,
      hdfc: true,
      icici: true,
      sbm: false
    }
  });
});

export default router;
