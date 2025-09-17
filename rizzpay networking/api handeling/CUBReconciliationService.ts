import AWS from 'aws-sdk';
import { CUBApiService } from './CUBApiService';

// AWS Services
const cloudWatch = new AWS.CloudWatch();
const sns = new AWS.SNS();

export class CUBReconciliationService {
  private cubApiService: CUBApiService;
  private cloudWatch: AWS.CloudWatch;
  private sns: AWS.SNS;

  constructor() {
    this.cubApiService = new CUBApiService();
    this.cloudWatch = new AWS.CloudWatch();
    this.sns = new AWS.SNS();
  }

  /**
   * Daily reconciliation process
   */
  async performDailyReconciliation(date: string): Promise<ReconciliationReport> {
    try {
      console.log(`Starting daily reconciliation for ${date}`);

      // 1. Fetch RizzPay transactions for the date
      const rizzpayTransactions = await this.getRizzpayTransactions(date);
      console.log(`Found ${rizzpayTransactions.length} RizzPay transactions`);

      // 2. Fetch CUB MIS/Settlement report
      const cubReport = await this.fetchCubMisReport(date);
      console.log(`Found ${cubReport.length} CUB transactions`);

      // 3. Perform reconciliation
      const reconciliationResult = this.reconcileTransactions(rizzpayTransactions, cubReport);

      // 4. Handle mismatches
      await this.processMismatches(reconciliationResult.mismatches);

      // 5. Generate and store report
      const report = await this.generateReconciliationReport(date, reconciliationResult);

      // 6. Send notifications if needed
      await this.sendReconciliationNotifications(report);

      console.log(`Reconciliation completed for ${date}`);
      return report;

    } catch (error) {
      console.error(`Reconciliation failed for ${date}:`, error);
      await this.handleReconciliationError(date, error);
      throw error;
    }
  }

  /**
   * Fetch RizzPay transactions for a specific date
   */
  async getRizzpayTransactions(date: string): Promise<RizzpayTransaction[]> {
    // Implementation would fetch from your database
    // This is a placeholder for the actual implementation
    
    const query = `
      SELECT 
        id,
        trace_id,
        utr_number,
        amount,
        from_account,
        to_account,
        beneficiary_name,
        ifsc_code,
        status,
        created_at,
        updated_at,
        bank_reference_id
      FROM payouts 
      WHERE DATE(created_at) = $1 
        AND bank_code = 'cub'
        AND status IN ('SUCCESS', 'FAILED')
      ORDER BY created_at
    `;

    // Placeholder - replace with actual database call
    return [];
  }

  /**
   * Fetch CUB MIS/Settlement report
   */
  async fetchCubMisReport(date: string): Promise<CubTransaction[]> {
    try {
      // This would typically be an API call to CUB's MIS system
      // or processing a file downloaded from their portal
      
      const response = await this.cubApiService.makeApiCall('/mis/report', {
        date: date,
        format: 'json'
      });

      return response.data.transactions || [];
    } catch (error) {
      console.error('Failed to fetch CUB MIS report:', error);
      throw error;
    }
  }

  /**
   * Reconcile RizzPay transactions with CUB report
   */
  reconcileTransactions(
    rizzpayTxns: RizzpayTransaction[], 
    cubTxns: CubTransaction[]
  ): ReconciliationResult {
    
    const matched: MatchedTransaction[] = [];
    const rizzpayUnmatched: RizzpayTransaction[] = [];
    const cubUnmatched: CubTransaction[] = [];
    const mismatches: MismatchedTransaction[] = [];

    // Create lookup maps for efficient matching
    const cubTxnMap = new Map<string, CubTransaction>();
    cubTxns.forEach(txn => {
      if (txn.utr_number) {
        cubTxnMap.set(txn.utr_number, txn);
      }
    });

    // Process each RizzPay transaction
    for (const rizzpayTxn of rizzpayTxns) {
      if (!rizzpayTxn.utr_number) {
        rizzpayUnmatched.push(rizzpayTxn);
        continue;
      }

      const cubTxn = cubTxnMap.get(rizzpayTxn.utr_number);
      
      if (!cubTxn) {
        rizzpayUnmatched.push(rizzpayTxn);
        continue;
      }

      // Check for mismatches
      const mismatchedFields = this.findMismatchedFields(rizzpayTxn, cubTxn);
      
      if (mismatchedFields.length > 0) {
        mismatches.push({
          rizzpay_transaction: rizzpayTxn,
          cub_transaction: cubTxn,
          mismatched_fields: mismatchedFields
        });
      } else {
        matched.push({
          rizzpay_transaction: rizzpayTxn,
          cub_transaction: cubTxn
        });
      }

      // Remove from CUB map to find unmatched CUB transactions
      cubTxnMap.delete(rizzpayTxn.utr_number);
    }

    // Remaining CUB transactions are unmatched
    cubUnmatched.push(...Array.from(cubTxnMap.values()));

    return {
      matched,
      rizzpay_unmatched: rizzpayUnmatched,
      cub_unmatched: cubUnmatched,
      mismatches,
      summary: {
        total_rizzpay: rizzpayTxns.length,
        total_cub: cubTxns.length,
        matched_count: matched.length,
        rizzpay_unmatched_count: rizzpayUnmatched.length,
        cub_unmatched_count: cubUnmatched.length,
        mismatch_count: mismatches.length
      }
    };
  }

