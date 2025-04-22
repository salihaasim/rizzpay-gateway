
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
