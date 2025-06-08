
import { supabase } from '@/integrations/supabase/client';

interface ReconciliationIssue {
  type: 'stuck_transaction' | 'delayed_payout' | 'missing_webhook' | 'duplicate_utr';
  transactionId?: string;
  payoutId?: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
}

export class ReconciliationService {
  static async runReconciliation() {
    console.log('Starting reconciliation process...', new Date().toISOString());
    
    const issues: ReconciliationIssue[] = [];

    try {
      // Check for stuck transactions (pending > 30 minutes)
      const stuckTransactions = await this.findStuckTransactions();
      issues.push(...stuckTransactions);

      // Check for delayed payouts (pending > 1 hour)
      const delayedPayouts = await this.findDelayedPayouts();
      issues.push(...delayedPayouts);

      // Check for missing webhooks (successful transactions without UTR)
      const missingWebhooks = await this.findMissingWebhooks();
      issues.push(...missingWebhooks);

      // Check for duplicate UTRs
      const duplicateUTRs = await this.findDuplicateUTRs();
      issues.push(...duplicateUTRs);

      // Log reconciliation results
      await this.logReconciliationResults(issues);

      // Send alerts for high severity issues
      if (issues.some(issue => issue.severity === 'high')) {
        await this.sendAlerts(issues.filter(issue => issue.severity === 'high'));
      }

      console.log(`Reconciliation completed. Found ${issues.length} issues.`);
      
      return {
        success: true,
        issuesFound: issues.length,
        issues: issues
      };
    } catch (error) {
      console.error('Reconciliation process failed:', error);
      
      await this.logReconciliationResults([], error.message);
      
      return {
        success: false,
        error: error.message
      };
    }
  }

  private static async findStuckTransactions(): Promise<ReconciliationIssue[]> {
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();
    
    const { data: stuckTxns, error } = await supabase
      .from('transactions')
      .select('id, date, status, amount, merchant_id')
      .eq('status', 'pending')
      .lt('date', thirtyMinutesAgo);

    if (error) {
      console.error('Error finding stuck transactions:', error);
      return [];
    }

    return stuckTxns.map(txn => ({
      type: 'stuck_transaction' as const,
      transactionId: txn.id,
      description: `Transaction ${txn.id} stuck in pending for >30 minutes (Amount: ₹${txn.amount})`,
      severity: 'medium' as const
    }));
  }

  private static async findDelayedPayouts(): Promise<ReconciliationIssue[]> {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    
    const { data: delayedPayouts, error } = await supabase
      .from('payout_requests')
      .select('id, created_at, status, amount, merchant_id')
      .eq('status', 'pending')
      .lt('created_at', oneHourAgo);

    if (error) {
      console.error('Error finding delayed payouts:', error);
      return [];
    }

    return delayedPayouts.map(payout => ({
      type: 'delayed_payout' as const,
      payoutId: payout.id,
      description: `Payout ${payout.id} pending for >1 hour (Amount: ₹${payout.amount})`,
      severity: 'high' as const
    }));
  }

  private static async findMissingWebhooks(): Promise<ReconciliationIssue[]> {
    const { data: successfulTxns, error } = await supabase
      .from('transactions')
      .select('id, payment_details, amount')
      .eq('status', 'successful')
      .is('payment_details->utr_number', null);

    if (error) {
      console.error('Error finding missing webhooks:', error);
      return [];
    }

    return successfulTxns.map(txn => ({
      type: 'missing_webhook' as const,
      transactionId: txn.id,
      description: `Successful transaction ${txn.id} missing UTR number (Amount: ₹${txn.amount})`,
      severity: 'medium' as const
    }));
  }

  private static async findDuplicateUTRs(): Promise<ReconciliationIssue[]> {
    // This would require a more complex query to find duplicate UTRs
    // For now, returning empty array
    return [];
  }

  private static async logReconciliationResults(issues: ReconciliationIssue[], error?: string) {
    try {
      await supabase
        .from('reconciliation_log')
        .insert({
          run_at: new Date().toISOString(),
          issues_found: issues.length,
          issues: issues,
          error_message: error,
          status: error ? 'failed' : 'completed'
        });
    } catch (logError) {
      console.error('Failed to log reconciliation results:', logError);
    }
  }

  private static async sendAlerts(highSeverityIssues: ReconciliationIssue[]) {
    // Placeholder for alert sending logic
    // Could integrate with Telegram, email, Slack, etc.
    console.log('HIGH SEVERITY ISSUES DETECTED:', highSeverityIssues);
    
    // Example: Send to admin webhook
    try {
      const alertMessage = `🚨 RizzPay Reconciliation Alert\n\nHigh severity issues detected:\n${
        highSeverityIssues.map(issue => `• ${issue.description}`).join('\n')
      }`;
      
      console.log('Alert would be sent:', alertMessage);
      // await sendTelegramAlert(alertMessage);
      // await sendEmailAlert(alertMessage);
    } catch (alertError) {
      console.error('Failed to send alerts:', alertError);
    }
  }
}

// CRON job setup (would be configured in the backend server)
export const setupReconciliationCron = () => {
  // Run every 5 minutes
  setInterval(async () => {
    await ReconciliationService.runReconciliation();
  }, 5 * 60 * 1000);
  
  console.log('Reconciliation CRON job setup - running every 5 minutes');
};
