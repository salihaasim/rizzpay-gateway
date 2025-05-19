
# RizzPay API Testing Guide

## Overview
This document provides guidelines for testing RizzPay's API endpoints.

## Test Environments
- Sandbox: `https://sandbox.rizzpay.co.in/api`
- Production: `https://api.rizzpay.co.in`

## API Test Cases

### 1. Payment Creation
```bash
curl -X POST https://sandbox.rizzpay.co.in/api/payments \
  -H "Authorization: Bearer YOUR_TEST_TOKEN" \
  -d '{
    "amount": 1000,
    "currency": "INR",
    "description": "Test Payment"
  }'
```

### 2. Payment Status Check
```bash
curl https://sandbox.rizzpay.co.in/api/payments/PAYMENT_ID \
  -H "Authorization: Bearer YOUR_TEST_TOKEN"
```

### 3. Gambling Mode API Testing

#### 3.1 Enable Gambling Mode for a Merchant
```bash
curl -X POST https://sandbox.rizzpay.co.in/api/gambling_mode/enable \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -d '{
    "merchant_id": "MERCHANT_ID",
    "settings": {
      "obfuscateDescriptors": true,
      "rotatePayoutEndpoints": true,
      "hideSensitiveTransactions": true
    }
  }'
```

#### 3.2 Process Gambling Payment
```bash
curl -X POST https://sandbox.rizzpay.co.in/api/gambling_mode/payments \
  -H "Authorization: Bearer YOUR_TEST_TOKEN" \
  -d '{
    "amount": 5000,
    "currency": "INR",
    "description": "Entertainment Services"
  }'
```

#### 3.3 Generate Static QR Code
```bash
curl -X GET https://sandbox.rizzpay.co.in/api/gambling_mode/qr/static/MERCHANT_ID \
  -H "Authorization: Bearer YOUR_TEST_TOKEN"
```

## Test Data
Use these test credentials in the sandbox environment:
- Test Card: 4111 1111 1111 1111
- UPI ID: test@rizzpay
- Bank Account: Test-Account-12345

## Error Scenarios
Test these error cases:
1. Invalid token
2. Insufficient funds
3. Invalid payment details
4. Network timeout simulation
5. Rate limit exceeded
6. Blocked IP address

## Gambling Mode API Workflow Testing

1. **Enable Gambling Mode**:
   - Test enabling via admin API
   - Verify settings are correctly applied

2. **Payment Processing**:
   - Test deposit with obfuscated descriptors
   - Verify UPI QR code generation (static and dynamic)

3. **Payout Processing**:
   - Test queuing payout requests
   - Verify endpoint rotation
   - Check status updates

4. **Risk Control Testing**:
   - Test IP blocking and unblocking
   - Verify rate limiting functionality
   - Test suspicious activity detection
