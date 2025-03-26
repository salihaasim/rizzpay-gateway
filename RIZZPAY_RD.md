
# Rizzpay Research & Development Documentation

## Project Overview

Rizzpay is a payment gateway platform that allows merchants to process payments through various methods and manage their transactions through a comprehensive dashboard.

## Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Shadcn UI
- **Backend**: Supabase (PostgreSQL database, authentication, serverless functions)
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **Routing**: React Router DOM
- **Form Handling**: React Hook Form, Zod
- **Notifications**: Sonner

## Running the Application Locally

### Development Environment Setup

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

## Payment Flow Architecture

### How Payments Work in RizzPay

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

### Detailed Transaction Flow:

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

### Technical Implementation:

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

## Quick Start Guide

For developers new to the project, here's a quick way to get started:

1. **Setup your environment** as described above
2. **Login as a test merchant**:
   - Email: `test@rizzpay.com`
   - Password: `testpass123`
3. **Explore the dashboard** to understand the merchant view
4. **Test a payment flow** by creating a new payment
5. **Check the webhook setup** to understand integration capabilities

## Code Architecture

### Store Structure

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

### Key Design Principles

1. **Slice Pattern**: State is divided into focused slices with specific responsibilities
2. **Type Safety**: Comprehensive TypeScript typing for all store operations
3. **Immutability**: State updates follow immutable patterns
4. **Separation of Concerns**: Business logic is separated from UI components

## Deployment

### Production Deployment

1. Build the application: `npm run build`
2. Deploy the `dist` folder to your hosting service
3. Ensure environment variables are properly set in the production environment

## Future Development Roadmap

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
