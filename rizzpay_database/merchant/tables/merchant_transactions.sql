
-- Enhanced transactions table for merchants
CREATE TABLE IF NOT EXISTS merchant_transactions (
    id TEXT PRIMARY KEY,
    merchant_id UUID NOT NULL REFERENCES merchant_profiles(id),
    customer_name TEXT,
    customer_email TEXT,
    customer_phone TEXT,
    amount NUMERIC NOT NULL CHECK (amount > 0),
    currency TEXT NOT NULL DEFAULT 'INR',
    payment_method payment_method_type NOT NULL,
    status transaction_status NOT NULL,
    processing_state processing_state DEFAULT 'initiated',
    description TEXT,
    reference_id TEXT,
    external_reference TEXT,
    payment_details JSONB DEFAULT '{}',
    processing_timeline JSONB DEFAULT '[]',
    fees JSONB DEFAULT '{}',
    settlement_id UUID,
    settled_at TIMESTAMP WITH TIME ZONE,
    failed_reason TEXT,
    retry_count INTEGER DEFAULT 0,
    webhook_attempts INTEGER DEFAULT 0,
    last_webhook_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    expires_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}'
);

-- Enable RLS
ALTER TABLE merchant_transactions ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX idx_merchant_transactions_merchant ON merchant_transactions(merchant_id);
CREATE INDEX idx_merchant_transactions_status ON merchant_transactions(status);
CREATE INDEX idx_merchant_transactions_payment_method ON merchant_transactions(payment_method);
CREATE INDEX idx_merchant_transactions_created_at ON merchant_transactions(created_at DESC);
CREATE INDEX idx_merchant_transactions_settlement ON merchant_transactions(settlement_id) WHERE settlement_id IS NOT NULL;
CREATE INDEX idx_merchant_transactions_reference ON merchant_transactions(reference_id) WHERE reference_id IS NOT NULL;

-- Partial indexes for active transactions
CREATE INDEX idx_merchant_transactions_pending ON merchant_transactions(merchant_id, created_at) 
WHERE status IN ('pending', 'processing');

-- Add trigger for updated_at
CREATE TRIGGER update_merchant_transactions_updated_at
    BEFORE UPDATE ON merchant_transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Comments
COMMENT ON TABLE merchant_transactions IS 'All payment transactions for merchants';
COMMENT ON COLUMN merchant_transactions.processing_timeline IS 'Array of processing stages with timestamps';
COMMENT ON COLUMN merchant_transactions.fees IS 'Fee breakdown including platform fees, gateway fees, etc.';
COMMENT ON COLUMN merchant_transactions.webhook_attempts IS 'Number of webhook delivery attempts';
