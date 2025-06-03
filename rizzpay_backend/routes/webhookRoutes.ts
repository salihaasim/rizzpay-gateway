
import { Router } from 'express';
import { PayoutController } from '../api/payout/payoutController';
import { validateBody } from '../middleware/validation';
import { asyncHandler } from '../middleware/errorHandler';
import { webhookPayloadSchema } from '../validators/schemas';

const router = Router();

// Webhook endpoint for bank callbacks (no auth required)
router.post('/payout-status',
  validateBody(webhookPayloadSchema),
  asyncHandler(PayoutController.handleWebhook)
);

// Health check for webhook endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Webhook endpoint is active',
    timestamp: new Date().toISOString()
  });
});

export default router;
