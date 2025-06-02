
-- Merchant wallet management
CREATE TABLE IF NOT EXISTS merchant_wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID UNIQUE NOT NULL REFERENCES merchant_profiles(id),
    available_balance NUMERIC DEFAULT 0 CHECK (available_balance >= 0),
    pending_balance NUMERIC DEFAULT 0 CHECK (pending_balance >= 0),
    total_balance NUMERIC GENERATED ALWAYS AS (available_balance + pending_balance) STORED,
    currency TEXT NOT NULL DEFAULT 'INR',
    last_settlement_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    frozen_amount NUMERIC DEFAULT 0 CHECK (frozen_amount >= 0),
    is_frozen BOOLEAN DEFAULT false,
    freeze_reason TEXT,
    metadata JSONB DEFAULT '{}'
);

-- Wallet transactions for detailed tracking
CREATE TABLE IF NOT EXISTS wallet_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_id UUID NOT NULL REFERENCES merchant_wallets(id),
    transaction_type wallet_transaction_type NOT NULL,
    amount NUMERIC NOT NULL,
    balance_before NUMERIC NOT NULL,
    balance_after NUMERIC NOT NULL,
    reference_type TEXT,
    reference_id TEXT,
    description TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    processed_by UUID,
    status wallet_transaction_status DEFAULT 'completed'
);

-- Enable RLS on both tables
ALTER TABLE merchant_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX idx_merchant_wallets_merchant ON merchant_wallets(merchant_id);
CREATE INDEX idx_wallet_transactions_wallet ON wallet_transactions(wallet_id);
CREATE INDEX idx_wallet_transactions_type ON wallet_transactions(transaction_type);
CREATE INDEX idx_wallet_transactions_created_at ON wallet_transactions(created_at DESC);
CREATE INDEX idx_wallet_transactions_reference ON wallet_transactions(reference_type, reference_id);

-- Add triggers for updated_at
CREATE TRIGGER update_merchant_wallets_updated_at
    BEFORE UPDATE ON merchant_wallets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to update wallet balance
CREATE OR REPLACE FUNCTION update_wallet_balance(
    p_merchant_id UUID,
    p_amount NUMERIC,
    p_transaction_type wallet_transaction_type,
    p_reference_type TEXT DEFAULT NULL,
    p_reference_id TEXT DEFAULT NULL,
    p_description TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_wallet_id UUID;
    v_balance_before NUMERIC;
    v_balance_after NUMERIC;
    v_transaction_id UUID;
BEGIN
    -- Get wallet info
    SELECT id, available_balance INTO v_wallet_id, v_balance_before
    FROM merchant_wallets 
    WHERE merchant_id = p_merchant_id;
    
    IF v_wallet_id IS NULL THEN
        RAISE EXCEPTION 'Wallet not found for merchant %', p_merchant_id;
    END IF;
    
    -- Calculate new balance
    IF p_transaction_type IN ('credit', 'settlement') THEN
        v_balance_after := v_balance_before + p_amount;
    ELSE
        v_balance_after := v_balance_before - p_amount;
        IF v_balance_after < 0 THEN
            RAISE EXCEPTION 'Insufficient balance. Current: %, Required: %', v_balance_before, p_amount;
        END IF;
    END IF;
    
    -- Update wallet balance
    UPDATE merchant_wallets 
    SET available_balance = v_balance_after,
        updated_at = now()
    WHERE id = v_wallet_id;
    
    -- Create transaction record
    INSERT INTO wallet_transactions (
        wallet_id, transaction_type, amount, balance_before, balance_after,
        reference_type, reference_id, description
    ) VALUES (
        v_wallet_id, p_transaction_type, p_amount, v_balance_before, v_balance_after,
        p_reference_type, p_reference_id, p_description
    ) RETURNING id INTO v_transaction_id;
    
    RETURN v_transaction_id;
END;
$$;

-- Comments
COMMENT ON TABLE merchant_wallets IS 'Merchant wallet for managing available and pending balances';
COMMENT ON TABLE wallet_transactions IS 'Detailed transaction log for wallet operations';
COMMENT ON FUNCTION update_wallet_balance IS 'Safely update wallet balance with transaction logging';
