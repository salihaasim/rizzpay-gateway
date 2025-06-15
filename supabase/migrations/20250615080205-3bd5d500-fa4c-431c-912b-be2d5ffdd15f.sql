
-- Fix search_path for update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO public
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- Fix search_path for log_whitelist_activity
CREATE OR REPLACE FUNCTION public.log_whitelist_activity()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO public
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO activity_logs (
        user_id,
        user_email,
        activity_type,
        details
    )
    SELECT 
        auth.uid(),
        auth.email(),
        CASE
            WHEN TG_OP = 'INSERT' THEN 
                CASE 
                    WHEN TG_TABLE_NAME = 'ip_whitelist' THEN 'ip_whitelist_created'
                    ELSE 'webhook_whitelist_created'
                END
            WHEN TG_OP = 'UPDATE' THEN 
                CASE 
                    WHEN TG_TABLE_NAME = 'ip_whitelist' THEN 'ip_whitelist_updated'
                    ELSE 'webhook_whitelist_updated'
                END
            WHEN TG_OP = 'DELETE' THEN 
                CASE 
                    WHEN TG_TABLE_NAME = 'ip_whitelist' THEN 'ip_whitelist_deleted'
                    ELSE 'webhook_whitelist_deleted'
                END
        END,
        jsonb_build_object(
            'merchant_id', COALESCE(NEW.merchant_id, OLD.merchant_id),
            'entry', CASE 
                WHEN TG_TABLE_NAME = 'ip_whitelist' THEN COALESCE(NEW.ip_address::text, OLD.ip_address::text)
                ELSE COALESCE(NEW.domain, OLD.domain)
            END,
            'status', COALESCE(NEW.status, OLD.status)
        );
    RETURN NEW;
END;
$$;

-- Fix search_path for calculate_payout_net_amount
CREATE OR REPLACE FUNCTION public.calculate_payout_net_amount(
  gross_amount numeric, 
  processing_fee numeric DEFAULT 0, 
  gst_rate numeric DEFAULT 0.18)
RETURNS numeric
LANGUAGE plpgsql
SET search_path TO public
AS $$
BEGIN
  RETURN gross_amount - processing_fee - (processing_fee * gst_rate);
END;
$$;

-- Fix search_path for get_merchant_wallet_balance
CREATE OR REPLACE FUNCTION public.get_merchant_wallet_balance(merchant_uuid uuid)
RETURNS numeric
LANGUAGE plpgsql
SET search_path TO public
SECURITY DEFINER
AS $$
DECLARE
  balance NUMERIC := 0;
BEGIN
  -- Calculate balance from transactions (simplified version)
  SELECT COALESCE(SUM(amount), 0) INTO balance
  FROM transactions 
  WHERE merchant_id = merchant_uuid 
  AND status = 'successful';
  
  -- Subtract any completed payouts
  SELECT balance - COALESCE(SUM(amount), 0) INTO balance
  FROM payout_requests 
  WHERE merchant_id = merchant_uuid 
  AND status = 'completed';
  
  RETURN GREATEST(balance, 0);
END;
$$;

-- Fix search_path for get_merchant_ledger_balance
CREATE OR REPLACE FUNCTION public.get_merchant_ledger_balance(p_merchant_id uuid)
RETURNS numeric
LANGUAGE plpgsql
SET search_path TO public
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
