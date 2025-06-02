
import { Request, Response } from 'express';
import { PaymentService } from '../../services/PaymentService';
import { createPaymentSchema, webhookSchema } from '../../validators/paymentValidators';

export class PaymentController {
  static async createPayment(req: Request, res: Response) {
    try {
      const validatedData = createPaymentSchema.parse(req.body);
      const merchantId = req.user?.id;
      
      const payment = await PaymentService.createPayment({
        ...validatedData,
        merchantId
      });
      
      res.status(201).json({
        success: true,
        data: payment
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Payment creation failed',
        error: error.message
      });
    }
  }
  
  static async processWebhook(req: Request, res: Response) {
    try {
      const bankSlug = req.params.bankSlug;
      const webhookData = webhookSchema.parse(req.body);
      
      const result = await PaymentService.processWebhook(bankSlug, webhookData, req.headers);
      
      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Webhook processing failed',
        error: error.message
      });
    }
  }
  
  static async getPaymentStatus(req: Request, res: Response) {
    try {
      const { transactionId } = req.params;
      
      const status = await PaymentService.getPaymentStatus(transactionId);
      
      res.json({
        success: true,
        data: status
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: 'Transaction not found',
        error: error.message
      });
    }
  }
  
  static async getTransactions(req: Request, res: Response) {
    try {
      const merchantId = req.user?.id;
      const { page = 1, limit = 50, status, paymentMethod } = req.query;
      
      const transactions = await PaymentService.getTransactions(merchantId, {
        page: Number(page),
        limit: Number(limit),
        status: status as string,
        paymentMethod: paymentMethod as string
      });
      
      res.json({
        success: true,
        data: transactions
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch transactions',
        error: error.message
      });
    }
  }
}
