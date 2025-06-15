
-- 1. Enable RLS for flagged tables
ALTER TABLE public.vpa_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vpa_payment_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reconciliation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.merchant_ledger ENABLE ROW LEVEL SECURITY;

-- 2. Block all access by default (failsafe, update with specific policies later)
-- You may add fine-grained SELECT/INSERT/UPDATE/DELETE rules after this

-- Optional: Add NO POLICIES by default (acts as BLOCK ALL)  
-- If you like, enable admins or merchants in a follow-up migration.
