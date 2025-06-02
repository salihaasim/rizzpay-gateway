
-- Enhanced merchant profiles table
CREATE TABLE IF NOT EXISTS merchant_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    business_name TEXT NOT NULL,
    business_type TEXT NOT NULL,
    business_category merchant_business_category,
    gst_number TEXT,
    pan_number TEXT NOT NULL,
    contact_email TEXT UNIQUE NOT NULL,
    contact_phone TEXT NOT NULL,
    business_address TEXT NOT NULL,
    website_url TEXT,
    api_key TEXT UNIQUE,
    webhook_url TEXT,
    webhook_secret TEXT,
    verification_status merchant_verification_status DEFAULT 'pending',
    is_active BOOLEAN DEFAULT false,
    kyc_completed_at TIMESTAMP WITH TIME ZONE,
    onboarding_completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    risk_score INTEGER DEFAULT 0 CHECK (risk_score >= 0 AND risk_score <= 100),
    monthly_transaction_limit NUMERIC DEFAULT 1000000,
    daily_transaction_limit NUMERIC DEFAULT 100000,
    single_transaction_limit NUMERIC DEFAULT 50000,
    settlement_frequency settlement_frequency DEFAULT 'daily',
    auto_settlement_enabled BOOLEAN DEFAULT true,
    commission_rate NUMERIC(5,4) DEFAULT 0.0200,
    metadata JSONB DEFAULT '{}'
);

-- Enable RLS
ALTER TABLE merchant_profiles ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX idx_merchant_profiles_email ON merchant_profiles(contact_email);
CREATE INDEX idx_merchant_profiles_api_key ON merchant_profiles(api_key) WHERE api_key IS NOT NULL;
CREATE INDEX idx_merchant_profiles_verification ON merchant_profiles(verification_status);
CREATE INDEX idx_merchant_profiles_active ON merchant_profiles(is_active);
CREATE INDEX idx_merchant_profiles_business_type ON merchant_profiles(business_type);
CREATE INDEX idx_merchant_profiles_risk_score ON merchant_profiles(risk_score);

-- Add trigger for updated_at
CREATE TRIGGER update_merchant_profiles_updated_at
    BEFORE UPDATE ON merchant_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Comments
COMMENT ON TABLE merchant_profiles IS 'Comprehensive merchant profile information';
COMMENT ON COLUMN merchant_profiles.risk_score IS 'Risk assessment score from 0 (low risk) to 100 (high risk)';
COMMENT ON COLUMN merchant_profiles.settlement_frequency IS 'How often settlements are processed: daily, weekly, monthly';
