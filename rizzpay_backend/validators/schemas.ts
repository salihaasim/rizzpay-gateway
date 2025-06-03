
import { z } from 'zod';

// Common schemas
export const uuidSchema = z.string().uuid();

// Payout schemas
export const createPayoutSchema = z.object({
  merchant_id: uuidSchema,
  amount: z.number().positive().max(1000000),
  currency: z.string().default('INR'),
  payout_method: z.enum(['bank_transfer', 'upi']),
  beneficiary_name: z.string().min(1).max(100).optional(),
  account_number: z.string().min(1).max(20).optional(),
  ifsc_code: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/).optional(),
  bank_name: z.string().max(100).optional(),
  upi_id: z.string().email().optional(),
  description: z.string().max(500).optional(),
  priority: z.number().int().min(1).max(5).default(3)
}).refine((data) => {
  if (data.payout_method === 'bank_transfer') {
    return data.beneficiary_name && data.account_number && data.ifsc_code;
  }
  if (data.payout_method === 'upi') {
    return data.upi_id;
  }
  return true;
}, {
  message: "Bank transfer requires beneficiary_name, account_number, and ifsc_code. UPI requires upi_id."
});

export const payoutStatusSchema = z.object({
  payoutId: uuidSchema
});

export const merchantPayoutsQuerySchema = z.object({
  page: z.string().transform(Number).pipe(z.number().int().positive()).default('1'),
  limit: z.string().transform(Number).pipe(z.number().int().min(1).max(100)).default('20'),
  status: z.enum(['pending', 'processing', 'completed', 'failed', 'cancelled']).optional(),
  method: z.enum(['bank_transfer', 'upi']).optional(),
  start_date: z.string().datetime().optional(),
  end_date: z.string().datetime().optional()
});

// Webhook schemas
export const webhookPayloadSchema = z.object({
  payout_id: uuidSchema,
  status: z.enum(['pending', 'processing', 'completed', 'failed', 'cancelled']),
  utr_number: z.string().optional(),
  bank_reference_id: z.string().optional(),
  failure_reason: z.string().optional(),
  timestamp: z.string().datetime(),
  bank_response: z.any().optional()
});

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  business_name: z.string().min(1).max(100),
  business_type: z.string().min(1).max(50),
  contact_phone: z.string().min(10).max(15)
});

// Admin schemas
export const adminQuerySchema = z.object({
  page: z.string().transform(Number).pipe(z.number().int().positive()).default('1'),
  limit: z.string().transform(Number).pipe(z.number().int().min(1).max(100)).default('20'),
  search: z.string().optional(),
  status: z.string().optional(),
  start_date: z.string().datetime().optional(),
  end_date: z.string().datetime().optional()
});

// Bulk upload schema
export const bulkUploadSchema = z.object({
  file_content: z.string().min(1),
  file_name: z.string().min(1),
  merchant_id: uuidSchema
});

// Merchant schemas
export const merchantProfileSchema = z.object({
  business_name: z.string().min(1).max(100),
  business_type: z.string().min(1).max(50),
  gst_number: z.string().regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/).optional(),
  pan_number: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/),
  contact_email: z.string().email(),
  contact_phone: z.string().min(10).max(15),
  business_address: z.string().min(1).max(500)
});
