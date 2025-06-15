
-- Create merchant_ledger table for double-entry accounting (if not present)
CREATE TABLE IF NOT EXISTS public.merchant_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID NOT NULL REFERENCES merchants(id),
  transaction_id TEXT, -- Reference to payin, payout etc. (optional in some adjustments)
  entry_type TEXT NOT NULL CHECK (entry_type IN ('credit', 'debit')),
  amount NUMERIC(16,2) NOT NULL CHECK (amount > 0),
  source TEXT NOT NULL, -- 'payin', 'payout', 'adjustment', etc.
  balance_after NUMERIC(16,2) NOT NULL, -- Balance after this entry
  description TEXT,
  metadata JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Index for fast lookup
CREATE INDEX IF NOT EXISTS idx_ledger_merchant_date ON public.merchant_ledger(merchant_id, created_at DESC);

-- Example function to get current merchant balance (summation through ledger entries, can be updated later if needed)
CREATE OR REPLACE FUNCTION public.get_merchant_ledger_balance(p_merchant_id UUID)
RETURNS NUMERIC
LANGUAGE plpgsql
AS $$
DECLARE
  balance NUMERIC := 0;
BEGIN
  SELECT COALESCE(SUM(
    CASE WHEN entry_type = 'credit' THEN amount ELSE -amount END
  ), 0) INTO balance
  FROM merchant_ledger
  WHERE merchant_id = p_merchant_id;
  RETURN balance;
END;
$$;

-- (Optional) Comment describing intent
COMMENT ON TABLE public.merchant_ledger IS 'Double-entry merchant ledger. One ledger per merchant for all credits, debits, payouts, and adjustments for robust audit.';
