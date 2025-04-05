
# Merchant Onboarding Guide - RizzPay Payment Gateway

This guide provides detailed instructions for merchants to integrate RizzPay payment services into their websites or applications. We'll walk through the complete onboarding process, from initial registration to successful integration.

## Table of Contents

1. [Registration Process](#registration-process)
2. [Account Verification](#account-verification)
3. [API Keys and Authentication](#api-keys-and-authentication)
4. [Integration Methods](#integration-methods)
5. [Webhook Configuration](#webhook-configuration)
6. [Testing Your Integration](#testing-your-integration)
7. [Going Live](#going-live)
8. [Example Integration: Color Trading & Betting Platform](#example-integration)
9. [Compliance Requirements](#compliance-requirements)
10. [Support Resources](#support-resources)

## Registration Process

1. **Create a Merchant Account**
   - Visit the RizzPay merchant portal at `https://merchant.rizzpay.com/register`
   - Complete the registration form with your business information
   - Accept the terms of service and privacy policy
   - Submit your application

2. **Complete Business Profile**
   - Login to your merchant dashboard
   - Navigate to "Business Settings"
   - Fill in your business details including:
     - Legal business name
     - Business type/category
     - Business registration number
     - Business address
     - Contact information
   - Upload required documents:
     - Business license/registration certificate
     - PAN card or equivalent tax ID
     - GST registration (if applicable)
     - Bank account statements (last 3 months)

## Account Verification

1. **KYC Verification**
   - Provide identification for all business owners/directors
   - Submit identity proof (Aadhaar, PAN, passport)
   - Submit address proof (utility bill, bank statement)
   - Submit a cancelled check for bank account verification

2. **Business Verification**
   - Our team will review your submitted documents
   - You may be contacted for additional information
   - Verification typically takes 1-3 business days

3. **Risk Assessment**
   - Our compliance team will assess your business risk profile
   - Additional documentation may be required based on your business category
   - For high-risk categories like color prediction or betting platforms, additional compliance requirements apply

## API Keys and Authentication

1. **Access API Credentials**
   - Once approved, log in to the merchant dashboard
   - Navigate to "Developer" → "API Keys"
   - You'll find your:
     - Merchant ID
     - API Key (Public Key)
     - Secret Key (Never share this)

2. **Environment Setup**
   - RizzPay provides two environments:
     - Sandbox: For testing and development
     - Production: For live transactions
   - Keep separate API keys for each environment

3. **Authentication Method**
   - RizzPay uses HMAC authentication for secure API communication
   - Each API request must include:
     - Your API Key in the request header
     - A signature generated using your Secret Key
     - Timestamp to prevent replay attacks

## Integration Methods

RizzPay offers multiple integration options to suit your business needs:

1. **Direct API Integration**
   - Full API documentation available at `https://docs.rizzpay.com/api`
   - Recommended for custom implementations
   - Provides maximum flexibility and control

2. **SDK Integration**
   - Official SDKs available for popular platforms:
     - JavaScript/Node.js
     - PHP
     - Python
     - Java
     - Android/iOS
   - Simplified implementation with fewer lines of code

3. **Payment Page Integration**
   - Redirect customers to a secure RizzPay-hosted payment page
   - Minimal coding required
   - Fully responsive and customizable to match your brand

4. **Webhook Integration**
   - Receive payment notifications directly to your server
   - Configure in the "Developer" → "Webhooks" section of your dashboard
   - Test webhooks in sandbox before going live

## Webhook Configuration

1. **Set Up Webhook URL**
   - Login to your merchant dashboard
   - Navigate to "Developer" → "Webhooks"
   - Add your webhook endpoint URL
   - Select events you want to receive notifications for

2. **Webhook Events**
   - `payment.initiated` - Payment process started
   - `payment.authorized` - Payment authorized but not captured
   - `payment.successful` - Payment successfully completed
   - `payment.failed` - Payment attempt failed
   - `payment.refunded` - Payment refunded to customer
   - `payment.disputed` - Payment disputed by customer

3. **Verifying Webhook Authenticity**
   - Each webhook request includes a signature in the `X-RizzPay-Signature` header
   - Verify this signature using your Secret Key to ensure the request is legitimate
   - Respond with HTTP 200 status code to acknowledge receipt

## Testing Your Integration

1. **Sandbox Environment**
   - Always start testing in the sandbox environment
   - Use test credentials and test cards provided in the developer dashboard
   - Test all payment scenarios (successful, failed, refunded, etc.)

2. **Test Cards**
   - Success Card: 4111 1111 1111 1111
   - Failure Card: 4000 0000 0000 0002
   - Authentication Required: 4000 0025 0000 3155
   - Test CVV: Any 3 digits
   - Test Expiry: Any future date

3. **Integration Checklist**
   - Verify payment creation
   - Confirm successful transaction processing
   - Test error handling
   - Validate webhook reception
   - Ensure proper order status updating
   - Test refund functionality
   - Verify security features

## Going Live

1. **Pre-Live Checklist**
   - Complete all sandbox testing
   - Ensure webhook handler is properly implemented
   - Update API endpoints from sandbox to production
   - Change test API keys to production keys

2. **Go-Live Request**
   - Submit a go-live request from your merchant dashboard
   - Our technical team will review your integration
   - Once approved, you'll receive confirmation to start processing live payments

3. **Production Monitoring**
   - Monitor your first few live transactions closely
   - Ensure settlements are being processed correctly
   - Verify webhook events are being received and handled

## Example Integration: Color Trading & Betting Platform

This step-by-step example demonstrates integrating RizzPay with a color trading and betting website:

### Step 1: Create API Integration

1. Log in to your RizzPay merchant dashboard
2. Navigate to "Developer" → "API Keys"
3. Generate new API keys specifically for your color trading platform
4. Copy and securely store your Merchant ID, API Key, and Secret Key

### Step 2: Set Up Your Server-Side Integration

```javascript
// Example Node.js implementation
const crypto = require('crypto');
const axios = require('axios');

// Configuration
const RIZZPAY_API_URL = 'https://api.rizzpay.com/v1';
const MERCHANT_ID = 'YOUR_MERCHANT_ID';
const API_KEY = 'YOUR_API_KEY';
const SECRET_KEY = 'YOUR_SECRET_KEY';

// Create a payment request
async function createPayment(userId, amount, description) {
  const timestamp = Date.now().toString();
  const payload = {
    merchant_id: MERCHANT_ID,
    amount: amount,
    currency: 'INR',
    description: description,
    customer_id: userId,
    callback_url: 'https://yourcolortrading.com/payment/callback',
    webhook_url: 'https://yourcolortrading.com/webhooks/payment'
  };
  
  const signaturePayload = timestamp + JSON.stringify(payload);
  const signature = crypto
    .createHmac('sha256', SECRET_KEY)
    .update(signaturePayload)
    .digest('hex');
    
  try {
    const response = await axios.post(`${RIZZPAY_API_URL}/payments`, payload, {
      headers: {
        'X-RizzPay-Merchant-ID': MERCHANT_ID,
        'X-RizzPay-API-Key': API_KEY,
        'X-RizzPay-Timestamp': timestamp,
        'X-RizzPay-Signature': signature,
        'Content-Type': 'application/json'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Payment creation failed:', error.response?.data || error.message);
    throw error;
  }
}
```

### Step 3: Implement Frontend Payment Flow

1. Create a "Deposit" button on your color trading platform
2. When clicked, call your backend API to create a payment
3. Redirect user to the payment URL received from RizzPay

```html
<!-- Example frontend implementation -->
<button id="deposit-btn" class="deposit-button">Deposit Funds</button>

<script>
  document.getElementById('deposit-btn').addEventListener('click', async () => {
    const amount = document.getElementById('amount-input').value;
    
    try {
      // Call your backend API
      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: amount,
          userId: 'current-user-id',
          description: 'Funds deposit to Color Trading account'
        })
      });
      
      const data = await response.json();
      
      if (data.paymentUrl) {
        // Redirect to RizzPay payment page
        window.location.href = data.paymentUrl;
      } else {
        alert('Failed to initialize payment');
      }
    } catch (error) {
      console.error('Payment creation failed:', error);
      alert('Payment initialization failed. Please try again.');
    }
  });
</script>
```

### Step 4: Handle Webhooks

1. Create a webhook endpoint on your server
2. Verify the webhook signature to ensure it's from RizzPay
3. Update user balance and bet status based on payment result

```javascript
// Example webhook handler (Node.js/Express)
app.post('/webhooks/payment', (req, res) => {
  const signature = req.headers['x-rizzpay-signature'];
  const timestamp = req.headers['x-rizzpay-timestamp'];
  
  // Verify signature
  const payload = timestamp + JSON.stringify(req.body);
  const expectedSignature = crypto
    .createHmac('sha256', SECRET_KEY)
    .update(payload)
    .digest('hex');
    
  if (signature !== expectedSignature) {
    return res.status(401).send('Invalid signature');
  }
  
  // Process the webhook event
  const { event, data } = req.body;
  
  switch (event) {
    case 'payment.successful':
      // Update user balance in database
      updateUserBalance(data.customer_id, data.amount);
      // Mark bet as active
      activateUserBets(data.customer_id, data.reference_id);
      break;
      
    case 'payment.failed':
      // Log failed payment attempt
      logFailedPayment(data);
      break;
      
    // Handle other event types
  }
  
  // Acknowledge receipt of webhook
  res.status(200).send('Webhook received');
});
```

### Step 5: Implement Callback Handling

Create a callback page to handle user returning from payment page:

```javascript
// Example callback handler
app.get('/payment/callback', (req, res) => {
  const { payment_id, status, reference_id } = req.query;
  
  if (status === 'success') {
    // Show success message
    res.render('payment-success', {
      paymentId: payment_id,
      referenceId: reference_id
    });
  } else {
    // Show failure message
    res.render('payment-failed', {
      reason: req.query.reason || 'Unknown error'
    });
  }
});
```

### Step 6: Testing Color Trading Integration

1. Implement a test betting flow in your sandbox environment
2. Create test users and test payment flows
3. Verify the following scenarios:
   - Successful deposit and balance update
   - Failed payment handling
   - Payment page responsiveness on mobile devices
   - Webhook event processing
   - Security of payment communications

### Step 7: KYC Implementation for Betting Platform

For betting/trading platforms, implement enhanced KYC:

1. Collect and verify user identity:
   - Full name
   - Date of birth (must be 18+)
   - Address verification
   - PAN card or equivalent
   - Photo ID verification

2. Implement deposit limits:
   - Daily deposit limits
   - Monthly deposit limits
   - Loss limits
   - Self-exclusion options

## Compliance Requirements

For color trading and betting platforms, ensure the following:

1. **Licensing**
   - Ensure your platform has all necessary gambling/betting licenses
   - Provide license documentation to RizzPay

2. **AML Compliance**
   - Implement transaction monitoring
   - Flag suspicious transactions
   - Report high-value transactions as required by law

3. **Responsible Gambling**
   - Implement cooling-off periods
   - Provide self-exclusion options
   - Display responsible gambling messages

4. **Transaction Limits**
   - Set appropriate transaction limits
   - Implement proper user verification for high-value transactions

## Support Resources

1. **Developer Documentation**
   - Comprehensive API reference: `https://docs.rizzpay.com`
   - Code examples and SDKs: `https://github.com/rizzpay`
   - Integration guides: `https://docs.rizzpay.com/guides`

2. **Technical Support**
   - Integration support: `integration-support@rizzpay.com`
   - Developer forum: `https://community.rizzpay.com`
   - Dedicated account manager for high-volume merchants

3. **Troubleshooting**
   - Transaction status lookup tool in merchant dashboard
   - API response code reference
   - Common integration errors and solutions guide

---

For specific questions or assistance with your integration, please contact our merchant support team at merchant-support@rizzpay.com or call +91-XXXXXXXXXX during business hours.
