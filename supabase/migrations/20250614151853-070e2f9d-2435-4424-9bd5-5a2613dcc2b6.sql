
-- STEP 1: Create the escrow_bank_configs table if it does not exist
CREATE TABLE IF NOT EXISTS public.escrow_bank_configs (
  bank TEXT PRIMARY KEY,
  account_number TEXT NOT NULL,
  ifsc_code TEXT NOT NULL,
  account_holder_name TEXT NOT NULL,
  api_key TEXT NOT NULL,
  api_secret TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- STEP 2: Enable Row Level Security for audit and future tenant support
ALTER TABLE public.escrow_bank_configs ENABLE ROW LEVEL SECURITY;

-- STEP 3: Allow all admins to UPDATE/SELECT/INSERT for now (update later for tenant-specific logic)
CREATE POLICY "Allow read/update/insert for admins"
  ON public.escrow_bank_configs
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- STEP 4: (Optional) Add index on updated_at for fast lookup
CREATE INDEX IF NOT EXISTS idx_escrow_bank_configs_updated_at ON public.escrow_bank_configs(updated_at);
