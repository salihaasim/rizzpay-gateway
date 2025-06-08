
import { Request, Response } from 'express';
import { WebhookService } from './webhook.service';

export class WebhookController {
  static async handleUpiWebhook(req: Request, res: Response) {
    try {
      const { body, headers } = req;
      const clientIP = req.ip || req.connection.remoteAddress;
      
      console.log('UPI Webhook received:', {
        body,
        headers,
        clientIP,
        timestamp: new Date().toISOString()
      });

      // Log webhook hit to database
      await WebhookService.logWebhookHit({
        source: 'upi',
        payload: body,
        headers,
        clientIP
      });

      // Process the webhook
      const result = await WebhookService.processUpiWebhook(body);
      
      res.status(200).json({
        success: true,
        message: 'Webhook processed successfully',
        transactionId: result.transactionId
      });
    } catch (error) {
      console.error('UPI Webhook processing error:', error);
      res.status(500).json({
        success: false,
        message: 'Webhook processing failed',
        error: error.message
      });
    }
  }

  static async handleBankWebhook(req: Request, res: Response) {
    try {
      const { body, headers } = req;
      const { bankCode } = req.params;
      const clientIP = req.ip || req.connection.remoteAddress;
      
      console.log(`${bankCode.toUpperCase()} Webhook received:`, {
        body,
        headers,
        clientIP,
        timestamp: new Date().toISOString()
      });

      // Log webhook hit
      await WebhookService.logWebhookHit({
        source: bankCode,
        payload: body,
        headers,
        clientIP
      });

      // Process bank-specific webhook
      const result = await WebhookService.processBankWebhook(bankCode, body);
      
      res.status(200).json({
        success: true,
        message: 'Bank webhook processed successfully',
        transactionId: result.transactionId
      });
    } catch (error) {
      console.error(`${req.params.bankCode} Webhook processing error:`, error);
      res.status(500).json({
        success: false,
        message: 'Bank webhook processing failed',
        error: error.message
      });
    }
  }
}
