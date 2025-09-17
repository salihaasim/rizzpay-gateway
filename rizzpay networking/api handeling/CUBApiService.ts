import { v4 as uuidv4 } from 'uuid';
import AWS from 'aws-sdk';

// AWS Services
const secretsManager = new AWS.SecretsManager();
const cloudWatch = new AWS.CloudWatch();
const s3 = new AWS.S3();
const sqs = new AWS.SQS();

export class CUBApiService {
  private baseUrl: string;
  private clientId: string;
  private clientSecret: string;

  constructor() {
    this.baseUrl = process.env.CUB_API_BASE_URL || '';
  }

  /**
   * Initialize service with credentials from AWS Secrets Manager
   */
  async initialize() {
    try {
      const secret = await secretsManager.getSecretValue({
        SecretId: 'rizzpay/cub/api-credentials'
      }).promise();

      const credentials = JSON.parse(secret.SecretString || '{}');
      this.clientId = credentials.clientId;
      this.clientSecret = credentials.clientSecret;
    } catch (error) {
      console.error('Failed to retrieve CUB API credentials:', error);
      throw error;
    }
  }

  /**
   * Generate unique transaction identifiers
   */
  generateTransactionIds(): { traceId: string; sessionId: string } {
    return {
      traceId: uuidv4(),
      sessionId: uuidv4()
    };
  }

  /**
   * Validate payout data before sending to CUB API
   */
  validatePayoutData(data: any): void {
    // Account number validation (9-18 digits)
    if (!/^\d{9,18}$/.test(data.to_account)) {
      throw new Error(`Invalid account number format: ${data.to_account}`);
    }

    // Amount validation (2 decimals)
    const amountStr = data.txn_amount.toString();
    if (!/^\d+\.\d{2}$/.test(amountStr)) {
      throw new Error(`Amount must have exactly 2 decimal places: ${amountStr}`);
    }

    // IFSC validation
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(data.ifsc_code)) {
      throw new Error(`Invalid IFSC code format: ${data.ifsc_code}`);
    }

    // Mandatory fields check
    const requiredFields = [
      'from_account', 'to_account', 'txn_amount', 'trace_id', 
      'session_id', 'beneficiary_name', 'ifsc_code'
    ];

