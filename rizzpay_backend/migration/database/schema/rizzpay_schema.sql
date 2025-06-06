
-- RizzPay Database Schema for AWS RDS PostgreSQL
-- Generated for migration from Supabase to AWS
-- Version: 1.0
-- Date: 2025-01-06

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types/enums
CREATE TYPE merchant_verification_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE bank_transaction_status AS ENUM ('pending', 'completed', 'failed', 'cancelled');
CREATE TYPE fund_transfer_status AS ENUM ('queued', 'processing', 'completed', 'failed', 'cancelled');
CREATE TYPE user_role_type AS ENUM ('admin', 'merchant', 'support');
CREATE TYPE http_method_type AS ENUM ('GET', 'POST', 'PUT', 'DELETE', 'PATCH');
CREATE TYPE transfer_mode_type AS ENUM ('NEFT', 'RTGS', 'IMPS', 'UPI');

-- Merchants table
CREATE TABLE merchants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    business_name TEXT NOT NULL,
    business_type TEXT,
    api_key TEXT DEFAULT gen_random_uuid()::text,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Merchant profiles table (extended merchant information)
CREATE TABLE merchant_profiles (
    id UUID PRIMARY KEY REFERENCES merchants(id) ON DELETE CASCADE,
    business_name TEXT NOT NULL,
    business_type TEXT NOT NULL,
    business_address TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    contact_phone TEXT NOT NULL,
    gst_number TEXT,
    pan_number TEXT NOT NULL,
    verification_status merchant_verification_status DEFAULT 'pending',
    is_active BOOLEAN DEFAULT false,
    api_key TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User roles table
CREATE TABLE user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    role user_role_type NOT NULL
);

