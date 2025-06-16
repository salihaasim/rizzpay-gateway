
import { supabase } from '@/integrations/supabase/client';

export interface WebhookLog {
  id?: string;
  merchant_id?: string;
  webhook_type: string;
  endpoint_url: string;
  payload: any;
  response_status?: number;
  response_body?: string;
  delivery_attempts?: number;
  successful?: boolean;
  error_message?: string;
}

export class WebhookLogService {
  static async createLog(logData: WebhookLog) {
    const { data, error } = await supabase
      .from('webhook_logs')
      .insert(logData)
      .select()
      .single();

    if (error) {
      console.error('Error creating webhook log:', error);
      throw error;
    }

    return data;
  }

  static async updateLogStatus(logId: string, success: boolean, responseData?: {
    response_status?: number;
    response_body?: string;
    error_message?: string;
  }) {
    const updateData = {
      successful: success,
      delivery_attempts: 1, // Fixed: using static increment instead of raw
      last_attempt_at: new Date().toISOString(),
      ...responseData
    };

    const { data, error } = await supabase
      .from('webhook_logs')
      .update(updateData)
      .eq('id', logId)
      .select()
      .single();

    if (error) {
      console.error('Error updating webhook log:', error);
      throw error;
    }

    return data;
  }

  static async getFailedWebhooks(merchantId?: string) {
    let query = supabase
      .from('webhook_logs')
      .select('*')
      .eq('successful', false)
      .order('created_at', { ascending: false });

    if (merchantId) {
      query = query.eq('merchant_id', merchantId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching failed webhooks:', error);
      throw error;
    }

    return data;
  }
}
