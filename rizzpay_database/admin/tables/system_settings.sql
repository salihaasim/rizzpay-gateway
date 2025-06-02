
-- System-wide settings managed by admins
CREATE TABLE IF NOT EXISTS system_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_key TEXT UNIQUE NOT NULL,
    setting_value JSONB NOT NULL,
    setting_type TEXT NOT NULL CHECK (setting_type IN ('string', 'number', 'boolean', 'object', 'array')),
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    requires_restart BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_by UUID REFERENCES admin_users(id),
    category TEXT DEFAULT 'general'
);

-- Enable RLS
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX idx_system_settings_key ON system_settings(setting_key);
CREATE INDEX idx_system_settings_category ON system_settings(category);
CREATE INDEX idx_system_settings_public ON system_settings(is_public);

-- Add trigger for updated_at
CREATE TRIGGER update_system_settings_updated_at
    BEFORE UPDATE ON system_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default settings
INSERT INTO system_settings (setting_key, setting_value, setting_type, description, category) VALUES
('payment_gateway_timeout', '30', 'number', 'Payment gateway timeout in seconds', 'payment'),
('max_transaction_amount', '100000', 'number', 'Maximum transaction amount in INR', 'payment'),
('min_transaction_amount', '1', 'number', 'Minimum transaction amount in INR', 'payment'),
('maintenance_mode', 'false', 'boolean', 'Enable maintenance mode', 'system'),
('kyc_auto_approval_limit', '50000', 'number', 'Auto-approve KYC below this amount', 'kyc'),
('webhook_retry_attempts', '3', 'number', 'Number of webhook retry attempts', 'webhook'),
('session_timeout_minutes', '60', 'number', 'User session timeout in minutes', 'security')
ON CONFLICT (setting_key) DO NOTHING;

-- Comments
COMMENT ON TABLE system_settings IS 'System-wide configuration settings managed by administrators';
COMMENT ON COLUMN system_settings.is_public IS 'Whether this setting can be accessed by non-admin users';
COMMENT ON COLUMN system_settings.requires_restart IS 'Whether changing this setting requires system restart';