  /**
   * Find mismatched fields between RizzPay and CUB transactions
   */
  findMismatchedFields(rizzpayTxn: RizzpayTransaction, cubTxn: CubTransaction): string[] {
    const mismatches: string[] = [];

    // Amount comparison (with tolerance for decimal precision)
    const amountDiff = Math.abs(parseFloat(rizzpayTxn.amount) - parseFloat(cubTxn.amount));
    if (amountDiff > 0.01) {
      mismatches.push('amount');
    }

    // Status comparison
    const statusMapping: Record<string, string> = {
      'SUCCESS': 'COMPLETED',
      'FAILED': 'FAILED',
      'PENDING': 'IN_PROGRESS'
    };

    if (statusMapping[rizzpayTxn.status] !== cubTxn.status) {
      mismatches.push('status');
    }

    // Account number comparison
    if (rizzpayTxn.to_account !== cubTxn.beneficiary_account) {
      mismatches.push('beneficiary_account');
    }

    // IFSC code comparison
    if (rizzpayTxn.ifsc_code !== cubTxn.ifsc_code) {
      mismatches.push('ifsc_code');
    }

    return mismatches;
  }

  /**
   * Process mismatched transactions
   */
  async processMismatches(mismatches: MismatchedTransaction[]): Promise<void> {
    for (const mismatch of mismatches) {
      try {
        // Mark for manual review in database
        await this.markForManualReview(mismatch);

        // Log the mismatch
        console.log('Transaction mismatch detected:', {
          trace_id: mismatch.rizzpay_transaction.trace_id,
          utr_number: mismatch.rizzpay_transaction.utr_number,
          mismatched_fields: mismatch.mismatched_fields
        });

        // Create CloudWatch custom metric
        await this.publishMismatchMetric(mismatch);

      } catch (error) {
        console.error('Failed to process mismatch:', error);
      }
    }
  }

  /**
   * Mark transaction for manual review
   */
  async markForManualReview(mismatch: MismatchedTransaction): Promise<void> {
    // Implementation would update database record
    // This is a placeholder for the actual implementation
    
    const updateQuery = `
      UPDATE payouts 
      SET 
        reconciliation_status = 'MANUAL_REVIEW',
        reconciliation_notes = $1,
        updated_at = NOW()
      WHERE trace_id = $2
    `;

    const notes = JSON.stringify({
      mismatched_fields: mismatch.mismatched_fields,
      cub_data: mismatch.cub_transaction,
      review_date: new Date().toISOString()
    });

    // Placeholder - replace with actual database call
    console.log('Marking for manual review:', mismatch.rizzpay_transaction.trace_id);
  }

  /**
   * Generate comprehensive reconciliation report
   */
  async generateReconciliationReport(
    date: string, 
    result: ReconciliationResult
  ): Promise<ReconciliationReport> {
    
    const report: ReconciliationReport = {
      date,
      timestamp: new Date().toISOString(),
      summary: result.summary,
      matched_transactions: result.matched,
      mismatched_transactions: result.mismatches,
      rizzpay_unmatched: result.rizzpay_unmatched,
      cub_unmatched: result.cub_unmatched,
      total_rizzpay_amount: this.calculateTotalAmount(
        result.matched.map(m => m.rizzpay_transaction)
          .concat(result.rizzpay_unmatched)
          .concat(result.mismatches.map(m => m.rizzpay_transaction))
      ),
      total_cub_amount: this.calculateTotalAmount(
        result.matched.map(m => m.cub_transaction)
          .concat(result.cub_unmatched)
          .concat(result.mismatches.map(m => m.cub_transaction))
      ),
      reconciliation_percentage: (result.summary.matched_count / result.summary.total_rizzpay) * 100
    };

    // Store report in database and S3
    await this.storeReconciliationReport(report);

    return report;
  }

  /**
   * Calculate total amount from transactions
   */
  calculateTotalAmount(transactions: Array<{ amount: string }>): number {
    return transactions.reduce((total, txn) => total + parseFloat(txn.amount), 0);
  }

