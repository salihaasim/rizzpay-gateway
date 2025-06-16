
import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import { validateQuery, validateBody } from '../middleware/validation';
import { asyncHandler } from '../middleware/errorHandler';
import { adminQuerySchema } from '../validators/schemas';
import { AdminService } from '../services/AdminService';
import { AnalyticsService } from '../services/AnalyticsService';
import { SettingsService } from '../services/SettingsService';
import { supabase } from '../config/supabase';

const router = Router();

// All admin routes require token authentication
router.use(authenticateToken);

// Admin dashboard stats
router.get('/dashboard',
  asyncHandler(async (req, res) => {
    const stats = await AnalyticsService.getDashboardStats();
    res.json({
      success: true,
      message: 'Dashboard stats retrieved successfully',
      data: stats
    });
  })
);

// Platform statistics
router.get('/platform-stats',
  asyncHandler(async (req, res) => {
    const stats = await AnalyticsService.getPlatformStats();
    res.json({
      success: true,
      message: 'Platform stats retrieved successfully',
      data: stats
    });
  })
);

// Admin user management
router.get('/list',
  validateQuery(adminQuerySchema),
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 20 } = req.query;
    const admins = await AdminService.listAdmins(Number(page), Number(limit));
    res.json({
      success: true,
      message: 'Admin list retrieved successfully',
      data: admins
    });
  })
);

router.post('/create',
  asyncHandler(async (req, res) => {
    const adminData = req.body;
    const newAdmin = await AdminService.createAdmin(adminData);
    res.json({
      success: true,
      message: 'Admin created successfully',
      data: newAdmin
    });
  })
);

router.get('/activity',
  asyncHandler(async (req, res) => {
    const { adminId, limit = 50 } = req.query;
    const activity = await AdminService.getAdminActivity(
      adminId as string, 
      Number(limit)
    );
    res.json({
      success: true,
      message: 'Admin activity retrieved successfully',
      data: activity
    });
  })
);

// Merchant risk analysis
router.get('/merchant-risk/:merchantId',
  asyncHandler(async (req, res) => {
    const { merchantId } = req.params;
    const riskAnalysis = await AnalyticsService.getMerchantRiskAnalysis(merchantId);
    res.json({
      success: true,
      message: 'Merchant risk analysis completed',
      data: riskAnalysis
    });
  })
);

// Admin merchant management
router.get('/merchants',
  validateQuery(adminQuerySchema),
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 20, status } = req.query;
    
    let query = supabase
      .from('merchants')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const offset = (Number(page) - 1) * Number(limit);
    query = query.range(offset, offset + Number(limit) - 1);

    const { data: merchants, error, count } = await query;

    if (error) {
      throw new Error(`Error fetching merchants: ${error.message}`);
    }

    res.json({
      success: true,
      message: 'Merchants retrieved successfully',
      data: {
        merchants,
        total: count,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil((count || 0) / Number(limit))
      }
    });
  })
);

// Admin payout management
router.get('/payouts',
  validateQuery(adminQuerySchema),
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 20, status } = req.query;
    
    let query = supabase
      .from('payout_requests')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const offset = (Number(page) - 1) * Number(limit);
    query = query.range(offset, offset + Number(limit) - 1);

    const { data: payouts, error, count } = await query;

    if (error) {
      throw new Error(`Error fetching payouts: ${error.message}`);
    }

    res.json({
      success: true,
      message: 'Payouts retrieved successfully',
      data: {
        payouts,
        total: count,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil((count || 0) / Number(limit))
      }
    });
  })
);

// Settings management
router.get('/settings',
  asyncHandler(async (req, res) => {
    const { category } = req.query;
    const settings = await SettingsService.getSettings(category as string);
    res.json({
      success: true,
      message: 'Settings retrieved successfully',
      data: settings
    });
  })
);

router.post('/settings',
  asyncHandler(async (req, res) => {
    const { settings } = req.body;
    
    if (Array.isArray(settings)) {
      const updatedSettings = await SettingsService.updateMultipleSettings(settings);
      res.json({
        success: true,
        message: 'Settings updated successfully',
        data: updatedSettings
      });
    } else {
      const { key, value, description } = settings;
      const updatedSetting = await SettingsService.updateSetting(key, value, description);
      res.json({
        success: true,
        message: 'Setting updated successfully',
        data: updatedSetting
      });
    }
  })
);

// Escrow Bank Connection (SBM Admin-side)
router.post('/escrow/connect',
  asyncHandler(async (req, res) => {
    const { accountNumber, ifscCode, accountHolderName, apiKey, apiSecret, bank = 'sbm' } = req.body;

    if (!accountNumber || !ifscCode || !accountHolderName || !apiKey || !apiSecret) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

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
