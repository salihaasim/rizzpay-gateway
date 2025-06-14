
-- Add VPA fields to merchant_profiles table
ALTER TABLE merchant_profiles 
ADD COLUMN merchant_vpa TEXT UNIQUE,
ADD COLUMN vpa_status TEXT DEFAULT 'pending',
ADD COLUMN vpa_created_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN qr_code_url TEXT;

-- Create VPA mappings table for better tracking
CREATE TABLE vpa_mappings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID NOT NULL REFERENCES merchant_profiles(id),
    vpa_address TEXT NOT NULL UNIQUE,
    bank_provider TEXT NOT NULL DEFAULT 'sbm',
    status TEXT NOT NULL DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    deactivated_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}'
);

-- Add VPA field to transactions table
ALTER TABLE transactions 
ADD COLUMN assigned_vpa TEXT,
ADD COLUMN vpa_payment_ref TEXT,
ADD COLUMN payment_source TEXT DEFAULT 'api';

-- Create VPA payment logs table
CREATE TABLE vpa_payment_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vpa_address TEXT NOT NULL,
    transaction_ref TEXT,
    amount NUMERIC NOT NULL,
    sender_vpa TEXT,
    bank_reference TEXT,
    webhook_payload JSONB,
    processing_status TEXT DEFAULT 'received',
    merchant_id UUID,
    matched_transaction_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    processed_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for performance
CREATE INDEX idx_vpa_mappings_merchant ON vpa_mappings(merchant_id);
CREATE INDEX idx_vpa_mappings_address ON vpa_mappings(vpa_address);
CREATE INDEX idx_vpa_payment_logs_vpa ON vpa_payment_logs(vpa_address);
CREATE INDEX idx_vpa_payment_logs_ref ON vpa_payment_logs(transaction_ref);
CREATE INDEX idx_transactions_vpa ON transactions(assigned_vpa) WHERE assigned_vpa IS NOT NULL;

-- Add comments
COMMENT ON TABLE vpa_mappings IS 'Maps merchant accounts to their assigned VPA addresses';
COMMENT ON TABLE vpa_payment_logs IS 'Logs all incoming VPA payments for processing and reconciliation';
COMMENT ON COLUMN merchant_profiles.merchant_vpa IS 'Unique VPA address assigned to merchant';
COMMENT ON COLUMN merchant_profiles.vpa_status IS 'Status of VPA: pending, active, suspended, deactivated';
