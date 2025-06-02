
-- Common utility functions

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to generate transaction ID
CREATE OR REPLACE FUNCTION generate_transaction_id(prefix TEXT DEFAULT 'TXN')
RETURNS TEXT AS $$
BEGIN
    RETURN prefix || '_' || extract(epoch from now())::bigint || '_' || 
           substr(md5(random()::text), 1, 8);
END;
$$ LANGUAGE plpgsql;

-- Function to validate PAN number
CREATE OR REPLACE FUNCTION validate_pan_number(pan TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN pan ~ '^[A-Z]{5}[0-9]{4}[A-Z]{1}$';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to validate GST number
CREATE OR REPLACE FUNCTION validate_gst_number(gst TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN gst ~ '^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to calculate transaction fees
CREATE OR REPLACE FUNCTION calculate_transaction_fees(
    amount NUMERIC,
    payment_method TEXT,
    merchant_commission_rate NUMERIC DEFAULT 0.02
)
RETURNS JSONB AS $$
DECLARE
    gateway_fee NUMERIC;
    platform_fee NUMERIC;
    gst_rate NUMERIC := 0.18;
    total_fee NUMERIC;
    net_amount NUMERIC;
BEGIN
    -- Calculate gateway fees based on payment method
    CASE payment_method
        WHEN 'card' THEN gateway_fee := amount * 0.015;
        WHEN 'upi' THEN gateway_fee := amount * 0.005;
        WHEN 'netbanking' THEN gateway_fee := amount * 0.01;
        WHEN 'wallet' THEN gateway_fee := amount * 0.008;
        ELSE gateway_fee := amount * 0.02;
    END CASE;
    
    -- Platform fee
    platform_fee := amount * merchant_commission_rate;
    
    -- Total fee with GST
    total_fee := (gateway_fee + platform_fee) * (1 + gst_rate);
    net_amount := amount - total_fee;
    
    RETURN jsonb_build_object(
        'gateway_fee', gateway_fee,
        'platform_fee', platform_fee,
        'gst_amount', (gateway_fee + platform_fee) * gst_rate,
        'total_fee', total_fee,
        'net_amount', net_amount
    );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to log admin activity
CREATE OR REPLACE FUNCTION log_admin_activity(
    p_admin_user_id UUID,
    p_action_type TEXT,
    p_resource_type TEXT,
    p_resource_id TEXT DEFAULT NULL,
    p_description TEXT DEFAULT NULL,
    p_old_values JSONB DEFAULT NULL,
    p_new_values JSONB DEFAULT NULL,
    p_severity audit_severity DEFAULT 'info'
)
RETURNS UUID AS $$
DECLARE
    log_id UUID;
BEGIN
    INSERT INTO audit_logs (
        admin_user_id, action_type, resource_type, resource_id,
        description, old_values, new_values, severity
    ) VALUES (
        p_admin_user_id, p_action_type, p_resource_type, p_resource_id,
        p_description, p_old_values, p_new_values, p_severity
    ) RETURNING id INTO log_id;
    
    RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
