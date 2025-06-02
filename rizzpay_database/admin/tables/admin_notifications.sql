
-- Admin notification system
CREATE TABLE IF NOT EXISTS admin_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_id UUID REFERENCES admin_users(id),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    notification_type admin_notification_type NOT NULL,
    priority notification_priority DEFAULT 'normal',
    is_read BOOLEAN DEFAULT false,
    is_archived BOOLEAN DEFAULT false,
    action_url TEXT,
    action_label TEXT,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    read_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}',
    related_resource_type TEXT,
    related_resource_id TEXT
);

-- Enable RLS
ALTER TABLE admin_notifications ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX idx_admin_notifications_recipient ON admin_notifications(recipient_id);
CREATE INDEX idx_admin_notifications_unread ON admin_notifications(recipient_id, is_read) WHERE NOT is_read;
CREATE INDEX idx_admin_notifications_type ON admin_notifications(notification_type);
CREATE INDEX idx_admin_notifications_priority ON admin_notifications(priority);
CREATE INDEX idx_admin_notifications_created_at ON admin_notifications(created_at DESC);

-- Function to mark notification as read
CREATE OR REPLACE FUNCTION mark_notification_read(notification_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE admin_notifications 
    SET is_read = true, read_at = now()
    WHERE id = notification_id;
    
    RETURN FOUND;
END;
$$;

-- Comments
COMMENT ON TABLE admin_notifications IS 'Notification system for admin users';
COMMENT ON COLUMN admin_notifications.priority IS 'Notification priority: low, normal, high, urgent';
COMMENT ON COLUMN admin_notifications.action_url IS 'URL to navigate when notification is clicked';
