
import { supabase } from '../config/supabase';
import { EnhancedBankIntegrationService } from './EnhancedBankIntegrationService';
import { PayoutService } from './PayoutService';

interface QueuedPayout {
  id: string;
  merchant_id: string;
  amount: number;
  priority: number;
  payout_method: string;
  status: string;
  retry_count: number;
  max_retries: number;
}

export class PayoutQueueService {
  private static isProcessing = false;
  private static processingInterval: NodeJS.Timeout | null = null;

  static startProcessing() {
    if (this.isProcessing) return;
    
    this.isProcessing = true;
    console.log('Starting payout queue processing...');
    
    // Process queue every 30 seconds
    this.processingInterval = setInterval(() => {
      this.processQueue();
    }, 30000);
    
    // Process immediately
    this.processQueue();
  }

  static stopProcessing() {
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
      this.processingInterval = null;
    }
    this.isProcessing = false;
    console.log('Stopped payout queue processing');
  }

  static async processQueue() {
    try {
      console.log('Processing payout queue...');
      
      // Get pending payouts ordered by priority and creation time
      const { data: pendingPayouts, error } = await supabase
        .from('payout_requests')
        .select('*')
        .eq('status', 'pending')
        .order('priority', { ascending: false })
        .order('created_at', { ascending: true })
        .limit(10);

      if (error) throw error;

      if (!pendingPayouts || pendingPayouts.length === 0) {
        console.log('No pending payouts to process');
        return;
      }

      console.log(`Processing ${pendingPayouts.length} pending payouts`);

      // Process each payout
      for (const payout of pendingPayouts) {
        await this.processSinglePayout(payout as QueuedPayout);
        
        // Add small delay between processing
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

    } catch (error) {
      console.error('Error processing payout queue:', error);
    }
  }

  private static async processSinglePayout(payout: QueuedPayout) {
    try {
      console.log(`Processing payout: ${payout.id}`);
      
      // Select best bank for this payout
      const selectedBank = this.selectOptimalBank(payout);
      
      // Initiate payout via bank integration
      const result = await EnhancedBankIntegrationService.initiatePayout(payout, selectedBank);
      
      if (result.success) {
        console.log(`Payout ${payout.id} initiated successfully via ${selectedBank}`);
      } else {
        console.error(`Payout ${payout.id} failed:`, result.message);
        
        // Handle retry logic
        await this.handlePayoutRetry(payout, result.message);
      }

    } catch (error) {
      console.error(`Error processing payout ${payout.id}:`, error);
      await this.handlePayoutRetry(payout, (error as Error).message);
    }
  }

  private static selectOptimalBank(payout: QueuedPayout): string {
    // Bank selection logic based on:
    // - Amount limits
    // - Processing time
    // - Success rates
    // - Cost optimization
    
    if (payout.amount >= 500000) {
      return 'icici'; // Higher limits
    } else if (payout.amount >= 100000) {
      return 'hdfc'; // Good for medium amounts
    } else {
      return 'sbm'; // Best for small amounts
    }
  }

  private static async handlePayoutRetry(payout: QueuedPayout, errorMessage: string) {
    try {
      if (payout.retry_count >= payout.max_retries) {
        // Mark as failed permanently
        await PayoutService.updatePayoutStatus(payout.id, 'failed', {
          failure_reason: `Max retries exceeded: ${errorMessage}`,
          failed_at: new Date().toISOString()
        });
        console.log(`Payout ${payout.id} marked as permanently failed`);
      } else {
        // Schedule retry with exponential backoff
        const retryDelay = Math.pow(2, payout.retry_count) * 60 * 1000; // Minutes in ms
        const nextRetryAt = new Date(Date.now() + retryDelay);
        
        await supabase
          .from('payout_requests')
          .update({
            retry_count: payout.retry_count + 1,
            next_retry_at: nextRetryAt.toISOString(),
            failure_reason: errorMessage,
            updated_at: new Date().toISOString()
          })
          .eq('id', payout.id);
        
        console.log(`Payout ${payout.id} scheduled for retry at ${nextRetryAt.toISOString()}`);
      }
    } catch (error) {
      console.error(`Error handling retry for payout ${payout.id}:`, error);
    }
  }

  static async getQueueStatus() {
    try {
      const { data: stats, error } = await supabase
        .from('payout_requests')
        .select('status')
        .in('status', ['pending', 'processing', 'failed']);

      if (error) throw error;

      const statusCounts = stats.reduce((acc, item) => {
        acc[item.status] = (acc[item.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        pending: statusCounts.pending || 0,
        processing: statusCounts.processing || 0,
        failed: statusCounts.failed || 0,
        isProcessing: this.isProcessing
      };
    } catch (error) {
      console.error('Error getting queue status:', error);
      return { pending: 0, processing: 0, failed: 0, isProcessing: false };
    }
  }
}