    for (const field of requiredFields) {
      if (!data[field]) {
        throw new Error(`Missing mandatory field: ${field}`);
      }
    }
  }

  /**
   * Format payout request for CUB API
   */
  formatPayoutRequest(payoutData: any, traceId: string, sessionId: string): any {
    return {
      from_account: payoutData.from_account,
      to_account: payoutData.to_account,
      txn_amount: parseFloat(payoutData.amount).toFixed(2),
      trace_id: traceId,
      session_id: sessionId,
      beneficiary_name: payoutData.beneficiary_name,
      ifsc_code: payoutData.ifsc_code,
      txn_type: payoutData.method || 'NEFT',
      remarks: payoutData.remarks || 'RizzPay Transfer'
    };
  }

  /**
   * Make API call to CUB with retry logic
   */
  async makeApiCall(endpoint: string, data: any, maxRetries: number = 3): Promise<any> {
    const headers = {
      'Content-Type': 'application/json',
      'X-IBM-Client-Id': this.clientId,
      'X-IBM-Client-Secret': this.clientSecret
    };

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const startTime = Date.now();
        
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
          method: 'POST',
          headers,
          body: JSON.stringify(data)
        });

        const responseTime = Date.now() - startTime;
        const responseData = await response.json();

        // Log the transaction
        await this.logTransaction(data, responseData, response.status, responseTime);

        // Publish metrics
        await this.publishMetrics(response.status, responseTime);

        if (response.status === 200) {
          return {
            success: true,
            status: response.status,
            data: responseData
          };
        } else if (response.status >= 500) {
          // Server error - retry
          if (attempt === maxRetries) {
            await this.sendToDeadLetterQueue(data, responseData, 'Max retries exceeded');
            throw new Error(`API call failed after ${maxRetries} attempts`);
          }
          
          // Exponential backoff
          const delay = Math.pow(2, attempt) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        } else {
          // Client error - don't retry
          return {
            success: false,
            status: response.status,
            data: responseData
          };
        }
      } catch (error) {
        if (attempt === maxRetries) {
          await this.sendToDeadLetterQueue(data, null, error.message);
          throw error;
        }
        
        // Network error - retry with backoff
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  /**
   * Initiate payout via CUB API
   */
  async initiatePayout(payoutData: any): Promise<any> {
    try {
      // Generate unique IDs
      const { traceId, sessionId } = this.generateTransactionIds();

      // Format request
      const requestData = this.formatPayoutRequest(payoutData, traceId, sessionId);

      // Validate data
      this.validatePayoutData(requestData);

      // Make API call
      const response = await this.makeApiCall('/payouts', requestData);

      // Process response
      return this.processApiResponse(response, traceId);
    } catch (error) {
      console.error('Payout initiation failed:', error);
      throw error;
    }
  }

  /**
   * Process API response and determine next action
   */
  processApiResponse(response: any, traceId: string): any {
    const { status, data } = response;

    if (status === 200 && data.success === true) {
      // Success - extract critical data
      return {
        status: 'SUCCESS',
        trace_id: traceId,
        utr_number: data.utr_number,
        bank_ref_id: data.bank_reference_id,
        transaction_id: data.transaction_id,
        message: data.message
      };
    } else if (status === 200 && data.success === false) {
      // Business failure
      return {
        status: 'FAILED',
        trace_id: traceId,
        reason: data.failure_reason,
        error_code: data.error_code,
        message: data.message
      };
    } else {
      // HTTP error
      return {
        status: 'ERROR',
        trace_id: traceId,
        http_status: status,
        error: data?.message || 'Unknown error'
      };
    }
  }

  /**
   * Log transaction with data masking
   */
  async logTransaction(request: any, response: any, httpStatus: number, responseTime: number): Promise<void> {
    const logData = {
      timestamp: new Date().toISOString(),
      trace_id: request.trace_id,
      session_id: request.session_id,
      http_status: httpStatus,
      response_time_ms: responseTime,
      request: this.maskSensitiveData(request),
      response: this.maskSensitiveData(response)
    };

    // Log to CloudWatch (masked)
    console.log('CUB_API_CALL:', JSON.stringify(logData));

    // Store full data in encrypted S3
    await this.storeInSecureS3(logData, request, response);
  }

  /**
   * Mask sensitive data for logging
   */
  maskSensitiveData(data: any): any {
    if (!data) return data;

    return {
      ...data,
      from_account: data.from_account?.replace(/\d(?=\d{4})/g, 'X'),
      to_account: data.to_account?.replace(/\d(?=\d{4})/g, 'X'),
      client_secret: data.client_secret ? '[MASKED]' : undefined
    };
  }

  /**
   * Store full transaction data in encrypted S3
   */
  async storeInSecureS3(logData: any, request: any, response: any): Promise<void> {
    try {
      const fullData = {
        ...logData,
        full_request: request,
        full_response: response
      };

      const key = `cub-api-logs/${new Date().toISOString().split('T')[0]}/${logData.trace_id}.json`;

      await s3.putObject({
        Bucket: 'rizzpay-secure-logs',
        Key: key,
        Body: JSON.stringify(fullData),
        ServerSideEncryption: 'AES256',
        ContentType: 'application/json'
      }).promise();
    } catch (error) {
      console.error('Failed to store transaction in S3:', error);
    }
  }

  /**
   * Send failed transactions to dead letter queue
   */
  async sendToDeadLetterQueue(request: any, response: any, error: string): Promise<void> {
    try {
      const message = {
        timestamp: new Date().toISOString(),
        request,
        response,
        error,
        retry_count: 3
      };

      await sqs.sendMessage({
        QueueUrl: process.env.CUB_DLQ_URL!,
        MessageBody: JSON.stringify(message)
      }).promise();

      console.log('Transaction sent to DLQ:', request.trace_id);
    } catch (error) {
      console.error('Failed to send to DLQ:', error);
    }
  }

  /**
   * Publish CloudWatch metrics
   */
  async publishMetrics(httpStatus: number, responseTime: number): Promise<void> {
    try {
      const isSuccess = httpStatus === 200 ? 1 : 0;
      const isError = httpStatus >= 400 ? 1 : 0;

      const params = {
        Namespace: 'RizzPay/CUB/API',
        MetricData: [
          {
            MetricName: 'ResponseTime',
            Value: responseTime,
            Unit: 'Milliseconds',
            Timestamp: new Date()
          },
          {
            MetricName: 'SuccessCount',
            Value: isSuccess,
            Unit: 'Count',
            Timestamp: new Date()
          },
          {
            MetricName: 'ErrorCount',
            Value: isError,
            Unit: 'Count',
            Timestamp: new Date()
          }
        ]
      };

      await cloudWatch.putMetricData(params).promise();
    } catch (error) {
      console.error('Failed to publish metrics:', error);
    }
  }

  /**
   * Check transaction status
   */
  async checkTransactionStatus(traceId: string): Promise<any> {
    try {
      const response = await this.makeApiCall('/status', { trace_id: traceId });
      return this.processApiResponse(response, traceId);
    } catch (error) {
      console.error('Status check failed:', error);
      throw error;
    }
  }
}

export default CUBApiService;