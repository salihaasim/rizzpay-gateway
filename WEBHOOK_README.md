
# RizzPay Integration Guide

## Overview

RizzPay provides a simple webhook integration that allows merchants to accept payments directly from their websites or applications. This guide explains how to integrate with RizzPay's system to start accepting payments.

## Getting Started

1. **Generate Your API Token**: Create your unique API token from your RizzPay merchant dashboard in the Developer section.
2. **Implement the Integration**: Add the RizzPay payment button or form to your website/application using one of our integration methods.
3. **Test Your Integration**: Use our sandbox environment to test your integration before going live.

## Integration Methods

### 1. HTML Form Integration

```html
<form action="https://yourdomain.com/api/webhook" method="POST">
  <input type="hidden" name="token" value="YOUR_API_TOKEN" />
  <input type="hidden" name="amount" value="100.00" />
  <input type="hidden" name="currency" value="INR" />
  <input type="hidden" name="description" value="Payment for Product X" />
  <input type="hidden" name="customer_name" value="John Doe" />
  <input type="hidden" name="customer_email" value="john@example.com" />
  <input type="hidden" name="callback_url" value="https://yourwebsite.com/payment-callback" />
  <button type="submit">Pay with RizzPay</button>
</form>
```

### 2. JavaScript Integration

```javascript
// Function to initiate payment
async function initiateRizzpayPayment(paymentDetails) {
  try {
    const response = await fetch("https://yourdomain.com/api/webhook", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: "YOUR_API_TOKEN",
        amount: paymentDetails.amount,
        currency: paymentDetails.currency || "INR",
        description: paymentDetails.description,
        customer_name: paymentDetails.customerName,
        customer_email: paymentDetails.customerEmail,
        callback_url: paymentDetails.callbackUrl
      }),
    });

    const result = await response.json();
    
    if (result.status === "success") {
      // Redirect to the payment page
      window.location.href = result.paymentUrl;
    } else {
      console.error("Payment initiation failed:", result.message);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}
```

### 3. Direct API Request

You can also make a direct GET or POST request to our webhook endpoint:

```
GET https://yourdomain.com/api/webhook?token=YOUR_API_TOKEN&amount=100.00&currency=INR&description=Product+Purchase&customer_name=John+Doe&customer_email=john@example.com&callback_url=https://yourwebsite.com/payment-callback
```

## Required Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| token | Yes | Your unique API token (found in your dashboard) |
| amount | Yes | Payment amount (e.g., 100.00) |
| currency | No | Currency code (default: INR) |
| description | No | Payment description or purpose |
| customer_name | Yes | Name of the customer making payment |
| customer_email | No | Email of the customer (recommended) |
| callback_url | No | URL to redirect after payment completion |

## Handling Callbacks

After payment completion, RizzPay will redirect the customer to your `callback_url` with the following parameters:

```
https://yourwebsite.com/payment-callback?transaction_id=TXN_123456&status=success
```

Parameters in the callback:

- `transaction_id`: The unique transaction ID generated for this payment
- `status`: The payment status, either `success` or `failed`

## Webhook Notifications

RizzPay can also send webhook notifications to your server when payment status changes:

1. Set up a webhook endpoint on your server
2. Add the endpoint URL in your RizzPay dashboard
3. We will send POST requests to your endpoint with payment details

Example webhook payload:

```json
{
  "event": "payment.completed",
  "transaction_id": "TXN_123456",
  "status": "success",
  "amount": "100.00",
  "currency": "INR",
  "customer_name": "John Doe",
  "customer_email": "john@example.com",
  "payment_method": "card",
  "payment_id": "PAY_789012",
  "timestamp": "2023-09-15T12:30:45Z"
}
```

## Testing Your Integration

Use the following test credentials for sandbox testing:

- Test Token: `test_webhook_token_sandbox`
- Test Card Number: `4111 1111 1111 1111`
- Test Expiry Date: Any future date
- Test CVV: Any 3 digits

## Security Considerations

- Always validate the webhook token before processing payments
- Implement proper error handling and logging
- Use HTTPS for all API communications
- Do not store sensitive payment details on your servers

## Troubleshooting

Common issues and solutions:

1. **Invalid Token Error**: Ensure you're using the correct token from your dashboard
2. **Connection Timeout**: Check your internet connection and firewall settings
3. **Callback Not Received**: Verify your `callback_url` is publicly accessible
4. **Payment Failed**: Check the error details in your dashboard

For additional support, contact our developer team at support@rizzpay.com
