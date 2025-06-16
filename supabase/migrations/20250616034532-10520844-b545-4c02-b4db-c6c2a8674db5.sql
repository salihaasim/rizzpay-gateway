
-- Enhanced Transaction Management
CREATE TABLE IF NOT EXISTS webhook_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID REFERENCES merchants(id),
    webhook_type TEXT NOT NULL,
    endpoint_url TEXT NOT NULL,
    payload JSONB NOT NULL,
    response_status INTEGER,
    response_body TEXT,
    delivery_attempts INTEGER DEFAULT 1,
    last_attempt_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    successful BOOLEAN DEFAULT false,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS transaction_retries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id TEXT NOT NULL REFERENCES transactions(id),
    retry_type TEXT NOT NULL, -- 'webhook', 'processing', 'settlement'
    attempt_number INTEGER NOT NULL,
    max_attempts INTEGER DEFAULT 3,
    next_retry_at TIMESTAMP WITH TIME ZONE,
    retry_reason TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Wallet Management Enhancements
CREATE TABLE IF NOT EXISTS wallet_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID NOT NULL REFERENCES merchants(id),
    transaction_type TEXT NOT NULL, -- 'credit', 'debit', 'freeze', 'unfreeze'
    amount NUMERIC(15,2) NOT NULL,
    balance_before NUMERIC(15,2) NOT NULL,
    balance_after NUMERIC(15,2) NOT NULL,
    reference_type TEXT, -- 'transaction', 'payout', 'adjustment'
    reference_id TEXT,
    description TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_by UUID -- admin user id for manual adjustments
);

CREATE TABLE IF NOT EXISTS wallet_adjustments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID NOT NULL REFERENCES merchants(id),
    adjustment_type TEXT NOT NULL, -- 'manual_credit', 'manual_debit', 'refund', 'chargeback'
    amount NUMERIC(15,2) NOT NULL,
    reason TEXT NOT NULL,
    admin_id UUID NOT NULL,
    admin_notes TEXT,
    approval_status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    approved_by UUID,
    approved_at TIMESTAMP WITH TIME ZONE,
    wallet_transaction_id UUID REFERENCES wallet_transactions(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Reconciliation System Enhancement
CREATE TABLE IF NOT EXISTS reconciliation_matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reconciliation_log_id UUID NOT NULL REFERENCES reconciliation_logs(id),
    transaction_id TEXT REFERENCES transactions(id),
    bank_reference TEXT,
    utr_number TEXT,
    amount NUMERIC(15,2) NOT NULL,
    match_type TEXT NOT NULL, -- 'auto', 'manual', 'partial'
    match_confidence NUMERIC(3,2), -- 0.00 to 1.00
    matched_by UUID, -- admin user id for manual matches
    matched_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    metadata JSONB DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS reconciliation_discrepancies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reconciliation_log_id UUID NOT NULL REFERENCES reconciliation_logs(id),
    discrepancy_type TEXT NOT NULL, -- 'missing_transaction', 'extra_bank_entry', 'amount_mismatch'
    bank_reference TEXT,
    utr_number TEXT,
    expected_amount NUMERIC(15,2),
    actual_amount NUMERIC(15,2),
    description TEXT,
    resolution_status TEXT DEFAULT 'pending', -- 'pending', 'resolved', 'escalated'
    resolved_by UUID,
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolution_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Security and API Management
CREATE TABLE IF NOT EXISTS api_rate_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID REFERENCES merchants(id),
    endpoint_pattern TEXT NOT NULL,
    requests_per_minute INTEGER DEFAULT 60,
    requests_per_hour INTEGER DEFAULT 1000,
    requests_per_day INTEGER DEFAULT 10000,
    current_minute_count INTEGER DEFAULT 0,
    current_hour_count INTEGER DEFAULT 0,
    current_day_count INTEGER DEFAULT 0,
    last_reset_minute TIMESTAMP WITH TIME ZONE DEFAULT now(),
    last_reset_hour TIMESTAMP WITH TIME ZONE DEFAULT now(),
    last_reset_day TIMESTAMP WITH TIME ZONE DEFAULT now(),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS merchant_api_restrictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID NOT NULL REFERENCES merchants(id),
    restriction_type TEXT NOT NULL, -- 'ip_whitelist_only', 'webhook_whitelist_only', 'api_disabled'
    is_active BOOLEAN DEFAULT true,
    reason TEXT,
    applied_by UUID NOT NULL,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    expires_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}'
);

