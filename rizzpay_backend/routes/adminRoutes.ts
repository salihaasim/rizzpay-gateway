import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import { validateQuery } from '../middleware/validation';
import { asyncHandler } from '../middleware/errorHandler';
import { adminQuerySchema } from '../validators/schemas';
import { supabase } from '../config/supabase';

const router = Router();

// All admin routes require token authentication
router.use(authenticateToken);

// Admin dashboard stats
router.get('/stats',
  asyncHandler(async (req, res) => {
    // Implement admin stats logic
    res.json({
      success: true,
      message: 'Admin stats endpoint',
      data: {
        totalMerchants: 0,
        totalPayouts: 0,
        totalVolume: 0
      }
    });
  })
);

// Admin merchant management
router.get('/merchants',
  validateQuery(adminQuerySchema),
  asyncHandler(async (req, res) => {
    // Implement admin merchant list logic
    res.json({
      success: true,
      message: 'Admin merchants endpoint',
      data: {
        merchants: [],
        pagination: req.query
      }
    });
  })
);

// Admin payout management
router.get('/payouts',
  validateQuery(adminQuerySchema),
  asyncHandler(async (req, res) => {
    // Implement admin payout list logic
    res.json({
      success: true,
      message: 'Admin payouts endpoint',
      data: {
        payouts: [],
        pagination: req.query
      }
    });
  })
);

// Escrow Bank Connection (SBM Admin-side)
router.post('/escrow/connect',
  asyncHandler(async (req, res) => {
    // Only admin should be able to call; token validated already
    const { accountNumber, ifscCode, accountHolderName, apiKey, apiSecret, bank = 'sbm' } = req.body;

    if (!accountNumber || !ifscCode || !accountHolderName || !apiKey || !apiSecret) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Store/Upsert in single row for the given escrow bank (could do per-tenant later, for now global)
    const { data, error } = await supabase
      .from('escrow_bank_configs')
      .upsert([{
        bank,
        account_number: accountNumber,
        ifsc_code: ifscCode,
        account_holder_name: accountHolderName,
        api_key: apiKey,
        api_secret: apiSecret,
        updated_at: new Date().toISOString()
      }], { onConflict: ['bank'] });

    if (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Failed to save bank config' });
    }
    res.json({ success: true, message: 'Escrow bank configuration saved', data });
  })
);

export default router;
