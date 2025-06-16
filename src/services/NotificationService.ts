
import { supabase } from '@/integrations/supabase/client';

export interface Notification {
  recipient_type: 'merchant' | 'admin' | 'customer';
  recipient_id?: string;
  notification_type: 'email' | 'sms' | 'webhook' | 'in_app';
  subject?: string;
  message: string;
  destination?: string;
  priority?: number;
  scheduled_at?: string;
  metadata?: any;
}

export class NotificationService {
  static async queueNotification(notificationData: Notification) {
    const { data, error } = await supabase
      .from('notification_queue')
      .insert({
        ...notificationData,
        metadata: JSON.stringify(notificationData.metadata || {})
      })
      .select()
      .single();

    if (error) {
      console.error('Error queuing notification:', error);
      throw error;
    }

    return data;
  }

  static async getPendingNotifications(limit: number = 100) {
    const { data, error } = await supabase
      .from('notification_queue')
      .select('*')
      .eq('status', 'pending')
      .lte('scheduled_at', new Date().toISOString())
      .order('priority', { ascending: true })
      .order('scheduled_at', { ascending: true })
      .limit(limit);

    if (error) {
      console.error('Error fetching pending notifications:', error);
      throw error;
    }

    return data;
  }

  static async updateNotificationStatus(notificationId: string, status: 'sent' | 'failed' | 'cancelled', errorMessage?: string) {
    const updateData: any = {
      status,
      delivery_attempts: supabase.raw('delivery_attempts + 1')
    };

    if (status === 'sent') {
      updateData.sent_at = new Date().toISOString();
    } else if (status === 'failed' && errorMessage) {
      updateData.error_message = errorMessage;
    }

    const { data, error } = await supabase
      .from('notification_queue')
      .update(updateData)
      .eq('id', notificationId)
      .select()
      .single();

    if (error) {
      console.error('Error updating notification status:', error);
      throw error;
    }

    return data;
  }

  static async queueTransactionNotification(merchantId: string, transactionId: string, status: string) {
    return await this.queueNotification({
      recipient_type: 'merchant',
      recipient_id: merchantId,
      notification_type: 'in_app',
      subject: 'Transaction Update',
      message: `Transaction ${transactionId} is now ${status}`,
      priority: status === 'successful' ? 1 : 2,
      metadata: { transaction_id: transactionId, transaction_status: status }
    });
  }
}
