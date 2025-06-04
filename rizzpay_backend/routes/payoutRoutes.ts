
import { Router } from 'express';
import { z } from 'zod';
import { PayoutController } from '../api/payout/payoutController';
import { authenticateApiKey } from '../middleware/authMiddleware';
import { validateBody, validateParams, validateQuery } from '../middleware/validation';
import { asyncHandler } from '../middleware/errorHandler';
import { encryptionMiddleware, decryptionMiddleware, logEncryptedRequest } from '../middleware/encryptionMiddleware';
import {
  createPayoutSchema,
  payoutStatusSchema,
  merchantPayoutsQuerySchema,
  uuidSchema,
  bulkUploadSchema
} from '../validators/schemas';
import { BulkPayoutService } from '../services/BulkPayoutService';

const router = Router();

// All payout routes require API key authentication
router.use(authenticateApiKey);

// Add encryption logging for all routes
router.use(logEncryptedRequest);

// Create payout request with encryption support
router.post('/',
  encryptionMiddleware(), // Auto-detect bank and encrypt if needed
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

// Retry failed payout with encryption
router.post('/:payoutId/retry',
  encryptionMiddleware(),
  validateParams(payoutStatusSchema),
  asyncHandler(PayoutController.retryPayout)
);

// Bulk payout upload with encryption
router.post('/bulk',
  encryptionMiddleware(),
  validateBody(bulkUploadSchema),
  asyncHandler(async (req, res) => {
    const { file_content, file_name, merchant_id, bank_code } = req.body;
    
    const result = await BulkPayoutService.processBulkFile(
      merchant_id,
      file_content,
      file_name,
      bank_code // Pass bank code for encryption
    );
    
    if (result.success) {
      res.status(201).json({
        ...result,
        encryption_applied: !!bank_code
      });
    } else {
      res.status(400).json(result);
    }
  })
);

// Get bulk upload status
router.get('/bulk/:uploadId',
  validateParams(z.object({ uploadId: uuidSchema })),
  asyncHandler(async (req, res) => {
    const { uploadId } = req.params;
    
    const status = await BulkPayoutService.getBulkUploadStatus(uploadId);
    
    if (status) {
      res.json({
        success: true,
        data: status
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Bulk upload not found'
      });
    }
  })
);

export default router;
