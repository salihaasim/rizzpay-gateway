
# RizzPay Documentation

## Payment System Documentation

### Overview

RizzPay is a comprehensive payment processing platform designed to facilitate various types of financial transactions including card payments, UPI transfers, wallet management, and bank transfers. This document provides details on how the payment transaction system works within the RizzPay ecosystem.

### Payment Flow

The RizzPay payment system follows these main steps:

1. **Payment Initiation**: A user or merchant initiates a payment through one of our interfaces
2. **Payment Method Selection**: User selects their preferred payment method
3. **Payment Processing**: The payment is routed through the appropriate payment processor
4. **Authorization**: The payment is authorized by the relevant financial institution
5. **Settlement**: Funds are settled and transferred to the merchant's account
6. **Notification**: All parties are notified of the transaction status

### Supported Payment Methods

RizzPay supports multiple payment methods to provide flexibility to users:

#### 1. Card Payments
- Credit and debit card processing
- Secure tokenization of card details
- Support for all major card networks (Visa, Mastercard, RuPay, etc.)

#### 2. UPI Payments
- Direct UPI ID payments
- QR code generation for easy payments
- Instant notification system

#### 3. NEFT/RTGS Bank Transfers
- Integration with HDFC Bank's NEFT API
- Secure bank transfer processing
- Support for all major Indian banks

#### 4. RizzPay Wallet
- Internal digital wallet system
- Instant transfers between users
- Low-fee transactions
- Deposit and withdrawal functionality

### RizzPay Wallet System

The wallet system provides a seamless way for users to manage funds within the RizzPay ecosystem:

#### Features:
- **Deposits**: Add funds to wallet using various payment methods
- **Withdrawals**: Transfer funds from wallet to bank accounts via NEFT
- **P2P Transfers**: Send money to other RizzPay users instantly
- **Direct Payments**: Pay for goods and services directly from wallet balance

#### Benefits:
- Faster transaction processing
- Reduced transaction fees
- Simplified recurring payments
- Transaction history and analytics

### HDFC Bank NEFT Integration

RizzPay integrates with HDFC Bank's NEFT API to provide secure bank transfers:

