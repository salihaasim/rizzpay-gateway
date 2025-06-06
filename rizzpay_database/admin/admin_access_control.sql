
-- Admin Access Control and Security Policies
-- Only admins can access all transaction data

-- Enable Row Level Security on all tables
ALTER TABLE rizz_admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE rizz_merchant_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE rizz_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE rizz_ledger_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE rizz_account_balances ENABLE ROW LEVEL SECURITY;

-- Security definer function to get current admin role
CREATE OR REPLACE FUNCTION get_current_admin_permission()
RETURNS admin_permission_level
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT permission_level 
  FROM rizz_admin_users 
  WHERE id = auth.uid() AND is_active = true;
$$;

-- Security definer function to check if user is admin
CREATE OR REPLACE FUNCTION is_rizz_admin()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM rizz_admin_users 
    WHERE id = auth.uid() 
    AND is_active = true 
    AND can_view_all_transactions = true
  );
$$;

-- Security definer function to check merchant access
CREATE OR REPLACE FUNCTION can_access_merchant(merchant_uuid UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT CASE 
    WHEN is_rizz_admin() THEN true
    WHEN auth.uid() = merchant_uuid THEN true
    ELSE false
  END;
$$;

-- RLS Policies for Admin Access

-- Admin users can only manage their own record unless super_admin
CREATE POLICY "Admin users self management" ON rizz_admin_users
  FOR ALL USING (
    id = auth.uid() OR 
    get_current_admin_permission() = 'super_admin'
  );

-- Only admins can view merchant accounts
CREATE POLICY "Admin only merchant access" ON rizz_merchant_accounts
  FOR SELECT USING (is_rizz_admin());

-- Merchants can only see their own account
CREATE POLICY "Merchant self access" ON rizz_merchant_accounts
  FOR SELECT USING (merchant_id = auth.uid());

-- Transaction access - admins see all, merchants see own
CREATE POLICY "Admin all transactions" ON rizz_transactions
  FOR SELECT USING (is_rizz_admin());

CREATE POLICY "Merchant own transactions" ON rizz_transactions
  FOR SELECT USING (merchant_id = auth.uid());

-- Ledger access - admins see all, merchants see own
CREATE POLICY "Admin all ledger" ON rizz_ledger_entries
  FOR SELECT USING (is_rizz_admin());

CREATE POLICY "Merchant own ledger" ON rizz_ledger_entries
  FOR SELECT USING (merchant_id = auth.uid());

-- Balance access - admins see all, merchants see own
CREATE POLICY "Admin all balances" ON rizz_account_balances
  FOR SELECT USING (is_rizz_admin());

CREATE POLICY "Merchant own balances" ON rizz_account_balances
  FOR SELECT USING (merchant_id = auth.uid());

-- Insert/Update policies for admins only
CREATE POLICY "Admin only insert transactions" ON rizz_transactions
  FOR INSERT WITH CHECK (is_rizz_admin());

CREATE POLICY "Admin only update transactions" ON rizz_transactions
  FOR UPDATE USING (is_rizz_admin());

CREATE POLICY "Admin only insert ledger" ON rizz_ledger_entries
  FOR INSERT WITH CHECK (is_rizz_admin());

-- Grant permissions to admin role
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;

-- Create read-only role for reporting
CREATE ROLE rizz_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO rizz_readonly;

-- Create admin role with full access
CREATE ROLE rizz_admin;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO rizz_admin;

