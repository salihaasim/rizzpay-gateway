
import { supabase } from '@/integrations/supabase/client';

export interface BulkOperation {
  merchant_id: string;
  operation_type: 'bulk_payout' | 'bulk_payment_links' | 'bulk_transaction_update';
  file_name?: string;
  file_path?: string;
  total_records: number;
  created_by: string;
  metadata?: any;
}

export class BulkOperationService {
  static async createBulkOperation(operationData: BulkOperation) {
    const { data, error } = await supabase
      .from('bulk_operations')
      .insert({
        ...operationData,
        result_summary: JSON.stringify({}),
        error_log: JSON.stringify([])
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating bulk operation:', error);
      throw error;
    }

    return data;
  }

  static async updateBulkOperationProgress(
    operationId: string, 
    processed: number, 
    successful: number, 
    failed: number,
    status?: string
  ) {
    const updateData: any = {
      processed_records: processed,
      successful_records: successful,
      failed_records: failed
    };

    if (status) {
      updateData.status = status;
      if (status === 'processing' && !updateData.started_at) {
        updateData.started_at = new Date().toISOString();
      } else if (status === 'completed' || status === 'failed') {
        updateData.completed_at = new Date().toISOString();
      }
    }

    const { data, error } = await supabase
      .from('bulk_operations')
      .update(updateData)
      .eq('id', operationId)
      .select()
      .single();

    if (error) {
      console.error('Error updating bulk operation:', error);
      throw error;
    }

    return data;
  }

  static async getMerchantBulkOperations(merchantId: string, limit: number = 20) {
    const { data, error } = await supabase
      .from('bulk_operations')
      .select('*')
      .eq('merchant_id', merchantId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching bulk operations:', error);
      throw error;
    }

    return data;
  }

  static async addErrorToOperation(operationId: string, errorData: any) {
    // First get current error log
    const { data: operation } = await supabase
      .from('bulk_operations')
      .select('error_log')
      .eq('id', operationId)
      .single();

    if (!operation) return;

    const currentErrors = JSON.parse(operation.error_log || '[]');
    currentErrors.push({
      ...errorData,
      timestamp: new Date().toISOString()
    });

    const { error } = await supabase
      .from('bulk_operations')
      .update({
        error_log: JSON.stringify(currentErrors)
      })
      .eq('id', operationId);

    if (error) {
      console.error('Error adding error to bulk operation:', error);
    }
  }
}
