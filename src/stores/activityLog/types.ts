
export type ActivityType = 
  | 'payment_in' 
  | 'payment_out'
  | 'escrow_created'
  | 'escrow_released'
  | 'merchant_created'
  | 'merchant_updated'
  | 'wallet_deposit'
  | 'wallet_withdrawal'
  | 'security_setting_changed'
  | 'admin_login'
  | 'merchant_login';

export interface ActivityLog {
  id: string;
  timestamp: string;
  activityType: ActivityType;
  userId: string | null;
  userEmail: string | null;
  details: {
    amount?: string;
    transactionId?: string;
    description?: string;
    [key: string]: any;
  };
  metadata?: Record<string, any>;
}

export interface ActivityLogStore {
  logs: ActivityLog[];
  addActivityLog: (activity: Omit<ActivityLog, 'id' | 'timestamp'>) => void;
  clearLogs: () => void;
}
