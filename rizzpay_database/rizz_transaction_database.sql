
-- RizzPay Comprehensive Transaction Database
-- Admin-Only Access with Merchant Ledger Logic
-- Version: 1.0
-- Date: 2025-01-06

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- Create custom types for the transaction system
CREATE TYPE admin_permission_level AS ENUM ('super_admin', 'finance_admin', 'support_admin', 'read_only_admin');
CREATE TYPE ledger_entry_type AS ENUM ('debit', 'credit');
CREATE TYPE transaction_category AS ENUM ('payment', 'payout', 'fee', 'refund', 'adjustment', 'settlement');
CREATE TYPE account_type AS ENUM ('merchant_wallet', 'settlement_account', 'fee_account', 'refund_account');
CREATE TYPE transaction_flow_state AS ENUM ('initiated', 'processing', 'gateway_sent', 'bank_processing', 'completed', 'failed', 'cancelled');

-- ================================
-- ADMIN ACCESS CONTROL TABLES
-- ================================

-- Admin users with strong permissions
CREATE TABLE rizz_admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    permission_level admin_permission_level NOT NULL DEFAULT 'read_only_admin',
    is_active BOOLEAN DEFAULT true,
    can_view_all_transactions BOOLEAN DEFAULT false,
    can_modify_ledger BOOLEAN DEFAULT false,
    can_access_merchant_data BOOLEAN DEFAULT false,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_by UUID REFERENCES rizz_admin_users(id),
    session_token TEXT,
    mfa_enabled BOOLEAN DEFAULT false
);

-- Admin access logs for audit trail
CREATE TABLE rizz_admin_access_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID NOT NULL REFERENCES rizz_admin_users(id),
    action_type TEXT NOT NULL,
    table_accessed TEXT,
    merchant_id UUID,
    transaction_id TEXT,
    ip_address INET NOT NULL,
    user_agent TEXT,
    query_executed TEXT,
    access_time TIMESTAMP WITH TIME ZONE DEFAULT now(),
    session_id TEXT
);

-- ================================
-- MERCHANT ACCOUNT SYSTEM
-- ================================

-- Enhanced merchant accounts with ledger setup
CREATE TABLE rizz_merchant_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID UNIQUE NOT NULL,
    business_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'closed')),
    kyc_status TEXT DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'approved', 'rejected')),
    account_opened_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    last_activity_at TIMESTAMP WITH TIME ZONE,
    risk_score INTEGER DEFAULT 0 CHECK (risk_score >= 0 AND risk_score <= 100),
    daily_limit NUMERIC(15,2) DEFAULT 100000,
    monthly_limit NUMERIC(15,2) DEFAULT 1000000,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Account balances for each merchant (real-time balances)
CREATE TABLE rizz_account_balances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID NOT NULL REFERENCES rizz_merchant_accounts(id),
    account_type account_type NOT NULL,
    currency TEXT NOT NULL DEFAULT 'INR',
    available_balance NUMERIC(15,2) DEFAULT 0 CHECK (available_balance >= 0),
    pending_balance NUMERIC(15,2) DEFAULT 0 CHECK (pending_balance >= 0),
    total_balance NUMERIC(15,2) GENERATED ALWAYS AS (available_balance + pending_balance) STORED,
    reserved_balance NUMERIC(15,2) DEFAULT 0 CHECK (reserved_balance >= 0),
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(merchant_id, account_type, currency)
);

-- ================================
-- COMPREHENSIVE TRANSACTION SYSTEM
-- ================================

-- Main transactions table with full audit
CREATE TABLE rizz_transactions (
    id TEXT PRIMARY KEY,
    merchant_id UUID NOT NULL REFERENCES rizz_merchant_accounts(id),
    customer_name TEXT,
    customer_email TEXT,
    customer_phone TEXT,
    amount NUMERIC(15,2) NOT NULL CHECK (amount > 0),
    currency TEXT NOT NULL DEFAULT 'INR',
    payment_method TEXT NOT NULL,
    category transaction_category NOT NULL DEFAULT 'payment',
    status TEXT NOT NULL,
    flow_state transaction_flow_state NOT NULL DEFAULT 'initiated',
    gateway_reference TEXT,
    bank_reference TEXT,
    utr_number TEXT,
    description TEXT,
    metadata JSONB DEFAULT '{}',
    fees_charged NUMERIC(15,2) DEFAULT 0,
    net_amount NUMERIC(15,2) GENERATED ALWAYS AS (amount - fees_charged) STORED,
    settlement_date TIMESTAMP WITH TIME ZONE,
    initiated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    completed_at TIMESTAMP WITH TIME ZONE,
    failed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_by TEXT DEFAULT 'system',
    ip_address INET,
    device_fingerprint TEXT
);

-- Transaction state changes for audit trail
CREATE TABLE rizz_transaction_states (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id TEXT NOT NULL REFERENCES rizz_transactions(id),
    from_state transaction_flow_state,
    to_state transaction_flow_state NOT NULL,
    reason TEXT,
    changed_by TEXT DEFAULT 'system',
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    additional_data JSONB DEFAULT '{}'
);

-- ================================
-- DOUBLE-ENTRY LEDGER SYSTEM
-- ================================

-- Ledger entries for double-entry bookkeeping
CREATE TABLE rizz_ledger_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID NOT NULL REFERENCES rizz_merchant_accounts(id),
    transaction_id TEXT REFERENCES rizz_transactions(id),
    account_type account_type NOT NULL,
    entry_type ledger_entry_type NOT NULL,
    amount NUMERIC(15,2) NOT NULL CHECK (amount > 0),
    currency TEXT NOT NULL DEFAULT 'INR',
    balance_before NUMERIC(15,2) NOT NULL,
    balance_after NUMERIC(15,2) NOT NULL,
    reference_id TEXT,
    description TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_by TEXT DEFAULT 'system',
    is_reversal BOOLEAN DEFAULT false,
    reversal_of UUID REFERENCES rizz_ledger_entries(id)
);

