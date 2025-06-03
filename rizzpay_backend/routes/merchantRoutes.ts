
import { Router } from 'express';
import { MerchantController } from '../api/merchant/merchantController';
import { authenticateToken, authenticateApiKey } from '../middleware/authMiddleware';
import { validateBody, validateParams, validateQuery } from '../middleware/validation';
import { asyncHandler } from '../middleware/errorHandler';
import {
  createMerchantSchema,
  updateMerchantSchema,
  merchantAccountSchema,
  uuidSchema,
  adminQuerySchema
} from '../validators/schemas';

const router = Router();

// Public routes
router.post('/', 
  validateBody(createMerchantSchema),
  asyncHandler(MerchantController.createMerchant)
);

// Authenticated routes (API key)
router.get('/:merchantId',
  authenticateApiKey,
  validateParams(z.object({ merchantId: uuidSchema })),
  asyncHandler(MerchantController.getMerchant)
);

router.patch('/:merchantId',
  authenticateApiKey,
  validateParams(z.object({ merchantId: uuidSchema })),
  validateBody(updateMerchantSchema),
  asyncHandler(MerchantController.updateMerchant)
);

router.post('/:merchantId/accounts',
  authenticateApiKey,
  validateParams(z.object({ merchantId: uuidSchema })),
  validateBody(merchantAccountSchema),
  asyncHandler(MerchantController.addMerchantAccount)
);

router.get('/:merchantId/accounts',
  authenticateApiKey,
  validateParams(z.object({ merchantId: uuidSchema })),
  asyncHandler(MerchantController.getMerchantAccounts)
);

router.post('/:merchantId/api-key',
  authenticateToken,
  validateParams(z.object({ merchantId: uuidSchema })),
  asyncHandler(MerchantController.generateApiKey)
);

router.get('/:merchantId/wallet/balance',
  authenticateApiKey,
  validateParams(z.object({ merchantId: uuidSchema })),
  asyncHandler(MerchantController.getWalletBalance)
);

// Admin routes
router.patch('/:merchantId/verification',
  authenticateToken,
  validateParams(z.object({ merchantId: uuidSchema })),
  validateBody(updateVerificationStatusSchema),
  asyncHandler(MerchantController.updateVerificationStatus)
);

export default router;