#### Integration Details:
- API Documentation: [HDFC Bank API](https://developer.hdfcbank.com/api-category-landing/34)
- Supports scheduled and immediate transfers
- Automatic reconciliation
- End-to-end encryption of sensitive data

#### NEFT Process Flow:
1. User initiates a withdrawal to their bank account
2. RizzPay validates the bank details (account number, IFSC code)
3. The NEFT request is sent to HDFC Bank's API
4. HDFC Bank processes the NEFT transfer
5. Both RizzPay and the user receive confirmation of the transfer
6. The transaction is recorded in the user's wallet history

### Transaction States

Each transaction in the RizzPay system goes through various states:

1. **Initiated**: Transaction has been created but processing hasn't started
2. **Processing**: Transaction is being processed by the payment gateway
3. **Authorized**: Payment has been authorized but not yet settled
4. **Completed**: Transaction has been successfully completed
5. **Failed**: Transaction has failed due to an error
6. **Declined**: Transaction was declined by the issuing bank or payment processor
7. **Refunded**: Transaction has been refunded to the customer

### Security Measures

RizzPay implements robust security measures:

- End-to-end encryption for all transactions
- Tokenization of sensitive payment information
- Multi-factor authentication for high-value transactions
- Real-time fraud detection systems
- Compliance with PCI-DSS standards
- Regular security audits

### Reporting and Analytics

The system provides comprehensive reporting capabilities:

- Transaction history and details
- Settlement reports
- Financial reconciliation
- Analytics dashboard for merchants
- Export functionality for accounting purposes

### API Integration

Merchants can integrate with the RizzPay payment system using our developer-friendly APIs:

- REST API for payment processing
- Webhook notifications for transaction updates
- Client libraries for popular programming languages
- Comprehensive documentation and integration guides

For more detailed information on API integration, please refer to the [Developer Documentation](/developers).

## Webhook Integration Guide

### Overview

Rizzpay provides a simple webhook integration that allows merchants to accept payments directly from their websites or applications. This guide explains how to integrate with Rizzpay's webhook system to start accepting payments.

### Getting Started

1. **Generate Your Webhook Token**: Create your unique webhook token from your Rizzpay merchant dashboard in the Webhooks section.
2. **Implement the Integration**: Add the Rizzpay payment button or form to your website/application using one of our integration methods.
3. **Test Your Integration**: Use our sandbox environment to test your integration before going live.

### Integration Methods

#### 1. HTML Form Integration

```html
<form action="https://yourdomain.com/api/webhook" method="POST">
  <input type="hidden" name="token" value="YOUR_WEBHOOK_TOKEN" />
  <input type="hidden" name="amount" value="100.00" />
  <input type="hidden" name="currency" value="INR" />
  <input type="hidden" name="description" value="Payment for Product X" />
  <input type="hidden" name="customer_name" value="John Doe" />
  <input type="hidden" name="customer_email" value="john@example.com" />
  <input type="hidden" name="callback_url" value="https://yourwebsite.com/payment-callback" />
  <button type="submit">Pay Now</button>
</form>
```

#### 2. JavaScript Integration

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
        token: "YOUR_WEBHOOK_TOKEN",
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

// Example usage
document.getElementById("payment-button").addEventListener("click", () => {
  initiateRizzpayPayment({
    amount: "100.00",
    currency: "INR",
    description: "Payment for Product X",
    customerName: "John Doe",
    customerEmail: "john@example.com",
    callbackUrl: "https://yourwebsite.com/payment-callback"
  });
});
```

#### 3. Direct API Request

You can also make a direct GET or POST request to our webhook endpoint:

```
GET https://yourdomain.com/api/webhook?token=YOUR_WEBHOOK_TOKEN&amount=100.00&currency=INR&description=Product+Purchase&customer_name=John+Doe&customer_email=john@example.com&callback_url=https://yourwebsite.com/payment-callback
```

### Required Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| token | Yes | Your unique webhook token (found in your dashboard) |
| amount | Yes | Payment amount (e.g., 100.00) |
| currency | No | Currency code (default: INR) |
| description | No | Payment description or purpose |
| customer_name | Yes | Name of the customer making payment |
| customer_email | No | Email of the customer (recommended) |
| callback_url | No | URL to redirect after payment completion |

### Handling Callbacks

After payment completion, Rizzpay will redirect the customer to your `callback_url` with the following parameters:

```
https://yourwebsite.com/payment-callback?transaction_id=TXN_123456&status=success
```

Parameters in the callback:

- `transaction_id`: The unique transaction ID generated for this payment
- `status`: The payment status, either `success` or `failed`

### Webhook Notifications

Rizzpay can also send webhook notifications to your server when payment status changes:

1. Set up a webhook endpoint on your server
2. Add the endpoint URL in your Rizzpay dashboard
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

### Testing Your Integration

Use the following test credentials for sandbox testing:

- Test Token: `test_webhook_token_sandbox`
- Test Card Number: `4111 1111 1111 1111`
- Test Expiry Date: Any future date
- Test CVV: Any 3 digits

### Security Considerations

- Always validate the webhook token before processing payments
- Implement proper error handling and logging
- Use HTTPS for all API communications
- Do not store sensitive payment details on your servers

### Troubleshooting

Common issues and solutions:

1. **Invalid Token Error**: Ensure you're using the correct token from your dashboard
2. **Connection Timeout**: Check your internet connection and firewall settings
3. **Callback Not Received**: Verify your `callback_url` is publicly accessible
4. **Payment Failed**: Check the error details in your dashboard

For additional support, contact our developer team at support@rizzpay.com

## Research & Development Documentation

### Project Overview

Rizzpay is a payment gateway platform that allows merchants to process payments through various methods and manage their transactions through a comprehensive dashboard.

### Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Shadcn UI
- **Backend**: Supabase (PostgreSQL database, authentication, serverless functions)
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **Routing**: React Router DOM
- **Form Handling**: React Hook Form, Zod
- **Notifications**: Sonner

### Running the Application Locally

#### Development Environment Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/rizzpay.git
   cd rizzpay
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Variables**
   Create a `.env` file in the root directory with:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
   ```

4. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   
   The application will be available at `http://localhost:8080`

5. **Build for production**
   ```bash
   npm run build
   # or
   yarn build
   ```

### Payment Flow Architecture

#### How Payments Work in RizzPay

RizzPay processes payments through a sequence of well-defined steps, from initiation to settlement. The diagram below illustrates the flow:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │     │                 │
│  User initiates │     │  Payment method │     │  Payment        │     │  Transaction    │
│  payment on     │──►  │  selection and  │──►  │  processing via │──►  │  recording and  │
│  Payment Page   │     │  data input     │     │  gateway/provider│     │  confirmation   │
│                 │     │                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │                       │                       │
        │                       │                       │                       │
        ▼                       ▼                       ▼                       ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │     │                 │
│  Amount and     │     │  UPI, Credit    │     │  Razorpay,      │     │  Transaction    │
│  merchant info  │     │  Card, NEFT     │     │  Bank networks, │     │  stored in      │
│  validation     │     │  Bank Transfer  │     │  UPI gateways   │     │  Supabase DB    │
│                 │     │                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘     └─────────────────┘
```

#### Detailed Transaction Flow:

1. **Payment Initiation**:
   - User enters payment amount and basic information
   - System generates a unique transaction ID
   - Initial transaction record created with "pending" status

2. **Payment Method Selection**:
   - User selects from available payment methods:
     - Credit/Debit Card (via Razorpay)
     - UPI (with QR code generation)
     - NEFT/Bank Transfer

3. **Payment Processing**:
   - For Card payments: Razorpay SDK handles payment securely
   - For UPI: QR code is generated for scanning with UPI apps
   - For NEFT: Bank details are provided for manual transfer

4. **Transaction States**:
   - The transaction goes through various processing states:
     - `initiated` → `gateway_processing` → `processor_routing` → `authorization_decision`
     - Final states: `completed` (success) or `declined` (failure)

5. **Confirmation and Recording**:
   - Transaction is stored in Supabase database
   - Receipt/confirmation is shown to user
   - Webhooks can notify external systems

6. **Settlement Process** (background):
   - Funds are settled to merchant account
   - Transaction status is updated to "settled"

#### Technical Implementation:

The payment processing flow is implemented using several key components:

1. **Payment Form (`PaymentFlow.tsx`)**:
   - Manages the user interface for payment entry
   - Handles validation and payment method selection

2. **Transaction Store (`transactionStore.ts`)**:
   - Zustand store for managing transaction state
   - Handles transaction creation, updates, and queries

3. **Payment Processors**:
   - Razorpay integration for card payments
   - UPI payment handlers
   - NEFT processing utilities

4. **Backend Integration**:
   - Supabase database for transaction storage
   - Authentication for merchants
   - Webhook processing for notifications

This architecture ensures secure, reliable payment processing with clear status tracking and comprehensive record-keeping.

### Application Structure

The application is structured to avoid redundancy and ensure a clean user experience:

1. **Landing Page (Index.tsx)**:
   - Contains its own Navbar for non-authenticated users
   - Showcases features and provides access to payment functionality

2. **Dashboard & Protected Routes**:
   - Wrapped in Layout component with consistent Navbar
   - Accessible only to authenticated users

3. **Payment Flow**:
   - Simplified to a single "Make Payment" option
   - Accessible from both authenticated and non-authenticated views

### Quick Start Guide

For developers new to the project, here's a quick way to get started:

1. **Setup your environment** as described above
2. **Login as a test merchant**:
   - Email: `test@rizzpay.com`
   - Password: `testpass123`
3. **Explore the dashboard** to understand the merchant view
4. **Test a payment flow** by creating a new payment
5. **Check the webhook setup** to understand integration capabilities

### Code Architecture

#### Store Structure

The application uses Zustand for state management with a modular approach:

```
src/stores/transactions/
├── index.ts                # Main store export
├── types.ts                # TypeScript interfaces and types
├── utils.ts                # Helper functions
├── transactionSlice.ts     # Transaction management
├── userRoleSlice.ts        # User roles and permissions
└── walletStore.ts          # Wallet functionality
```

#### Key Design Principles

1. **Slice Pattern**: State is divided into focused slices with specific responsibilities
2. **Type Safety**: Comprehensive TypeScript typing for all store operations
3. **Immutability**: State updates follow immutable patterns
4. **Separation of Concerns**: Business logic is separated from UI components

### Deployment

#### Production Deployment

1. Build the application: `npm run build`
2. Deploy the `dist` folder to your hosting service
3. Ensure environment variables are properly set in the production environment

### Future Development Roadmap

1. **Analytics Dashboard**
   - Implement comprehensive analytics for merchants
   - Add visualization tools for transaction data

2. **Enhanced Security**
   - Implement additional security layers for payment processing
   - Add 2FA for merchant accounts

3. **Mobile Optimization**
   - Enhance mobile responsiveness
   - Develop PWA capabilities

4. **Integration Ecosystem**
   - Add more third-party integrations
   - Create a marketplace for payment plugins

5. **Internationalization**
   - Add multi-currency support
   - Implement language localization
