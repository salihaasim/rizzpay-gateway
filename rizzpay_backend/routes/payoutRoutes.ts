
import { Router } from 'express';
import { PayoutController } from '../api/payout/payoutController';
import { authenticateApiKey } from '../middleware/authMiddleware';
import { validateBody, validateParams, validateQuery } from '../middleware/validation';
import { asyncHandler } from '../middleware/errorHandler';
import {
  createPayoutSchema,
  payoutStatusSchema,
  merchantPayoutsQuerySchema,
  uuidSchema
} from '../validators/schemas';

const router = Router();

// All payout routes require API key authentication
router.use(authenticateApiKey);

// Create payout request
router.post('/',
  validateBody(createPayoutSchema),
  asyncHandler(PayoutController.createPayout)
);

// Get payout status
router.get('/:payoutId',
  validateParams(payoutStatusSchema),
  asyncHandler(PayoutController.getPayoutStatus)
);

// Get merchant payouts with filtering
router.get('/merchant/:merchantId',
  validateParams(z.object({ merchantId: uuidSchema })),
  validateQuery(merchantPayoutsQuerySchema),
  asyncHandler(PayoutController.getMerchantPayouts)
);

// Retry failed payout
router.post('/:payoutId/retry',
  validateParams(payoutStatusSchema),
  asyncHandler(PayoutController.retryPayout)
);

export default router;
