
-- Notification related enums
CREATE TYPE admin_notification_type AS ENUM (
    'kyc_pending',
    'merchant_registration',
    'high_value_transaction',
    'suspicious_activity',
    'system_alert',
    'settlement_failed',
    'api_limit_exceeded',
    'security_breach'
);

CREATE TYPE notification_priority AS ENUM (
    'low',
    'normal',
    'high',
    'urgent'
);

CREATE TYPE audit_severity AS ENUM (
    'info',
    'warning', 
    'error',
    'critical'
);
