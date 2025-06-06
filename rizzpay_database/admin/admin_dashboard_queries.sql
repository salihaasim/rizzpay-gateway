
-- Admin Dashboard Queries for Complete Transaction Oversight

-- Get all transactions across all merchants (admin only)
CREATE OR REPLACE FUNCTION get_all_transactions_admin(
    p_limit INTEGER DEFAULT 100,
    p_offset INTEGER DEFAULT 0,
    p_merchant_id UUID DEFAULT NULL,
    p_status TEXT DEFAULT NULL,
    p_date_from TIMESTAMP DEFAULT NULL,
    p_date_to TIMESTAMP DEFAULT NULL
)
RETURNS TABLE (
    transaction_id TEXT,
    merchant_name TEXT,
    customer_name TEXT,
    amount NUMERIC,
    fees_charged NUMERIC,
    net_amount NUMERIC,
    status TEXT,
    flow_state transaction_flow_state,
    payment_method TEXT,
    created_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Check if user is admin
    IF NOT is_rizz_admin() THEN
        RAISE EXCEPTION 'Access denied. Admin privileges required.';
    END IF;
    
    -- Log the access
    PERFORM log_admin_access('QUERY_ALL_TRANSACTIONS', 'rizz_transactions');
    
    RETURN QUERY
    SELECT 
        t.id,
        m.business_name,
        t.customer_name,
        t.amount,
        t.fees_charged,
        t.net_amount,
        t.status,
        t.flow_state,
        t.payment_method,
        t.created_at,
        t.completed_at
    FROM rizz_transactions t
    JOIN rizz_merchant_accounts m ON t.merchant_id = m.id
    WHERE 
        (p_merchant_id IS NULL OR t.merchant_id = p_merchant_id)
        AND (p_status IS NULL OR t.status = p_status)
        AND (p_date_from IS NULL OR t.created_at >= p_date_from)
        AND (p_date_to IS NULL OR t.created_at <= p_date_to)
    ORDER BY t.created_at DESC
    LIMIT p_limit OFFSET p_offset;
END;
$$;

-- Get merchant ledger summary (admin only)
CREATE OR REPLACE FUNCTION get_merchant_ledger_summary_admin(p_merchant_id UUID)
RETURNS TABLE (
    account_type account_type,
    total_credits NUMERIC,
    total_debits NUMERIC,
    current_balance NUMERIC,
    last_activity TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Check if user is admin
    IF NOT is_rizz_admin() THEN
        RAISE EXCEPTION 'Access denied. Admin privileges required.';
    END IF;
    
    -- Log the access
    PERFORM log_admin_access('QUERY_MERCHANT_LEDGER', 'rizz_ledger_entries', p_merchant_id);
    
    RETURN QUERY
    SELECT 
        le.account_type,
        COALESCE(SUM(CASE WHEN le.entry_type = 'credit' THEN le.amount ELSE 0 END), 0) as total_credits,
        COALESCE(SUM(CASE WHEN le.entry_type = 'debit' THEN le.amount ELSE 0 END), 0) as total_debits,
        ab.available_balance,
        MAX(le.created_at) as last_activity
    FROM rizz_ledger_entries le
    LEFT JOIN rizz_account_balances ab ON le.merchant_id = ab.merchant_id AND le.account_type = ab.account_type
    WHERE le.merchant_id = p_merchant_id
    AND le.is_reversal = false
    GROUP BY le.account_type, ab.available_balance;
END;
$$;

-- Get platform-wide statistics (admin only)
CREATE OR REPLACE FUNCTION get_platform_statistics_admin()
RETURNS TABLE (
    total_merchants INTEGER,
    active_merchants INTEGER,
    total_transactions BIGINT,
    total_volume NUMERIC,
    total_fees_collected NUMERIC,
    avg_transaction_amount NUMERIC,
    today_transactions BIGINT,
    today_volume NUMERIC,
    success_rate NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Check if user is admin
    IF NOT is_rizz_admin() THEN
        RAISE EXCEPTION 'Access denied. Admin privileges required.';
    END IF;
    
    -- Log the access
    PERFORM log_admin_access('QUERY_PLATFORM_STATS');
    
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*)::INTEGER FROM rizz_merchant_accounts) as total_merchants,
        (SELECT COUNT(*)::INTEGER FROM rizz_merchant_accounts WHERE status = 'active') as active_merchants,
        (SELECT COUNT(*) FROM rizz_transactions) as total_transactions,
        (SELECT COALESCE(SUM(amount), 0) FROM rizz_transactions WHERE status = 'completed') as total_volume,
        (SELECT COALESCE(SUM(fees_charged), 0) FROM rizz_transactions WHERE status = 'completed') as total_fees_collected,
        (SELECT COALESCE(AVG(amount), 0) FROM rizz_transactions WHERE status = 'completed') as avg_transaction_amount,
        (SELECT COUNT(*) FROM rizz_transactions WHERE DATE(created_at) = CURRENT_DATE) as today_transactions,
        (SELECT COALESCE(SUM(amount), 0) FROM rizz_transactions WHERE DATE(created_at) = CURRENT_DATE) as today_volume,
        (SELECT 
            CASE 
                WHEN COUNT(*) = 0 THEN 0 
                ELSE ROUND((COUNT(CASE WHEN status = 'completed' THEN 1 END)::NUMERIC / COUNT(*)::NUMERIC) * 100, 2)
            END
         FROM rizz_transactions 
         WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
        ) as success_rate;
END;
$$;

-- Get merchant risk analysis (admin only)
CREATE OR REPLACE FUNCTION get_merchant_risk_analysis_admin(p_merchant_id UUID)
RETURNS TABLE (
    merchant_id UUID,
    business_name TEXT,
    total_volume NUMERIC,
    transaction_count BIGINT,
    failure_rate NUMERIC,
    avg_transaction_amount NUMERIC,
    large_transaction_count BIGINT,
    risk_score INTEGER,
    last_activity TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Check if user is admin
    IF NOT is_rizz_admin() THEN
        RAISE EXCEPTION 'Access denied. Admin privileges required.';
    END IF;
    
    -- Log the access
    PERFORM log_admin_access('QUERY_RISK_ANALYSIS', 'rizz_transactions', p_merchant_id);
    
    RETURN QUERY
    SELECT 
        m.id,
        m.business_name,
        COALESCE(SUM(t.amount), 0) as total_volume,
        COUNT(t.id) as transaction_count,
        CASE 
            WHEN COUNT(t.id) = 0 THEN 0 
            ELSE ROUND((COUNT(CASE WHEN t.status = 'failed' THEN 1 END)::NUMERIC / COUNT(t.id)::NUMERIC) * 100, 2)
        END as failure_rate,
        COALESCE(AVG(t.amount), 0) as avg_transaction_amount,
        COUNT(CASE WHEN t.amount > 10000 THEN 1 END) as large_transaction_count,
        m.risk_score,
        m.last_activity_at
    FROM rizz_merchant_accounts m
    LEFT JOIN rizz_transactions t ON m.id = t.merchant_id
    WHERE m.id = p_merchant_id
    GROUP BY m.id, m.business_name, m.risk_score, m.last_activity_at;
END;
$$;

-- Get transaction flow analysis (admin only)
CREATE OR REPLACE FUNCTION get_transaction_flow_analysis_admin(
    p_date_from TIMESTAMP DEFAULT CURRENT_DATE - INTERVAL '30 days',
    p_date_to TIMESTAMP DEFAULT CURRENT_DATE + INTERVAL '1 day'
)
RETURNS TABLE (
    flow_state transaction_flow_state,
    transaction_count BIGINT,
    total_amount NUMERIC,
    avg_processing_time INTERVAL
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Check if user is admin
    IF NOT is_rizz_admin() THEN
        RAISE EXCEPTION 'Access denied. Admin privileges required.';
    END IF;
    
    -- Log the access
    PERFORM log_admin_access('QUERY_FLOW_ANALYSIS', 'rizz_transactions');
    
    RETURN QUERY
    SELECT 
        t.flow_state,
        COUNT(*) as transaction_count,
        SUM(t.amount) as total_amount,
        AVG(CASE 
            WHEN t.completed_at IS NOT NULL THEN t.completed_at - t.initiated_at
            ELSE NULL
        END) as avg_processing_time
    FROM rizz_transactions t
    WHERE t.created_at BETWEEN p_date_from AND p_date_to
    GROUP BY t.flow_state
    ORDER BY transaction_count DESC;
END;
$$;

