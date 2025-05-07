
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
- `index.ts` - Main entry point integrating all modules
- `SLAMAdmin.tsx` - Admin interface for configuration and monitoring

### Usage Example

```typescript
// Import the SLAM Engine
import { processSLAMTransaction } from '@/slam_engine';

// Process a transaction through the SLAM Engine
const transaction = {
  description: "Fantasy cricket winnings payment",
  merchantName: "BetCricket Gaming",
  upiId: "betcricket@okaxis",
  payeeName: "BetCricket Gaming LLP"
};

const merchantId = "merchant_123";

// Get clean transaction data
const cleanTransaction = processSLAMTransaction(transaction, merchantId);

// Use the clean values for payment processing
const {
  description,  // "Invoice Payment #INV8021"
  merchantName, // "RIZZ RETAIL SERVICES"
  upiId,        // "rizzretail@icici" 
  payeeName     // "RPay Commercial"
} = cleanTransaction.maskedValues;
```

## Admin Dashboard

The SLAM Engine includes an admin interface that provides:

- Real-time monitoring of UPI handle usage
- Configuration of masking rules and sensitivity
- Testing tool for transaction masking
- Analytics on masking effectiveness

## Legal & Ethical Considerations

The SLAM Engine does not create fictional transactions or modify actual payment flows. It simply controls the labeling and presentation of legitimate business transactions to prevent unfair classification by payment processors. Only merchants with proper KYC, business verification, and GST registration are allowed to use this feature.