-- Transactions table
CREATE TABLE transactions (
    id TEXT PRIMARY KEY,
    merchant_id UUID REFERENCES merchants(id),
    amount NUMERIC(12,2) NOT NULL,
    currency TEXT DEFAULT 'INR',
    status TEXT NOT NULL,
    payment_method TEXT NOT NULL,
    customer_name TEXT,
    customer_email TEXT,
    description TEXT,
    payment_details JSONB,
    processing_state TEXT,
    processing_timeline JSONB,
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Merchant accounts (bank account details)
CREATE TABLE merchant_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID NOT NULL REFERENCES merchants(id),
    account_holder_name TEXT NOT NULL,
    account_number TEXT NOT NULL,
    ifsc_code TEXT NOT NULL,
    bank_name TEXT NOT NULL,
    branch_name TEXT,
    account_type TEXT DEFAULT 'current',
    is_verified BOOLEAN DEFAULT false,
    is_primary BOOLEAN DEFAULT false,
    verification_method TEXT,
    verification_date TIMESTAMP WITH TIME ZONE,
    verification_details JSONB,
    daily_limit NUMERIC,
    monthly_limit NUMERIC,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payout requests table
CREATE TABLE payout_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID NOT NULL REFERENCES merchants(id),
    amount NUMERIC(12,2) NOT NULL,
    currency TEXT DEFAULT 'INR',
    payout_method TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    description TEXT,
    beneficiary_name TEXT,
    account_number TEXT,
    ifsc_code TEXT,
    bank_name TEXT,
    upi_id TEXT,
    processing_fee NUMERIC(12,2) DEFAULT 0,
    gst_amount NUMERIC(12,2) DEFAULT 0,
    net_amount NUMERIC(12,2),
    priority INTEGER DEFAULT 1,
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    bank_reference_id TEXT,
    utr_number TEXT,
    failure_reason TEXT,
    internal_notes TEXT,
    webhook_data JSONB,
    processing_started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    failed_at TIMESTAMP WITH TIME ZONE,
    next_retry_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bank transactions table
CREATE TABLE bank_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id TEXT NOT NULL,
    merchant_id UUID NOT NULL REFERENCES merchants(id),
    customer_name TEXT NOT NULL,
    customer_email TEXT,
    customer_phone TEXT,
    amount NUMERIC(12,2) NOT NULL,
    currency TEXT DEFAULT 'INR',
    transaction_type bank_transaction_status NOT NULL,
    status bank_transaction_status DEFAULT 'pending',
    utr_number TEXT,
    bank_reference_number TEXT,
    remitter_account TEXT,
    remitter_ifsc TEXT,
    beneficiary_account TEXT,
    beneficiary_ifsc TEXT,
    remarks TEXT,
    bank_charges NUMERIC(12,2) DEFAULT 0,
    gst_amount NUMERIC(12,2) DEFAULT 0,
    net_amount NUMERIC(12,2),
    bank_response JSONB,
    transaction_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    settlement_date TIMESTAMP WITH TIME ZONE,
    webhook_received_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Merchant payout settings
CREATE TABLE merchant_payout_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID NOT NULL REFERENCES merchants(id),
    auto_payout_enabled BOOLEAN DEFAULT false,
    auto_payout_threshold NUMERIC(12,2) DEFAULT 1000,
    auto_payout_schedule TEXT DEFAULT 'daily',
    preferred_payout_method TEXT DEFAULT 'bank_transfer',
    daily_limit NUMERIC(12,2) DEFAULT 100000,
    monthly_limit NUMERIC(12,2) DEFAULT 1000000,
    webhook_url TEXT,
    webhook_secret TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payout ledger (for tracking balance changes)
CREATE TABLE payout_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID NOT NULL REFERENCES merchants(id),
    payout_request_id UUID NOT NULL REFERENCES payout_requests(id),
    transaction_type TEXT NOT NULL,
    amount NUMERIC(12,2) NOT NULL,
    balance_before NUMERIC(12,2) NOT NULL,
    balance_after NUMERIC(12,2) NOT NULL,
    reference_id TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fund transfer jobs (for bulk processing)
CREATE TABLE fund_transfer_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id TEXT NOT NULL,
    merchant_id UUID NOT NULL REFERENCES merchants(id),
    transaction_id UUID REFERENCES payout_requests(id),
    beneficiary_name TEXT NOT NULL,
    beneficiary_account TEXT NOT NULL,
    beneficiary_ifsc TEXT NOT NULL,
    payout_amount NUMERIC(12,2) NOT NULL,
    transfer_mode transfer_mode_type NOT NULL,
    status fund_transfer_status DEFAULT 'queued',
    priority INTEGER DEFAULT 1,
    scheduled_at TIMESTAMP WITH TIME ZONE,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    failed_at TIMESTAMP WITH TIME ZONE,
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    bank_reference TEXT,
    failure_reason TEXT,
    charges_applied NUMERIC(12,2) DEFAULT 0,
    final_amount NUMERIC(12,2),
    webhook_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- KYC submissions
CREATE TABLE kyc_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    status TEXT DEFAULT 'pending',
    aadhaar_document_path TEXT,
    pan_document_path TEXT,
    gst_number TEXT,
    gst_document_path TEXT,
    notes TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Merchant documents
CREATE TABLE merchant_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID REFERENCES merchants(id),
    document_type TEXT NOT NULL,
    document_url TEXT NOT NULL,
    status merchant_verification_status DEFAULT 'pending',
    verification_notes TEXT,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    verified_at TIMESTAMP WITH TIME ZONE
);

-- IP whitelist
CREATE TABLE ip_whitelist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID NOT NULL REFERENCES merchants(id),
    ip_address INET NOT NULL,
    status TEXT DEFAULT 'active',
    created_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Webhook whitelist
CREATE TABLE webhook_whitelist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID NOT NULL REFERENCES merchants(id),
    domain TEXT NOT NULL,
    status TEXT DEFAULT 'active',
    created_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bulk upload files
CREATE TABLE bulk_upload_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID REFERENCES merchants(id),
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    file_checksum TEXT NOT NULL,
    upload_method TEXT DEFAULT 'sftp',
    processing_status TEXT DEFAULT 'uploaded',
    total_records INTEGER,
    processed_records INTEGER DEFAULT 0,
    successful_records INTEGER DEFAULT 0,
    failed_records INTEGER DEFAULT 0,
    validation_errors JSONB,
    error_log JSONB,
    bank_batch_id TEXT,
    settlement_file_generated BOOLEAN DEFAULT false,
    settlement_file_path TEXT,
    processing_started_at TIMESTAMP WITH TIME ZONE,
    processing_completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- API request logs
