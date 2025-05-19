
# RizzPay Webhook Testing Guide

## Overview
This document provides guidelines for testing RizzPay's webhook integrations.

## Webhook Registration
```bash
curl -X POST https://sandbox.rizzpay.co.in/api/webhooks \
  -H "Authorization: Bearer YOUR_TEST_TOKEN" \
  -d '{
    "url": "https://your-server.com/webhook",
    "events": ["payment.success", "payment.failed"],
    "secret": "your_webhook_secret"
  }'
```

## Event Types
Test webhooks for these event types:
- `payment.success`
- `payment.failed`
- `payment.processing`
- `payout.initiated`
- `payout.processed`
- `payout.failed`

## Gambling Mode Webhook Events
When testing in Gambling Mode, these additional events are available:
- `gambling.deposit.initiated`
- `gambling.deposit.completed`
- `gambling.withdrawal.queued`
- `gambling.withdrawal.processed`
- `gambling.risk.alert`

## Webhook Payload Format

### Standard Payment Webhook
```json
{
  "event": "payment.success",
  "created": 1656089985,
  "data": {
    "id": "pay_123456789",
    "amount": 1000,
    "currency": "INR",
    "status": "successful",
    "customer_email": "customer@example.com",
    "description": "Purchase"
  }
}
```

### Gambling Mode Payment Webhook
```json
{
  "event": "gambling.deposit.completed",
  "created": 1656089985,
  "data": {
    "id": "pay_123456789",
    "amount": 1000,
    "currency": "INR",
    "status": "successful",
    "description": "Entertainment Services"
  }
}
```

## Webhook Signature Verification
```javascript
const crypto = require('crypto');

function verifySignature(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}
```

## Testing Steps

1. **Register webhook endpoint** in RizzPay dashboard or via API
2. **Set up webhook receiver** on your server
3. **Verify request signatures** using your webhook secret
4. **Test different event types** by triggering corresponding actions
5. **Implement proper error handling** and retries
6. **Test idempotency** by processing the same webhook multiple times

## Sandbox Testing Tools

RizzPay provides these sandbox testing tools:
1. **Webhook Simulator**: Generate test webhook events
2. **Event Logs**: View webhook delivery history
3. **Retry Failed Webhooks**: Manually retry failed webhooks

Access these tools from the RizzPay dashboard under Developers > Webhooks.

## Gambling Mode Webhook Testing

When testing gambling mode webhooks:
1. Set up your endpoint to handle obfuscated data
2. Test all gambling-specific event types
3. Verify that sensitive data is properly masked
4. Test webhook delivery from rotating IP addresses
