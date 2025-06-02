
import { z } from 'zod';

export const createPaymentSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().default('INR'),
  paymentMethod: z.enum(['card', 'upi', 'netbanking', 'wallet']),
  customerName: z.string().min(2, 'Customer name is required'),
  customerEmail: z.string().email().optional(),
  description: z.string().optional()
});

export const webhookSchema = z.object({
  transaction_id: z.string().optional(),
  txnId: z.string().optional(),
  orderId: z.string().optional(),
  status: z.string(),
  txnStatus: z.string().optional(),
  payment_id: z.string().optional(),
  bankRefNo: z.string().optional()
});

export type CreatePaymentRequest = z.infer<typeof createPaymentSchema>;
export type WebhookRequest = z.infer<typeof webhookSchema>;