  /**
   * Store reconciliation report
   */
  async storeReconciliationReport(report: ReconciliationReport): Promise<void> {
    try {
      // Store in S3 for long-term storage
      const s3 = new AWS.S3();
      await s3.putObject({
        Bucket: 'rizzpay-reconciliation-reports',
        Key: `${report.date}/reconciliation-report.json`,
        Body: JSON.stringify(report, null, 2),
        ContentType: 'application/json',
        ServerSideEncryption: 'AES256'
      }).promise();

      // Store summary in database
      const summaryQuery = `
        INSERT INTO reconciliation_reports (
          date, total_rizzpay, total_cub, matched_count, 
          mismatch_count, reconciliation_percentage, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, NOW())
      `;

      // Placeholder - replace with actual database call
      console.log('Reconciliation report stored for:', report.date);

    } catch (error) {
      console.error('Failed to store reconciliation report:', error);
      throw error;
    }
  }

  /**
   * Send reconciliation notifications
   */
  async sendReconciliationNotifications(report: ReconciliationReport): Promise<void> {
    try {
      // Send notification if reconciliation percentage is below threshold
      if (report.reconciliation_percentage < 98) {
        await this.sendLowReconciliationAlert(report);
      }

      // Send notification if there are many mismatches
      if (report.summary.mismatch_count > 10) {
        await this.sendHighMismatchAlert(report);
      }

      // Daily summary notification
      await this.sendDailySummary(report);

    } catch (error) {
      console.error('Failed to send reconciliation notifications:', error);
    }
  }

  /**
   * Publish mismatch metric to CloudWatch
   */
  async publishMismatchMetric(mismatch: MismatchedTransaction): Promise<void> {
    try {
      await this.cloudWatch.putMetricData({
        Namespace: 'RizzPay/Reconciliation',
        MetricData: [
          {
            MetricName: 'TransactionMismatch',
            Value: 1,
            Unit: 'Count',
            Dimensions: [
              {
                Name: 'MismatchType',
                Value: mismatch.mismatched_fields.join(',')
              }
            ],
            Timestamp: new Date()
          }
        ]
      }).promise();
    } catch (error) {
      console.error('Failed to publish mismatch metric:', error);
    }
  }

  /**
   * Handle reconciliation errors
   */
  async handleReconciliationError(date: string, error: any): Promise<void> {
    try {
      // Log error
      console.error(`Reconciliation error for ${date}:`, error);

      // Send alert to operations team
      await this.sns.publish({
        TopicArn: process.env.RECONCILIATION_ERROR_TOPIC_ARN,
        Subject: `Reconciliation Failed - ${date}`,
        Message: JSON.stringify({
          date,
          error: error.message,
          timestamp: new Date().toISOString()
        })
      }).promise();

      // Store error in database for tracking
      // Implementation would update error tracking table

    } catch (notificationError) {
      console.error('Failed to handle reconciliation error:', notificationError);
    }
  }

  private async sendLowReconciliationAlert(report: ReconciliationReport): Promise<void> {
    // Implementation for low reconciliation percentage alert
  }

  private async sendHighMismatchAlert(report: ReconciliationReport): Promise<void> {
    // Implementation for high mismatch count alert
  }

  private async sendDailySummary(report: ReconciliationReport): Promise<void> {
    // Implementation for daily summary notification
  }
}

// Type definitions
interface RizzpayTransaction {
  id: string;
  trace_id: string;
  utr_number?: string;
  amount: string;
  from_account: string;
  to_account: string;
  beneficiary_name: string;
  ifsc_code: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  created_at: string;
  updated_at: string;
  bank_reference_id?: string;
}

interface CubTransaction {
  utr_number: string;
  amount: string;
  beneficiary_account: string;
  beneficiary_name: string;
  ifsc_code: string;
  status: 'COMPLETED' | 'FAILED' | 'IN_PROGRESS';
  transaction_date: string;
  settlement_date?: string;
  reference_id: string;
}

interface MatchedTransaction {
  rizzpay_transaction: RizzpayTransaction;
  cub_transaction: CubTransaction;
}

interface MismatchedTransaction {
  rizzpay_transaction: RizzpayTransaction;
  cub_transaction: CubTransaction;
  mismatched_fields: string[];
}

interface ReconciliationResult {
  matched: MatchedTransaction[];
  rizzpay_unmatched: RizzpayTransaction[];
  cub_unmatched: CubTransaction[];
  mismatches: MismatchedTransaction[];
  summary: {
    total_rizzpay: number;
    total_cub: number;
    matched_count: number;
    rizzpay_unmatched_count: number;
    cub_unmatched_count: number;
    mismatch_count: number;
  };
}

interface ReconciliationReport {
  date: string;
  timestamp: string;
  summary: ReconciliationResult['summary'];
  matched_transactions: MatchedTransaction[];
  mismatched_transactions: MismatchedTransaction[];
  rizzpay_unmatched: RizzpayTransaction[];
  cub_unmatched: CubTransaction[];
  total_rizzpay_amount: number;
  total_cub_amount: number;
  reconciliation_percentage: number;
}

export default CUBReconciliationService;