CREATE TABLE api_request_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id TEXT NOT NULL,
    merchant_id UUID REFERENCES merchants(id),
    endpoint_url TEXT NOT NULL,
    http_method http_method_type NOT NULL,
    ip_address INET,
    user_agent TEXT,
    request_headers JSONB,
    request_body JSONB,
    response_status INTEGER,
    response_headers JSONB,
    response_body JSONB,
    response_time_ms INTEGER,
    bank_api_endpoint TEXT,
    bank_request_id TEXT,
    error_code TEXT,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- UTR logs (for tracking bank UTR numbers)
CREATE TABLE utr_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    utr_number TEXT NOT NULL,
    webhook_source TEXT NOT NULL,
    webhook_payload JSONB NOT NULL,
    webhook_signature TEXT,
    processing_status TEXT DEFAULT 'received',
    bank_transaction_id UUID REFERENCES bank_transactions(id),
    duplicate_check BOOLEAN DEFAULT false,
    error_message TEXT,
    received_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payout webhooks
CREATE TABLE payout_webhooks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payout_request_id UUID NOT NULL REFERENCES payout_requests(id),
    webhook_type TEXT NOT NULL,
    payload JSONB NOT NULL,
    response_body TEXT,
    response_code INTEGER,
    delivered BOOLEAN DEFAULT false,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_transactions_merchant_id ON transactions(merchant_id);
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_payout_requests_merchant_id ON payout_requests(merchant_id);
CREATE INDEX idx_payout_requests_status ON payout_requests(status);
CREATE INDEX idx_bank_transactions_merchant_id ON bank_transactions(merchant_id);
CREATE INDEX idx_bank_transactions_utr ON bank_transactions(utr_number);
CREATE INDEX idx_api_request_logs_merchant_id ON api_request_logs(merchant_id);
CREATE INDEX idx_api_request_logs_created_at ON api_request_logs(created_at);

-- Create triggers for updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_merchant_accounts_updated_at 
    BEFORE UPDATE ON merchant_accounts 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payout_requests_updated_at 
    BEFORE UPDATE ON payout_requests 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bank_transactions_updated_at 
    BEFORE UPDATE ON bank_transactions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_merchant_payout_settings_updated_at 
    BEFORE UPDATE ON merchant_payout_settings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fund_transfer_jobs_updated_at 
    BEFORE UPDATE ON fund_transfer_jobs 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_kyc_submissions_updated_at 
    BEFORE UPDATE ON kyc_submissions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ip_whitelist_updated_at 
    BEFORE UPDATE ON ip_whitelist 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_webhook_whitelist_updated_at 
    BEFORE UPDATE ON webhook_whitelist 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bulk_upload_files_updated_at 
    BEFORE UPDATE ON bulk_upload_files 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create business logic functions
CREATE OR REPLACE FUNCTION get_merchant_wallet_balance(merchant_uuid UUID)
RETURNS NUMERIC AS $$
DECLARE
    balance NUMERIC := 0;
BEGIN
    -- Calculate balance from transactions
    SELECT COALESCE(SUM(amount), 0) INTO balance
    FROM transactions 
    WHERE merchant_id = merchant_uuid 
    AND status = 'successful';
    
    -- Subtract completed payouts
    SELECT balance - COALESCE(SUM(amount), 0) INTO balance
    FROM payout_requests 
    WHERE merchant_id = merchant_uuid 
    AND status = 'completed';
    
    RETURN GREATEST(balance, 0);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION calculate_payout_net_amount(
    gross_amount NUMERIC, 
    processing_fee NUMERIC DEFAULT 0, 
    gst_rate NUMERIC DEFAULT 0.18
)
RETURNS NUMERIC AS $$
BEGIN
    RETURN gross_amount - processing_fee - (processing_fee * gst_rate);
END;
$$ LANGUAGE plpgsql;

-- Insert initial data (optional)
-- You can add any default data here if needed

-- Grant permissions (adjust as needed for your environment)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO rizzpay_admin;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO rizzpay_admin;

COMMENT ON DATABASE postgres IS 'RizzPay Production Database - Migrated from Supabase';
