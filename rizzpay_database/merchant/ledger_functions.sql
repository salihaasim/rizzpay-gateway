
-- Merchant Ledger Functions and Business Logic
-- Double-entry bookkeeping system

-- Function to create ledger entry with balance update
CREATE OR REPLACE FUNCTION create_ledger_entry(
    p_merchant_id UUID,
    p_transaction_id TEXT,
    p_account_type account_type,
    p_entry_type ledger_entry_type,
    p_amount NUMERIC,
    p_description TEXT,
    p_reference_id TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_ledger_id UUID;
    v_current_balance NUMERIC;
    v_new_balance NUMERIC;
BEGIN
    -- Get current balance
    SELECT available_balance INTO v_current_balance
    FROM rizz_account_balances
    WHERE merchant_id = p_merchant_id 
    AND account_type = p_account_type;
    
    -- If balance record doesn't exist, create it
    IF v_current_balance IS NULL THEN
        INSERT INTO rizz_account_balances (merchant_id, account_type, available_balance)
        VALUES (p_merchant_id, p_account_type, 0);
        v_current_balance := 0;
    END IF;
    
    -- Calculate new balance
    IF p_entry_type = 'credit' THEN
        v_new_balance := v_current_balance + p_amount;
    ELSE
        v_new_balance := v_current_balance - p_amount;
        -- Check for sufficient balance on debit
        IF v_new_balance < 0 THEN
            RAISE EXCEPTION 'Insufficient balance. Current: %, Required: %', v_current_balance, p_amount;
        END IF;
    END IF;
    
    -- Create ledger entry
    INSERT INTO rizz_ledger_entries (
        merchant_id, transaction_id, account_type, entry_type,
        amount, balance_before, balance_after, reference_id, description
    ) VALUES (
        p_merchant_id, p_transaction_id, p_account_type, p_entry_type,
        p_amount, v_current_balance, v_new_balance, p_reference_id, p_description
    ) RETURNING id INTO v_ledger_id;
    
    -- Update balance
    UPDATE rizz_account_balances
    SET available_balance = v_new_balance,
        last_updated = now()
    WHERE merchant_id = p_merchant_id 
    AND account_type = p_account_type;
    
    RETURN v_ledger_id;
END;
$$;

-- Function to process transaction with double-entry
CREATE OR REPLACE FUNCTION process_transaction_ledger(
    p_transaction_id TEXT,
    p_merchant_id UUID,
    p_amount NUMERIC,
    p_fee_amount NUMERIC DEFAULT 0
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_net_amount NUMERIC;
BEGIN
    v_net_amount := p_amount - p_fee_amount;
    
    -- Credit merchant wallet (net amount)
    PERFORM create_ledger_entry(
        p_merchant_id,
        p_transaction_id,
        'merchant_wallet',
        'credit',
        v_net_amount,
        'Payment received - net amount',
        p_transaction_id
    );
    
    -- Debit fee account if fee exists
    IF p_fee_amount > 0 THEN
        PERFORM create_ledger_entry(
            p_merchant_id,
            p_transaction_id,
            'fee_account',
            'debit',
            p_fee_amount,
            'Transaction fee charged',
            p_transaction_id
        );
    END IF;
    
    RETURN true;
END;
$$;

-- Function to process payout with ledger
CREATE OR REPLACE FUNCTION process_payout_ledger(
    p_merchant_id UUID,
    p_payout_id TEXT,
    p_amount NUMERIC,
    p_fee_amount NUMERIC DEFAULT 0
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_total_debit NUMERIC;
BEGIN
    v_total_debit := p_amount + p_fee_amount;
    
    -- Debit from merchant wallet
    PERFORM create_ledger_entry(
        p_merchant_id,
        p_payout_id,
        'merchant_wallet',
        'debit',
        v_total_debit,
        'Payout processed including fees',
        p_payout_id
    );
    
    -- Credit settlement account
    PERFORM create_ledger_entry(
        p_merchant_id,
        p_payout_id,
        'settlement_account',
        'credit',
        p_amount,
        'Payout to bank account',
        p_payout_id
    );
    
    RETURN true;
END;
$$;

-- Function to calculate merchant balance
CREATE OR REPLACE FUNCTION get_merchant_calculated_balance(
    p_merchant_id UUID,
    p_account_type account_type DEFAULT 'merchant_wallet'
)
RETURNS NUMERIC
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_balance NUMERIC := 0;
BEGIN
    SELECT 
        COALESCE(SUM(CASE WHEN entry_type = 'credit' THEN amount ELSE -amount END), 0)
    INTO v_balance
    FROM rizz_ledger_entries
    WHERE merchant_id = p_merchant_id 
    AND account_type = p_account_type
    AND is_reversal = false;
    
    RETURN v_balance;
END;
$$;

-- Function to reconcile balances
CREATE OR REPLACE FUNCTION reconcile_merchant_balance(
    p_merchant_id UUID,
    p_account_type account_type DEFAULT 'merchant_wallet'
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_calculated_balance NUMERIC;
    v_recorded_balance NUMERIC;
BEGIN
    -- Get calculated balance from ledger
    v_calculated_balance := get_merchant_calculated_balance(p_merchant_id, p_account_type);
    
    -- Get recorded balance
    SELECT available_balance INTO v_recorded_balance
    FROM rizz_account_balances
    WHERE merchant_id = p_merchant_id 
    AND account_type = p_account_type;
    
    -- Update if different
    IF v_calculated_balance != v_recorded_balance THEN
        UPDATE rizz_account_balances
        SET available_balance = v_calculated_balance,
            last_updated = now()
        WHERE merchant_id = p_merchant_id 
        AND account_type = p_account_type;
        
        -- Log the reconciliation
        INSERT INTO rizz_ledger_checkpoints (
            merchant_id, account_type, checkpoint_date,
            calculated_balance, recorded_balance, is_reconciled
        ) VALUES (
            p_merchant_id, p_account_type, CURRENT_DATE,
            v_calculated_balance, v_recorded_balance, true
        );
    END IF;
    
    RETURN true;
END;
$$;

-- Function to reverse a transaction
CREATE OR REPLACE FUNCTION reverse_transaction(
    p_transaction_id TEXT,
    p_reason TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_ledger_entry RECORD;
    v_reverse_type ledger_entry_type;
BEGIN
    -- Get all ledger entries for this transaction
    FOR v_ledger_entry IN 
        SELECT * FROM rizz_ledger_entries 
        WHERE transaction_id = p_transaction_id 
        AND is_reversal = false
    LOOP
        -- Determine reverse entry type
        IF v_ledger_entry.entry_type = 'credit' THEN
            v_reverse_type := 'debit';
        ELSE
            v_reverse_type := 'credit';
        END IF;
        
        -- Create reversal entry
        PERFORM create_ledger_entry(
            v_ledger_entry.merchant_id,
            p_transaction_id,
            v_ledger_entry.account_type,
            v_reverse_type,
            v_ledger_entry.amount,
            'Reversal: ' || p_reason,
            p_transaction_id
        );
    END LOOP;
    
    -- Mark original entries as reversed
    UPDATE rizz_ledger_entries
    SET is_reversal = true
    WHERE transaction_id = p_transaction_id;
    
    RETURN true;
END;
$$;

