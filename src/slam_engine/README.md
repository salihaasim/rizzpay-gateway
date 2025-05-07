
# SLAM Engine - Smart Labeling & Masking Module

## Overview

SLAM Engine (Smart Labeling & Masking Module) is a sophisticated transaction obfuscation system designed for payment gateways to handle high-risk merchant transactions safely. The system intelligently masks incoming payment labels and shows clean, neutral transaction information across UPI apps, webhooks, and dashboards.

## Core Components

### 1. UPI Handle Rotation Engine

- Maintains a pool of clean UPI handles (e.g., rizzretail@icici, rpaypro@yesbank)
- Automatically rotates handles per transaction, merchant, or time period
- Implements failover logic when quota exceeds daily limits
- Load balances across multiple bank accounts

### 2. Transaction Label Rewriting

- Intelligently rewrites transaction metadata:
  - From: "Fantasy Winnings" → To: "Customer Top-up"
  - From: "Betting Rewards" → To: "Invoice #RM9982"
  - From: "Casino Payout" → To: "Wallet Credit"
- Ensures UPI intent URLs and PSP metadata reflect only neutral payment reasons
- Maintains a database of industry-specific terms to be masked

### 3. Merchant Name Obfuscation

- Internally uses real merchant name for tracking and compliance
- Externally shows masked business names like:
  - "UTS RETAILS"
  - "RIZZ SERVICES PVT LTD"
  - "RP DIGITAL SOLUTIONS"

### 4. Dashboard/Webhook Cleaning

- Ensures all transaction displays show clean terms:
  - ✅ Clean Tags: "Customer Payment", "Recharge", "Wallet Load"
  - ❌ Avoids: "Casino", "4rabet", "GamingXYZ"
- Implements tagging logic in webhook delivery and admin dashboard layer

## Technical Implementation

### Key Files

- `types.ts` - Core types and interfaces
- `upiRotation.ts` - UPI handle rotation implementation
- `labelRewriter.ts` - Transaction description cleaning and merchant name obfuscation
- `upiIntegration.ts` - API-friendly UPI integration layer for external systems
- `index.ts` - Main entry point integrating all modules
- `SLAMAdmin.tsx` - Admin interface for configuration and monitoring

### Enhanced AI Integration

The SLAM Engine now includes an enhanced API layer for easy integration with AI assistants and external systems:

- Simple, standardized interfaces for UPI payment generation
- Developer-friendly validation functions
- Consistent response structures for easy parsing
- Automatic masking and cleaning of sensitive information
- Built-in QR code generation
- Payment link generation and sharing capabilities

### Usage Example

```typescript
// Import the SLAM Engine
import { generateUpiPayment } from '@/slam_engine';

// Generate a UPI payment with automatic masking
const payment = generateUpiPayment({
  amount: 999.99,
  description: "Fantasy cricket winnings payment",
  merchantId: "merchant_123",
  merchantName: "BetCricket Gaming"
});

// Use the clean values for payment processing
console.log(payment.paymentUrl);  // UPI URL with clean values
console.log(payment.qrCodeUrl);   // QR code URL for the payment
console.log(payment.maskedDescription);  // Clean description
```

### Payment Link Integration

The SLAM Engine now supports easy payment link and UTR verification:

```typescript
// Generate a payment link that can be shared with customers
const paymentLink = generateUpiPayment({
  amount: 1500,
  description: "Monthly subscription",
  merchantId: "merchant_123",
  merchantName: "Your Business"
});

// Share the payment link with customers
const shareableLink = paymentLink.paymentUrl;
const qrCodeUrl = paymentLink.qrCodeUrl;
```

### UTR Verification Flow

The SLAM Engine supports UTR (Unique Transaction Reference) verification:

1. Customer makes a payment using the provided UPI ID
2. Customer receives a UTR ID from their bank after payment
3. Customer enters the UTR ID in the verification form
4. Merchant can verify the UTR ID against their bank statement
5. Payment is marked as verified after confirmation

### Website Integration

Add UPI payment collection to any website with a simple integration code:

```html
<!-- RizzPay Payment Button -->
<script src="https://cdn.rizzpay.com/upi-plugin.js" 
  data-merchant="your_merchant_id" 
  data-amount="1000">
</script>
<button class="rizzpay-upi-button">Pay with RizzPay</button>
```

### Static vs Dynamic Payment Links

The SLAM Engine now supports both static and dynamic payment links:

1. **Dynamic Payment Links**: Include a fixed amount that the customer must pay
   - Useful for invoice payments, product purchases with known prices
   - Customer cannot modify the amount in their UPI app

2. **Static Payment Links**: Allow customers to enter any amount
   - Useful for donations, variable payments, or general-purpose collection
   - Customer enters their desired amount in the UPI app
   - Great for tips, subscriptions with flexible amounts

Toggle between static and dynamic modes in the UPI payment generator.

## Admin Dashboard

The SLAM Engine includes an admin interface that provides:

- Real-time monitoring of UPI handle usage
- Configuration of masking rules and sensitivity
- Testing tool for transaction masking
- Analytics on masking effectiveness
- Payment link generation and management
- Static and dynamic payment QR code generation

## Legal & Ethical Considerations

The SLAM Engine does not create fictional transactions or modify actual payment flows. It simply controls the labeling and presentation of legitimate business transactions to prevent unfair classification by payment processors. Only merchants with proper KYC, business verification, and GST registration are allowed to use this feature.
