
interface WebhookRequest {
  body: any;
  headers: Record<string, string>;
  ip?: string;
  params?: Record<string, string>;
}

interface WebhookResponse {
  status: (code: number) => {
    json: (data: any) => void;
  };
}

export class WebhookController {
  static async handleUpiWebhook(req: WebhookRequest, res: WebhookResponse) {
    try {
      const { body, headers } = req;
      const clientIP = req.ip;
      
      console.log('UPI Webhook received:', {
        body,
        headers,
        clientIP,
        timestamp: new Date().toISOString()
      });

      // Log webhook hit to database (using existing api_request_logs table)
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
    } catch (error: any) {
      console.error('UPI Webhook processing error:', error);
      res.status(500).json({
        success: false,
        message: 'Webhook processing failed',
        error: error.message
      });
    }
  }

  static async handleBankWebhook(req: WebhookRequest, res: WebhookResponse) {
    try {
      const { body, headers } = req;
      const { bankCode } = req.params || {};
      const clientIP = req.ip;
      
      console.log(`${bankCode?.toUpperCase()} Webhook received:`, {
        body,
        headers,
        clientIP,
        timestamp: new Date().toISOString()
      });

      // Log webhook hit
      await WebhookService.logWebhookHit({
        source: bankCode || 'unknown',
        payload: body,
        headers,
        clientIP
      });

      // Process bank-specific webhook
      const result = await WebhookService.processBankWebhook(bankCode || 'unknown', body);
      
      res.status(200).json({
        success: true,
        message: 'Bank webhook processed successfully',
        transactionId: result.transactionId
      });
    } catch (error: any) {
      console.error(`${req.params?.bankCode} Webhook processing error:`, error);
      res.status(500).json({
        success: false,
        message: 'Bank webhook processing failed',
        error: error.message
      });
    }
  }
}

// Import after class definition to avoid circular dependency
import { WebhookService } from './webhook.service';
