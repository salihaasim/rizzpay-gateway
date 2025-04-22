
# RizzPay Webhook Testing Guide

## Overview
This guide covers testing webhook integrations with RizzPay.

## Setting Up Webhook Testing

### Local Testing
1. Use ngrok or localtunnel for local webhook testing
2. Set up a local endpoint to receive webhook events
3. Configure webhook URL in RizzPay dashboard

### Test Webhook Payload
```json
{
  "event": "payment.success",
  "data": {
    "payment_id": "pay_test_123",
    "amount": 1000,
    "currency": "INR",
    "status": "completed"
  }
}
```

## Webhook Test Scenarios

### 1. Payment Success
Test successful payment webhook delivery:
```bash
# Simulate webhook
curl -X POST http://your-endpoint/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "event": "payment.success",
    "data": {
      "payment_id": "test_123",
      "status": "completed"
    }
  }'
```

### 2. Payment Failure
Test failed payment webhook:
```bash
# Simulate webhook
curl -X POST http://your-endpoint/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "event": "payment.failed",
    "data": {
      "payment_id": "test_124",
      "status": "failed",
      "error": "insufficient_funds"
    }
  }'
```

## Security Testing
1. Verify webhook signatures
2. Test IP whitelist functionality
3. Validate payload structure
4. Check retry mechanism
