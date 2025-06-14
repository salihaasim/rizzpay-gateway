
-- 1. Create reconciliation_logs table
CREATE TABLE IF NOT EXISTS public.reconciliation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL,
  upload_time TIMESTAMP WITH TIME ZONE DEFAULT now(),
  file_name TEXT NOT NULL,
  total_records INTEGER NOT NULL,
  matched_count INTEGER DEFAULT 0,
  unmatched_count INTEGER DEFAULT 0,
  manual_overrides JSONB DEFAULT '[]'::jsonb,
  export_link TEXT,
  match_results JSONB DEFAULT '[]'::jsonb -- stores result of each file entry matched/unmatched
);

-- 2. (Optional) Enable RLS if needed for compliance/audit (most admin logs are open to admins only)
-- ALTER TABLE public.reconciliation_logs ENABLE ROW LEVEL SECURITY;

-- 3. (Optional but recommended) - Add index for faster queries by upload_time
CREATE INDEX IF NOT EXISTS idx_reconciliation_logs_upload_time ON public.reconciliation_logs(upload_time DESC);
