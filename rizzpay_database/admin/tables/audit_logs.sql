
-- Comprehensive audit logging for admin actions
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_user_id UUID REFERENCES admin_users(id),
    action_type TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id TEXT,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    session_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    severity audit_severity DEFAULT 'info',
    description TEXT,
    metadata JSONB DEFAULT '{}'
);

-- Enable RLS
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Create indexes for efficient querying
CREATE INDEX idx_audit_logs_admin_user ON audit_logs(admin_user_id);
CREATE INDEX idx_audit_logs_action_type ON audit_logs(action_type);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_severity ON audit_logs(severity);

-- Partition by month for better performance
-- CREATE TABLE audit_logs_y2024m01 PARTITION OF audit_logs
-- FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

-- Comments
COMMENT ON TABLE audit_logs IS 'Comprehensive audit trail for all admin actions and system changes';
COMMENT ON COLUMN audit_logs.severity IS 'Severity level: info, warning, error, critical';
COMMENT ON COLUMN audit_logs.metadata IS 'Additional contextual information about the action';
