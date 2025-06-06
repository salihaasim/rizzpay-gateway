
-- Enhanced Security Policies and Encryption

-- Enable RLS on audit tables
ALTER TABLE rizz_activity_audit ENABLE ROW LEVEL SECURITY;
ALTER TABLE rizz_admin_access_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE rizz_settlements ENABLE ROW LEVEL SECURITY;

-- Audit table policies - only admins can view
CREATE POLICY "Admin only audit access" ON rizz_activity_audit
  FOR SELECT USING (is_rizz_admin());

CREATE POLICY "Admin only access logs" ON rizz_admin_access_logs
  FOR SELECT USING (is_rizz_admin());

CREATE POLICY "Admin only settlements" ON rizz_settlements
  FOR ALL USING (is_rizz_admin());

-- Function to log admin access
CREATE OR REPLACE FUNCTION log_admin_access(
    p_action_type TEXT,
    p_table_accessed TEXT DEFAULT NULL,
    p_merchant_id UUID DEFAULT NULL,
    p_transaction_id TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO rizz_admin_access_logs (
        admin_id, action_type, table_accessed, merchant_id, 
        transaction_id, ip_address, access_time
    ) VALUES (
        auth.uid(), p_action_type, p_table_accessed, p_merchant_id,
        p_transaction_id, inet_client_addr(), now()
    );
END;
$$;

-- Trigger to auto-log admin access to sensitive tables
CREATE OR REPLACE FUNCTION audit_admin_access()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Only log if current user is admin
    IF is_rizz_admin() THEN
        PERFORM log_admin_access(
            TG_OP,
            TG_TABLE_NAME,
            CASE 
                WHEN TG_TABLE_NAME = 'rizz_transactions' THEN NEW.merchant_id
                WHEN TG_TABLE_NAME = 'rizz_ledger_entries' THEN NEW.merchant_id
                ELSE NULL
            END,
            CASE 
                WHEN TG_TABLE_NAME = 'rizz_transactions' THEN NEW.id
                WHEN TG_TABLE_NAME = 'rizz_ledger_entries' THEN NEW.transaction_id
                ELSE NULL
            END
        );
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$;

-- Apply audit trigger to sensitive tables
CREATE TRIGGER audit_transactions_access
    AFTER SELECT ON rizz_transactions
    FOR EACH STATEMENT
    EXECUTE FUNCTION audit_admin_access();

CREATE TRIGGER audit_ledger_access
    AFTER SELECT ON rizz_ledger_entries
    FOR EACH STATEMENT
    EXECUTE FUNCTION audit_admin_access();

-- Function to encrypt sensitive data
CREATE OR REPLACE FUNCTION encrypt_sensitive_data(p_data TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Use pgcrypto to encrypt sensitive data
    RETURN encode(encrypt(p_data::bytea, 'rizz_encryption_key', 'aes'), 'base64');
END;
$$;

-- Function to decrypt sensitive data
CREATE OR REPLACE FUNCTION decrypt_sensitive_data(p_encrypted_data TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Decrypt data
    RETURN convert_from(decrypt(decode(p_encrypted_data, 'base64'), 'rizz_encryption_key', 'aes'), 'UTF8');
EXCEPTION
    WHEN OTHERS THEN
        RETURN NULL; -- Return NULL if decryption fails
END;
$$;

-- Function to mask sensitive data for display
CREATE OR REPLACE FUNCTION mask_sensitive_data(p_data TEXT, p_visible_chars INTEGER DEFAULT 4)
RETURNS TEXT
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
    IF p_data IS NULL OR length(p_data) <= p_visible_chars THEN
        RETURN p_data;
    END IF;
    
    RETURN left(p_data, p_visible_chars) || repeat('*', length(p_data) - p_visible_chars);
END;
$$;

-- Create materialized view for admin dashboard (refreshed hourly)
CREATE MATERIALIZED VIEW rizz_admin_dashboard_stats AS
SELECT 
    DATE(created_at) as transaction_date,
    COUNT(*) as total_transactions,
    SUM(amount) as total_volume,
    COUNT(DISTINCT merchant_id) as active_merchants,
    AVG(amount) as avg_transaction_amount,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as successful_transactions,
    COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_transactions,
    SUM(fees_charged) as total_fees_collected
FROM rizz_transactions
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY transaction_date DESC;

-- Create index on materialized view
CREATE INDEX idx_admin_dashboard_stats_date ON rizz_admin_dashboard_stats(transaction_date);

-- Function to refresh admin dashboard stats
CREATE OR REPLACE FUNCTION refresh_admin_dashboard_stats()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY rizz_admin_dashboard_stats;
END;
$$;

-- Schedule automatic refresh (requires pg_cron extension)
-- SELECT cron.schedule('refresh-admin-stats', '0 * * * *', 'SELECT refresh_admin_dashboard_stats();');