-- Core Missing Features
CREATE TABLE IF NOT EXISTS payment_links (
    id TEXT PRIMARY KEY,
    merchant_id UUID NOT NULL REFERENCES merchants(id),
    amount NUMERIC(15,2) NOT NULL,
    currency TEXT DEFAULT 'INR',
    description TEXT,
    customer_name TEXT,
    customer_email TEXT,
    customer_phone TEXT,
    payment_methods JSONB DEFAULT '["upi", "card", "netbanking"]',
    status TEXT DEFAULT 'active', -- 'active', 'expired', 'paid', 'cancelled'
    expires_at TIMESTAMP WITH TIME ZONE,
    redirect_url TEXT,
    webhook_url TEXT,
    paid_at TIMESTAMP WITH TIME ZONE,
    transaction_id TEXT REFERENCES transactions(id),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS bulk_operations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID NOT NULL REFERENCES merchants(id),
    operation_type TEXT NOT NULL, -- 'bulk_payout', 'bulk_payment_links', 'bulk_transaction_update'
    file_name TEXT,
    file_path TEXT,
    total_records INTEGER NOT NULL,
    processed_records INTEGER DEFAULT 0,
    successful_records INTEGER DEFAULT 0,
    failed_records INTEGER DEFAULT 0,
    status TEXT DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    error_log JSONB DEFAULT '[]',
    result_summary JSONB DEFAULT '{}',
    created_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS notification_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_type TEXT NOT NULL, -- 'merchant', 'admin', 'customer'
    recipient_id UUID,
    notification_type TEXT NOT NULL, -- 'email', 'sms', 'webhook', 'in_app'
    subject TEXT,
    message TEXT NOT NULL,
    destination TEXT, -- email/phone/webhook_url
    status TEXT DEFAULT 'pending', -- 'pending', 'sent', 'failed', 'cancelled'
    priority INTEGER DEFAULT 1, -- 1=high, 2=medium, 3=low
    scheduled_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    sent_at TIMESTAMP WITH TIME ZONE,
    delivery_attempts INTEGER DEFAULT 0,
    max_attempts INTEGER DEFAULT 3,
    error_message TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enhanced indexes for better performance
CREATE INDEX IF NOT EXISTS idx_webhook_logs_merchant_type ON webhook_logs(merchant_id, webhook_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_delivery ON webhook_logs(successful, last_attempt_at) WHERE NOT successful;

CREATE INDEX IF NOT EXISTS idx_transaction_retries_next_retry ON transaction_retries(next_retry_at) WHERE next_retry_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_transaction_retries_transaction ON transaction_retries(transaction_id, retry_type);

CREATE INDEX IF NOT EXISTS idx_wallet_transactions_merchant ON wallet_transactions(merchant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_reference ON wallet_transactions(reference_type, reference_id);

CREATE INDEX IF NOT EXISTS idx_reconciliation_matches_log ON reconciliation_matches(reconciliation_log_id);
CREATE INDEX IF NOT EXISTS idx_reconciliation_matches_transaction ON reconciliation_matches(transaction_id);

CREATE INDEX IF NOT EXISTS idx_api_rate_limits_merchant ON api_rate_limits(merchant_id, endpoint_pattern);
CREATE INDEX IF NOT EXISTS idx_api_rate_limits_active ON api_rate_limits(is_active, last_reset_minute) WHERE is_active;

CREATE INDEX IF NOT EXISTS idx_payment_links_merchant ON payment_links(merchant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payment_links_status ON payment_links(status, expires_at);

CREATE INDEX IF NOT EXISTS idx_bulk_operations_merchant ON bulk_operations(merchant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bulk_operations_status ON bulk_operations(status, started_at);

CREATE INDEX IF NOT EXISTS idx_notification_queue_status ON notification_queue(status, scheduled_at);
CREATE INDEX IF NOT EXISTS idx_notification_queue_recipient ON notification_queue(recipient_type, recipient_id);

-- Enhanced API request logs indexing
CREATE INDEX IF NOT EXISTS idx_api_request_logs_merchant_endpoint ON api_request_logs(merchant_id, endpoint_url, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_api_request_logs_response_status ON api_request_logs(response_status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_api_request_logs_error ON api_request_logs(error_code, created_at DESC) WHERE error_code IS NOT NULL;

-- Add triggers for updated_at columns on new tables
CREATE TRIGGER update_wallet_adjustments_updated_at
    BEFORE UPDATE ON wallet_adjustments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE webhook_logs IS 'General webhook delivery logs for all webhook types';
COMMENT ON TABLE transaction_retries IS 'Retry mechanism tracking for failed transactions and webhooks';
COMMENT ON TABLE wallet_transactions IS 'Detailed wallet transaction history for merchants';
COMMENT ON TABLE wallet_adjustments IS 'Manual wallet adjustments and administrative actions';
COMMENT ON TABLE reconciliation_matches IS 'Detailed records of transaction-to-bank reconciliation matches';
COMMENT ON TABLE reconciliation_discrepancies IS 'Unmatched items requiring manual review during reconciliation';
COMMENT ON TABLE api_rate_limits IS 'Rate limiting configuration and tracking per merchant';
COMMENT ON TABLE merchant_api_restrictions IS 'API access restrictions and security controls';
COMMENT ON TABLE payment_links IS 'Shareable payment links for customer payments';
COMMENT ON TABLE bulk_operations IS 'Bulk operation tracking for file uploads and batch processing';
COMMENT ON TABLE notification_queue IS 'Queued notifications for email, SMS, and webhook delivery';
