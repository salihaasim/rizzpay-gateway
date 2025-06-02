
-- Transaction and payment related enums
CREATE TYPE transaction_status AS ENUM (
    'pending',
    'processing', 
    'successful',
    'failed',
    'cancelled',
    'refunded',
    'partially_refunded'
);

CREATE TYPE processing_state AS ENUM (
    'initiated',
    'validated',
    'submitted_to_bank',
    'processing_by_bank',
    'completed',
    'declined',
    'timeout',
    'error'
);

CREATE TYPE payment_method_type AS ENUM (
    'card',
    'upi',
    'netbanking',
    'wallet',
    'paylater',
    'crypto'
);

CREATE TYPE settlement_frequency AS ENUM (
    'instant',
    'daily',
    'weekly', 
    'monthly'
);

CREATE TYPE wallet_transaction_type AS ENUM (
    'credit',
    'debit',
    'settlement',
    'refund',
    'fee',
    'adjustment',
    'withdrawal'
);

CREATE TYPE wallet_transaction_status AS ENUM (
    'pending',
    'completed',
    'failed',
    'cancelled'
);