-- Ledger balance verification table
CREATE TABLE rizz_ledger_checkpoints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID NOT NULL REFERENCES rizz_merchant_accounts(id),
    account_type account_type NOT NULL,
    checkpoint_date DATE NOT NULL,
    calculated_balance NUMERIC(15,2) NOT NULL,
    recorded_balance NUMERIC(15,2) NOT NULL,
    variance NUMERIC(15,2) GENERATED ALWAYS AS (calculated_balance - recorded_balance) STORED,
    is_reconciled BOOLEAN DEFAULT false,
    reconciled_by UUID REFERENCES rizz_admin_users(id),
    reconciled_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(merchant_id, account_type, checkpoint_date)
);

-- ================================
-- SETTLEMENT AND PAYOUT TRACKING
-- ================================

-- Settlement records for bank transfers
CREATE TABLE rizz_settlements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID NOT NULL REFERENCES rizz_merchant_accounts(id),
    settlement_batch_id TEXT NOT NULL,
    total_amount NUMERIC(15,2) NOT NULL,
    fee_amount NUMERIC(15,2) DEFAULT 0,
    net_amount NUMERIC(15,2) GENERATED ALWAYS AS (total_amount - fee_amount) STORED,
    transaction_count INTEGER NOT NULL,
    bank_account_id TEXT NOT NULL,
    utr_reference TEXT,
    settlement_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    failure_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    processed_by UUID REFERENCES rizz_admin_users(id)
);

-- Settlement transaction mapping
CREATE TABLE rizz_settlement_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    settlement_id UUID NOT NULL REFERENCES rizz_settlements(id),
    transaction_id TEXT NOT NULL REFERENCES rizz_transactions(id),
    amount_settled NUMERIC(15,2) NOT NULL,
    fee_deducted NUMERIC(15,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(settlement_id, transaction_id)
);

-- ================================
-- COMPREHENSIVE AUDIT SYSTEM
-- ================================

-- All database activities audit
CREATE TABLE rizz_activity_audit (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name TEXT NOT NULL,
    operation TEXT NOT NULL CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE')),
    record_id TEXT NOT NULL,
    old_values JSONB,
    new_values JSONB,
    changed_by TEXT NOT NULL,
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    client_ip INET,
    session_id TEXT,
    merchant_id UUID,
    admin_id UUID REFERENCES rizz_admin_users(id)
);

-- Performance monitoring for queries
CREATE TABLE rizz_query_performance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    query_type TEXT NOT NULL,
    execution_time_ms INTEGER NOT NULL,
    rows_affected INTEGER,
    merchant_id UUID,
    admin_id UUID REFERENCES rizz_admin_users(id),
    executed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    query_hash TEXT
);

-- ================================
-- INDEXES FOR PERFORMANCE
-- ================================

-- Transaction indexes
CREATE INDEX idx_rizz_transactions_merchant_date ON rizz_transactions(merchant_id, created_at DESC);
CREATE INDEX idx_rizz_transactions_status ON rizz_transactions(status, flow_state);
CREATE INDEX idx_rizz_transactions_payment_method ON rizz_transactions(payment_method, created_at DESC);
CREATE INDEX idx_rizz_transactions_amount ON rizz_transactions(amount, currency);
CREATE INDEX idx_rizz_transactions_utr ON rizz_transactions(utr_number) WHERE utr_number IS NOT NULL;

-- Ledger indexes
CREATE INDEX idx_rizz_ledger_merchant_account ON rizz_ledger_entries(merchant_id, account_type, created_at DESC);
CREATE INDEX idx_rizz_ledger_transaction ON rizz_ledger_entries(transaction_id);
CREATE INDEX idx_rizz_ledger_reference ON rizz_ledger_entries(reference_id) WHERE reference_id IS NOT NULL;

-- Balance indexes
CREATE INDEX idx_rizz_balances_merchant ON rizz_account_balances(merchant_id, account_type);

-- Audit indexes
CREATE INDEX idx_rizz_audit_table_record ON rizz_activity_audit(table_name, record_id);
CREATE INDEX idx_rizz_audit_merchant ON rizz_activity_audit(merchant_id, changed_at DESC);
CREATE INDEX idx_rizz_audit_admin ON rizz_activity_audit(admin_id, changed_at DESC);

-- Admin access indexes
CREATE INDEX idx_rizz_admin_access_merchant ON rizz_admin_access_logs(merchant_id, access_time DESC);
CREATE INDEX idx_rizz_admin_access_admin ON rizz_admin_access_logs(admin_id, access_time DESC);

-- ================================
-- TRIGGERS FOR AUTOMATION
-- ================================

-- Update timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to relevant tables
CREATE TRIGGER update_rizz_admin_users_updated_at BEFORE UPDATE ON rizz_admin_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rizz_merchant_accounts_updated_at BEFORE UPDATE ON rizz_merchant_accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rizz_transactions_updated_at BEFORE UPDATE ON rizz_transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Comments for documentation
COMMENT ON DATABASE postgres IS 'RizzPay Comprehensive Transaction Database with Admin Controls and Ledger Logic';
COMMENT ON TABLE rizz_admin_users IS 'Admin users with granular permissions for transaction access';
COMMENT ON TABLE rizz_transactions IS 'Complete transaction records with full audit trail';
COMMENT ON TABLE rizz_ledger_entries IS 'Double-entry ledger for merchant account management';
COMMENT ON TABLE rizz_account_balances IS 'Real-time merchant account balances';
COMMENT ON TABLE rizz_activity_audit IS 'Comprehensive audit trail for all database operations';

