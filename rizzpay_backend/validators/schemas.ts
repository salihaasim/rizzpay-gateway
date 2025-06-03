
import { z } from 'zod';

// Common schemas
export const uuidSchema = z.string().uuid();
export const emailSchema = z.string().email();
export const phoneSchema = z.string().regex(/^\+?[1-9]\d{1,14}$/);

// Merchant schemas
export const createMerchantSchema = z.object({
  business_name: z.string().min(2).max(255),
  business_type: z.string().min(2).max(100),
  contact_email: emailSchema,
  contact_phone: phoneSchema,
  business_address: z.string().min(10).max(500),
  pan_number: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]$/),
  gst_number: z.string().regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/).optional()
});

export const updateMerchantSchema = createMerchantSchema.partial();

export const merchantAccountSchema = z.object({
  account_number: z.string().min(8).max(20),
  ifsc_code: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/),
  account_holder_name: z.string().min(2).max(255),
  bank_name: z.string().min(2).max(255),
  branch_name: z.string().max(255).optional(),
  account_type: z.enum(['savings', 'current', 'cc', 'od']).optional(),
  is_primary: z.boolean().optional(),
  daily_limit: z.number().positive().optional(),
  monthly_limit: z.number().positive().optional()
});

// Payout schemas
export const createPayoutSchema = z.object({
  merchant_id: uuidSchema,
  amount: z.number().positive().max(1000000),
  currency: z.string().length(3).default('INR'),
  payout_method: z.enum(['bank_transfer', 'upi']),
  beneficiary_name: z.string().min(2).max(255).optional(),
  account_number: z.string().min(8).max(20).optional(),
  ifsc_code: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/).optional(),
  bank_name: z.string().max(255).optional(),
  upi_id: z.string().max(255).optional(),
  description: z.string().max(500).optional(),
  priority: z.number().int().min(1).max(5).default(3)
});

export const payoutStatusSchema = z.object({
  payoutId: uuidSchema
});

export const merchantPayoutsQuerySchema = z.object({
  page: z.string().transform(val => parseInt(val)).refine(val => val > 0).default('1'),
  limit: z.string().transform(val => parseInt(val)).refine(val => val > 0 && val <= 100).default('20'),
  status: z.enum(['pending', 'processing', 'completed', 'failed', 'cancelled']).optional(),
  method: z.enum(['bank_transfer', 'upi']).optional()
});

// Webhook schemas
export const webhookPayloadSchema = z.object({
  payout_id: uuidSchema,
  status: z.enum(['pending', 'processing', 'completed', 'failed', 'cancelled']),
  utr_number: z.string().optional(),
  bank_reference_id: z.string().optional(),
  failure_reason: z.string().optional(),
  processing_fee: z.number().optional(),
  bank_charges: z.number().optional(),
  timestamp: z.string(),
  bank_response: z.any().optional()
});

// Auth schemas
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(6)
});

export const registerSchema = z.object({
  email: emailSchema,
  password: z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 
    'Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  name: z.string().min(2).max(255)
});

// Admin schemas
export const updateVerificationStatusSchema = z.object({
  status: z.enum(['pending', 'approved', 'rejected']),
  notes: z.string().max(1000).optional()
});

export const adminQuerySchema = z.object({
  page: z.string().transform(val => parseInt(val)).refine(val => val > 0).default('1'),
  limit: z.string().transform(val => parseInt(val)).refine(val => val > 0 && val <= 100).default('20'),
  status: z.string().optional(),
  search: z.string().optional()
});
