
-- User role enums
CREATE TYPE admin_role AS ENUM (
    'super_admin',
    'admin', 
    'finance_admin',
    'operations_admin',
    'support_admin',
    'read_only_admin'
);

CREATE TYPE merchant_verification_status AS ENUM (
    'pending',
    'under_review',
    'verified',
    'rejected',
    'suspended'
);

CREATE TYPE merchant_business_category AS ENUM (
    'ecommerce',
    'fintech',
    'gaming',
    'education',
    'healthcare',
    'travel',
    'food_delivery',
    'retail',
    'services',
    'other'
);
